<script setup>
const props = defineProps({
  field: {
    type: Object,
    required: true,
  },
})
</script>
<template>
  <div class="field">
    <label>{{ field.props?.label }}</label>
    <input
      class="input"
      type="password"
      :name="field.name"
      :placeholder="field.props.placeholder"
      :required="field.props.required"
    />
  </div>
</template>
<style scoped>
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.field label {
  font-size: 13px;
  color: #555;
  margin-bottom: 6px;
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
</style>
