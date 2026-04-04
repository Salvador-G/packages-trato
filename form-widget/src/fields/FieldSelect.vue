<script setup>
defineProps({
  field: { type: Object, required: true },
  renderMode: {
    type: String,
    default: "runtime", // canvas | palette | runtime
  },
  modelValue: { 
    type: [String, Number],
    default: ""
  }
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="field" :class="`mode-${renderMode}`">
    <label v-if="renderMode !== 'palette'">
      {{ field.props?.label || field.label }}
      <span v-if="field.props?.required || field.required" class="required">*</span>
    </label>

    <select
      class="input"
      :required="field.props?.required || field.required"
      :disabled="renderMode !== 'runtime'"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled selected>
        {{ field.props?.placeholder || field.placeholder || 'Seleccione una opción...' }}
      </option>
      <option 
        v-for="(opt, index) in (field.options || [])" 
        :key="index" 
        :value="opt"
      >
        {{ opt }}
      </option>
    </select>
  </div>
</template>

<style scoped>
/* base (runtime) */
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #334155;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #ffffff;
  color: #1e293b;
  cursor: pointer;
}

.input:focus {
  outline: none;
  border-color: #4f7cff;
  box-shadow: 0 0 0 2px rgba(79,124,255,0.15);
}

.input:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
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