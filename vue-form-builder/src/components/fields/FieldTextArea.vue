<script setup>
const props = defineProps({
  field: {
    type: Object,
    required: true,
  },
  renderMode: {
    type: String,
    default: "runtime", // canvas | palette | runtime
  },
});
</script>
<template>
  <div class="field" :class="`mode-${renderMode}`">
    <!-- label SOLO en runtime y canvas -->
    <label v-if="renderMode !== 'palette'">
      {{ field.props?.label }}
    </label>

    <input
      class="input"
      type="text"
      :name="field.name"
      :placeholder="field.props.placeholder"
      :required="field.props.required"
      :disabled="renderMode !== 'runtime'"
    />
  </div>
</template>
<style scoped>
/* base (runtime) */
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.input:focus {
  outline: none;
  border-color: #4f7cff;
  box-shadow: 0 0 0 2px rgba(79,124,255,0.15);
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
