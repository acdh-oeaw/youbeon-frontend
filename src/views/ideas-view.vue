<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DetailsPanel from '@/components/details-panel.vue'
import DetailsPanelQuotes from '@/components/details-panel-quotes.vue'
import DetailsPanelSection from '@/components/details-panel-section.vue'
import FiltersPanel from '@/components/filters-panel.vue'
import InfoDialog from '@/components/info-dialog.vue'
import MainContent from '@/components/main-content.vue'
import MultiCombobox from '@/components/multi-combobox.vue'
import type { Graph } from '@/components/network-graph.vue'
import NetworkGraph from '@/components/network-graph.vue'
import SingleSelect from '@/components/single-select.vue'
import VisualisationContainer from '@/components/visualisation-container.vue'
import { nodeColors } from '@/config/network-graph.config'
import { accounts, ideas, interviewReligions, interviews, places } from '@/db'
import type { Idea, Resource, ResourceKeyMap, ResourceMap } from '@/db/types'

//

/**
 * Note that we create new objects for nodes and edges, because d3 will mutate them.
 */
const graph: Graph = { nodes: { fixed: [], dynamic: [] }, edges: [] }

ideas.forEach((idea) => {
  graph.nodes.dynamic.push({ key: idea.key, label: idea.label, kind: idea.kind })

  idea.interviews.forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const religion = interviews.get(key)!.religion
    graph.edges.push({ source: religion, target: idea.key })
  })
})

interviewReligions.forEach((religion) => {
  graph.nodes.fixed.push({ key: religion.key, label: religion.label, kind: religion.kind })
})

//

type IdeaFilters = Pick<ResourceKeyMap, 'idea' | 'interview-religion'>
type IdeaFilterKind = keyof IdeaFilters
type LabeledIdeaFilterKinds = Map<IdeaFilterKind, { key: IdeaFilterKind; label: string }>
type IdeaFilterItems = Pick<ResourceMap, 'idea' | 'interview-religion'>

const ideaFilterItems: IdeaFilterItems = {
  idea: ideas,
  'interview-religion': interviewReligions,
}

const labeledIdeaFilterKinds: LabeledIdeaFilterKinds = new Map([
  ['idea', { key: 'idea', label: 'Ideen' }],
  ['interview-religion', { key: 'interview-religion', label: 'Religionen' }],
])

const ideaFilters = ref<IdeaFilters>({ idea: new Set(), 'interview-religion': new Set() })
const defaultIdeaFilterKind = 'idea'
const ideaFilterKind = ref<IdeaFilterKind>(defaultIdeaFilterKind)

const selectedIdea = ref<Idea | null>(null)

const highlightedIdeas = computed(() => {
  const highlights = new Set<Resource['key']>()

  ideaFilters.value.idea.forEach((key) => {
    highlights.add(key)
    ideas.get(key)?.ideas.forEach((key) => {
      highlights.add(key)
    })
  })

  ideaFilters.value['interview-religion'].forEach((key) => {
    interviewReligions.get(key)?.ideas.forEach((key) => {
      highlights.add(key)
    })
  })

  return highlights
})

//

const route = useRoute()
const router = useRouter()

function isFilterKind(value: string): value is IdeaFilterKind {
  return Object.keys(ideaFilterItems).includes(value)
}

function syncFiltersWithSearchParams() {
  const searchParams = new URLSearchParams(window.location.search)
  const details = searchParams.get('details')
  const ids = searchParams.getAll('id').filter(Boolean)
  const kind = searchParams.get('kind') ?? defaultIdeaFilterKind

  if (isFilterKind(kind)) {
    const keys = new Set<Resource['key']>()

    ids.forEach((key) => {
      if (ideaFilterItems[kind].has(key)) {
        keys.add(key)
      }
    })

    ideaFilters.value = {
      idea: new Set(),
      'interview-religion': new Set(),
      [kind]: keys,
    }

    ideaFilterKind.value = kind
  }

  if (details != null && ideaFilterItems.idea.has(details)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    selectedIdea.value = ideaFilterItems.idea.get(details)!
  } else {
    selectedIdea.value = null
  }
}

