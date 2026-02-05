import { computed } from "vue";
import { useFormBuilderStore } from "../stores/formBuilder.store";
import { createField } from "../schema/field.schema";

export function useFormBuilder() {
  const store = useFormBuilderStore();

  /* ============================
   * Estado derivado
   * ============================ */
  const fields = computed({
    get: () => store.fields,
    set: (value) => {
      store.fields = value;
      store.touch();
    },
  });

  const activeFieldId = computed({
    get: () => store.activeFieldId,
    set: (id) => (store.activeFieldId = id),
  });

  const activeField = computed(
    () => store.fields.find((f) => f.id === store.activeFieldId) || null,
  );

  /* ============================
   * Acciones
   * ============================ */
  function addField(type, overrides = {}) {
  const field = createField(type, overrides, store.fields)
  store.fields.push(field)
  store.activeFieldId = field.id
  store.touch()
}

  function selectField(id) {
    store.activeFieldId = id;
  }

  function updateField({ id, changes }) {
    const index = store.fields.findIndex((f) => f.id === id);
    if (index === -1) return;

    const field = store.fields[index];

    store.fields[index] = {
      ...field,
      ...changes,
      props: {
        ...field.props,
        ...(changes.props || {}),
      },
    };

    store.touch();
  }

  function removeField(id) {
    store.fields = store.fields.filter((f) => f.id !== id);
    if (store.activeFieldId === id) {
      store.activeFieldId = null;
    }
    store.touch();
  }

  function exportForm() {
    return store.exportForm();
  }

  /**
   * Exporta y envía a un endpoint dinámico
   * El paquete NO asume nada del backend
   */
  async function exportAndSend({
    endpoint,
    method = 'POST',
    headers = {},
    transform,
  }) {
    if (!endpoint) {
      throw new Error('exportAndSend: endpoint is required')
    }

    const payload = exportForm()
    const body = transform ? transform(payload) : payload

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Failed to export form')
    }

    return response.json()
  }

  return {
    fields,
    activeField,
    activeFieldId,
    addField,
    selectField,
    updateField,
    removeField,
    exportForm,
    exportAndSend,
  };
}
