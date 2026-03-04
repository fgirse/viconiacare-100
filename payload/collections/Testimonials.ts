import type { CollectionConfig } from 'payload'
import { isAdmin, isEditor } from '../access/roles'

const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimonials',
  },
  admin: {
    useAsTitle: 'familyName',
    defaultColumns: ['familyName', 'rating', 'createdAt'],
  },
  access: {
    read:   () => true,
    create: isAdmin,
    update: isEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'familyName',
      label: 'Family Name',
      type: 'text',
      required: true,
    },
    {
      name: 'avatarInitials',
      label: 'Avatar Initials',
      type: 'text',
      maxLength: 2,
      admin: {
        description: 'Two letters shown in the avatar (e.g. "JD")',
      },
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
    },
    {
      name: 'statement',
      label: 'Testimonial Statement',
      type: 'textarea',
      required: true,
    },
    {
      name: 'rating',
      label: 'Rating (1–5)',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
      required: true,
    },
    {
      name: 'avatar',
      label: 'Family Photo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'featured',
      label: 'Featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show this testimonial in the homepage section',
      },
    },
  ],
}

export default Testimonials
