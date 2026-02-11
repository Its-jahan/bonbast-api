# استفاده از نسخه اسلیم پایتون
FROM python:3.11-slim

# نصب پکیج‌های سیستمی مورد نیاز برای کروم و سلنیوم
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    wget \
    gnupg \
    unzip \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# کپی نیازمندی‌ها و نصب آن‌ها
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# کپی کد برنامه
COPY . .

# تنظیم متغیر محیطی برای اینکه پایتون بداند کروم کجاست
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver

EXPOSE 5000

CMD ["python", "app.py"]
