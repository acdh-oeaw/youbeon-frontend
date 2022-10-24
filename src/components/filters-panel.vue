<template>
  <div
    class="absolute inset-x-0 top-0 z-dialog flex justify-center border border-neutral-200 bg-background p-4 shadow-lg"
  >
    <form
      v-bind="$attrs"
      novalidate
      role="search"
      class="mx-auto w-full max-w-4xl"
      @submit.prevent=""
    >
      <slot />
    </form>
  </div>
</template>
