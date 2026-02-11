from flask import Flask, g, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import threading
import time
import logging

from api_manager import init_api_manager, require_metered_api_key, auth_api_key_value, increment_usage_for_key

app = Flask(__name__)
init_api_manager(app)

# تنظیمات لاگینگ
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# متغیر جهانی برای کش کردن قیمت‌ها
LATEST_PRICES = {
    "data": {},
    "last_updated": None,
    "status": "Initializing"
}

# لیست تمام آیتم‌های موجود در عکس و ID آن‌ها در سایت Bonbast
# کلید سمت چپ: نامی که در API می‌گیرید
# مقدار سمت راست: ID المنت در HTML سایت
TARGETS = {
    # --- ارزهای اصلی (ستون چپ) ---
    "usd": "usd1",         # دلار آمریکا
    "eur": "eur1",         # یورو
    "gbp": "gbp1",         # پوند انگلیس
    "chf": "chf1",         # فرانک سوئیس
    "cad": "cad1",         # دلار کانادا
    "aud": "aud1",         # دلار استرالیا
    "sek": "sek1",         # کرون سوئد
    "nok": "nok1",         # کرون نروژ
    "rub": "rub1",         # روبل روسیه
    "thb": "thb1",         # بات تایلند
    "sgd": "sgd1",         # دلار سنگاپور
    "hkd": "hkd1",         # دلار هنگ کنگ
    "azn": "azn1",         # منات آذربایجان
    "amd": "amd1",         # درام ارمنستان

    # --- ارزهای دیگر (ستون راست) ---
    "dkk": "dkk1",         # کرون دانمارک
    "aed": "aed1",         # درهم امارات
    "jpy": "jpy1",         # ین ژاپن
    "try": "try1",         # لیر ترکیه
    "cny": "cny1",         # یوان چین
    "sar": "sar1",         # ریال عربستان
    "inr": "inr1",         # روپیه هند
    "myr": "myr1",         # رینگیت مالزی
    "afn": "afn1",         # افغانی افغانستان
    "kwd": "kwd1",         # دینار کویت
    "iqd": "iqd1",         # دینار عراق
    "bhd": "bhd1",         # دینار بحرین
    "omr": "omr1",         # ریال عمان
    "qar": "qar1",         # ریال قطر

    # --- طلا و سکه ---
    "gold_ounce": "ounce",      # انس طلا
    "gold_gram_18k": "gol18",   # گرم طلا ۱۸
    "gold_mithqal": "mithqal",  # مثقال طلا
    "coin_emami": "emami1",     # سکه امامی
    "coin_azadi": "azadi1",     # سکه بهار آزادی (طرح قدیم)
    "coin_half": "azadi1_2",    # نیم سکه
    "coin_quarter": "azadi1_4", # ربع سکه
    "coin_gram": "azadi1g",     # سکه گرمی
    
    # --- کریپتو (پایین صفحه) ---
    "bitcoin": "bitcoin"        # بیت‌کوین
}

# محدوده هر scope برای فیلتر خروجی API
SCOPE_KEYS = {
    "currency": ["usd", "eur", "gbp", "chf", "cad", "aud", "sek", "nok", "rub", "thb", "sgd", "hkd", "azn", "amd",
                 "dkk", "aed", "jpy", "try", "cny", "sar", "inr", "myr", "afn", "kwd", "iqd", "bhd", "omr", "qar"],
    "crypto": ["bitcoin"],
    "gold": ["gold_ounce", "gold_gram_18k", "gold_mithqal", "coin_emami", "coin_azadi", "coin_half", "coin_quarter", "coin_gram"],
}


def _filter_prices_by_scope(data: dict, scope: str) -> dict:
    if scope == "all" or not scope:
        return data
    keys = SCOPE_KEYS.get(scope, [])
    return {k: v for k, v in data.items() if k in keys}


def create_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.page_load_strategy = 'eager'
    prefs = {"profile.managed_default_content_settings.images": 2}
    options.add_experimental_option("prefs", prefs)
    return webdriver.Chrome(options=options)

def scraper_worker():
    global LATEST_PRICES
    while True:
        driver = None
        try:
            logging.info("Starting extensive background scrape...")
            driver = create_driver()
            driver.get("https://www.bonbast.com")

            # صبر برای لود شدن حداقل یکی از المان‌های اصلی (مثلا دلار)
            wait = WebDriverWait(driver, 20)
            wait.until(EC.presence_of_element_located((By.ID, "usd1")))

            temp_data = {}
            
            # حلقه برای گرفتن تمام آیتم‌های تعریف شده در دیکشنری TARGETS
            for api_key, html_id in TARGETS.items():
                try:
                    element = driver.find_element(By.ID, html_id)
                    temp_data[api_key] = element.text
                except:
                    temp_data[api_key] = "N/A"

            # اضافه کردن زمان بروزرسانی
            LATEST_PRICES["data"] = temp_data
            LATEST_PRICES["last_updated"] = time.strftime("%Y-%m-%d %H:%M:%S")
            LATEST_PRICES["status"] = "Success"
            logging.info(f"Successfully scraped {len(temp_data)} items.")

        except Exception as e:
            logging.error(f"Scrape failed: {e}")
            LATEST_PRICES["status"] = f"Error: {str(e)}"
        
        finally:
            if driver:
                driver.quit()
            # آپدیت هر ۶۰ ثانیه
            time.sleep(60)

# شروع ترد پس‌زمینه
threading.Thread(target=scraper_worker, daemon=True).start()

@app.route('/prices', methods=['GET'])
def get_prices():
    return jsonify(LATEST_PRICES)

@app.route('/v1/prices', methods=['GET'])
@require_metered_api_key
def get_prices_v1():
    scope = g.api_key.get("scope") or "all"
    filtered_data = _filter_prices_by_scope(LATEST_PRICES.get("data", {}), scope)
    return jsonify({
        "data": filtered_data,
        "last_updated": LATEST_PRICES.get("last_updated"),
        "status": LATEST_PRICES.get("status"),
    })


@app.route('/v1/key/<api_key>/prices', methods=['GET'])
def get_prices_by_key(api_key: str):
    auth_row = auth_api_key_value(api_key)
    if not auth_row:
        return jsonify({"error": "Invalid or inactive API key."}), 401
    usage = increment_usage_for_key(api_key_id=int(auth_row["api_key_id"]))
    if not usage.get("ok"):
        return jsonify({"error": usage.get("error"), "usage": usage}), 429
    scope = auth_row.get("scope") or "all"
    filtered_data = _filter_prices_by_scope(LATEST_PRICES.get("data", {}), scope)
    return jsonify({
        "data": filtered_data,
        "last_updated": LATEST_PRICES.get("last_updated"),
        "status": LATEST_PRICES.get("status"),
        "usage": usage,
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"ok": True, "status": LATEST_PRICES.get("status")})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
