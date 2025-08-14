// composables/useUserValidator.ts
import Ajv from "ajv";
import { userSchema } from "../../schemas/userSchema";
import addFormats from "ajv-formats";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({
  allErrors: true,
  strict: false, // This option allows "errorMessage"
  $data: true,
});

// 2. Add the plugins to the Ajv instance
//    This order is crucial for keywords to be recognized
addFormats(ajv);
ajvErrors(ajv, { singleError: true });

const validateUser = ajv.compile(userSchema);

export function useUserValidator() {
  function validateUserForm(data: {
    id?: string;
    email: string;
    roles: string[];
    username: string;
    password?: string;
  }) {
    const valid = validateUser(data);
    return {
      valid,
      errors: valid ? [] : (validateUser.errors || [])
    };
  }
  return { validateUserForm };
}
