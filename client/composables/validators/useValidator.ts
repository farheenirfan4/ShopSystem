// composables/useValidator.ts
import ajv from '../../plugins/ajv'
import { loginSchema } from "../../schemas/loginSchema";

const validateLogin = ajv.compile(loginSchema);

export function useValidator() {
  function validateLoginForm(data: { email: string; password: string }) {
    const valid = validateLogin(data);
    return {
      valid,
      errors: valid ? [] : (validateLogin.errors || [])
    };
  }
  return { validateLoginForm };
}
