import { createApp } from 'vue'
import FormRenderer from './FormRenderer.vue'

async function load({ selector, brand, formKey, apiBase }) {
  const url = `${apiBase}/public/${brand}/${formKey}/`

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

  if (!form || !Array.isArray(form.schema)) {
    console.warn('[FormWidget] Invalid form schema')
    return
  }

  createApp(FormRenderer, {
    fields: form.schema,
    settings: form.settings || {},
    meta: form.meta || {},
  }).mount(el)
}

// API GLOBAL
window.FormWidget = {
  mount,
  load,
}
