<script setup>
import { FIELD_COMPONENTS } from '../components/fields/index'

defineProps({
  fields: {
    type: Array,
    required: true,
  },
  settings: {
    type: Object,
    default: () => ({}),
  },
})

// Misma función de cálculo que en el Canvas
function getFieldWidth(widthVal) {
  if (widthVal === '50') return 'calc(50% - 6px)';
  if (widthVal === '33') return 'calc(33.33% - 8px)';
  if (widthVal === '25') return 'calc(25% - 9px)';
  return '100%';
}
</script>

<template>
  <div class="sheet">
    <div
      v-for="field in fields"
      :key="field.id"
      class="renderer-field-wrapper"
      :style="{ width: getFieldWidth(field.width) }"
    >
      <component
        :is="FIELD_COMPONENTS[field.type]"
        :field="field"
      />
    </div>
  </div>
</template>

<style scoped>
.sheet {
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 600px; /* Mejor usar max-width para que sea responsivo */
  margin: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  /* Habilitamos el Flex Grid aquí también */
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.renderer-field-wrapper {
  box-sizing: border-box;
}
</style>