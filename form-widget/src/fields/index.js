import FieldText from "./FieldText.vue";
import FieldNumber from "./FieldNumber.vue";
import FieldEmail from "./FieldEmail.vue";
import FieldPassword from "./FieldPassword.vue";
import FieldTextarea from "./FieldTextarea.vue";
import FieldSelect from "./FieldSelect.vue";
import FieldCheckbox from "./FieldCheckbox.vue";
import FieldButton from "./FieldButton.vue";

export const FIELD_COMPONENTS = {
  text: FieldText,
  number: FieldNumber,
  email: FieldEmail,
  password: FieldPassword,
  textarea: FieldTextarea,
  select: FieldSelect,
  checkbox: FieldCheckbox,
  button: FieldButton,
};