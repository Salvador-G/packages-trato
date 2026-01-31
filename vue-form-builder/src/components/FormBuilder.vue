<script setup>
import draggable from 'vuedraggable'

const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:fields', 'remove'])

function updateFields(newValue) {
  emit('update:fields', newValue)
}
</script>

<template>
  <div>hola</div>
</template>
