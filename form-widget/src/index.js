import { createApp } from 'vue'
import FormRenderer from './FormRenderer.vue'

async function load({ selector, brand, formKey, apiBase }) {
  const url = `${apiBase}/form-engine/public/${brand}/${formKey}/`

  const res = await fetch(url)

  if (!res.ok) {
    console.error('[FormWidget] Error loading form')
    return
  }

  const form = await res.json()

  mount(selector, form)
}


function mount(selector, form) {
  const el = document.querySelector(selector)

  if (!el) {
    console.warn('[FormWidget] Container not found:', selector)
    return
  }

  const fields = form?.schema || [] 

  if (!Array.isArray(fields) || !fields.length) {
    console.warn('[FormWidget] Empty or invalid schema')
    return
  }

  createApp(FormRenderer, {
    fields,
    settings: form.settings || {},
    meta: form.meta || {},
  }).mount(el)
}


// API GLOBAL
window.FormWidget = {
  mount,
  load,
}
