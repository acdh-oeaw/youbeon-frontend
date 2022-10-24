<script lang="ts" setup>
import { MagnifyingGlassIcon, XMarkIcon as CloseIcon } from '@heroicons/vue/20/solid'
import { ref } from 'vue'

import FilterPanelForm from '@/components/filter-panel-form.vue'
import { useScreenColors } from '@/lib/use-screen-colors'

const colors = useScreenColors()

const isOpen = ref(false)
const filterPanelId = 'search-filters'
</script>

<template>
  <div
    class="absolute inset-x-0 top-0 z-dialog hidden border-b-4 bg-background p-4 shadow-lg sm:flex"
    :class="colors.borderColor[0]"
  >
    <filter-panel-form v-bind="$attrs">
      <slot />
    </filter-panel-form>
  </div>

  <div class="sm:hidden">
    <button
      :aria-expanded="isOpen"
      :aria-controls="filterPanelId"
      aria-label="Suchfilter anzeigen"
      class="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full text-neutral-0 shadow-xl"
      :class="colors.backgroundColor[0]"
      @click="isOpen = true"
    >
      <magnifying-glass-icon aria-hidden="true" class="h-5 w-5" />
    </button>
    <div v-if="isOpen">
      <transition
        appear
        class="transition"
        enter-active-class="duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          :id="filterPanelId"
          class="absolute inset-x-0 top-0 z-dialog flex border-b-4 bg-background p-4 pr-12 shadow-lg"
          :class="colors.borderColor[0]"
        >
          <button
            aria-label="Suchfilter verbergen"
            class="absolute right-0 top-0 z-10 grid h-10 w-10 place-items-center"
            @click="isOpen = false"
          >
            <close-icon aria-hidden="true" class="h-5 w-5" />
          </button>
          <filter-panel-form v-bind="$attrs">
            <slot />
          </filter-panel-form>
        </div>
      </transition>
    </div>
  </div>
</template>