watch(
  () => {
    return route.query
  },
  syncFiltersWithSearchParams,
  { immediate: true },
)

function onClickNode(key: Resource['key'], kind: Resource['kind']) {
  if (kind === 'interview-religion') {
    router.push({ query: { ...route.query, kind: kind as IdeaFilterKind, id: [key] } })
  } else {
    router.push({ query: { ...route.query, details: key } })
  }
}

function onChangeIdeaFilterKind(kind: string) {
  router.push({ query: { ...route.query, kind: kind as IdeaFilterKind } })
}

function onChangeIdeaFilters(id: Array<Resource['key']>) {
  router.push({ query: { ...route.query, id } })
}

function onCloseDetailsPanel() {
  const { details: _, ...query } = route.query
  router.push({ query })
}
</script>

<template>
  <main-content class="h-full overflow-hidden">
    <h1 class="sr-only">{{ $router.currentRoute.value.meta['title'] }}</h1>

    <visualisation-container v-slot="{ width, height }">
      <network-graph
        :width="width"
        :height="height"
        :graph="graph"
        :highlighted="highlightedIdeas"
        :matched="ideaFilters[ideaFilterKind]"
        :selected="selectedIdea"
        @click-node="onClickNode"
      />
    </visualisation-container>

    <filters-panel
      id="ideas-filters"
      name="ideas-filters"
      class="grid items-start gap-4 sm:grid-cols-[1fr_auto]"
    >
      <multi-combobox
        name="active-places-filters"
        :label="labeledIdeaFilterKinds.get(ideaFilterKind)!.label"
        :items="ideaFilterItems[ideaFilterKind]"
        :model-value="Array.from(ideaFilters[ideaFilterKind])"
        @update:model-value="onChangeIdeaFilters"
      />
      <single-select
        :model-value="ideaFilterKind"
        :items="labeledIdeaFilterKinds"
        name="ideas-filter-kind"
        label="Filter-Kategorie"
        class="min-w-[8rem] flex-1"
        @update:model-value="onChangeIdeaFilterKind"
      />
      <div class="text-xs">
        Suchtreffer werden
        <span
          class="mx-1 inline-block h-2.5 w-2.5 rounded-full"
          :style="{ backgroundColor: nodeColors.selected }"
        />
        markiert, Kookkurrenzen
        <span
          class="mx-1 inline-block h-2.5 w-2.5 rounded-full"
          :style="{ backgroundColor: nodeColors.highlighted }"
        />.
      </div>
    </filters-panel>

    <details-panel
      :is-open="selectedIdea != null"
      :title="selectedIdea?.label"
      @close-panel="onCloseDetailsPanel"
    >
      <details-panel-section
        label="Verknüpfte Accounts"
        :keys="selectedIdea?.accounts"
        :items="accounts"
        route="accounts"
      />
      <details-panel-section
        label="Verknüpfte Orte"
        :keys="selectedIdea?.places"
        :items="places"
        route="places"
      />
      <details-panel-section
        label="Verknüpfte Ideen"
        :keys="selectedIdea?.ideas"
        :items="ideas"
        route="ideas"
      />
      <details-panel-quotes label="Zitate" :items="selectedIdea?.quotes" />
    </details-panel>

    <info-dialog title="Info">
      <div>Klick auf Idee/Religionsgruppe: hebt den Knoten hervor und öffnet das Kontext-Menü</div>
      <div>Suche nach Ideen: hebt die gesuchte Idee und damit assoziierte Ideen hervor</div>
      <div>
        Suche nach einer Religionsgruppen: hebt alle Accounts hervor, die mit einer Religionsgruppe
        assoziiert sind
      </div>
      <div>
        Suche nach mehreren Religionsgruppen: zeigt alle Ideen, die mit den jeweiligen Religionen
        assoziiert sind in der Farbe der Religionen; Ideen, an denen sich mehrere der ausgewählten
        Religionen "treffen", werden gesondert hervorgehoben
      </div>
    </info-dialog>
  </main-content>
</template>
