<script lang="ts" setup>
import { metadata } from '~/config/metadata.config'
</script>

<template>
  <footer class="bg-neutral-900 text-neutral-100">
    <div class="mx-auto max-w-7xl">
      <div class="flex justify-between px-8 py-2 font-medium">
        <small class="text-xs"
          >&copy;
          <a :href="metadata.creator.website" rel="noreferrer" target="_blank">
            {{ metadata.creator.shortName ?? metadata.creator.name }}
          </a>
          {{ new Date().getUTCFullYear() }}</small
        >
        <router-link class="text-xs hover:text-neutral-0" :to="{ name: 'imprint' }">
          Impressum
        </router-link>
      </div>
    </div>
  </footer>
</template>
