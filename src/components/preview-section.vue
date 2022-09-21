<script lang="ts" setup>
import PreviewCard from '@/components/preview-card.vue'
</script>

<template>
  <section>
    <div class="mx-auto grid max-w-7xl gap-12 py-16 px-8">
      <div class="grid gap-4">
        <h2 class="font-display text-2xl font-bold">Die YouBeOn Map</h2>
        <p class="max-w-xl font-medium leading-relaxed text-neutral-600">
          Die YouBeOn Map nimmt Sie mit in die Lebenswelten religiöser, junger Menschen aus Wien.
          Auf drei Ebenen können Sie Orte und Instagram-Accounts, die den Jugendlichen wichtig sind,
          und die damit verbundenen Ideen erkunden.
        </p>
      </div>
      <div class="grid gap-8 sm:grid-cols-3">
        <preview-card title="Orte" :to="{ name: 'places' }">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident illo asperiores nostrum
          harum sed minus, ea animi nemo porro assumenda voluptate ipsa odit incidunt labore
          explicabo eligendi fuga doloribus quae?
        </preview-card>
        <preview-card title="Accounts" :to="{ name: 'accounts' }">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident illo asperiores nostrum
          harum sed minus, ea animi nemo porro assumenda voluptate ipsa odit incidunt labore
          explicabo eligendi fuga doloribus quae?
        </preview-card>
        <preview-card title="Ideen" :to="{ name: 'ideas' }">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident illo asperiores nostrum
          harum sed minus, ea animi nemo porro assumenda voluptate ipsa odit incidunt labore
          explicabo eligendi fuga doloribus quae?
        </preview-card>
      </div>
    </div>
  </section>
</template>
