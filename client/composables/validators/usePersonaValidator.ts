// composables/usePersonaValidator.ts
import Ajv from "ajv";
import addFormats from "ajv-formats";
import ajvErrors from "ajv-errors";
import { personaSchema } from "../../schemas/personaSchema";

const ajv = new Ajv({
  allErrors: true,
  strict: false, // allow "errorMessage"
  $data: true,
});
addFormats(ajv);
ajvErrors(ajv, { singleError: true });

const validatePersona = ajv.compile(personaSchema);

export function usePersonaValidator() {
  function validatePersonaForm(data: {
    name: string;
    forPayingUsers: boolean;
    maxLevel: number;
    minLevel: number;
    maxMmr: number;
    minMmr: number;
    maxDeposits: number;
    minDeposits: number;
  }) {
    const valid = validatePersona(data);
    return {
      valid,
      errors: valid ? [] : (validatePersona.errors || []),
    };
  }
  return { validatePersonaForm };
}
