import { log } from '@stefanprobst/log'

import type {
  Account,
  Idea,
  Interview,
  InterviewReligion,
  Place,
  Religion,
  Resource,
  ResourceKind,
} from '../../src/db/types'
import type { InputData } from './read-xlsx-files'

export interface TransformedData {
  accounts: Map<Account['key'], Account>
  ideas: Map<Idea['key'], Idea>
  interviews: Map<Interview['key'], Interview>
  interviewReligions: Map<InterviewReligion['key'], InterviewReligion>
  places: Map<Place['key'], Place>
  religions: Map<Religion['key'], Religion>
}

export function transformData(input: InputData): TransformedData {
  const accountsByKey = new Map<Account['key'], Account>()

  for (const row of input.accounts) {
    if (row.Kode == null) {
      log.error(`Missing key for account in row ${row.__rowNum__}:\n ${JSON.stringify(row)}`)
      continue
    }

    const { key, name } = splitKey(row.Kode)

    if (name == null) {
      log.error(`Missing name for place in row ${row.__rowNum__}:\n ${JSON.stringify(row)}`)
      continue
    }

    // const url = String(new URL(name, 'https://instagram.com'))

    const account: Account = {
      kind: 'account',
      key,
      label: name,
      // url,
      mentions: 0,
      interviews: new Set(),
      ideas: new Set(),
      religions: new Set(),
    }

    accountsByKey.set(key, account)
  }

  //

  const ideasByKey = new Map<Idea['key'], Idea>()

  for (const row of input.ideas) {
    if (row.Kode == null) {
      log.error(`Missing key for idea in row ${row.__rowNum__}:\n ${JSON.stringify(row)}`)
      continue
    }

    const { key, name } = splitKey(row.Kode)

    if (name == null) {
      log.error(`Missing name for place in row ${row.__rowNum__}:\n ${JSON.stringify(row)}`)
      continue
    }

    const quotes: Array<string> = []
    const columns = ['__EMPTY_1', '__EMPTY_2', '__EMPTY_3'] as const
    for (const column of columns) {
      const quote = row[column]
      if (quote != null && typeof quote === 'string' && quote.length > 0) {
        quotes.push(quote)
      }
    }

    const idea: Idea = {
      kind: 'idea',
      key,
      label: name,
      quotes,
      interviews: new Set(),
      ideas: new Set(),
      places: new Set(),
      accounts: new Set(),
    }

    ideasByKey.set(key, idea)
  }

  //

  const placesByKey = new Map<Place['key'], Place>()

  for (const row of input.places) {
    if (row.Kodes == null) {
      log.error(`Missing key for place in row ${row.__rowNum__}:\n ${JSON.stringify(row)}`)
      continue
    }

    const { key, name } = splitKey(row.Kodes)

    if (name == null) {
      log.error(`Missing name for place in row ${row.__rowNum__}:\n ${JSON.stringify(row)}`)
      continue
    }

    const [coordinates] = row.Referenz?.split(' - ') ?? []

    if (coordinates == null) {
      log.error(`Missing coordinates for place in row ${row.__rowNum__}:\n ${JSON.stringify(row)}`)
      continue
    }

    const [latitude, longitude] = coordinates.split(', ').map((value) => {
      return Number(value.trim().replace(',', '.'))
    })

    if (
      latitude == null ||
      Number.isNaN(latitude) ||
      longitude == null ||
      Number.isNaN(longitude)
    ) {
      log.error(`Invalid coordinates for place in row ${row.__rowNum__}:\n ${JSON.stringify(row)}`)
      continue
    }

    const place: Place = {
      kind: 'place',
      key,
      label: name,
      coordinates: { lat: latitude, lng: longitude },
      ideas: new Set(),
      religions: new Set(),
      interviews: new Set(),
    }

    placesByKey.set(place.key, place)
  }

  //

  /** Religions don't have a separate representation in the data but are referenced in relations. */
  const religionsByKey = new Map<Religion['key'], Religion>()

  /** Interviews don't have a separate representation in the data but are referenced in relations. */
  const interviewsByKey = new Map<Interview['key'], Interview>()
  const interviewReligionsByKey = new Map<InterviewReligion['key'], InterviewReligion>()

  //

  for (const row of input.relations) {
    if (row.Kodes == null) {
      log.error(`Missing keys for relation in row ${row.__rowNum__}:\n ${JSON.stringify(row)}`)
      continue
    }

    const keys = row.Kodes.split('\n')
    const interview = row.Dokument
    /**
     * Interviews have identifiers which encode number, religion, and gender - like "01-jued-w".
     * Religion identifiers do *not* match `Religion['key']`.
     */
    const interviewReligion = normalizeInterviewReligionKey(interview?.split('-')[1])

    if (interview == null || interviewReligion == null) {
      log.error(`Missing interview in row ${row.__rowNum__}:\n ${JSON.stringify(row)}`)
      continue
    }
    if (!interviewsByKey.has(interview)) {
      interviewsByKey.set(interview, {
        kind: 'interview',
        key: interview,
        label: interview,
        religion: interviewReligion,
      })
    }
    if (!interviewReligionsByKey.has(interviewReligion)) {
      interviewReligionsByKey.set(interviewReligion, {
        kind: 'interview-religion',
        key: interviewReligion,
        label: getInterviewReligionLabel(interviewReligion),
        interviews: new Set(),
      })
    }
    interviewReligionsByKey.get(interviewReligion)?.interviews.add(interview)

    const keysByKind = new Map<ResourceKind, Set<Extract<Resource, { kind: ResourceKind }>['key']>>(
      [
        ['account', new Set()],
        ['idea', new Set()],
        ['place', new Set()],
        ['religion', new Set()],
      ],
    )

    for (const _key of keys) {
      // FIXME: what do plaintext values in the `Kodes` column mean? Example: "Studium", "Instagramnutzung".
      if (!_key.includes(':')) continue

      const { key, name, prefix } = splitKey(_key)

      if (prefix == null) {
        log.error(`Missing resource kind in row ${row.__rowNum__}:\n ${JSON.stringify(row)}`)
        continue
      }

      const kind = inferResourceKind(prefix)

      if (kind === 'ignored') {
        continue
      }
      if (kind === 'unknown') {
        log.error(
          `Unknown resource kind ${prefix} referenced in row ${row.__rowNum__}:\n ${JSON.stringify(
            row,
          )}`,
        )
        continue
      }

      if (kind === 'religion') {
        if (name == null) {
          log.error(`Missing name for religion in row ${row.__rowNum__}:\n ${JSON.stringify(row)}`)
          continue
        }
        if (!religionsByKey.has(key)) {
          religionsByKey.set(key, { kind: 'religion', key, label: name })
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      keysByKind.get(kind)!.add(key)
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    for (const key of keysByKind.get('idea')!) {
      const idea = ideasByKey.get(key)
      // assert(idea != null, `Missing idea with key ${key}.`)
      if (idea == null) {
        log.error(`Missing idea with key ${key}.`)
        continue // FIXME:
      }
      idea.interviews.add(interview)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const key of keysByKind.get('idea')!) {
        if (key !== idea.key) {
          // assert(ideasByKey.has(key), `Missing idea with key ${key}.`)
          if (!ideasByKey.has(key)) {
            log.error(`Missing idea with key ${key}.`)
            continue // FIXME:
          }
          idea.ideas.add(key)
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const key of keysByKind.get('place')!) {
        // assert(placesByKey.has(key), `Missing place with key ${key}.`)
        if (!placesByKey.has(key)) {
          log.error(`Missing place with key ${key}.`)
          continue // FIXME:
        }
        idea.places.add(key)
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const key of keysByKind.get('account')!) {
        // assert(accountsByKey.has(key), `Missing account with key ${key}.`)
        if (!accountsByKey.has(key)) {
          log.error(`Missing account with key ${key}.`)
          continue // FIXME:
        }
        idea.accounts.add(key)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    for (const key of keysByKind.get('account')!) {
      const account = accountsByKey.get(key)
      // assert(account != null, `Missing account with key ${key}.`)
      if (account == null) {
        log.error(`Missing account with key ${key}.`)
        continue // FIXME:
      }
      account.mentions++
      account.interviews.add(interview)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const key of keysByKind.get('idea')!) {
        // assert(ideasByKey.has(key), `Missing idea with key ${key}.`)
        if (!ideasByKey.has(key)) {
          log.error(`Missing idea with key ${key}.`)
          continue // FIXME:
        }
        account.ideas.add(key)
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const key of keysByKind.get('religion')!) {
        // assert(religionsByKey.has(key), `Missing religion with key ${key}.`)
        if (!religionsByKey.has(key)) {
          log.error(`Missing religion with key ${key}.`)
          continue // FIXME:
        }
        account.religions.add(key)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    for (const key of keysByKind.get('place')!) {
      const place = placesByKey.get(key)
      // assert(place != null, `Missing place with key ${key}.`)
      if (place == null) {
        log.error(`Missing place with key ${key}.`)
        continue // FIXME:
      }
      place.interviews.add(interview)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const key of keysByKind.get('idea')!) {
        // assert(ideasByKey.has(key), `Missing idea with key ${key}.`)
        if (!ideasByKey.has(key)) {
          log.error(`Missing idea with key ${key}.`)
          continue // FIXME:
        }
        place.ideas.add(key)
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const key of keysByKind.get('religion')!) {
        // assert(religionsByKey.has(key), `Missing religion with key ${key}.`)
        if (!religionsByKey.has(key)) {
          log.error(`Missing religion with key ${key}.`)
          continue // FIXME:
        }
        place.religions.add(key)
      }
    }
  }

  return {
    accounts: accountsByKey,
    ideas: ideasByKey,
    interviews: interviewsByKey,
    interviewReligions: interviewReligionsByKey,
    places: placesByKey,
    religions: religionsByKey,
  }
}

/** Identifiers in the xlsx files look like "P: Name". */
function splitKey(key: string): {
  key: string
  name: string | undefined
  prefix: string | undefined
} {
  const [prefix, rest] = key.split(':', 2)
  return { key, prefix, name: rest?.trim() }
}

/**
 * FIXME:
 * In `relations.xlsx` there are entries in the identifier column which
 * (i) are plaintext values which don't follow the "P: Name" convention (example: 'Studium")
 * (ii) are other resource kinds???
 */
function inferResourceKind(prefix: string): ResourceKind | 'ignored' | 'unknown' {
  switch (prefix) {
    case 'A':
      return 'account'
    case 'I':
      return 'idea'
    case 'O':
    case 'OL':
    case 'OR':
    case 'OS':
      return 'place'
    case 'R':
      return 'religion'
    case 'Glaubensweg':
    case 'insta':
    case 'Insta':
    case 'RELIGIÖSE PRAXIS':
    case 'USE':
      return 'ignored'
    default:
      return 'unknown'
  }
}

function normalizeInterviewReligionKey(value: string | undefined): string | undefined {
  if (value === 'evang') return 'evan'
  return value
}

function getInterviewReligionLabel(value: string): string {
  switch (value) {
    case 'alev':
      return 'Alevitische Jugendliche'
    case 'evan':
      return 'Evangelische Jugendliche'
    case 'jued':
      return 'Jüdische Jugendliche'
    case 'kath':
      return 'Katholische Jugendliche'
    case 'musl':
      return 'Muslimische Jugendliche'
    case 'orth':
      return 'Orthodoxe Jugendliche'
    case 'sikh':
      return 'Sikh Jugendliche'
    default:
      throw new Error(`Unknown interview religion ${value}.`)
  }
}
