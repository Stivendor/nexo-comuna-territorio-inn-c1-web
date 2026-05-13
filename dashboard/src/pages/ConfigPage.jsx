import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Save } from 'lucide-react'

export default function ConfigPage() {
  const [webhookUrl, setWebhookUrl] = useState('')
  const [saved, setSaved] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setSaved(false)

    const { error } = await supabase
      .from('config')
      .upsert({ key: 'webhook_url', value: webhookUrl })

    if (!error) setSaved(true)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="section-title">Configuración</h1>
        <p className="section-subtitle">Comuna 1 - Popular · Ajustes del dashboard</p>
      </div>

      <div className="config-section">
        <h2>Webhook del bot</h2>
        <p className="config-desc">URL donde Camello_c1_bot envía los datos de nuevos usuarios.</p>
        <form onSubmit={handleSave} className="config-form">
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://tu-dominio.com/api/webhook"
          />
          <button type="submit" className="btn-primary">
            <Save size={16} />
            Guardar
          </button>
        </form>
        {saved && <p className="success-msg">Configuración guardada ✅</p>}
      </div>

      <div className="config-section">
        <h2>Información del proyecto</h2>
        <div className="config-info">
          <div className="info-row">
            <span>Proyecto</span>
            <span>Nexo-Comuna · Comuna 1 - Popular</span>
          </div>
          <div className="info-row">
            <span>Bot de Telegram</span>
            <span>@Camello_c1_bot</span>
          </div>
          <div className="info-row">
            <span>Programa</span>
            <span>Territorio Inn</span>
          </div>
          <div className="info-row">
            <span>Barrios</span>
            <span>11 barrios de la C1</span>
          </div>
        </div>
      </div>
    </div>
  )
}
