interface ResourceBase {
  key: string
  label: string
}

export interface Account extends ResourceBase {
  kind: 'account'
  /** Can be constructed by prepending "https://instagram.com/" to `label`. */
  // url: string
  mentions: number
  interviews: Set<Interview['key']>
  ideas: Set<Idea['key']>
  religions: Set<Religion['key']>
}

export interface Idea extends ResourceBase {
  kind: 'idea'
  quotes: Array<string>
  interviews: Set<Interview['key']>
  /** Co-occurrences. */
  ideas: Set<Idea['key']>
  places: Set<Place['key']>
  // religions: Set<Religion['key']>
  accounts: Set<Account['key']>
}

export interface Place extends ResourceBase {
  kind: 'place'
  coordinates: { lng: number; lat: number }
  interviews: Set<Interview['key']>
  ideas: Set<Idea['key']>
  religions: Set<Religion['key']>
  // accounts: Set<Account['key']>
}

export interface Religion extends ResourceBase {
  kind: 'religion'
  // interviews: Set<string>
  // ideas: Set<Idea['key']>
  // places: Set<Place['key']>
  // religions: Set<Religion['key']>
  // accounts: Set<Account['key']>
}

export interface Interview extends ResourceBase {
  kind: 'interview'
  /**
   * Interviews have identifiers which encode number, religion, and gender - like "01-jued-w".
   * Religion identifiers do *not* match `Religion['key']`.
   */
  religion: InterviewReligion['key']
  // gender: string
}

export interface InterviewReligion extends ResourceBase {
  kind: 'interview-religion'
  interviews: Set<Interview['key']>
}

export type Resource = Account | Idea | Interview | InterviewReligion | Place | Religion

export type ResourceKind = Resource['kind']