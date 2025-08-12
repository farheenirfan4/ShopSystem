// schemas/loginSchema.ts
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv({ allErrors: true });
addFormats(ajv)

export const loginSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 }
  },
  required: ["email", "password"],
  additionalProperties: false
} as const;
