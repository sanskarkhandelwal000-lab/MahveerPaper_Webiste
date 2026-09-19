/**
 * Inbox database schema. Idempotent (create ... if not exists) and applied
 * automatically on first connection by lib/inbox/db.ts, so there is no separate
 * migration step. Works on Postgres (Supabase etc.) and on the embedded PGlite
 * used for local development.
 */
export const SCHEMA_SQL = `
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  role text not null default 'agent' check (role in ('admin','agent')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  wa_id text not null unique,
  name text,
  profile_name text,
  email text,
  location text,
  company text,
  tags text[] not null default '{}',
  opted_in boolean not null default false,
  opted_in_at timestamptz,
  blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contacts_tags_idx on contacts using gin (tags);

create table if not exists labels (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#00a884'
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null unique references contacts(id) on delete cascade,
  status text not null default 'open' check (status in ('open','resolved')),
  assigned_to uuid references users(id) on delete set null,
  bot_paused boolean not null default false,
  needs_human boolean not null default false,
  pinned boolean not null default false,
  unread_count int not null default 0,
  last_message_at timestamptz,
  last_message_preview text,
  last_message_direction text,
  last_inbound_at timestamptz,
  bot_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists conversations_last_idx on conversations (last_message_at desc nulls last);

create table if not exists conversation_labels (
  conversation_id uuid not null references conversations(id) on delete cascade,
  label_id uuid not null references labels(id) on delete cascade,
  primary key (conversation_id, label_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  wa_message_id text unique,
  direction text not null check (direction in ('in','out')),
  sender_type text not null default 'customer' check (sender_type in ('customer','bot','agent','campaign','system')),
  sender_user_id uuid references users(id) on delete set null,
  type text not null default 'text',
  body text,
  caption text,
  media_id text,
  media_path text,
  mime_type text,
  filename text,
  location jsonb,
  contacts jsonb,
  interactive jsonb,
  template_name text,
  reply_to_wa_id text,
  reactions jsonb not null default '[]'::jsonb,
  status text not null default 'sent' check (status in ('queued','sent','delivered','read','failed')),
  error text,
  created_at timestamptz not null default now()
);
create index if not exists messages_conv_idx on messages (conversation_id, created_at);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists quick_replies (
  id uuid primary key default gen_random_uuid(),
  shortcut text not null unique,
  body text not null
);

create table if not exists templates (
  id uuid primary key default gen_random_uuid(),
  wa_template_id text,
  name text not null,
  language text not null default 'en',
  category text not null default 'MARKETING',
  status text not null default 'PENDING',
  components jsonb not null default '[]'::jsonb,
  rejected_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, language)
);

create table if not exists contact_lists (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);
create table if not exists contact_list_members (
  list_id uuid not null references contact_lists(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  primary key (list_id, contact_id)
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  template_id uuid not null references templates(id),
  audience jsonb not null default '{}'::jsonb,
  variables jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','scheduled','sending','completed','cancelled')),
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','sent','delivered','read','failed')),
  wa_message_id text,
  error text,
  sent_at timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  unique (campaign_id, contact_id)
);
create index if not exists campaign_recipients_wa_idx on campaign_recipients (wa_message_id);

create table if not exists sample_requests (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references contacts(id) on delete set null,
  wa_id text,
  product_id text,
  product_name text,
  name text,
  email text,
  location text,
  status text not null default 'awaiting' check (status in ('awaiting','new','shipped','closed')),
  created_at timestamptz not null default now()
);

create table if not exists media_files (
  path text primary key,
  mime text not null,
  data bytea not null,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  key text primary key,
  value jsonb not null
);
`;
