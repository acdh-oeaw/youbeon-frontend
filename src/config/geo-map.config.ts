import { range, shuffle } from 'd3'

import { ideas } from '@/db'

export const config = {
  options: {
    preferCanvas: true,
    zoomControl: false,
  },
  tileLayer: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
}

export const initialViewState = {
  center: [48.20849, 16.37208] as [number, number] /** Vienna. */,
  zoom: 13,
}

const interviewReligionColors: Record<string, string> = {
  alev: '#623e88',
  evan: '#e166b9',
  jued: '#42dbd1',
  kath: '#2366dd',
  musl: '#7ecc3e',
  orth: '#e54e51',
  sikh: '#ffa513',
}

const ideaColors = generateIdeaColors()

export const colors = {
  idea: ideaColors,
  'interview-religion': interviewReligionColors,
  place: 'hsl(1.8deg 71.3% 63.1%)' /** brand-red */,
  multiple: '#425c66',
  default: 'hsl(1.8deg 71.3% 82%)' /** brand-red-tint */,
  muted: 'hsl(1.8deg 71.3% 87%)' /** brand-red-tint */,
}

function generateIdeaColors() {
  const step = 360 / ideas.size
  const palette = shuffle(
    range(ideas.size).map((index) => {
      return `hsl(${Math.floor(step * index)}deg 50% 50%)`
    }),
  )

  let index = 0
  const colors: Record<string, string> = {}
  for (const key of ideas.keys()) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    colors[key] = palette[index++]!
  }

  return colors
}

export const opacities = {
  default: 0.8,
  muted: 0.4,
  highlighted: 0.8,
  selected: 0.8,
}

export const strokes = {
  default: {
    width: 1,
    color: 'hsl(0deg 0% 98%)' /** background */,
    opacity: opacities.default,
  },
  selected: {
    width: 2,
    color: 'black',
    opacity: opacities.selected,
  },
}

export const marker = {
  fillColor: colors.default,
  fillOpacity: opacities.default,
  strokeColor: strokes.default.color,
  strokeWidth: strokes.default.width,
  strokeOpacity: strokes.default.opacity,
  radius: 5,
}
