<script setup>
import draggable from "vuedraggable";
import { createField } from "../schema/index";
import { FIELD_COMPONENTS } from "./fields/index";

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "select"]);

function onUpdate(newValue) {
  emit("update:modelValue", newValue);
}

function onChange(evt) {
  if (!evt.added) return;
  const cloned = evt.added.element;
  if (!cloned || typeof cloned.type !== "string") return;

  const field = createField(cloned.type, {}, props.modelValue);
  
  // Por defecto, hacemos que el campo ocupe el 100% del ancho
  field.width = "100"; 

  const updated = [...props.modelValue];
  updated.splice(evt.added.newIndex, 1, field);

  emit("update:modelValue", updated);
  emit("select", field.id);
}

// NUEVO: Función para eliminar un campo
function removeField(index) {
  const updated = [...props.modelValue];
  updated.splice(index, 1);
  emit("update:modelValue", updated);
  // Limpiamos la selección si se borró
  emit("select", null); 
}

// NUEVO: Calculadora de anchos para el grid (tomando en cuenta el gap de 12px)
function getFieldWidth(widthVal) {
  if (widthVal === '50') return 'calc(50% - 6px)';
  if (widthVal === '33') return 'calc(33.33% - 8px)';
  if (widthVal === '25') return 'calc(25% - 9px)';
  return '100%';
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
    <template #item="{ element, index }">
      <div 
        class="canvas-item" 
        :style="{ width: getFieldWidth(element.width) }"
      >
        <div class="canvas-item-header">
          <div class="drag-handle" title="Mover">⋮⋮</div>
          <button class="delete-btn" @click.stop="removeField(index)" title="Eliminar campo">✕</button>
        </div>

        <div class="field-preview" @click="emit('select', element.id)">
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

  /* NUEVO: Configuración Flexbox para el Grid */
  display: flex;
  flex-direction: row; /* En fila */
  flex-wrap: wrap;    /* Permite que bajen a la siguiente línea */
  gap: 12px;          /* Espaciado entre componentes */
  align-content: flex-start;
}

.canvas-item {
  padding: 12px 14px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-sizing: border-box; /* Crucial para los cálculos de width con calc() */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
}

.canvas-item:hover {
  background-color: #f1f5f9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* NUEVO: Cabecera del item para poner el icono de mover y borrar a los lados */
.canvas-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.drag-handle {
  cursor: grab;
  user-select: none;
  color: #64748b;
}

.drag-handle:active {
  cursor: grabbing;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  padding: 0 4px;
  border-radius: 4px;
}

.delete-btn:hover {
  background: #fee2e2;
}
</style>