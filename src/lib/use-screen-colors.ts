import { useRoute } from 'vue-router'

import { routes } from '@/app/router'

export function useScreenColors(): {
  backgroundColor: [string, string]
  color: [string, string]
  borderColor: [string, string]
  hover: { backgroundColor: [string, string] }
} {
  const route = useRoute()

  switch (route.name) {
    case routes.places.name: {
      return {
        backgroundColor: ['bg-brand-red', 'bg-brand-red-tint'],
        color: ['text-brand-red', 'text-brand-red-tint'],
        borderColor: ['border-brand-red', 'border-brand-red-tint'],
        hover: { backgroundColor: ['hover:bg-brand-red', 'hover:bg-brand-red-tint'] },
      }
    }

    case routes.accounts.name: {
      return {
        backgroundColor: ['bg-brand-cyan', 'bg-brand-cyan-tint'],
        color: ['text-brand-cyan', 'text-brand-cyan-tint'],
        borderColor: ['border-brand-cyan', 'border-brand-cyan-tint'],
        hover: { backgroundColor: ['hover:bg-brand-cyan', 'hover:bg-brand-cyan-tint'] },
      }
    }

    case routes.ideas.name: {
      return {
        backgroundColor: ['bg-brand-yellow', 'bg-brand-yellow-tint'],
        color: ['text-brand-yellow', 'text-brand-yellow-tint'],
        borderColor: ['border-brand-yellow', 'border-brand-yellow-tint'],
        hover: { backgroundColor: ['hover:bg-brand-yellow', 'hover:bg-brand-yellow-tint'] },
      }
    }

    default:
      throw new Error('Invalid route name.')
  }
}
