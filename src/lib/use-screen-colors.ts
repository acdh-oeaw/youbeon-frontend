import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { routes } from '@/app/router'

interface Colors {
  backgroundColor: [string, string]
  color: [string, string]
  borderColor: [string, string]
  hover: { backgroundColor: [string, string] }
}

const defaultColors: Colors = {
  backgroundColor: ['bg-brand-cyan', 'bg-brand-cyan-tint'],
  color: ['text-brand-cyan', 'text-brand-cyan-tint'],
  borderColor: ['border-brand-cyan', 'border-brand-cyan-tint'],
  hover: { backgroundColor: ['hover:bg-brand-cyan', 'hover:bg-brand-cyan-tint'] },
}

export function useScreenColors(): Ref<Colors> {
  const route = useRoute()
  const colors = ref<Colors>(defaultColors)

  watch(
    () => {
      return route.name
    },
    (name) => {
      switch (name) {
        case routes.places.name: {
          colors.value = {
            backgroundColor: ['bg-brand-red', 'bg-brand-red-tint'],
            color: ['text-brand-red', 'text-brand-red-tint'],
            borderColor: ['border-brand-red', 'border-brand-red-tint'],
            hover: { backgroundColor: ['hover:bg-brand-red', 'hover:bg-brand-red-tint'] },
          }
          break
        }

        case routes.accounts.name: {
          colors.value = {
            backgroundColor: ['bg-brand-cyan', 'bg-brand-cyan-tint'],
            color: ['text-brand-cyan', 'text-brand-cyan-tint'],
            borderColor: ['border-brand-cyan', 'border-brand-cyan-tint'],
            hover: { backgroundColor: ['hover:bg-brand-cyan', 'hover:bg-brand-cyan-tint'] },
          }
          break
        }

        case routes.ideas.name: {
          colors.value = {
            backgroundColor: ['bg-brand-yellow', 'bg-brand-yellow-tint'],
            color: ['text-brand-yellow', 'text-brand-yellow-tint'],
            borderColor: ['border-brand-yellow', 'border-brand-yellow-tint'],
            hover: { backgroundColor: ['hover:bg-brand-yellow', 'hover:bg-brand-yellow-tint'] },
          }
          break
        }

        default:
          colors.value = defaultColors
      }
    },
    { immediate: true },
  )

  return colors
}
