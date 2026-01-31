import { createApp } from 'vue'
import FormRenderer from './FormRenderer.vue'

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

// 🔑 API GLOBAL
window.FormWidget = {
  mount,
}
