import type { CollectionConfig, FieldAccess } from 'payload'
import { isSuperAdmin, isAdminOrSelf } from '../access/roles.ts'

export type UserRole = 'superadmin' | 'admin' | 'editor' | 'user'

const isSuperAdminFieldAccess: FieldAccess = async (args) => {
  const result = await isSuperAdmin(args as Parameters<typeof isSuperAdmin>[0])
  return result === true
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // 7 Tage
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 Minuten
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  admin: {
    useAsTitle: 'email',
    group: 'Benutzerverwaltung',
    defaultColumns: ['email', 'firstName', 'lastName', 'role', 'updatedAt'],
  },
  access: {
    create: isSuperAdmin,
    read:   isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isSuperAdmin,
  },
  fields: [
    // ── Persönliche Daten ─────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          label: 'Vorname',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          label: 'Nachname',
          required: true,
        },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
    },
    // ── Rolle ────────────────────────────────────────────────
    {
      name: 'role',
      type: 'select',
      label: 'Rolle',
      required: true,
      defaultValue: 'user',
      options: [
        { label: '👑 Superadmin', value: 'superadmin' },
        { label: '🛡️ Admin',      value: 'admin' },
        { label: '✏️ Editor',     value: 'editor' },
        { label: '👤 User',       value: 'user' },
      ],
      access: {
        // Nur Superadmins dürfen Rollen ändern
        update: isSuperAdminFieldAccess,
      },
    },
    // ── Status ───────────────────────────────────────────────
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Aktiv',
      defaultValue: true,
      admin: {
        description: 'Deaktivierte Nutzer können sich nicht einloggen',
      },
    },
    // ── Profilbild ───────────────────────────────────────────
    {
      name: 'avatar',
      type: 'upload',
      label: 'Profilbild',
      relationTo: 'media',
    },
    // ── Bevorzugte Sprache ────────────────────────────────────
    {
      name: 'preferredLanguage',
      type: 'select',
      label: 'Bevorzugte Sprache',
      defaultValue: 'de',
      options: [
        { label: 'Deutsch',   value: 'de' },
        { label: 'English',   value: 'en' },
        { label: 'Italiano',  value: 'it' },
        { label: 'Español',   value: 'es' },
        { label: 'Português', value: 'pt' },
        { label: 'Türkçe',   value: 'tr' },
      ],
    },
    // ── Timestamps ───────────────────────────────────────────
    {
      name: 'lastLoginAt',
      type: 'date',
      label: 'Letzter Login',
      admin: { readOnly: true },
    },
  ],
  hooks: {
    afterLogin: [
      async ({ user, req }) => {
        // Letzten Login-Zeitstempel aktualisieren
        await req.payload.update({
          collection: 'users',
          id: user.id,
          data: { lastLoginAt: new Date().toISOString() },
          req,
        })
      },
    ],
  },
  timestamps: true,
}
