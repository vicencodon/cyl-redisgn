import { useState, useEffect } from 'react'
import { useSiteSettings } from '../../hooks/useSiteSettings'

// ── Componentes reutilizables ────────────────────────────────
function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder }) {
  return (
    <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
  )
}

function SaveBar({ saving, saved, onSave }) {
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-6">
      <button onClick={onSave} disabled={saving}
        className="btn-primary text-sm py-2 disabled:opacity-60">
        {saving ? 'Guardando…' : 'Guardar cambios'}
      </button>
      {saved && <span className="text-xs text-green-600 font-medium">✓ Guardado</span>}
    </div>
  )
}

function SettingsCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
      <h2 className="text-sm font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">{title}</h2>
      {children}
    </div>
  )
}

// ── Settings: Home & Hero ────────────────────────────────────
export function SettingsHome() {
  const { value, loading, saving, save } = useSiteSettings('home_hero')
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (value) setForm(value) }, [value])
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    const ok = await save(form)
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  }

  if (loading || !form) return <SettingsLoader />

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <PageHeader title="Home & Hero" sub="Textos principales de la página de inicio" />
      <SettingsCard title="Banner hero">
        <div className="space-y-4">
          <Field label="Título principal">
            <Input value={form.title} onChange={(v) => set('title', v)} />
          </Field>
          <Field label="Subtítulo">
            <textarea value={form.subtitle ?? ''} onChange={(e) => set('subtitle', e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Botón primario — texto">
              <Input value={form.cta_primary_label} onChange={(v) => set('cta_primary_label', v)} />
            </Field>
            <Field label="Botón primario — URL">
              <Input value={form.cta_primary_url} onChange={(v) => set('cta_primary_url', v)} placeholder="/novedades" />
            </Field>
            <Field label="Botón secundario — texto">
              <Input value={form.cta_secondary_label} onChange={(v) => set('cta_secondary_label', v)} />
            </Field>
            <Field label="Botón secundario — URL">
              <Input value={form.cta_secondary_url} onChange={(v) => set('cta_secondary_url', v)} placeholder="/outlet" />
            </Field>
          </div>
        </div>
        <SaveBar saving={saving} saved={saved} onSave={handleSave} />
      </SettingsCard>
    </div>
  )
}

// ── Settings: Banners ────────────────────────────────────────
export function SettingsBanners() {
  const { value, loading, saving, save } = useSiteSettings('banners')
  const [banners, setBanners] = useState([])
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (value) setBanners(value) }, [value])

  const update = (i, k, v) => setBanners((prev) => prev.map((b, idx) => idx === i ? { ...b, [k]: v } : b))
  const add    = () => setBanners((prev) => [...prev, { id: `banner-${Date.now()}`, text: '', active: true, bg_color: '#b02c2c', text_color: '#ffffff' }])
  const remove = (i) => setBanners((prev) => prev.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    const ok = await save(banners)
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  }

  if (loading) return <SettingsLoader />

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <PageHeader title="Banners" sub="Mensajes promocionales que aparecen en la parte superior de la tienda" />
      <SettingsCard title="Banners activos">
        <div className="space-y-4">
          {banners.map((b, i) => (
            <div key={b.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={b.active} onChange={(e) => update(i, 'active', e.target.checked)}
                    className="w-4 h-4 accent-brand-600" />
                  <span className="text-sm font-medium text-gray-700">Activo</span>
                </label>
                <button onClick={() => remove(i)} className="text-xs text-red-400 hover:text-red-600">Eliminar</button>
              </div>
              <Field label="Texto del banner">
                <Input value={b.text} onChange={(v) => update(i, 'text', v)} placeholder="🚚 Envío gratis en pedidos +50€" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Color de fondo">
                  <div className="flex items-center gap-2">
                    <input type="color" value={b.bg_color} onChange={(e) => update(i, 'bg_color', e.target.value)}
                      className="w-10 h-9 border border-gray-200 rounded-lg cursor-pointer" />
                    <Input value={b.bg_color} onChange={(v) => update(i, 'bg_color', v)} />
                  </div>
                </Field>
                <Field label="Color de texto">
                  <div className="flex items-center gap-2">
                    <input type="color" value={b.text_color} onChange={(e) => update(i, 'text_color', e.target.value)}
                      className="w-10 h-9 border border-gray-200 rounded-lg cursor-pointer" />
                    <Input value={b.text_color} onChange={(v) => update(i, 'text_color', v)} />
                  </div>
                </Field>
              </div>
              {b.text && (
                <div className="rounded-lg px-4 py-2 text-center text-sm font-medium"
                  style={{ backgroundColor: b.bg_color, color: b.text_color }}>
                  {b.text}
                </div>
              )}
            </div>
          ))}
          <button onClick={add} className="w-full border-2 border-dashed border-gray-200 text-gray-400 hover:border-brand-300 hover:text-brand-600 rounded-xl py-3 text-sm transition-colors">
            + Añadir banner
          </button>
        </div>
        <SaveBar saving={saving} saved={saved} onSave={handleSave} />
      </SettingsCard>
    </div>
  )
}

