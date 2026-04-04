<script setup>
defineProps({
  field: Object,
  modelValue: [String, Number],
  disabled: Boolean
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field-wrapper">
    <label v-if="field.props.label">
      {{ field.props.label }} <span v-if="field.required" class="required">*</span>
    </label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :required="field.required"
      :disabled="disabled"
      class="form-input"
    >
      <option value="" disabled selected>{{ field.props.placeholder || 'Selecciona una opción...' }}</option>
      <option v-for="(opt, i) in field.options" :key="i" :value="opt">
        {{ opt }}
      </option>
    </select>
  </div>
</template>