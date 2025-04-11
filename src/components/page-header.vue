<script lang="ts" setup>
import { useRoute } from "vue-router";

import { useScreenColors } from "@/lib/use-screen-colors";

const route = useRoute();
const colors = useScreenColors();
</script>

<template>
	<header
		class="fixed inset-x-0 z-elevated bg-neutral-0"
		:class="
			route.path === '/'
				? [colors.borderColor[0], 'border-b-4 shadow-lg']
				: ['border-b border-neutral-200']
		"
	>
		<div
			class="mx-auto grid max-w-5xl grid-cols-[3rem_1fr] items-center gap-2.5 px-6 py-2 xxs:gap-4 xs:gap-8 xs:px-8"
		>
			<div>
				<RouterLink :to="{ name: 'home' }">
					<span class="sr-only">Startseite</span>
					<img alt="" :height="48" src="@/assets/images/logo.png" :width="48" />
				</RouterLink>
			</div>
			<nav>
				<ul
					class="flex flex-wrap justify-end gap-x-2.5 font-display text-sm font-semibold xxs:gap-x-4 xs:gap-x-12 sm:text-base md:text-lg"
					role="list"
				>
					<li>
						<RouterLink active-class="underline" :to="{ name: 'places' }">Orte</RouterLink>
					</li>
					<li>
						<RouterLink active-class="underline" :to="{ name: 'accounts' }">Accounts</RouterLink>
					</li>
					<li>
						<RouterLink active-class="underline" :to="{ name: 'ideas' }">Ideen</RouterLink>
					</li>
					<li>
						<RouterLink
							v-slot="{ href, isExactActive, navigate, route: to }"
							custom
							:to="{ name: 'home', hash: '#faq' }"
						>
							<a
								:aria-current="isExactActive && route.hash === to.hash ? 'page' : undefined"
								:class="isExactActive && route.hash === to.hash ? 'underline' : undefined"
								:href="href"
								@click="navigate"
							>
								FAQ
							</a>
						</RouterLink>
					</li>
				</ul>
			</nav>
		</div>
	</header>
</template>
