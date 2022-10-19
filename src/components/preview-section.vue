<script lang="ts" setup>
import PreviewCard from '@/components/preview-card.vue'
</script>

<template>
  <section>
    <div class="mx-auto grid max-w-5xl gap-12 py-16 px-8">
      <div class="grid gap-4">
        <h2 class="sr-only font-display text-2xl font-bold">Die YouBeOn Map</h2>
        <p class="max-w-xl font-medium leading-relaxed text-neutral-600">
          Die YouBeOn Map besteht aus drei Ebenen, die gemeinsam einen Einblick in die online und
          offline Lebenswelten von religiösen jungen Menschen aus Wien vermitteln sollen.
        </p>
      </div>
      <div class="grid items-start gap-12 md:grid-cols-3">
        <preview-card title="Orte" color="bg-brand-red">
          Die Ebene der Orte zeigt Orte der Religionsausübung sowie nicht-religiöse Orte, die
          unseren Interviewteilnehmer*innen wichtig waren. Außerdem kann man hier die mit den Orten
          assoziierte Ideen erkunden, sehen welche Religionsgruppen welche Orte genannt haben und wo
          sich Personen unterschiedlicher Religionen begegnen (können). Auch wenn jeder Ort an einem
          spezifischen Punkt auf der Landkarte verortet ist, können dabei Gebiete unterschiedlicher
          Größe angezeigt werden, z.B. Bezirke (Innere Stadt, 1.Bezirk) oder Dörfer (Hacibektas,
          Neveshir, Türkei)
        </preview-card>
        <preview-card title="Accounts" color="bg-brand-cyan">
          Die Ebene der Accounts zeigt die wichtigsten Accounts, denen unsere
          Interviewteilnehmer*innen auf der Plattform Instagram folgen. Die Accounts sind nach
          Religionsgruppen geclustert. In der Mitte befinden sich Accounts, die bei mehr als einer
          Religion vorkommen. Die Verbindung von einem Account zu einer Religion bedeutet, dass
          mindestens eine Person aus dieser Religionstradition diesem Account folgt.
        </preview-card>
        <preview-card title="Ideen" color="bg-brand-yellow">
          Die Ebene der Ideen zeigt die Begriffe und Konzepte, die den Teilnehmenden wichtig sind.
          Dazu hat das YouBeOn-Team Aussagen aus den Interviews systematisch aufgearbeitet und zu
          "Ideen" verdichtet. Die Ideen sind nach Religionsgruppen geclustert. In der Mitte befinden
          sich Ideen, die bei mehr als einer Religion vorkommen. Die Verbindung von einer Idee zu
          einer Religion bedeutet, dass mindestens ein*e Teilnehmer*in dieser Religionstradition
          etwas zu dieser Idee geäußert hat. Bei Auswahl einer Idee werden damit assoziierte Ideen
          und die Verbindungen zu den verknüpften Religionsgruppen gehighlightet.
        </preview-card>
      </div>
    </div>
  </section>
</template>
