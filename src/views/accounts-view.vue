<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DetailsPanel from '@/components/details-panel.vue'
import DetailsPanelSection from '@/components/details-panel-section.vue'
import FiltersPanel from '@/components/filters-panel.vue'
import InfoDialog from '@/components/info-dialog.vue'
import MainContent from '@/components/main-content.vue'
import MultiCombobox from '@/components/multi-combobox.vue'
import type { Graph } from '@/components/network-graph.vue'
import NetworkGraph from '@/components/network-graph.vue'
import SingleSelect from '@/components/single-select.vue'
import VisualisationContainer from '@/components/visualisation-container.vue'
import { accounts, ideas, interviewReligions, interviews } from '@/db'
import type { Account, Resource, ResourceKeyMap, ResourceMap } from '@/db/types'

//

/**
 * Note that we create new objects for nodes and edges, because d3 will mutate them.
 */
const graph: Graph = { nodes: { fixed: [], dynamic: [] }, edges: [] }

accounts.forEach((account) => {
  graph.nodes.dynamic.push({ key: account.key, label: account.label, kind: account.kind })

  account.interviews.forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const religion = interviews.get(key)!.religion
    graph.edges.push({ source: religion, target: account.key })
  })
})

interviewReligions.forEach((religion) => {
  graph.nodes.fixed.push({ key: religion.key, label: religion.label, kind: religion.kind })
})

//

type AccountFilters = Pick<ResourceKeyMap, 'account' | 'interview-religion'>
type AccountFilterKind = keyof AccountFilters
type LabeledAccountFilterKinds = Map<AccountFilterKind, { key: AccountFilterKind; label: string }>
type AccountFilterItems = Pick<ResourceMap, 'account' | 'interview-religion'>

const accountFilterItems: AccountFilterItems = {
  account: accounts,
  'interview-religion': interviewReligions,
}

const labeledAccountFilterKinds: LabeledAccountFilterKinds = new Map([
  ['account', { key: 'account', label: 'Accounts' }],
  ['interview-religion', { key: 'interview-religion', label: 'Religionen' }],
])

const accountFilters = ref<AccountFilters>({ account: new Set(), 'interview-religion': new Set() })
const defaultAccountFilterKind = 'account'
const accountFilterKind = ref<AccountFilterKind>(defaultAccountFilterKind)

const selectedAccount = ref<Account | null>(null)

const highlightedAccounts = computed(() => {
  const highlights = new Set<Resource['key']>()

  accountFilters.value.account.forEach((key) => {
    highlights.add(key)
    accounts.get(key)?.ideas.forEach((key) => {
      highlights.add(key)
    })
  })

  accountFilters.value['interview-religion'].forEach((key) => {
    interviewReligions.get(key)?.accounts.forEach((key) => {
      highlights.add(key)
    })
  })

  return highlights
})

//

const route = useRoute()
const router = useRouter()

function isFilterKind(value: string): value is AccountFilterKind {
  return Object.keys(accountFilterItems).includes(value)
}

function syncFiltersWithSearchParams() {
  const searchParams = new URLSearchParams(window.location.search)
  const details = searchParams.get('details')
  const ids = searchParams.getAll('id').filter(Boolean)
  const kind = searchParams.get('kind') ?? defaultAccountFilterKind

  if (isFilterKind(kind)) {
    const keys = new Set<Resource['key']>()

    ids.forEach((key) => {
      if (accountFilterItems[kind].has(key)) {
        keys.add(key)
      }
    })

    accountFilters.value = {
      account: new Set(),
      'interview-religion': new Set(),
      [kind]: keys,
    }

    accountFilterKind.value = kind
  }

  if (details != null && accountFilterItems.account.has(details)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    selectedAccount.value = accountFilterItems.account.get(details)!
  } else {
    selectedAccount.value = null
  }
}

syncFiltersWithSearchParams()

watch(() => {
  return route.query
}, syncFiltersWithSearchParams)

function onClickNode(key: Resource['key'], kind: Resource['kind']) {
  if (kind === 'interview-religion') {
    router.push({ query: { ...route.query, kind: kind as AccountFilterKind, id: [key] } })
  } else {
    router.push({ query: { ...route.query, details: key } })
  }
}

function onChangeAccountFilterKind(kind: string) {
  router.push({ query: { ...route.query, kind: kind as AccountFilterKind } })
}

function onChangeAccountFilters(id: Array<Resource['key']>) {
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
        :highlighted="highlightedAccounts"
        :selected="accountFilters[accountFilterKind]"
        @click-node="onClickNode"
      />
    </visualisation-container>

    <filters-panel
      id="accounts-filters"
      name="accounts-filters"
      class="grid items-start gap-4 sm:grid-cols-[1fr_auto]"
    >
      <multi-combobox
        name="active-places-filters"
        :label="labeledAccountFilterKinds.get(accountFilterKind)!.label"
        :items="accountFilterItems[accountFilterKind]"
        :model-value="Array.from(accountFilters[accountFilterKind])"
        @update:model-value="onChangeAccountFilters"
      />
      <single-select
        :model-value="accountFilterKind"
        :items="labeledAccountFilterKinds"
        name="accounts-filter-kind"
        label="Filter-Kategorie"
        class="min-w-[8rem] flex-1"
        @update:model-value="onChangeAccountFilterKind"
      />
    </filters-panel>

    <details-panel
      :is-open="selectedAccount != null"
      :title="selectedAccount?.label"
      @close-panel="onCloseDetailsPanel"
    >
      <details-panel-section
        label="Verknüpfte Ideen"
        :keys="selectedAccount?.ideas"
        :items="ideas"
        route="ideas"
      />
    </details-panel>

    <info-dialog title="Info">
      <p>
        Auf dieser Ebene der YouBeOn Map sehen Sie die Instagram-Accounts, von denen die
        Interviewteilnehmer*innen im Gespräch erzählt haben. Sie sind nach Religionstraditionen
        geclustert (das bedeutet, dass mindestens eine Person aus einer Tradition einem Account in
        diesem Cluster folgt). In der Mitte sehen Sie Accounts, denen Personen aus mehreren
        Religionstraditionen folgen. Erkunden Sie die Insta-Profile und die mit den Accounts
        assoziierten Ideen.
      </p>
    </info-dialog>
  </main-content>
</template>