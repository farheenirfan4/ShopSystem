// hooks/validateUsernameSearch.ts
import { BadRequest } from '@feathersjs/errors'
import type { HookContext } from '@feathersjs/feathers'

export const validateUsernameSearch = () => {
  return async (context: HookContext) => {
    const usernameQuery = context.params.query?.username

    // username: { $like: '%a%' } or username: 'a'
    if (typeof usernameQuery === 'string' && usernameQuery.length < 2) {
      throw new BadRequest('Search query too short')
    }

    if (
      typeof usernameQuery === 'object' &&
      ('$like' in usernameQuery || '$ilike' in usernameQuery)
    ) {
      const value = usernameQuery.$like || usernameQuery.$ilike
      const cleaned = String(value).replace(/%/g, '')
      if (cleaned.length < 2) {
        throw new BadRequest('Search query too short')
      }
    }

    return context
  }
}
