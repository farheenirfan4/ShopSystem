
import Ajv from "ajv";
import addFormats from "ajv-formats";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
ajvErrors(ajv);


export interface Offer {
  id: string
  title: string
  description: string
  price: string // e.g. "19.99"
  discountPercentage: string // e.g. "10"
  promotionalTags: string | string[] ;
  product: string
  personasId: number ;
  displayConfigureId: number
  repeatPatterns: "none" | "daily" | "weekly" | "monthly"
  repeatDetails: string[]
  startDateUTC: string 
  endDateUTC: string
}

export const offersSchema = {
  additionalProperties: true,
  required: [
    "title", "description", "price", "discountPercentage",
    "promotionalTags", "product", "personasId", "displayConfigureId",
    "repeatPatterns", "repeatDetails",
    "startDateUTC", "endDateUTC"
  ],
  properties: {
    id: {
      type: "string",
      minLength: 1,
      errorMessage: {
        type: "ID must be a string",
        minLength: "ID cannot be empty"
      }
    },
    title: {
      type: "string",
      minLength: 1,
      errorMessage: {
        type: "Title must be a string",
        minLength: "Title is required"
      }
    },
    description: {
      type: "string",
      minLength: 1,
      errorMessage: {
        type: "Description must be a string",
        minLength: "Description is required"
      }
    },
    price: {
      type: "string",
      pattern: "^[0-9]+(\\.[0-9]{1,2})?$",
      errorMessage: {
        type: "Price must be a string",
        pattern: "Price must be a number optionally with up to 2 decimals, e.g. 19.99"
      }
    },
    discountPercentage: {
      type: "string",
      pattern: "^[0-9]{1,3}$",
      errorMessage: {
        type: "Discount Percentage must be a string",
        pattern: "Discount Percentage must be a number between 0 and 999"
      }
    },
    promotionalTags: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        errorMessage: {
          type: "Each promotional tag must be a string",
          minLength: "Promotional tag cannot be empty"
        }
      },
      minItems: 1,
      errorMessage: {
        type: "Promotional Tags must be an array",
        minItems: "At least one promotional tag is required"
      }
    },
    product: {
      type: "string",
      minLength: 1,
      errorMessage: {
        type: "Product must be a string",
        minLength: "Product is required"
      }
    },
    personasId: {
      type: "number",
      minimum: 1,
      errorMessage: {
        type: "Personas ID must be a number",
        minimum: "Personas ID must be at least 1"
      }
    },
    displayConfigureId: {
      type: "number",
      minimum: 1,
      errorMessage: {
        type: "Display Configure ID must be a number",
        minimum: "Display Configure ID must be at least 1"
      }
    },
    repeatPatterns: {
      type: "string",
      enum: ["none", "daily", "weekly", "monthly"],
      errorMessage: {
        type: "Repeat Pattern must be a string",
        enum: "Repeat Pattern must be one of 'none', 'daily', 'weekly', or 'monthly'"
      }
    },
    repeatDetails: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
          "null",
          "january", "february", "march", "april", "may", "june",
          "july", "august", "september", "october", "november", "december"
        ],
        errorMessage: {
          type: "Repeat Detail must be a string",
          enum: "Repeat Detail must be a valid day or month name or 'null'"
        }
      },
      minItems: 0,
      errorMessage: {
        type: "Repeat Details must be an array"
      }
    },
    startDateUTC: {
      type: "string",
      format: "date-time",
      errorMessage: {
        type: "Start Date must be a string",
        format: "Start Date must be a valid ISO date-time string"
      }
    },
    endDateUTC: {
      type: "string",
      format: "date-time",
      errorMessage: {
        type: "End Date must be a string",
        format: "End Date must be a valid ISO date-time string"
      }
    }
  },
  errorMessage: {
    required: {
      title: "Title is required",
      description: "Description is required",
      price: "Price is required",
      discountPercentage: "Discount Percentage is required",
      promotionalTags: "Promotional Tags are required",
      product: "Product is required",
      personasId: "Personas ID is required",
      displayConfigureId: "Display Configure ID is required",
      repeatPatterns: "Repeat Pattern is required",
      repeatDetails: "Repeat Details are required",
      startDateUTC: "Start Date is required",
      endDateUTC: "End Date is required"
    },
    additionalProperties: "Extra properties are not allowed"
  }
};

