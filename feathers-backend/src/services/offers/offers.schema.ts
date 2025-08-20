// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { OffersService } from './offers.class'
import { format } from 'path'
import { Type } from '@feathersjs/typebox'

// Main data model schema
export const offersSchema = {
  $id: 'Offers',
  type: 'object',
  additionalProperties: false,
  required: [
    'title', 'description', 'price', 'discountPercentage',
    'promotionalTags', 'product', 'personasId', 'displayConfigureId',
    'repeatPatterns','repeatDetails', 'createdBy', 'updatedBy',
    'startDateUTC', 'endDateUTC', 'createdAt', 'updatedAt'
  ],
  properties: {
    id:{type: 'string'},
    title: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    price: { type: 'string', pattern: '^[0-9]+(\\.[0-9]{1,2})?$' }, // e.g., 19.99
    discountPercentage: { type: 'string', pattern: '^[0-9]{1,3}$' },
    
    promotionalTags: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
      minItems: 1
    },
    
    product: {
      type: 'string', minLength: 1
      
    },

    personasId: { type: 'number', minimum: 1 },
    displayConfigureId: { type: 'number', minimum: 1 },
    repeatPatterns: { type: 'string', enum: ['none', 'daily', 'weekly', 'monthly'] },
    repeatDetails: {
  type: 'array',
  items: {
    anyOf: [
      { type: 'string', enum: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday','null','january','february','march','april','may','june','july','august','september','october','november','december',
        '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20',
        '21','22','23','24','25','26','27','28','29','30','31'
      ] },
    ]
  },
  minItems: 0
},

    createdBy: { type: 'string', minLength: 1 },
    updatedBy: { type: 'string', minLength: 1 },

    isDeleted: { type: 'boolean' },

    startDateUTC: { type: 'string', format: 'date-time' },
    endDateUTC: { type: 'string', format: 'date-time' },

    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    //status: {type: 'string'}
  }
} as const
export type Offers = FromSchema<typeof offersSchema>
export const offersValidator = getValidator(offersSchema, dataValidator)
export const offersResolver = resolve<Offers, HookContext<OffersService>>({})

export const offersExternalResolver = resolve<Offers, HookContext<OffersService>>({})

// Schema for creating new data
export const offersDataSchema = {
  $id: 'OffersData',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...offersSchema.properties
  }
} as const
export type OffersData = FromSchema<typeof offersDataSchema>
export const offersDataValidator = getValidator(offersDataSchema, dataValidator)
export const offersDataResolver = resolve<OffersData, HookContext<OffersService>>({})

// Schema for updating existing data
export const offersPatchSchema = {
  $id: 'OffersPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...offersSchema.properties
  }
} as const
export type OffersPatch = FromSchema<typeof offersPatchSchema>
export const offersPatchValidator = getValidator(offersPatchSchema, dataValidator)
export const offersPatchResolver = resolve<OffersPatch, HookContext<OffersService>>({})

// Schema for allowed query properties
export const offersQuerySchema = {
  $id: 'OffersQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(offersSchema.properties),
    $offersPerDay: Type.Optional(Type.Boolean()),
  }
} as const
export type OffersQuery = FromSchema<typeof offersQuerySchema>
export const offersQueryValidator = getValidator(offersQuerySchema, queryValidator)
export const offersQueryResolver = resolve<OffersQuery, HookContext<OffersService>>({})
