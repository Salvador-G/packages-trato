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
</template>

<style scoped>
.palette {
  width: 220px;
  padding: 12px;
  background: #f8f9fb;
  border-right: 1px solid #e0e0e0;
}

.palette h3 {
  margin-bottom: 12px;
  font-size: 14px;
  color: #444;
}

.palette-item {
  padding: 10px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: grab;
  text-align: center;
  font-size: 13px;
  transition: background 0.2s, box-shadow 0.2s;
}

.palette-item:hover {
  background: #f0f4ff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}
</style>