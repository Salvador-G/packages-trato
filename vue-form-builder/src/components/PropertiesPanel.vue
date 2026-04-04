<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  activeField: {
    type: Object,
    default: null,
  },
  mappingOptions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["update-field"]);

const localField = ref({ props: {} });

/**
 * Sincronización a prueba de balas
 */
watch(
  () => props.activeField,
  (field) => {
    if (field) {
      // Hacemos una copia profunda segura
      const copy = JSON.parse(JSON.stringify(field));
      
      // Blindaje: si el field no tiene props (como el checkbox nuevo), se lo creamos vacío
      if (!copy.props) copy.props = {};

      // Lógica especial para transformar el array del Select en texto
      if (copy.type === 'select' && Array.isArray(copy.options)) {
        copy.optionsText = copy.options.join('\n');
      } else {
        copy.optionsText = '';
      }

      // Vue actualiza toda la vista de golpe sin perder reactividad
      localField.value = copy;
    }
  },
  { immediate: true, deep: true }
);

/**
 * Actualiza atributos que viven dentro de "props" (label, min, max, required, etc)
 * SIN borrar los demás atributos.
 */
function updateProp(key, value) {
  if (!props.activeField) return;

  emit("update-field", {
    id: props.activeField.id,
    changes: {
      props: {
        ...localField.value.props,
        [key]: value
      }
    },
  });
}

/**
 * Actualiza atributos que viven en la raíz (options)
 */
function updateRoot(key, value) {
  if (!props.activeField) return;

  emit("update-field", {
    id: props.activeField.id,
    changes: {
      [key]: value
    },
  });
}

const isEmpty = computed(() => !props.activeField);

const supportsRequired = computed(() => {
  if (!localField.value || !localField.value.type) return false;
  return ["text", "number", "select", "checkbox", "textarea", "email", "password"].includes(localField.value.type);
});

const supportsMapping = computed(() => {
  if (!localField.value || !localField.value.type) return false;
  
  // Solo permitimos mapear campos de Texto, Correo o Listas Desplegables.
  // Excluimos explícitamente 'number', 'button', 'checkbox', etc.
  return ["text", "email", "select"].includes(localField.value.type);
});
</script>

<template>
  <aside class="properties-panel">
    <div v-if="isEmpty" class="empty-state">
      Selecciona un campo para editar sus propiedades
    </div>

    <div v-else class="panel-content">
      <h3 class="title">Propiedades del campo</h3>

      <div v-if="localField.type !== 'button'" class="field">
        <label>Etiqueta</label>
        <input
          type="text"
          v-model="localField.props.label"
          @input="updateProp('label', localField.props.label)"
        />
      </div>

      <div v-if="supportsMapping && mappingOptions.length > 0" class="field">
        <label>Mapear datos (Integración):</label>
        <select
          v-model="localField.props.mappedTo"
          @change="updateProp('mappedTo', localField.props.mappedTo)"
        >
          <option value="">-- Campo personalizado --</option>
          <option 
            v-for="opt in mappingOptions" 
            :key="opt.value" 
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
        <small style="color: #64748b; font-size: 11px; margin-top: 4px; display: block;">
          Vinculará la respuesta con el sistema externo.
        </small>
      </div>

      <div v-if="supportsRequired" class="field switch-field">
        <span>Campo requerido</span>
        <label class="switch">
          <input
            type="checkbox"
            v-model="localField.props.required"
            @change="updateProp('required', localField.props.required)"
          />
          <span class="slider"></span>
        </label>
      </div>

      <template v-if="['text', 'textarea', 'email', 'password'].includes(localField.type)">
        <div class="field">
          <label>Placeholder</label>
          <input
            type="text"
            v-model="localField.props.placeholder"
            @input="updateProp('placeholder', localField.props.placeholder)"
          />
        </div>

        <div class="field" v-if="localField.type === 'text'">
          <label>Longitud máxima</label>
          <input
            type="number"
            min="1"
            v-model.number="localField.props.maxLength"
            @input="updateProp('maxLength', localField.props.maxLength)"
          />
        </div>
      </template>

      <template v-if="localField.type === 'number'">
        <div class="field">
          <label>Mínimo</label>
          <input
            type="number"
            v-model.number="localField.props.min"
            @input="updateProp('min', localField.props.min)"
          />
        </div>

        <div class="field">
          <label>Máximo</label>
          <input
            type="number"
            v-model.number="localField.props.max"
            @input="updateProp('max', localField.props.max)"
          />
        </div>
      </template>

      <template v-if="localField.type === 'select'">
        <div class="field">
          <label>Opciones (una por línea)</label>
          <textarea
            rows="5"
            v-model="localField.optionsText"
            @input="
              updateRoot('options', (localField.optionsText || '')
                  .split('\n')
                  .map(o => o.trim())
                  .filter(Boolean))
            "
          />
        </div>
      </template>

      <template v-if="localField.type === 'button'">
        <div class="field">
          <label>Texto del botón</label>
          <input
            type="text"
            v-model="localField.props.text"
            @input="updateProp('text', localField.props.text)"
          />
        </div>

        <div class="field switch-field">
          <span>Deshabilitado</span>
          <label class="switch">
            <input
              type="checkbox"
              v-model="localField.props.disabled"
              @change="updateProp('disabled', localField.props.disabled)"
            />
            <span class="slider"></span>
          </label>
        </div>
      </template>
    </div>
  </aside>
</template>

<style scoped>
/* TODO TU CSS SE MANTIENE EXACTAMENTE IGUAL AQUÍ */
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

.field select { 
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