<script lang="ts" setup>
import { useRoute } from 'vue-router'

import { useScreenColors } from '@/lib/use-screen-colors'

const route = useRoute()
const colors = useScreenColors()
</script>

<template>
  <header
    class="z-elevated"
    :class="route.path === '/' && [colors.borderColor[0], 'border-b-4 shadow-lg']"
  >
    <div
      class="mx-auto grid max-w-5xl grid-cols-[3rem_1fr] items-center gap-4 px-6 py-2 xs:gap-8 xs:px-8"
    >
      <div>
        <router-link :to="{ name: 'home' }">
          <span class="sr-only">Startseite</span>
          <img alt="" src="@/assets/images/logo.png" :width="48" :height="48" />
        </router-link>
      </div>
      <nav>
        <ul
          class="flex flex-wrap justify-end gap-x-6 font-display text-sm font-semibold xs:gap-x-12 sm:text-base"
          role="list"
        >
          <li>
            <router-link active-class="underline" :to="{ name: 'places' }">Orte</router-link>
          </li>
          <li>
            <router-link active-class="underline" :to="{ name: 'accounts' }">Accounts</router-link>
          </li>
          <li>
            <router-link active-class="underline" :to="{ name: 'ideas' }">Ideen</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
