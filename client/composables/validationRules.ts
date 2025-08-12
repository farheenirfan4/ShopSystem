// composables/validationRules.ts
import { computed } from 'vue';

// Define the validation functions
const required = (v: string) => !!v || 'This field is required';
const minLength = (length: number) => (v: string) => (v && v.length >= length) || `Must be at least ${length} characters`;
const maxLength = (length: number) => (v: string) => (v && v.length <= length) || `Must be at most ${length} characters`;
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email format';

// Export a rules object
export const signupRules = {
  username: [
    required,
    minLength(3),
    maxLength(20)
  ],
  email: [
    required,
    isEmail
  ],
  password: [
    required,
    minLength(8)
  ]
};