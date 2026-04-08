<script setup>
import draggable from 'vuedraggable'
import { FIELD_DEFINITIONS } from '../schema/index'
import { createField } from '../schema/field.schema'

const palette = Object.entries(FIELD_DEFINITIONS).map(
  ([type, def]) => ({
    type,
    label: def.paletteLabel,
  })
)

function cloneField(item) {
  return createField(item.type)
}
</script>
<template>
  <div class="palette">
    <h3>Campos</h3>
    
    <draggable
      :list="palette"
      item-key="type"
      :group="{ name: 'form', pull: 'clone', put: false }"
      :sort="false"
      :clone="cloneField"
    >
      <template #item="{ element }">
        <div class="palette-item">
          {{ element.label }}
        </div>
      </template>
    </draggable>
  </div>
</template>
<style scoped>
.palette {
  /* CAMBIOS AQUI: 
     1. Quitamos width: 220px y le damos 100% para que respete el 25% del padre 
     2. Quitamos el border-right porque la clase .layout-column ya envuelve todo con un borde
  */
  width: 100%;
  height: 100%; 
  padding: 16px; 
  background: #f8f9fb; /* Puedes dejar este fondo o cambiarlo a transparente si prefieres que sea blanco */
  box-sizing: border-box;
}

.palette h3 {
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #334155;
}

.palette-item {
  padding: 10px;
  margin-bottom: 10px;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  cursor: grab;
  text-align: center;
  font-size: 13px;
  color: #475569;
  transition: all 0.2s ease;
}

.palette-item:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>