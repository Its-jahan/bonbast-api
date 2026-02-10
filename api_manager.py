import datetime as _dt
import hashlib as _hashlib
import hmac as _hmac
import os as _os
import secrets as _secrets
import sqlite3 as _sqlite3

from flask import Blueprint, current_app, g, jsonify, request


bp = Blueprint("api_manager", __name__)


DEFAULT_PLANS = [
    {
        "slug": "starter",
        "name": "پلن استارتر",
        "monthly_quota": 300_000,
        "rpm_limit": 120,
        "price_irr": 0,
        "active": 1,
    },
    {
        "slug": "business",
        "name": "پلن تجاری",
        "monthly_quota": 1_000_000,
        "rpm_limit": 600,
        "price_irr": 0,
        "active": 1,
    },
    {
        "slug": "enterprise",
        "name": "پلن سازمانی",
        "monthly_quota": 10_000_000,
        "rpm_limit": 2_000,
        "price_irr": 0,
        "active": 1,
    },
]


def _utcnow_iso() -> str:
    return _dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def _month_key() -> str:
    return _dt.datetime.utcnow().strftime("%Y-%m")


def _get_db_path() -> str:
    return (
        current_app.config.get("API_DB_PATH")
        or _os.environ.get("API_DB_PATH")
        or _os.path.join(current_app.root_path, "data", "api_manager.db")
    )


def _get_pepper_path() -> str:
    return (
        current_app.config.get("API_KEY_PEPPER_PATH")
        or _os.environ.get("API_KEY_PEPPER_PATH")
        or _os.path.join(current_app.root_path, "data", "api_key_pepper")
    )


def _ensure_parent_dir(path: str) -> None:
    parent = _os.path.dirname(path)
    if parent:
        _os.makedirs(parent, exist_ok=True)


def get_db() -> _sqlite3.Connection:
    db = getattr(g, "_api_manager_db", None)
    if db is not None:
        return db

    db_path = _get_db_path()
    _ensure_parent_dir(db_path)
    db = _sqlite3.connect(db_path)
    db.row_factory = _sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON;")
    g._api_manager_db = db
    return db


def close_db(_exc=None) -> None:
    db = getattr(g, "_api_manager_db", None)
    if db is not None:
        db.close()
        g._api_manager_db = None


def _load_or_create_pepper() -> bytes:
    if "API_KEY_PEPPER_BYTES" in current_app.config:
        return current_app.config["API_KEY_PEPPER_BYTES"]

    env_pepper = _os.environ.get("API_KEY_PEPPER")
    if env_pepper:
        pepper_bytes = env_pepper.encode("utf-8")
        current_app.config["API_KEY_PEPPER_BYTES"] = pepper_bytes
        return pepper_bytes

    pepper_path = _get_pepper_path()
    _ensure_parent_dir(pepper_path)

    if _os.path.exists(pepper_path):
        with open(pepper_path, "rb") as f:
            pepper_bytes = f.read().strip()
    else:
        pepper_bytes = _secrets.token_bytes(32)
        with open(pepper_path, "wb") as f:
            f.write(pepper_bytes)

    current_app.config["API_KEY_PEPPER_BYTES"] = pepper_bytes
    return pepper_bytes


def _hash_api_key(api_key: str) -> str:
    pepper = _load_or_create_pepper()
    return _hmac.new(pepper, api_key.encode("utf-8"), _hashlib.sha256).hexdigest()


def _generate_api_key() -> str:
    return f"bb_{_secrets.token_urlsafe(32)}"


