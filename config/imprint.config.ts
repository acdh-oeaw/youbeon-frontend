import { join } from 'node:path'

import { assert } from '@stefanprobst/assert'
import { createUrl } from '@stefanprobst/request'
import dotenv from 'dotenv'

import { metadata } from './metadata.config'

const envFileNames = ['.env', '.env.local']
envFileNames.forEach((envFileName) => {
  dotenv.config({ path: join(process.cwd(), envFileName) })
})

const baseUrl = 'https://shared.acdh.oeaw.ac.at'
const pathname = '/acdh-common-assets/api/imprint.php'
const redmineId = process.env['REDMINE_ID']
const locale = metadata.locale

assert(
  redmineId != null,
  'Please set the REDMINE_ID environment variable to the redmine service issue id.',
)

export const url = createUrl({
  baseUrl,
  pathname,
  searchParams: { serviceID: redmineId, outputLang: locale },
})