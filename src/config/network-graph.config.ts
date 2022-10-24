import type { ResourceKind } from '@/db/types'

export const nodeColors: Record<ResourceKind, string> = {
  account: 'hsl(175.9deg 38.6% 77.6%)' /** brand-cyan */,
  idea: 'hsl(47deg 77.8% 59.4%)' /** brand-yellow */,
  interview: 'hsl(175.9deg 38.6% 77.6%)' /** brand-cyan */,
  place: 'hsl(1.8deg 71.3% 63.1%)' /** brand-red */,
  religion: 'hsl(175.9deg 38.6% 77.6%)' /** brand-cyan */,
  'interview-religion': '#ddd',
}

export const highlightedNodeColors: Record<
  ResourceKind,
  { highlighted: string; selected: string }
> = {
  account: {
    highlighted: 'hsl(47deg 77.8% 59.4%)' /** brand-yellow */,
    selected: 'hsl(1.8deg 71.3% 63.1%)' /** brand-red */,
  },
  idea: {
    highlighted: 'hsl(175.9deg 38.6% 77.6%)' /** brand-cyan */,
    selected: 'hsl(1.8deg 71.3% 63.1%)' /** brand-red */,
  },
  interview: {
    highlighted: 'hsl(47deg 77.8% 59.4%)' /** brand-yellow */,
    selected: 'hsl(1.8deg 71.3% 63.1%)' /** brand-red */,
  },
  'interview-religion': {
    highlighted: 'hsl(47deg 77.8% 59.4%)' /** brand-yellow */,
    selected: 'hsl(1.8deg 71.3% 63.1%)' /** brand-red */,
  },
  place: {
    highlighted: 'hsl(47deg 77.8% 59.4%)' /** brand-yellow */,
    selected: 'hsl(1.8deg 71.3% 63.1%)' /** brand-red */,
  },
  religion: {
    highlighted: 'hsl(47deg 77.8% 59.4%)' /** brand-yellow */,
    selected: 'hsl(1.8deg 71.3% 63.1%)' /** brand-red */,
  },
}

export const nodeSizes: Record<ResourceKind, number> = {
  account: 1,
  idea: 1,
  interview: 1,
  place: 1,
  religion: 1,
  'interview-religion': 3,
}

export const edgeStrokeColor: Record<'account' | 'highlighted' | 'idea', string> = {
  account: 'hsl(175.9deg 38.6% 92%)' /** brand-cyan-tint */,
  idea: 'hsl(47deg 77.8% 92%)' /** brand-yellow-tint */,
  highlighted: '#ddd',
}
