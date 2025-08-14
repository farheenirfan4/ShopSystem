// schemas/userSchema.ts

import type { User } from "../composables/users/useUser"; // adjust path as needed
import Ajv from "ajv";
import addFormats from "ajv-formats";
import ajvErrors from "ajv-errors";

// Initialize Ajv with formats and custom error messages
const ajv = new Ajv({
  allErrors: true,
  strict: false, // allow non-standard keywords like errorMessage
  $data: true
});
addFormats(ajv);
ajvErrors(ajv, { singleError: true });

export const userSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 1,
      errorMessage: {
        type: "ID must be a string",
        minLength: "ID is required"
      }
    },
    email: {
      type: "string",
      format: "email",
      errorMessage: {
        type: "Email must be a string",
        format: "Email must be a valid email address"
      }
    },
    roles: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        errorMessage: {
          type: "Role must be a string",
          minLength: "Role name cannot be empty"
        }
      },
      minItems: 1,
      errorMessage: {
        type: "Roles must be an array of strings",
        minItems: "At least one role is required"
      }
    },
    username: {
      type: "string",
      minLength: 3,
      maxLength: 30,
      errorMessage: {
        type: "Username must be a string",
        minLength: "Username must be at least 3 characters long",
        maxLength: "Username must not exceed 30 characters"
      }
    },
    password: {
      type: "string",
      minLength: 8, // Enforcing a minimum length for security
      errorMessage: {
        type: "Password must be a string",
        minLength: "Password must be at least 8 characters long"
      }
    }
  },
  required: [ "email", "roles", "username"],
  additionalProperties: false,
  errorMessage: {
    required: {
      email: "Email is required",
      roles: "Roles are required",
      username: "Username is required"
    },
    additionalProperties: "Extra properties are not allowed"
  }
};
