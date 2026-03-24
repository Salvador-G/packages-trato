import { createApp } from 'vue'
import FormRenderer from './FormRenderer.vue'

async function load({ selector, brand, formKey, apiBase }) {
  // Aseguramos que la URL no tenga doble slash si apiBase termina en /
  const baseUrl = apiBase.replace(/\/$/, '');
  const url = `${baseUrl}/form-engine/public/${brand}/${formKey}`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      console.error('[FormWidget] Error loading form from:', url)
      return
    }

    const formData = await res.json()
    mount(selector, formData, baseUrl, brand, formKey)
  } catch (error) {
    console.error('[FormWidget] Network error:', error)
  }
}

function mount(selector, formData, baseUrl, brandId, formKey) {
  const el = document.querySelector(selector)

  if (!el) {
    console.warn('[FormWidget] Container not found:', selector)
    return
  }

  const rawFields = formData?.schema_fields || [] 

  if (!Array.isArray(rawFields) || !rawFields.length) {
    console.warn('[FormWidget] Empty or invalid schema')
    return
  }

  // Expandimos cada campo con sus props para facilitar el acceso desde el renderer
  const fields = rawFields.map(field => ({
    ...field,
    ...(field.props || {}) // Expandimos las props (labels, placeholders, text del botón)
  }))

  const submitUrl = `${baseUrl}/form-engine/public/${brandId}/${formKey}/submit`

  createApp(FormRenderer, {
    fields,
    settings: {}, 
    meta: formData.meta || {},
    submitUrl: submitUrl 
  }).mount(el)
}

// API GLOBAL
window.FormWidget = {
  load,
  // Ya no exponemos mount públicamente porque requiere variables internas
}