// schemas/personaSchema.ts
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)
ajvErrors(ajv)

export const personaSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      errorMessage: {
        type: "Name must be a string",
        minLength: "Name is required"
      }
    },
    forPayingUsers: {
      type: "boolean",
      errorMessage: {
        type: "forPayingUsers must be a boolean"
      }
    },
    maxLevel: {
      type: "integer",
      minimum: 0,
      errorMessage: {
        type: "maxLevel must be an integer",
        minimum: "maxLevel must be 0 or greater"
      }
    },
    minLevel: {
      type: "integer",
      minimum: 0,
      errorMessage: {
        type: "minLevel must be an integer",
        minimum: "minLevel must be 0 or greater"
      }
    },
    maxMmr: {
      type: "integer",
      minimum: 0,
      errorMessage: {
        type: "maxMmr must be an integer",
        minimum: "maxMmr must be 0 or greater"
      }
    },
    minMmr: {
      type: "integer",
      minimum: 0,
      errorMessage: {
        type: "minMmr must be an integer",
        minimum: "minMmr must be 0 or greater"
      }
    },
    maxDeposits: {
      type: "integer",
      minimum: 0,
      errorMessage: {
        type: "maxDeposits must be an integer",
        minimum: "maxDeposits must be 0 or greater"
      }
    },
    minDeposits: {
      type: "integer",
      minimum: 0,
      errorMessage: {
        type: "minDeposits must be an integer",
        minimum: "minDeposits must be 0 or greater"
      }
    }
  },
  required: [
    "name",
    "forPayingUsers",
    "maxLevel",
    "minLevel",
    "maxMmr",
    "minMmr",
    "maxDeposits",
    "minDeposits"
  ],
  additionalProperties: false,
  errorMessage: {
    required: {
      name: "Name is required",
      forPayingUsers: "forPayingUsers is required",
      maxLevel: "maxLevel is required",
      minLevel: "minLevel is required",
      maxMmr: "maxMmr is required",
      minMmr: "minMmr is required",
      maxDeposits: "maxDeposits is required",
      minDeposits: "minDeposits is required"
    },
    additionalProperties: "No extra properties allowed"
  }
};
