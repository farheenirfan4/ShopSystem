// composables/useValidator.ts
import { ref, computed } from 'vue';

export function useValidator<T extends object>(rules: Record<keyof T, ((value: any) => string | boolean)[]>) {
  const errors = ref<Partial<Record<keyof T, string>>>({});
  const formValid = computed(() => Object.values(errors.value).every(error => !error));

  const validateField = (field: keyof T, value: any) => {
    const fieldRules = rules[field];
    if (!fieldRules) return true;

    for (const rule of fieldRules) {
      const result = rule(value);
      if (typeof result === 'string') {
        errors.value[field] = result;
        return false;
      }
    }
    delete errors.value[field];
    return true;
  };

  const validateAll = (data: T) => {
    let isValid = true;
    for (const key in rules) {
      if (!validateField(key, data[key])) {
        isValid = false;
      }
    }
    return isValid;
  };

  return {
    errors,
    formValid,
    validateField,
    validateAll,
  };
}