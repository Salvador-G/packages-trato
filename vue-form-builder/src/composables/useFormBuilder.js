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

  return {
    fields,
    activeField,
    activeFieldId,
    addField,
    selectField,
    updateField,
    removeField,
    exportForm,
  };
}
