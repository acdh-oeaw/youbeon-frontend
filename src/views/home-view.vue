<script lang="ts" setup>
import FaqSection from "@/components/faq-section.vue";
import HeroSection from "@/components/hero-section.vue";
import MainContent from "@/components/main-content.vue";
import PreviewSection from "@/components/preview-section.vue";
</script>

<template>
	<MainContent class="grid grid-rows-[auto_auto_1fr]">
		<HeroSection />
		<PreviewSection />
		<FaqSection />
	</MainContent>
</template>
