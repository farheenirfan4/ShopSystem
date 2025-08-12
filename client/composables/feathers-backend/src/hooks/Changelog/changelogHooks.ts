import type { HookContext } from '@feathersjs/feathers'
import path from 'path';


export const saveOriginalDataHook = async (context: HookContext): Promise<HookContext> => {
  if (context.method === 'patch' || context.method === 'update') {
    const original = await context.service.get(context.id!, context.params);
    context.params.original = original;
  }
  return context;
};


export const changelogHook = async (context: HookContext): Promise<HookContext> => {
  const { app, data, result, params, method } = context;
  console.log(`[ChangeLog Hook] Method: ${method}, Path: ${path}`);
  console.log('Data:', data);
  console.log('Result:', result);

  if ((method === 'patch' || method === 'update') && params.original) {
    const changes = [];

    for (const key of Object.keys(data)) {
      if (JSON.stringify(data[key]) !== JSON.stringify(params.original[key])) {
        changes.push({
          fieldname: key,
          oldvalue: params.original[key],
          newvalue: data[key]
        });
      }
    }

    if (changes.length > 0) {
      app.emit('changelog:create', {
        service_id: result.id,
        service: context.path,
        user_id: params.user?.id || null,
        timestamp: new Date().toISOString(),
        action: method,
        changes: JSON.stringify(changes)
      });
    }
  }

  if (method === 'create') {
    app.emit('changelog:create', {
      service_id: result.id,
      service: context.path,
      user_id: params.user?.id || null,
      timestamp: new Date().toISOString(),
      action: method,
      changes: JSON.stringify([
        { fieldname: 'all', oldvalue: null, newvalue: result }
      ])
    });
  }

  if (method === 'remove') {
    app.emit('changelog:create', {
      service_id: result.id,
      service: context.path,
      user_id: params.user?.id || null,
      timestamp: new Date().toISOString(),
      action: method,
      changes: JSON.stringify([
        { fieldname: 'all', oldvalue: result, newvalue: null }
      ])
    });
  }

  // Return the full context as expected
  return context;
};
