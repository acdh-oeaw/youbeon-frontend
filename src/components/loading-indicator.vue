<script lang="ts" setup>
const label = 'Laden...'

const size = 32
const center = size / 2
const strokeWidth = 4
const r = center - strokeWidth
const c = 2 * r * Math.PI
const offset = c - (1 / 4) * c
</script>

<template>
  <svg
    :aria-label="label"
    :aria-valuemin="0"
    :aria-valuemax="100"
    class="grid place-items-center"
    fill="none"
    :height="size"
    role="progressbar"
    :stroke-width="strokeWidth"
    :viewBox="`0 0 ${size} ${size}`"
    :width="size"
  >
    <circle
      :cx="center"
      :cy="center"
      :opacity="0.25"
      :r="r"
      role="presentation"
      stroke="currentColor"
    />
    <circle
      :cx="center"
      :cy="center"
      :r="r"
      role="presentation"
      stroke="currentColor"
      :stroke-dasharray="c"
      :stroke-dashoffset="offset"
    >
      <animateTransform
        attributeName="transform"
        begin="0s"
        dur="1s"
        :from="`0 ${center} ${center}`"
        repeatCount="indefinite"
        :to="`360 ${center} ${center}`"
        type="rotate"
      />
    </circle>
  </svg>
</template>
