<script setup>
defineProps({
  field: Object,
  modelValue: Boolean,
  disabled: Boolean
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field-wrapper checkbox-wrapper">
    <label class="checkbox-label">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        :required="field.required"
        :disabled="disabled"
      />
      <span>{{ field.props.label }} <span v-if="field.required" class="required">*</span></span>
    </label>
  </div>
</template>

<style scoped>
.checkbox-wrapper { display: flex; align-items: center; }
.checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; }
input[type="checkbox"] { width: 16px; height: 16px; }
</style>