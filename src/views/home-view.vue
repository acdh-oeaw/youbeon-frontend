<script lang="ts" setup>
import FaqSection from "@/components/faq-section.vue";
import HeroSection from "@/components/hero-section.vue";
import MainContent from "@/components/main-content.vue";
import PreviewSection from "@/components/preview-section.vue";
import ProjectSection from "@/components/project-section.vue";
import PublicationsSection from "@/components/publications-section.vue";
import TeamSection from "@/components/team-section.vue";
</script>

<template>
	<MainContent class="grid grid-rows-[auto_auto_1fr]">
		<HeroSection />
		<PreviewSection />
		<FaqSection />
		<ProjectSection />
		<TeamSection />
		<PublicationsSection />
	</MainContent>
</template>
