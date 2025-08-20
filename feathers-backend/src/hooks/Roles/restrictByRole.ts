// src/hooks/restrictByRole.ts
import { Forbidden } from '@feathersjs/errors';
import { HookContext } from '../../declarations';

export const restrictByRole = (...roles: string[]) => {
  return async (context: HookContext) => {
    const { params } = context;
    const user = params.user;

   
    if (!user) {
      throw new Forbidden('You must be authenticated to access this resource.');
    }

    
    const hasRole = roles.some(role => user.roles && user.roles.includes(role));

    if (!hasRole) {
      throw new Forbidden('You do not have the required permissions to perform this action.');
    }

    return context;
  };
};