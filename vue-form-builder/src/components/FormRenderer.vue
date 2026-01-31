<script setup>
import { FIELD_COMPONENTS } from '../components/fields/index'

defineProps({
  fields: {
    type: Array,
    required: true,
  },
  settings: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="sheet">
    <component
    v-for="field in fields"
    :key="field.id"
    :is="FIELD_COMPONENTS[field.type]"
    :field="field"
  />
  </div>
</template>
<style scoped>
.sheet {
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  width: 450px;
  margin: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>