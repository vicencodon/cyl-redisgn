-- ============================================================
-- CyL Complementos — Dashboard Admin
-- Ejecutar en: Supabase > SQL Editor
-- ============================================================

-- ── TABLA: roles de usuario ──────────────────────────────────
create table if not exists user_roles (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  role    text not null default 'customer'  -- 'admin' | 'customer'
);

alter table user_roles enable row level security;

-- Cada usuario puede leer su propio rol
drop policy if exists "Leer propio rol" on user_roles;
create policy "Leer propio rol"
  on user_roles for select
  using (auth.uid() = user_id);

-- Solo service_role puede insertar/actualizar roles (desde SQL Editor)
drop policy if exists "Admin gestiona roles" on user_roles;
create policy "Admin gestiona roles"
  on user_roles for all
  using (auth.role() = 'service_role');

-- ── TABLA: configuración del sitio ───────────────────────────
create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz default now()
);

alter table site_settings enable row level security;

-- Lectura pública (la tienda la lee para mostrar banners, etc.)
drop policy if exists "Settings públicos" on site_settings;
create policy "Settings públicos"
  on site_settings for select
  using (true);

-- Solo admin puede modificar
drop policy if exists "Solo admin modifica settings" on site_settings;
create policy "Solo admin modifica settings"
  on site_settings for all
  using (
    exists (
      select 1 from user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- ── TABLA: pedidos — política adicional para admin ────────────
drop policy if exists "Admin ve todos los pedidos" on orders;
create policy "Admin ve todos los pedidos"
  on orders for all
  using (
    exists (
      select 1 from user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- ── TABLA: products — escritura para admin ───────────────────
drop policy if exists "Admin gestiona productos" on products;
create policy "Admin gestiona productos"
  on products for all
  using (
    exists (
      select 1 from user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- ── VALORES INICIALES DE SETTINGS ────────────────────────────
insert into site_settings (key, value) values
('home_hero', '{
  "title": "Tu tienda de complementos",
  "subtitle": "Bolsos, maletas, cinturones y mucho más. Descubre nuestra colección.",
  "cta_primary_label": "Ver novedades",
  "cta_primary_url": "/novedades",
  "cta_secondary_label": "Outlet",
  "cta_secondary_url": "/outlet"
}'::jsonb),

('banners', '[
  {
    "id": "banner-1",
    "text": "🚚 Envío gratis en pedidos superiores a 50€",
    "active": true,
    "bg_color": "#b02c2c",
    "text_color": "#ffffff"
  }
]'::jsonb),

('shipping_methods', '[
  { "id": "standard", "label": "Envío estándar (3-5 días)", "price": 4.95, "free_from": 50, "active": true },
  { "id": "express",  "label": "Envío express (24h)",       "price": 8.95, "free_from": null, "active": true },
  { "id": "pickup",   "label": "Recogida en tienda",        "price": 0,    "free_from": null, "active": true }
]'::jsonb),

('payment_methods', '[
  { "id": "card",     "label": "Tarjeta de crédito / débito", "active": true },
  { "id": "transfer", "label": "Transferencia bancaria",      "active": true },
  { "id": "cash",     "label": "Efectivo en tienda",          "active": true }
]'::jsonb),

('contact_info', '{
  "phone": "+34 900 000 000",
  "email": "info@cylcomplementos.com",
  "address": "Calle Mayor 1, 24001 León",
  "schedule": "Lun–Vie 10:00–20:00 · Sáb 10:00–14:00",
  "instagram": "",
  "facebook": ""
}'::jsonb)

on conflict (key) do nothing;

-- ── ASIGNAR ROL ADMIN (cambia el email por el tuyo) ──────────
-- Ejecuta esto después de hacer login en la app al menos una vez:
--
-- insert into user_roles (user_id, role)
-- select id, 'admin' from auth.users where email = 'TU_EMAIL@AQUI.COM'
-- on conflict (user_id) do update set role = 'admin';
