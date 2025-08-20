// src/hooks/preventSelfRoleChange.ts
import { Forbidden } from '@feathersjs/errors';
import { HookContext } from '../../declarations';
import { User } from '../../services/users/users.schema';

export const preventSelfRoleChange = () => {
  return async (context: HookContext) => {
    const { id, data, params } = context;
    const user = params.user as User;

    // This hook is for `patch` and `update`
    if (context.method !== 'patch' && context.method !== 'update') {
      return context;
    }

    
    if (user && user.id === id) {
      const originalRoles = user.roles || [];
      const newRoles = data.roles || [];

      
      const rolesChanged = JSON.stringify(originalRoles.sort()) !== JSON.stringify(newRoles.sort());

      if (rolesChanged) {
        
        const isAdmin = originalRoles.includes('admin');
        
        
        if (!isAdmin) {
          throw new Forbidden('You are not allowed to change your own role.');
        }
      }
    }

    return context;
  };
};