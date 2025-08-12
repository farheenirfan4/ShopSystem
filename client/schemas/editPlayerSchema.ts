import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { ref } from 'vue'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

const schema = {
  type: 'object',
  required: [],
  properties: {
    username: { type: ['string', 'null'], maxLength: 30 },
    email: { type: ['string', 'null'], format: 'email' },
    location: { type: ['string', 'null'], enum: ['UK', 'USA', 'PK', 'CA', null] },
    metadata: {
      type: 'object',
      properties: {
        CareerProgressData: {
          type: 'object',
          properties: {
            XP: { type: ['integer', 'null'], minimum: 0 },
            Level: { type: ['integer', 'null'], minimum: 0, maximum: 1000 }
          },
          required: []
        },
        EarningData: {
          type: 'object',
          properties: {
            Ranking: { type: ['integer', 'null'], minimum: -100 }
          },
          required: []
        }
      },
      required: []
    }
  }
}

const validateEditUser = ajv.compile(schema)

export function editPlayerValidator() {
  const validationErrors = ref<string[]>([])

  function validate(data: any): boolean {
    const valid = validateEditUser(data)
    validationErrors.value = []

    if (!valid && validateEditUser.errors) {
      validationErrors.value = validateEditUser.errors.map((err) => {
  const pathSegments = err.instancePath.split('/').filter(Boolean)
  const field = pathSegments[pathSegments.length - 1] || err.params.missingProperty || 'Field'
  return `${field} ${err.message}`
})
    }

    return valid as boolean
  }

  return {
    validate,
    validationErrors,
  }
}
