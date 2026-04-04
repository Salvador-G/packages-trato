<script setup>
defineProps({
  field: { type: Object, required: true },
  renderMode: {
    type: String,
    default: "runtime", // canvas | palette | runtime
  },
  modelValue: { 
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="field" :class="`mode-${renderMode}`">
    <label class="checkbox-label" v-if="renderMode !== 'palette'">
      <input
        type="checkbox"
        class="checkbox-input"
        :required="field.props?.required || field.required"
        :disabled="renderMode !== 'runtime'"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span>
        {{ field.props?.label || field.label }}
        <span v-if="field.props?.required || field.required" class="required">*</span>
      </span>
    </label>
    
    <div v-else class="palette-preview">
      <input type="checkbox" disabled />
      <span>Checkbox</span>
    </div>
  </div>
</template>

<style scoped>
/* base (runtime) */
.field {
  margin-bottom: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4f7cff; /* Color B2B moderno */
}

.checkbox-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

/* palette preview */
.palette-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
}

/* canvas */
.mode-canvas {
  pointer-events: none;
  opacity: 0.95;
}

/* palette */
.mode-palette {
  pointer-events: none;
  opacity: 0.7;
  transform: scale(0.9);
}
</style>