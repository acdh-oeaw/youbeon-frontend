<script lang="ts" setup>
import {
  Dialog as DialogRoot,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { useScreenColors } from '@/lib/use-screen-colors'

const _props = defineProps<{
  title: string
}>()

const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}

const { borderColor, backgroundColor, hover } = useScreenColors()
const label = 'Info'
</script>

<template>
  <button
    :aria-label="label"
    :class="[
      borderColor[0],
      backgroundColor[1],
      hover.backgroundColor[0],
      'absolute left-4 bottom-4 z-overlay hidden h-12 w-12 place-items-center rounded-full border-2 shadow-lg transition xs:grid',
    ]"
    @click="toggle"
  >
    <information-circle-icon aria-hidden="true" class="h-6 w-6" />
  </button>
  <transition-root appear :show="isOpen" as="template">
    <dialog-root class="relative z-dialog" @close="toggle">
      <transition-child
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-neutral-1000/30 transition" />
      </transition-child>

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <transition-child
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <dialog-panel
            :class="[
              borderColor[0],
              'grid w-full max-w-sm transform gap-4 rounded-lg border-4 bg-neutral-0 p-8 shadow-lg transition',
            ]"
          >
            <button aria-label="Close dialog" class="absolute right-4 top-4" @click="toggle">
              <x-mark-icon aria-hidden="true" class="h-5 w-5" />
            </button>
            <dialog-title class="font-display text-lg font-medium leading-tight">{{
              title
            }}</dialog-title>
            <div class="grid gap-4">
              <slot :close="toggle" />
            </div>
          </dialog-panel>
        </transition-child>
      </div>
    </dialog-root>
  </transition-root>
</template>
