// Template for creating new cafes
import type { Cafe } from '../schema/cafe'

export const template: Partial<Cafe> = {
  id: '',
  name: '',
  slug: '',
  location: {
    neighborhood: 'le-marais',
    arrondissement: 3,
    address: '',
    mapsUrl: ''
  },
  vibes: ['laptop-friendly'],
  features: {
    laptopFriendly: true,
    wifi: true,
    plugs: true,
    terrace: false,
    food: true
  },
  media: [
    { url: '', alt: '' }
  ],
  description: '',
  status: 'draft',
  addedAt: new Date().toISOString()
}
