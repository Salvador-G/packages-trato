<script setup>
defineProps({
  field: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="field field-button">
    <button
      class="button"
      type="button"
      :name="field.name"
      :disabled="field.disabled"
    >
      {{ field.props.text }}
    </button>
  </div>
</template>
<style scoped>
.field-button {
  margin-bottom: 16px;
}

.button {
  width: 100%;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  background-color: #4f7cff;
  color: #fff;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>