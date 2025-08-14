import Ajv from "ajv";
import addFormats from "ajv-formats";
import ajvErrors from "ajv-errors";
import { displayConfigureSchema } from "../../schemas/displayConfigureSchema";

const ajv = new Ajv({
  allErrors: true,
  strict: false, // allow "errorMessage"
  $data: true,
});
addFormats(ajv);
ajvErrors(ajv, { singleError: true });

const validateDisplayConfigure = ajv.compile(displayConfigureSchema);

export function useDisplayConfigureValidator() {
  function validateDisplayConfigureForm(data: {
    displaySection: string;
    height: string;
    width: string;
    priority: number;
  }) {
    const valid = validateDisplayConfigure(data);
    return {
      valid,
      errors: valid ? [] : (validateDisplayConfigure.errors || []),
    };
  }
  return { validateDisplayConfigureForm };
}
