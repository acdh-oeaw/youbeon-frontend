<script lang="ts" setup>
import PreviewCard from "@/components/preview-card.vue";
</script>

<template>
	<section>
		<div class="mx-auto grid max-w-5xl gap-16 p-8">
			<div class="grid gap-4">
				<p
					class="max-w-3xl text-sm font-medium leading-relaxed text-neutral-700 xs:text-base xs:leading-relaxed sm:text-lg sm:leading-relaxed"
				>
					Die YouBeOn Map besteht aus drei Ebenen, die gemeinsam einen Einblick in die online und
					offline Lebenswelten von religiösen jungen Menschen aus Wien vermitteln sollen.
				</p>
			</div>
			<div class="grid items-start gap-12 md:grid-cols-3">
				<PreviewCard color="bg-brand-red" title="Orte">
					Die Ebene der Orte zeigt Orte der Religionsausübung sowie nicht-religiöse Orte, die
					unseren Interviewteilnehmer*innen wichtig waren. Außerdem kann man hier die mit den Orten
					assoziierte Ideen erkunden, sehen welche Religionsgruppen welche Orte genannt haben und wo
					sich Personen unterschiedlicher Religionen begegnen (können). Auch wenn jeder Ort an einem
					spezifischen Punkt auf der Landkarte verortet ist, können dabei Gebiete unterschiedlicher
					Größe angezeigt werden, z.B. Bezirke (Innere Stadt, 1.Bezirk) oder Dörfer (Hacibektas,
					Neveshir, Türkei)
				</PreviewCard>
				<PreviewCard color="bg-brand-cyan" title="Accounts">
					Die Ebene der Accounts zeigt die wichtigsten Accounts, denen unsere
					Interviewteilnehmer*innen auf der Plattform Instagram folgen. Die Accounts sind nach
					Religionsgruppen geclustert. In der Mitte befinden sich Accounts, die bei mehr als einer
					Religion vorkommen. Die Verbindung von einem Account zu einer Religion bedeutet, dass
					mindestens eine Person aus dieser Religionstradition diesem Account folgt.
				</PreviewCard>
				<PreviewCard color="bg-brand-yellow" title="Ideen">
					Die Ebene der Ideen zeigt die Begriffe und Konzepte, die den Teilnehmenden wichtig sind.
					Dazu hat das YouBeOn-Team Aussagen aus den Interviews systematisch aufgearbeitet und zu
					"Ideen" verdichtet. Die Ideen sind nach Religionsgruppen geclustert. In der Mitte befinden
					sich Ideen, die bei mehr als einer Religion vorkommen. Die Verbindung von einer Idee zu
					einer Religion bedeutet, dass mindestens ein*e Teilnehmer*in dieser Religionstradition
					etwas zu dieser Idee geäußert hat. Bei Auswahl einer Idee werden damit assoziierte Ideen
					und die Verbindungen zu den verknüpften Religionsgruppen gehighlightet.
				</PreviewCard>
			</div>
		</div>
	</section>
</template>
