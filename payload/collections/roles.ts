import type { Access } from 'payload'

export type UserRole = 'superadmin' | 'admin' | 'editor' | 'user'

const role = (req: any): UserRole | undefined => req.user?.role

export const isSuperAdmin:    Access = ({ req }) => role(req) === 'superadmin'
export const isAdmin:         Access = ({ req }) => ['superadmin', 'admin'].includes(role(req) ?? '')
export const isEditor:        Access = ({ req }) => ['superadmin', 'admin', 'editor'].includes(role(req) ?? '')
export const isAuthenticated: Access = ({ req }) => Boolean(req.user)
export const isPublic:        Access = ()        => true

export const isAdminOrSelf: Access = ({ req, id }) => {
  if (!req.user) return false
  if (['superadmin', 'admin'].includes(role(req) ?? '')) return true
  return req.user?.id === id
}

export const readOwnDocuments: Access = ({ req }) => {
  if (!req.user) return false
  if (['superadmin', 'admin', 'editor'].includes(role(req) ?? '')) return true
  return { patient: { equals: req.user?.id } }
}

export const readOwnCarePlan: Access = ({ req }) => {
  if (!req.user) return false
  if (['superadmin', 'admin', 'editor'].includes(role(req) ?? '')) return true
  return { patient: { equals: req.user?.id } }
}
