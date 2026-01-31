import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'

export const useFormBuilderStore = defineStore('formBuilder', {
  state: () => ({
    meta: {
      id: null,
      name: 'Untitled form',
      alias: null,
      version: 1,
      createdAt: null,
      updatedAt: null,
    },

    settings: {
      submitMethod: 'POST',
      endpoint: null,
      showHeader: false,
    },

    fields: [],

    activeFieldId: null,
  }),

  getters: {
    isReady: (state) => !!state.meta.id,
  },

  actions: {
    /** Inicializa un nuevo formulario */
    createForm(payload = {}) {
      const now = new Date().toISOString()

      this.meta = {
        id: nanoid(),
        name: payload.name || 'Untitled form',
        alias: payload.alias || null,
        version: 1,
        createdAt: now,
        updatedAt: now,
      }

      this.settings = {
        submitMethod: 'POST',
        endpoint: null,
        showHeader: false,
      }

      this.fields = []
      this.activeFieldId = null
    },

    /** Marca modificación */
    touch() {
      this.meta.updatedAt = new Date().toISOString()
    },

    /** Reemplaza todos los campos (importación) */
    setFields(fields = []) {
      this.fields = Array.isArray(fields) ? fields : []
      this.activeFieldId = null
      this.touch()
    },

    /** Importa un formulario completo */
    importForm(form) {
      if (!form || !Array.isArray(form.schema)) return

      this.meta = {
        ...form.meta,
        id: form.meta?.id || nanoid(),
        updatedAt: new Date().toISOString(),
      }

      this.settings = {
        ...this.settings,
        ...form.settings,
      }

      this.fields = form.schema
      this.activeFieldId = null
    },

    /** Exportación limpia (lista para widget / backend) */
    exportForm() {
      return {
        meta: { ...this.meta },
        settings: { ...this.settings },
        schema: JSON.parse(JSON.stringify(this.fields)),
      }
    },
  },
})
