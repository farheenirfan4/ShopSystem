import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)
ajvErrors(ajv)

export const displayConfigureSchema = {
  type: "object",
  properties: {
    displaySection: {
      type: "string",
      minLength: 1,
      errorMessage: {
        type: "Display Section must be a string",
        minLength: "Display Section is required"
      }
    },
    height: {
      type: "string",
      minLength: 1,
      errorMessage: {
        type: "Height must be a string",
        minLength: "Height is required"
      }
    },
    width: {
      type: "string",
      minLength: 1,
      errorMessage: {
        type: "Width must be a string",
        minLength: "Width is required"
      }
    },
    priority: {
      type: "number",
      minLength: 1,
      errorMessage: {
        type: "Priority must be a string",
        minLength: "Priority is required"
      }
    }
  },
  required: ["displaySection", "height", "width", "priority"],
  additionalProperties: false,
  errorMessage: {
    required: {
      displaySection: "Display Section is required",
      height: "Height is required",
      width: "Width is required",
      priority: "Priority is required"
    },
    additionalProperties: "No extra properties allowed"
  }
};