// ── Settings: Envío ──────────────────────────────────────────
export function SettingsShipping() {
  const { value, loading, saving, save } = useSiteSettings('shipping_methods')
  const [methods, setMethods] = useState([])
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (value) setMethods(value) }, [value])
  const update = (i, k, v) => setMethods((prev) => prev.map((m, idx) => idx === i ? { ...m, [k]: v } : m))

  const handleSave = async () => {
    const ok = await save(methods)
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  }

  if (loading) return <SettingsLoader />

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <PageHeader title="Métodos de envío" sub="Configura los métodos de envío disponibles y sus precios" />
      <SettingsCard title="Métodos disponibles">
        <div className="space-y-3">
          {methods.map((m, i) => (
            <div key={m.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-800">{m.label}</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={m.active} onChange={(e) => update(i, 'active', e.target.checked)}
                    className="w-4 h-4 accent-brand-600" />
                  <span className="text-xs text-gray-600">Activo</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nombre visible">
                  <Input value={m.label} onChange={(v) => update(i, 'label', v)} />
                </Field>
                <Field label="Precio (€)">
                  <Input type="number" value={m.price} onChange={(v) => update(i, 'price', Number(v))} />
                </Field>
                <Field label="Gratis a partir de (€)" hint="Dejar vacío para desactivar">
                  <Input type="number" value={m.free_from ?? ''} onChange={(v) => update(i, 'free_from', v ? Number(v) : null)} placeholder="50" />
                </Field>
              </div>
            </div>
          ))}
        </div>
        <SaveBar saving={saving} saved={saved} onSave={handleSave} />
      </SettingsCard>
    </div>
  )
}

// ── Settings: Pago ───────────────────────────────────────────
export function SettingsPayment() {
  const { value, loading, saving, save } = useSiteSettings('payment_methods')
  const [methods, setMethods] = useState([])
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (value) setMethods(value) }, [value])
  const update = (i, k, v) => setMethods((prev) => prev.map((m, idx) => idx === i ? { ...m, [k]: v } : m))

  const handleSave = async () => {
    const ok = await save(methods)
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  }

  if (loading) return <SettingsLoader />

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <PageHeader title="Métodos de pago" sub="Activa o desactiva los métodos de pago disponibles en el checkout" />
      <SettingsCard title="Métodos disponibles">
        <div className="space-y-3">
          {methods.map((m, i) => (
            <div key={m.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-800">{m.label}</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-gray-500">{m.active ? 'Activo' : 'Inactivo'}</span>
                <div className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${m.active ? 'bg-brand-600' : 'bg-gray-200'}`}
                  onClick={() => update(i, 'active', !m.active)}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${m.active ? 'left-5' : 'left-0.5'}`} />
                </div>
              </label>
            </div>
          ))}
        </div>
        <SaveBar saving={saving} saved={saved} onSave={handleSave} />
      </SettingsCard>
    </div>
  )
}

// ── Settings: Contacto ───────────────────────────────────────
export function SettingsContact() {
  const { value, loading, saving, save } = useSiteSettings('contact_info')
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (value) setForm(value) }, [value])
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    const ok = await save(form)
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  }

  if (loading || !form) return <SettingsLoader />

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <PageHeader title="Datos de contacto" sub="Información de contacto que aparece en el footer y página de contacto" />
      <SettingsCard title="Información de contacto">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Teléfono"><Input value={form.phone} onChange={(v) => set('phone', v)} placeholder="+34 900 000 000" /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={(v) => set('email', v)} /></Field>
          </div>
          <Field label="Dirección"><Input value={form.address} onChange={(v) => set('address', v)} /></Field>
          <Field label="Horario"><Input value={form.schedule} onChange={(v) => set('schedule', v)} placeholder="Lun–Vie 10:00–20:00" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Instagram (URL)"><Input value={form.instagram} onChange={(v) => set('instagram', v)} placeholder="https://instagram.com/..." /></Field>
            <Field label="Facebook (URL)"><Input value={form.facebook} onChange={(v) => set('facebook', v)} placeholder="https://facebook.com/..." /></Field>
          </div>
        </div>
        <SaveBar saving={saving} saved={saved} onSave={handleSave} />
      </SettingsCard>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────
function PageHeader({ title, sub }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {sub && <p className="text-sm text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function SettingsLoader() {
  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="h-8 bg-gray-100 rounded animate-pulse w-48 mb-6" />
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
      </div>
    </div>
  )
}
