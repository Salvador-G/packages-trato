/* =====================================================
 * Field Types
 * ===================================================== */

export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  EMAIL: 'email',
  PASSWORD: 'password',
  TEXTAREA: 'textarea',
  BUTTON: 'button',
}

/* =====================================================
 * Base names (payload keys)
 * ===================================================== */
/**
 * Define el nombre base usado para generar el `name`
 * del campo dentro del payload.
 *
 * Regla:
 * - type puede repetirse
 * - name NO debe repetirse dentro de un formulario
 */
export const FIELD_BASE_NAMES = {
  [FIELD_TYPES.TEXT]: 'text',
  [FIELD_TYPES.NUMBER]: 'number',
  [FIELD_TYPES.EMAIL]: 'email',
  [FIELD_TYPES.PASSWORD]: 'password',
  [FIELD_TYPES.TEXTAREA]: 'textarea',
  // BUTTON no genera payload → no tiene base name
}

/* =====================================================
 * Field Definitions (UI defaults)
 * ===================================================== */

export const FIELD_DEFINITIONS = {
  [FIELD_TYPES.TEXT]: {
    paletteLabel: 'InputText',
    props: {
      label: 'Texto',
      required: false,
      placeholder: 'Ingrese texto',
      maxLength: null,
    },
  },

  [FIELD_TYPES.NUMBER]: {
    paletteLabel: 'InputNumber',
    props: {
      label: 'Número',
      required: false,
      min: null,
      max: null,
    },
  },

  [FIELD_TYPES.TEXTAREA]: {
    paletteLabel: 'Textarea',
    props: {
      label: 'Textarea',
      required: false,
      placeholder: 'Descripción',
      rows: 3,
    },
  },

  [FIELD_TYPES.EMAIL]: {
    paletteLabel: 'Email',
    props: {
      label: 'Correo',
      required: false,
      placeholder: 'correo@ejemplo.com',
    },
  },

  [FIELD_TYPES.PASSWORD]: {
    paletteLabel: 'Password',
    props: {
      label: 'Contraseña',
      required: false,
      placeholder: 'Password',
    },
  },

  [FIELD_TYPES.BUTTON]: {
    paletteLabel: 'Button',
    props: {
      text: 'Enviar',
      action: 'submit',
      disabled: false,
    },
  },
}

/* =====================================================
 * UUID generator
 * ===================================================== */

function generateId() {
  return crypto.randomUUID()
}

/* =====================================================
 * Name generator
 * ===================================================== */

function generateUniqueName(type, fields = []) {
  const base = FIELD_BASE_NAMES[type]
  if (!base) return null

  const existingNames = fields
  .map(f => f.name)
  .filter(n => typeof n === 'string' && n.length)

  if (!existingNames.includes(base)) {
    return base
  }

  let i = 1
  while (existingNames.includes(`${base}_${i}`)) {
    i++
  }

  return `${base}_${i}`
}

/* =====================================================
 * Factory
 * ===================================================== */
/**
 * @param {string} type - FIELD_TYPES
 * @param {object} overrides - props o name custom
 * @param {array} fields - schema actual del formulario
 */
export function createField(type, overrides = {}, fields = []) {
  const definition = FIELD_DEFINITIONS[type]

  if (!definition) {
    throw new Error(`Unsupported field type: ${type}`)
  }

  return {
    id: generateId(),

    // name:
    // - si el usuario lo define → se respeta
    // - si no → se autogenera
    // - botones no generan name
    name:
      overrides.name ??
      (type !== FIELD_TYPES.BUTTON
        ? generateUniqueName(type, fields)
        : null),

    type,

    props: {
      ...definition.props,
      ...overrides.props,
    },
  }
}
