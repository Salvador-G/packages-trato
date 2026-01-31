<script setup>
import { computed, reactive, watch } from "vue";

const props = defineProps({
  activeField: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update-field"]);

/**
 * Copia editable del campo activo
 */
const localField = reactive({});

/**
 * Sincronización del campo activo
 */
watch(
  () => props.activeField,
  (field) => {
    Object.keys(localField).forEach((k) => delete localField[k]);

    if (field) {
      Object.assign(localField, JSON.parse(JSON.stringify(field)));
    }
  },
  { immediate: true }
);

/**
 * Emitir cambios parciales
 */
function update(changes) {
  if (!props.activeField) return;

  emit("update-field", {
    id: props.activeField.id,
    changes,
  });
}

const isEmpty = computed(() => !props.activeField);

/**
 * Campos que soportan "required"
 */
const supportsRequired = computed(() =>
  ["text", "number", "select", "checkbox"].includes(localField.type)
);
</script>

<template>
  <aside class="properties-panel">
    <div v-if="isEmpty" class="empty-state">
      Selecciona un campo para editar sus propiedades
    </div>

    <div v-else class="panel-content">
      <h3 class="title">Propiedades del campo</h3>

      <!-- Label (NO para button) -->
      <div v-if="localField.type !== 'button'" class="field">
        <label>Etiqueta</label>
        <input
          type="text"
          v-model="localField.props.label"
          @input="update({ props: { label: localField.props.label } })"
        />
      </div>

      <!-- Required como switch -->
      <div v-if="supportsRequired" class="field switch-field">
        <span>Campo requerido</span>

        <label class="switch">
          <input
            type="checkbox"
            v-model="localField.required"
            @change="update({ required: localField.required })"
          />
          <span class="slider"></span>
        </label>
      </div>

      <!-- TEXT -->
      <template v-if="localField.type === 'text'">
        <div class="field">
          <label>Placeholder</label>
          <input
            type="text"
            v-model="localField.props.placeholder"
            @input="update({ props: { placeholder: localField.props.placeholder } })"
          />
        </div>

        <div class="field">
          <label>Longitud máxima</label>
          <input
            type="number"
            min="1"
            v-model.number="localField.maxLength"
            @input="update({ maxLength: localField.maxLength })"
          />
        </div>
      </template>

      <!-- NUMBER -->
      <template v-if="localField.type === 'number'">
        <div class="field">
          <label>Mínimo</label>
          <input
            type="number"
            v-model.number="localField.min"
            @input="update({ min: localField.min })"
          />
        </div>

        <div class="field">
          <label>Máximo</label>
          <input
            type="number"
            v-model.number="localField.max"
            @input="update({ max: localField.max })"
          />
        </div>
      </template>

      <!-- SELECT -->
      <template v-if="localField.type === 'select'">
        <div class="field">
          <label>Opciones (una por línea)</label>
          <textarea
            rows="5"
            v-model="localField.optionsText"
            @input="
              update({
                options: localField.optionsText
                  .split('\n')
                  .map(o => o.trim())
                  .filter(Boolean),
              })
            "
          />
        </div>
      </template>

      <!-- BUTTON -->
      <template v-if="localField.type === 'button'">
        <div class="field">
          <label>Texto del botón</label>
          <input
            type="text"
            v-model="localField.props.text"
            @input="update({ props: { text: localField.props.text } })"
          />
        </div>

        <div class="field switch-field">
          <span>Deshabilitado</span>

          <label class="switch">
            <input
              type="checkbox"
              v-model="localField.disabled"
              @change="update({ disabled: localField.disabled })"
            />
            <span class="slider"></span>
          </label>
        </div>
      </template>
    </div>
  </aside>
</template>

<style scoped>
.properties-panel {
  width: 320px;
  padding: 16px;
  border-left: 1px solid #e2e8f0;
  background: #ffffff;
}

.empty-state {
  color: #64748b;
  font-size: 14px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.field {
  margin-bottom: 12px;
}

.field label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
  color: #334155;
}

.field input,
.field textarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
}

/* SWITCH */
.switch-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch {
  position: relative;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  inset: 0;
  background-color: #cbd5e1;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.2s;
}

.slider::before {
  content: "";
  position: absolute;
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.2s;
}

.switch input:checked + .slider {
  background-color: #4f7cff;
}

.switch input:checked + .slider::before {
  transform: translateX(20px);
}
</style>
