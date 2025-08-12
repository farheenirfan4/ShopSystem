// composables/useOfferValidator.ts
import Ajv from "ajv";
import { offersSchema } from "../../schemas/offerSchema";
import addFormats from "ajv-formats";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({
  allErrors: true,
  strict: false, // allow "errorMessage" keyword
  $data: true,
});

// Add plugins in correct order
addFormats(ajv);
ajvErrors(ajv, { singleError: true });

const validateOffer = ajv.compile(offersSchema);

export function useOfferValidator() {
  function validateOfferForm(data: {
    id?: string;
    title: string;
    description: string;
    price: string;
    discountPercentage: string;
    promotionalTags: string[];
    product: string;
    personasId: number;
    displayConfigureId: number;
    repeatPatterns: "none" | "daily" | "weekly" | "monthly";
    repeatDetails: string[];
    startDateUTC: string;
    endDateUTC: string;
  }) {
    const valid = validateOffer(data);
    return {
      valid,
      errors: valid ? [] : (validateOffer.errors || [])
    };
  }

  return { validateOfferForm };
}
