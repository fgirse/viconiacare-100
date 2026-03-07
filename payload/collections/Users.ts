import type { CollectionConfig } from 'payload'

const emailVerificationEnabled = process.env.PAYLOAD_ENABLE_EMAIL_VERIFICATION === 'true'

const getDisplayName = (user: unknown): string => {
  if (typeof user === 'object' && user !== null && 'name' in user) {
    const name = (user as { name?: unknown }).name
    if (typeof name === 'string' && name.trim().length > 0) return name
  }
  return 'Nutzer'
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200,
    verify: emailVerificationEnabled
      ? {
          generateEmailHTML: ({ token, user }) => {
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`
            return `
              <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #f9fafb;">
                <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                  <div style="text-align: center; margin-bottom: 32px;">
                    <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #ca8a04, #0f766e); border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-size: 28px;">✦</span>
                    </div>
                    <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0;">E-Mail bestätigen</h1>
                  </div>
                  <p style="color: #6b7280; line-height: 1.6;">Hallo ${getDisplayName(user)},</p>
                  <p style="color: #6b7280; line-height: 1.6;">Bitte bestätigen Sie Ihre E-Mail-Adresse, um Zugang zu Ihrem Pflegedienst-Konto zu erhalten.</p>
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${url}" style="background: linear-gradient(135deg, #ca8a04, #0f766e); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">E-Mail bestätigen</a>
                  </div>
                  <p style="color: #9ca3af; font-size: 14px; text-align: center;">Dieser Link ist 24 Stunden gültig.</p>
                </div>
              </div>
            `
          },
        }
      : false,
    forgotPassword: {
      generateEmailHTML: (args) => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${args?.token}`
        return `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1>Passwort zurücksetzen</h1>
            <p>Klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:</p>
            <a href="${url}" style="background: #ca8a04; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Passwort zurücksetzen</a>
          </div>
        `
      },
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'superadmin' || user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    create: ({ req: { user } }) => {
      if (!user) return true // allow registration
      return user.role === 'superadmin' || user.role === 'admin'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'superadmin') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'superadmin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Vollständiger Name',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      label: 'Rolle',
      options: [
        { label: 'Super Administrator', value: 'superadmin' },
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User / Patient', value: 'user' },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'superadmin' || user?.role === 'admin',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
    },
    {
      name: 'address',
      type: 'group',
      label: 'Adresse',
      fields: [
        { name: 'street', type: 'text', label: 'Straße und Hausnummer' },
        { name: 'zip', type: 'text', label: 'PLZ' },
        { name: 'city', type: 'text', label: 'Stadt' },
      ],
    },
    {
      name: 'isPatient',
      type: 'checkbox',
      label: 'Ist Patient/Kunde',
      defaultValue: false,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Profilbild',
    },
    {
      name: 'lastLogin',
      type: 'date',
      label: 'Letzter Login',
      admin: { readOnly: true },
    },
  ],
  timestamps: true,
}
