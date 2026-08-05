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
  vibes: ['casual'],
  features: {
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
