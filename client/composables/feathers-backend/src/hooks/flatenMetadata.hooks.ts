import { HookContext } from '@feathersjs/feathers'

export const flattenMetadataForSort = (context: HookContext) => {
  if (context.type === 'before' && context.method === 'find') {
    const sort = context.params.query?.$sort || {}
    const flattenedSort: Record<string, number> = {}

    for (const key in sort) {
      if (key.startsWith('metadata.CareerProgressData.Level')) {
        flattenedSort['metadataLevel'] = sort[key]
        delete context.params.query.$sort[key]
      } else {
        flattenedSort[key] = sort[key]
      }
    }

    context.params.query.$sort = flattenedSort
  }

  return context
}
