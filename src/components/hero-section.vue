<script lang="ts" setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'

import places from '@/assets/images/places.png'
</script>

<template>
  <section class="relative border-b border-brand-cyan bg-brand-cyan-tint">
    <div class="absolute inset-0 overflow-hidden opacity-30">
      <img alt="" class="h-full w-full object-cover" :src="places" />
    </div>
    <div class="relative mx-auto grid w-full max-w-7xl gap-8 px-8 py-16 sm:py-32">
      <div class="grid gap-4">
        <div class="font-display font-semibold text-neutral-500 sm:text-lg">
          Mapping On- and Offline Identifications of Urban Religious Youth
        </div>
        <h1
          class="max-w-[64rem] font-display text-4xl font-black tracking-tight text-neutral-900 sm:text-6xl xs:text-5xl"
        >
          Young Believers Online
        </h1>
      </div>
      <div class="grid max-w-xl gap-4 text-base font-medium leading-relaxed text-neutral-600">
        <p>
          Die YouBeOn Map nimmt Sie mit in die Lebenswelten religiöser, junger Menschen aus Wien.
          Auf drei Ebenen können Sie Orte und Instagram-Accounts, die den Jugendlichen wichtig sind,
          und die damit verbundenen Ideen erkunden.
        </p>
      </div>
      <div class="my-2 flex flex-col gap-4 sm:gap-8 xs:flex-row">
        <router-link
          class="inline-flex min-w-[8rem] items-center justify-between gap-2 rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-neutral-0 hover:bg-neutral-700 hover:text-neutral-0"
          :to="{ name: 'places' }"
          >Orte <chevron-right-icon aria-hidden="true" class="h-4 w-4 text-neutral-400"
        /></router-link>
        <router-link
          class="inline-flex min-w-[8rem] items-center justify-between gap-2 rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-neutral-0 hover:bg-neutral-700 hover:text-neutral-0"
          :to="{ name: 'accounts' }"
          >Accounts <chevron-right-icon aria-hidden="true" class="h-4 w-4 text-neutral-400"
        /></router-link>
        <router-link
          class="inline-flex min-w-[8rem] items-center justify-between gap-2 rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-neutral-0 hover:bg-neutral-700 hover:text-neutral-0"
          :to="{ name: 'ideas' }"
          >Ideen <chevron-right-icon aria-hidden="true" class="h-4 w-4 text-neutral-400"
        /></router-link>
      </div>
    </div>
  </section>
</template>
