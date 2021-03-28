import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';
// At it's simplest, access control returns a yes or no value depending on the users session


export function isSignedIn({session}: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map(permission => [
    permission,
    function ({session}: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    }
  ])
);

// Permissions check if someone meets a criteria - yes or no
export const permissions = {
  ...generatedPermissions
};

// Rule based function
// Rules can return a boolean or a filter wich limits wich products they can CRUD
export const rules = {
  canManageProducts({session}: ListAccessArgs) {
    // 1. Do they have permission ?
    if (!isSignedIn({session})) {
      return false;
    }
    if (permissions.canManageProducts?.({session})) {
      console.log("CAN MANAGE PRODUCTS", session)
      return true;
    }
    // 2. If not, do they own the item ?
    return {user: {id: session.itemId }};
  },
  canReadProducts({session}: ListAccessArgs) {
    if (permissions.canManageProducts?.({session})) {
      return true; // Can read everything
    }
    // Can only see available
    return { status: 'AVAILABLE' };
  },
  canOrder({session}: ListAccessArgs) {
    // 1. Do they have permission ?
    if (!isSignedIn({session})) {
      return false;
    }
    if (permissions.canManageCart?.({session})) {
      return true;
    }
    // 2. If not, do they own the item ?
    return {user: {id: session.itemId }};
  },
  canManageOrderItems({session}: ListAccessArgs) {
    // 1. Do they have permission ?
    if (!isSignedIn({session})) {
      return false;
    }

    if (permissions.canManageCart?.({session})) {
      return true;
    }
    // 2. If not, do they own the item ?
    return {order: {user: {id: session.itemId }}};
  },
  canManageUsers({session}: ListAccessArgs) {
    // 1. Do they have permission ?
    if (!isSignedIn({session})) {
      return false;
    }
    if (permissions.canManageUsers?.({session})) {
      return true;
    }
    // 2. Otherwise user may only manage itself
    return {id: session.itemId };
  },
};