import { join } from 'node:path'

import { assert } from '@stefanprobst/assert'
import xlsx from 'xlsx'

interface InputRow {
  __rowNum__: number
}

interface AccountInputRow extends InputRow {
  /** Single identifier like "A: #africanfood". */
  Kode?: string
}

interface IdeaInputRow extends InputRow {
  /** Single identifier like "I: Something". */
  Kode?: string
  /** NOTE: There are additional 1-3 columns without header which contain quotes. */
  __EMPTY_1?: unknown
  __EMPTY_2?: unknown
  __EMPTY_3?: unknown
}

interface PlaceInputRow extends InputRow {
  // FIXME: although apperently there are more than one identifier sometimes? (most are not places though)
  /** Single identifier string like "OS: Paris, Frankreich". */
  Kodes?: string
  /** Coordinates (duplicated for whatever reason) like "48,8567, 2,351462 - 48,8567, 2,351462". */
  Referenz?: string
}

interface RelationInputRow extends InputRow {
  /** List of identifiers, separated by line breaks, like "I: Familie\nI: Geburtsort\nOL: Rumänien". */
  Kodes?: string
  Dokument?: string
}

export interface InputData {
  accounts: Array<AccountInputRow>
  ideas: Array<IdeaInputRow>
  places: Array<PlaceInputRow>
  relations: Array<RelationInputRow>
}

export function readXlsxFiles(): InputData {
  const accounts = getRows<AccountInputRow>('accounts')
  const ideas = getRows<IdeaInputRow>('ideas')
  const places = getRows<PlaceInputRow>('places')
  const relations = getRows<RelationInputRow>('relations')

  return { accounts, ideas, places, relations }
}

function getRows<T>(fileName: string): Array<T> {
  const filePath = join(process.cwd(), 'data', fileName + '.xlsx')
  // eslint-disable-next-line import/no-named-as-default-member
  const workbook = xlsx.readFile(filePath, { type: 'binary' })
  const [first] = workbook.SheetNames
  assert(first != null, `No sheets in ${fileName}.`)
  const sheet = workbook.Sheets[first]
  assert(sheet != null, `No sheets in ${fileName}.`)
  // eslint-disable-next-line import/no-named-as-default-member
  const rows = xlsx.utils.sheet_to_json(sheet)

  return rows as Array<T>
}
