<script setup>
import draggable from 'vuedraggable'
import { createField } from '../schema/index'
import { FIELD_COMPONENTS } from './fields/index'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'select',
])

function onUpdate(newValue) {
  emit('update:modelValue', newValue)
}

function onChange(evt) {
  console.log('[FormCanvas] onChange evt:', evt)

  // SOLO cuando se agrega desde la palette
  if (!evt.added) return

  const cloned = evt.added.element
  console.log('[FormCanvas] cloned:', cloned)

  if (!cloned || typeof cloned.type !== 'string') {
    console.warn('[FormCanvas] cloned inválido:', cloned)
    return
  }

  const field = createField(
  cloned.type,
  {},
  props.modelValue
)
  console.log('[FormCanvas] field creado:', field)

  const updated = [...props.modelValue]
  updated.splice(evt.added.newIndex, 1, field)

  emit('update:modelValue', updated)
  emit('select', field.id)
}
</script>

<template>
  <draggable
  :model-value="modelValue"
  item-key="id"
  :group="{ name: 'form', pull: true, put: true }"
  class="canvas"
  handle=".drag-handle"
  @update:modelValue="onUpdate"
  @change="onChange"
>
    <template #item="{ element }">
      <div class="canvas-item">
  <div
    class="drag-handle"
    title="Mover"
  >
    ⋮⋮
  </div>

  <div
    class="field-preview"
    @click="emit('select', element.id)"
  >
    <component
      :is="FIELD_COMPONENTS[element.type]"
      :field="element"
      readonly
    />
  </div>
</div>
    </template>
  </draggable>
</template>
<style scoped>
.canvas {
  min-height: 300px;
  padding: 16px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  background-color: #f8fafc;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

.canvas-item {
  padding: 12px 14px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;

  cursor: move;
  user-select: none;

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
}

.canvas-item:hover {
  background-color: #f1f5f9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.drag-handle {
  cursor: grab;
  user-select: none;
  color: #64748b;
  margin-bottom: 6px;
}

.drag-handle:active {
  cursor: grabbing;
}
</style>
