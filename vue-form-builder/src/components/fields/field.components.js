import FieldText from './FieldText.vue'
import FieldNumber from './FieldNumber.vue'
import FieldTextArea from './FieldTextArea.vue'
import FieldEmail from './FieldEmail.vue'
import FieldPassword from './FieldPassword.vue'
import FieldSelect from './FieldSelect.vue'
import FieldCheckbox from './FieldCheckbox.vue'
import FieldButton from './FieldButton.vue'

export const FIELD_COMPONENTS = {
  text: FieldText,
  number: FieldNumber,
  textarea: FieldTextArea,
  email: FieldEmail,
  password: FieldPassword,
  select: FieldSelect,
  checkbox: FieldCheckbox,
  button: FieldButton,
}
