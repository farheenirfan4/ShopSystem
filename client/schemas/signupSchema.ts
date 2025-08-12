import Ajv from "ajv"
import ajvErrors from "ajv-errors"
import addFormats from "ajv-formats"

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  code: { source: true } 
})

addFormats(ajv)
ajvErrors(ajv)

export const signupSchema = {
  type: "object",
  required: ["username", "email", "password"],
  properties: {
    username: {
      type: "string",
      minLength: 3,
      maxLength: 20
    },
    email: {
      type: "string",
      format: "email"
    },
    password: {
      type: "string",
      minLength: 8
    }
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      username: "Username must be between 3–20 characters",
      email: "Email must be valid",
      password: "Password must be at least 8 characters",
    },
    required: {
      username: "Username is required",
      email: "Email is required",
      password: "Password is required",
    },
    additionalProperties: "Extra properties are not allowed"
  }
}

//export const validateSignup = ajv.compile(signupSchema)
