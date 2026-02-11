-- Supabase tables for bonbast-api sync (run in SQL editor)

create table if not exists plans (
  id bigint primary key,
  slug text unique not null,
  scope text not null default 'all',
  name text not null,
  monthly_quota bigint not null,
  rpm_limit integer not null,
  price_irr bigint not null default 0,
  active boolean not null default true,
  created_at timestamptz not null
);

create table if not exists customers (
  id bigint primary key,
  email text not null,
  supabase_user_id text unique,
  current_plan_slug text,
  created_at timestamptz not null
);

create table if not exists api_keys (
  id bigint primary key,
  customer_id bigint not null references customers(id),
  plan_id bigint not null references plans(id),
  plan_slug text,
  plan_name text,
  plan_scope text,
  monthly_quota bigint,
  rpm_limit integer,
  price_irr bigint,
  api_key text,
  api_url text,
  key_hash text,
  key_prefix text,
  key_last4 text,
  status text,
  created_at timestamptz,
  revoked_at timestamptz
);

create index if not exists api_keys_customer_id_idx on api_keys(customer_id);

create table if not exists usage_monthly (
  api_key_id bigint not null references api_keys(id),
  month text not null,
  request_count bigint not null,
  extra_quota bigint not null default 0,
  primary key (api_key_id, month)
);
