import { HookContext } from '@feathersjs/feathers'

export const logChange = (entity: string, action: 'create' | 'patch' | 'remove') => {
  return async (context: HookContext) => {
    const { app, id, result, params, data } = context
    const entityId = result?.id || id?.toString() || ''
    const changedBy = params?.user?.id || 'system'

    const oldData =
      action === 'create'
        ? null
        : await app.service(entity).get(entityId).catch(() => null)

    await app.service('change-logs').create({
      entity,
      entityId,
      action,
      changedBy,
      timestamp: new Date().toISOString(),
      oldData,
      newData: result || data
    })

    return context
  }
}