def init_db() -> None:
    db_path = _get_db_path()
    _ensure_parent_dir(db_path)
    db = _sqlite3.connect(db_path)
    try:
        db.execute("PRAGMA foreign_keys = ON;")
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS plans (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              slug TEXT NOT NULL UNIQUE,
              name TEXT NOT NULL,
              monthly_quota INTEGER NOT NULL,
              rpm_limit INTEGER NOT NULL,
              price_irr INTEGER NOT NULL DEFAULT 0,
              active INTEGER NOT NULL DEFAULT 1,
              created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS customers (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              email TEXT NOT NULL UNIQUE,
              created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS api_keys (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              customer_id INTEGER NOT NULL REFERENCES customers(id),
              plan_id INTEGER NOT NULL REFERENCES plans(id),
              key_hash TEXT NOT NULL UNIQUE,
              key_prefix TEXT NOT NULL,
              key_last4 TEXT NOT NULL,
              status TEXT NOT NULL,
              created_at TEXT NOT NULL,
              revoked_at TEXT
            );

            CREATE TABLE IF NOT EXISTS usage_monthly (
              api_key_id INTEGER NOT NULL REFERENCES api_keys(id),
              month TEXT NOT NULL,
              request_count INTEGER NOT NULL,
              PRIMARY KEY (api_key_id, month)
            );
            """
        )

        existing = db.execute("SELECT COUNT(1) AS c FROM plans;").fetchone()[0]
        if existing == 0:
            now = _utcnow_iso()
            for plan in DEFAULT_PLANS:
                db.execute(
                    """
                    INSERT INTO plans (slug, name, monthly_quota, rpm_limit, price_irr, active, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?);
                    """,
                    (
                        plan["slug"],
                        plan["name"],
                        int(plan["monthly_quota"]),
                        int(plan["rpm_limit"]),
                        int(plan.get("price_irr", 0)),
                        int(plan.get("active", 1)),
                        now,
                    ),
                )
        db.commit()
    finally:
        db.close()


def _get_or_create_customer(db: _sqlite3.Connection, email: str) -> int:
    row = db.execute("SELECT id FROM customers WHERE email = ?;", (email,)).fetchone()
    if row:
        return int(row["id"])
    now = _utcnow_iso()
    cur = db.execute("INSERT INTO customers (email, created_at) VALUES (?, ?);", (email, now))
    return int(cur.lastrowid)


def _create_api_key(db: _sqlite3.Connection, *, customer_id: int, plan_id: int) -> dict:
    api_key = _generate_api_key()
    key_hash = _hash_api_key(api_key)
    key_prefix = api_key.split("_", 1)[0]
    key_last4 = api_key[-4:]
    now = _utcnow_iso()
    cur = db.execute(
        """
        INSERT INTO api_keys (customer_id, plan_id, key_hash, key_prefix, key_last4, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'active', ?);
        """,
        (customer_id, plan_id, key_hash, key_prefix, key_last4, now),
    )
    return {"api_key": api_key, "api_key_id": int(cur.lastrowid), "created_at": now}


def _auth_api_key(db: _sqlite3.Connection, api_key: str):
    key_hash = _hash_api_key(api_key)
    row = db.execute(
        """
        SELECT api_keys.id AS api_key_id, api_keys.status, api_keys.customer_id, api_keys.plan_id,
               plans.slug AS plan_slug, plans.name AS plan_name, plans.monthly_quota, plans.rpm_limit, plans.active AS plan_active
        FROM api_keys
        JOIN plans ON plans.id = api_keys.plan_id
        WHERE api_keys.key_hash = ?;
        """,
        (key_hash,),
    ).fetchone()
    if not row:
        return None
    if row["status"] != "active" or int(row["plan_active"]) != 1:
        return None
    return row


def _increment_usage_or_reject(db: _sqlite3.Connection, *, api_key_id: int) -> dict:
    month = _month_key()
    db.execute("BEGIN IMMEDIATE;")
    row = db.execute(
        """
        SELECT plans.monthly_quota AS monthly_quota,
               COALESCE(usage_monthly.request_count, 0) AS request_count
        FROM api_keys
        JOIN plans ON plans.id = api_keys.plan_id
        LEFT JOIN usage_monthly ON usage_monthly.api_key_id = api_keys.id AND usage_monthly.month = ?
        WHERE api_keys.id = ? AND api_keys.status = 'active';
        """,
        (month, api_key_id),
    ).fetchone()
    if not row:
        db.execute("ROLLBACK;")
        return {"ok": False, "error": "API key not active."}

    monthly_quota = int(row["monthly_quota"])
    request_count = int(row["request_count"])
    if request_count >= monthly_quota:
        db.execute("ROLLBACK;")
        return {"ok": False, "error": "Monthly quota exceeded.", "month": month, "request_count": request_count, "monthly_quota": monthly_quota}

    new_count = request_count + 1
    db.execute(
        """
        INSERT INTO usage_monthly (api_key_id, month, request_count)
        VALUES (?, ?, ?)
        ON CONFLICT(api_key_id, month) DO UPDATE SET request_count = excluded.request_count;
        """,
        (api_key_id, month, new_count),
    )
    db.commit()
    return {"ok": True, "month": month, "request_count": new_count, "monthly_quota": monthly_quota}


def require_api_key(view_func):
    def wrapped(*args, **kwargs):
        api_key = request.headers.get("x-api-key") or request.headers.get("X-API-Key")
        if not api_key:
            return jsonify({"error": "Missing x-api-key header."}), 401

        db = get_db()
        auth_row = _auth_api_key(db, api_key)
        if not auth_row:
            return jsonify({"error": "Invalid or inactive API key."}), 401

        g.api_key = auth_row
        return view_func(*args, **kwargs)

    wrapped.__name__ = getattr(view_func, "__name__", "wrapped")
    return wrapped


def require_metered_api_key(view_func):
    @require_api_key
    def wrapped(*args, **kwargs):
        db = get_db()
        usage = _increment_usage_or_reject(db, api_key_id=int(g.api_key["api_key_id"]))
        if not usage.get("ok"):
            return jsonify({"error": usage.get("error"), "usage": usage}), 429
        g.api_usage = usage
        return view_func(*args, **kwargs)

    wrapped.__name__ = getattr(view_func, "__name__", "wrapped_metered")
    return wrapped


def _require_admin(view_func):
    def wrapped(*args, **kwargs):
        admin_token = _os.environ.get("ADMIN_TOKEN")
        if not admin_token:
            return jsonify({"error": "ADMIN_TOKEN is not configured."}), 503
        provided = request.headers.get("x-admin-token") or request.headers.get("X-Admin-Token")
        if provided != admin_token:
            return jsonify({"error": "Unauthorized."}), 401
        return view_func(*args, **kwargs)

    wrapped.__name__ = getattr(view_func, "__name__", "wrapped_admin")
    return wrapped


@bp.get("/plans")
def list_plans():
    db = get_db()
    rows = db.execute(
        "SELECT slug, name, monthly_quota, rpm_limit, price_irr, active FROM plans WHERE active = 1 ORDER BY id ASC;"
    ).fetchall()
    return jsonify(
        {
            "plans": [
                {
                    "slug": r["slug"],
                    "name": r["name"],
                    "monthly_quota": int(r["monthly_quota"]),
                    "rpm_limit": int(r["rpm_limit"]),
                    "price_irr": int(r["price_irr"]),
                }
                for r in rows
            ]
        }
    )


@bp.post("/purchase")
def purchase_plan():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    plan_slug = (payload.get("plan_slug") or "").strip()

    if not email or "@" not in email:
        return jsonify({"error": "A valid email is required."}), 400
    if not plan_slug:
        return jsonify({"error": "plan_slug is required."}), 400

    db = get_db()
    plan = db.execute("SELECT id, slug, name FROM plans WHERE slug = ? AND active = 1;", (plan_slug,)).fetchone()
    if not plan:
        return jsonify({"error": "Plan not found."}), 404

    # NOTE: Payment integration (Stripe/Zarinpal/etc.) should happen before issuing a key.
    customer_id = _get_or_create_customer(db, email)
    key = _create_api_key(db, customer_id=customer_id, plan_id=int(plan["id"]))
    db.commit()
    return jsonify(
        {
            "api_key": key["api_key"],
            "api_key_id": key["api_key_id"],
            "plan": {"slug": plan["slug"], "name": plan["name"]},
            "created_at": key["created_at"],
        }
    )


@bp.get("/self/usage")
@require_api_key
def self_usage():
    db = get_db()
    api_key_id = int(g.api_key["api_key_id"])
    month = _month_key()
    row = db.execute(
        """
        SELECT COALESCE(usage_monthly.request_count, 0) AS request_count,
               plans.monthly_quota AS monthly_quota,
               plans.slug AS plan_slug,
               plans.name AS plan_name
        FROM api_keys
        JOIN plans ON plans.id = api_keys.plan_id
        LEFT JOIN usage_monthly ON usage_monthly.api_key_id = api_keys.id AND usage_monthly.month = ?
        WHERE api_keys.id = ?;
        """,
        (month, api_key_id),
    ).fetchone()
    return jsonify(
        {
            "month": month,
            "request_count": int(row["request_count"]),
            "monthly_quota": int(row["monthly_quota"]),
            "plan": {"slug": row["plan_slug"], "name": row["plan_name"]},
        }
    )


@bp.post("/self/rotate")
def self_rotate():
    api_key = request.headers.get("x-api-key") or request.headers.get("X-API-Key")
    if not api_key:
        return jsonify({"error": "Missing x-api-key header."}), 401

    db = get_db()
    auth_row = _auth_api_key(db, api_key)
    if not auth_row:
        return jsonify({"error": "Invalid or inactive API key."}), 401

    db.execute("BEGIN IMMEDIATE;")
    db.execute("UPDATE api_keys SET status = 'revoked', revoked_at = ? WHERE id = ?;", (_utcnow_iso(), int(auth_row["api_key_id"])))
    key = _create_api_key(db, customer_id=int(auth_row["customer_id"]), plan_id=int(auth_row["plan_id"]))
    db.commit()
    return jsonify(
        {
            "api_key": key["api_key"],
            "api_key_id": key["api_key_id"],
            "plan": {"slug": auth_row["plan_slug"], "name": auth_row["plan_name"]},
            "created_at": key["created_at"],
        }
    )


@bp.get("/admin/keys")
@_require_admin
def admin_list_keys():
    db = get_db()
    rows = db.execute(
        """
        SELECT api_keys.id AS api_key_id, api_keys.key_prefix, api_keys.key_last4, api_keys.status,
               api_keys.created_at, api_keys.revoked_at,
               customers.email AS email,
               plans.slug AS plan_slug, plans.name AS plan_name
        FROM api_keys
        JOIN customers ON customers.id = api_keys.customer_id
        JOIN plans ON plans.id = api_keys.plan_id
        ORDER BY api_keys.id DESC
        LIMIT 200;
        """
    ).fetchall()
    return jsonify(
        {
            "keys": [
                {
                    "api_key_id": int(r["api_key_id"]),
                    "masked": f"{r['key_prefix']}_…{r['key_last4']}",
                    "status": r["status"],
                    "created_at": r["created_at"],
                    "revoked_at": r["revoked_at"],
                    "customer": {"email": r["email"]},
                    "plan": {"slug": r["plan_slug"], "name": r["plan_name"]},
                }
                for r in rows
            ]
        }
    )


def init_api_manager(app) -> None:
    app.config.setdefault(
        "API_DB_PATH",
        _os.environ.get("API_DB_PATH") or _os.path.join(app.root_path, "data", "api_manager.db"),
    )
    app.config.setdefault(
        "API_KEY_PEPPER_PATH",
        _os.environ.get("API_KEY_PEPPER_PATH") or _os.path.join(app.root_path, "data", "api_key_pepper"),
    )

    with app.app_context():
        init_db()
        _load_or_create_pepper()
    app.teardown_appcontext(close_db)
    app.register_blueprint(bp)
