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

    // Check if the user is attempting to change their own record
    if (user && user.id === id) {
      const originalRoles = user.roles || [];
      const newRoles = data.roles || [];

      // Check if the role array has changed
      const rolesChanged = JSON.stringify(originalRoles.sort()) !== JSON.stringify(newRoles.sort());

      if (rolesChanged) {
        // Find if the user is an admin
        const isAdmin = originalRoles.includes('admin');
        
        // Admins can change their own role, but other users cannot
        if (!isAdmin) {
          throw new Forbidden('You are not allowed to change your own role.');
        }
      }
    }

    return context;
  };
};