<script lang="ts" setup>
// @ts-expect-error TypeScript does not know about resource queries.
import hero from "@/assets/images/hero.jpg?format=webp";
</script>

<template>
	<section class="relative">
		<div class="mx-auto max-w-6xl">
			<RouterLink aria-label="Hier gehts zur YouBeOn Map" class="block" :to="{ name: 'places' }">
				<img
					alt=""
					class="size-full border border-brand-cyan object-cover"
					height="598"
					:src="hero"
					width="1152"
				/>
			</RouterLink>
		</div>
		<div class="relative mx-auto grid w-full max-w-5xl gap-8 p-8 sm:py-16">
			<div class="grid gap-4">
				<h1 class="sr-only">YouBeOn Map</h1>
				<h2
					class="font-display text-xl font-black leading-normal tracking-tight text-neutral-900 xs:text-2xl xs:leading-normal md:text-3xl md:leading-normal"
				>
					Die digitale Landkarte des Forschungsprojektes
					<a class="underline decoration-dotted" href="https://youbeon.eu" rel="noreferrer">
						Young Believers Online: Mapping On- and Offline Identifications of Urban Religious Youth
					</a>
				</h2>
			</div>
			<div
				class="grid max-w-4xl gap-4 text-sm font-medium leading-relaxed text-neutral-700 xs:text-base xs:leading-relaxed sm:text-lg sm:leading-relaxed"
			>
				<p>
					Die YouBeOn Map nimmt Sie mit in die Lebenswelten von 41 religiösen, jungen Menschen aus
					Wien und Umgebung die sich als Teil von sieben unterschiedlichen Religionstraditionen
					verstehen. Sie zeigt exemplarisch wie sich religiöses Leben online (auf Instagram) und
					offline (in der Stadt) abspielt, was junge Menschen unterschiedlicher Religionen verbindet
					und wo es charakteristische Eigenheiten gibt.
				</p>
			</div>
			<div>
				<iframe
					allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
					class="aspect-video w-full"
					frameborder="0"
					src="https://www.youtube-nocookie.com/embed/xmTcc6694-E?rel=0"
					title="Die YouBeOn Map"
				/>
			</div>
		</div>
	</section>
</template>
