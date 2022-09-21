<template>
  <form
    class="absolute inset-x-4 top-4 z-dialog mx-auto max-w-4xl rounded-lg border-4 border-brand-cyan bg-brand-cyan-tint p-4 shadow-lg sm:inset-x-8 sm:top-8"
    novalidate
    role="search"
    @submit.prevent=""
  >
    <slot />
  </form>
</template>
