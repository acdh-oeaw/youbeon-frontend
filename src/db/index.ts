import { accounts as _accounts } from '@/db/accounts'
import { ideas as _ideas } from '@/db/ideas'
import { interviewReligions as _interviewReligions } from '@/db/interviewReligions'
import { interviews as _interviews } from '@/db/interviews'
import { places as _places } from '@/db/places'
import { religions as _religions } from '@/db/religions'
import type { Account, Idea, Interview, InterviewReligion, Place, Religion } from '@/db/types'

export const accounts = _accounts as Map<Account['key'], Account>
export const ideas = _ideas as Map<Idea['key'], Idea>
export const interviews = _interviews as Map<Interview['key'], Interview>
export const interviewReligions = _interviewReligions as Map<
  InterviewReligion['key'],
  InterviewReligion
>
export const places = _places as Map<Place['key'], Place>
export const religions = _religions as Map<Religion['key'], Religion>
