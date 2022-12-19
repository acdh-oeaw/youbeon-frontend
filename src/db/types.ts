interface ResourceBase {
	key: string
	label: string
}

export interface Account extends ResourceBase {
	kind: 'account'
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
	accounts: Set<Account['key']>
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
	ideas: Set<Idea['key']>
	// religions: Set<Religion['key']>
	accounts: Set<Account['key']>
	places: Set<Place['key']>
}

export interface InterviewReligion extends ResourceBase {
	kind: 'interview-religion'
	interviews: Set<Interview['key']>
	ideas: Set<Idea['key']>
	// religions: Set<Religion['key']>
	accounts: Set<Account['key']>
	places: Set<Place['key']>
}

export type Resource = Account | Idea | Interview | InterviewReligion | Place | Religion

export type ResourceKind = Resource['kind']

export type ResourceKeyMap = {
	[Kind in ResourceKind]: Set<Extract<Resource, { kind: Kind }>['key']>
}

export type ResourceMap = {
	[Kind in ResourceKind]: Map<
		Extract<Resource, { kind: Kind }>['key'],
		Extract<Resource, { kind: Kind }>
	>
}
