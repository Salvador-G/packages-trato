<script setup>
import { reactive } from 'vue'
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
})

const formState = reactive({})

async function handleSubmit() {
  if (!props.submitUrl) {
    console.warn('[FormWidget] submitUrl not provided')
    return
  }

  try {
    const res = await fetch(props.submitUrl, {
      method: props.settings?.submitMethod || 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState),
    })

    if (!res.ok) {
      throw new Error('Submit failed')
    }

    const data = await res.json()

    console.log('[FormWidget] Submission OK:', data)

  } catch (err) {
    console.error('[FormWidget] Submission error:', err)
  }
}

function getFieldBindings(field) {
  if (field.type === 'button') {
    return {}
  }

  return {
    modelValue: formState[field.name],
    'onUpdate:modelValue': val => {
      formState[field.name] = val
    }
  }
}

</script>

<template>
    <form class="sheet" @submit.prevent="handleSubmit">
    <component
      v-for="field in fields"
      :key="field.id"
      :is="FIELD_COMPONENTS[field.type]"
      :field="field"
      v-bind="getFieldBindings(field)"
    />
  </form>
</template>
<style scoped>
.sheet {
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  width: 450px;
  margin: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>