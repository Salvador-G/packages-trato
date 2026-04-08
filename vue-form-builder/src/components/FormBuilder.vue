<script setup>
import { ref, computed } from 'vue'
import FieldPalette from './FieldPalette.vue'
import FormCanvas from './FormCanvas.vue'
import PropertiesPanel from './PropertiesPanel.vue'

const props = defineProps({
  // modelValue recibirá el array 'fields' desde el v-model del padre
  modelValue: {
    type: Array,
    required: true,
  },
  // Recibimos las opciones de mapeo para pasárselas al panel de propiedades
  mappingOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

// El estado interno de selección ahora vive en el Builder
const activeFieldId = ref(null)

const activeField = computed(() => {
  return props.modelValue.find(f => f.id === activeFieldId.value) || null
})

// Función para actualizar toda la estructura (al mover o añadir)
function updateFields(newFields) {
  emit('update:modelValue', newFields)
}

// Función para actualizar las propiedades de un solo campo
function applyFieldUpdate({ id, changes }) {
  const updatedFields = props.modelValue.map(field => {
    if (field.id === id) {
      return { ...field, ...changes }
    }
    return field
  })
  updateFields(updatedFields)
}
</script>

<template>
  <div class="form-builder-layout">
    <div class="layout-column column-palette">
      <FieldPalette />
    </div>

    <div class="layout-column column-canvas">
      <FormCanvas 
        :modelValue="modelValue" 
        @update:modelValue="updateFields"
        @select="activeFieldId = $event"
      />
    </div>

    <div class="layout-column column-properties">
      <PropertiesPanel 
        :activeField="activeField"
        :mappingOptions="mappingOptions"
        @update-field="applyFieldUpdate"
      />
    </div>
  </div>
</template>

<style scoped>
/* Estilos en Vue puro, replicando el diseño sin usar PrimeFlex */
.form-builder-layout {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Equivalente al gap-3 */
  height: 100%;
  box-sizing: border-box;
}

/* En pantallas grandes (lg), pasa a ser una fila */
@media (min-width: 992px) {
  .form-builder-layout {
    flex-direction: row;
  }
}

.layout-column {
  border: 1px solid #e2e8f0; /* Equivalente a surface-border border-1 */
  border-radius: 8px;        /* Equivalente a border-round */
  overflow-y: auto;          /* Equivalente a overflow-y-auto */
  background-color: #ffffff;
}

/* Tamaños de las columnas en pantallas grandes */
@media (min-width: 992px) {
  .column-palette {
    flex: 0 0 25%; /* Equivalente a lg:w-3 */
  }
  
  .column-canvas {
    flex: 1; /* Equivalente a lg:w-6 (Ocupa el resto del espacio) */
    background-color: #f8fafc; /* Equivalente a surface-ground */
    padding: 16px; /* Equivalente a p-4 */
  }
  
  .column-properties {
    flex: 0 0 25%; /* Equivalente a lg:w-3 */
  }
}
</style>