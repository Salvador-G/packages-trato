<script setup>
import { reactive, ref } from 'vue'
import { FIELD_COMPONENTS } from './fields/index'

const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  settings: {
    type: Object,
    default: () => ({}),
  },
  meta: {
    type: Object,
    default: () => ({}),
  },
  submitUrl: {
    type: String,
    default: null,
  },
  source: {
    type: String,
    default: 'widget',
  }
})

const formState = reactive({})

// ¡NUEVO! Estados para mejorar la UX (Experiencia de Usuario)
const isSubmitting = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  if (!props.submitUrl) {
    console.warn('[FormWidget] submitUrl no provisto')
    return
  }

  try {
    isSubmitting.value = true
    errorMessage.value = ''

    const finalPayload = {};
    
    props.fields.forEach(field => {
      // Ignoramos el botón de envío
      if (field.type === 'button') return;
      
      // La regla de oro B2B: 
      // 1. Usa el mapeo del CRM si existe.
      // 2. Si no, usa la pregunta real (Label) para que sea legible en el panel.
      // 3. Si por alguna razón no hay label, usa el nombre interno (text_1).
      const mappedKey = field.props?.mappedTo || field.props?.label || field.name;
      
      // Asignamos la respuesta del usuario final a esta nueva llave legible
      finalPayload[mappedKey] = formState[field.name];
    });

    // Envolvemos finalPayload dentro de "payload"
    const bodyData = {
      payload: finalPayload,
      source: props.source
    }

    const res = await fetch(props.submitUrl, {
      method: props.settings?.submitMethod || 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData), 
    })

    if (!res.ok) {
      throw new Error('No se pudo enviar el formulario.')
    }

    const data = await res.json()
    console.log('[FormWidget] Envío exitoso, ID:', data.submission_id)
    
    isSuccess.value = true

  } catch (err) {
    console.error('[FormWidget] Error en el envío:', err)
    errorMessage.value = 'Hubo un error al enviar tus datos. Intenta de nuevo.'
  } finally {
    isSubmitting.value = false
  }
}

function getFieldBindings(field) {
  if (field.type === 'button') {
    // Si el botón está enviando, lo deshabilitamos para evitar doble click
    return {
      disabled: isSubmitting.value,
      // Si quieres cambiar el texto mientras carga:
      // text: isSubmitting.value ? 'Enviando...' : field.text
    }
  }

  return {
    modelValue: formState[field.name],
    'onUpdate:modelValue': val => {
      formState[field.name] = val
    },
    // Deshabilitamos inputs si se está enviando
    disabled: isSubmitting.value 
  }
}
</script>

<template>
  <div class="form-container">
    
    <div v-if="isSuccess" class="success-screen">
      <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <h3>{{ settings.successMessage || '¡Formulario enviado con éxito!' }}</h3>
      <p>Nos pondremos en contacto contigo pronto.</p>
    </div>

    <form v-else class="sheet" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>

      <component
        v-for="field in fields"
        :key="field.id"
        :is="FIELD_COMPONENTS[field.type]"
        :field="field"
        v-bind="getFieldBindings(field)"
      />
    </form>
    
  </div>
</template>

<style scoped>
.form-container {
  width: 100%;
  max-width: 450px;
  margin: auto;
  font-family: system-ui, -apple-system, sans-serif;
}

.sheet {
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
}

.success-screen {
  padding: 40px 24px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
}

.success-icon {
  width: 64px;
  height: 64px;
  color: #10b981; /* Verde esmeralda */
  margin: 0 auto 16px;
}

.success-screen h3 {
  margin: 0 0 8px;
  color: #111827;
}

.success-screen p {
  margin: 0;
  color: #6b7280;
}

.error-banner {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  text-align: center;
}
</style>