import '@stefanprobst/request/fetch'

import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { assert } from '@stefanprobst/assert'
import { log } from '@stefanprobst/log'
import { createUrl, HttpError, request } from '@stefanprobst/request'
import dotenv from 'dotenv'
import { format } from 'prettier'

dotenv.config()

const baseUrl = 'https://shared.acdh.oeaw.ac.at'
const pathname = '/acdh-common-assets/api/imprint.php'
const redmineId = process.env['REDMINE_ID']
const locale = 'de'

async function generate() {
  assert(
    redmineId != null,
    'Please set the REDMINE_ID environment variable to the redmine service issue id.',
  )

  const url = createUrl({
    baseUrl,
    pathname,
    searchParams: { serviceID: redmineId, outputLang: locale },
  })

  const html = await request(url, { responseType: 'text' })

  const view = format(
    `
    <script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
      name: 'ImprintView',
    })
    </script>

    <template>
    <div class="container">
      <h1>Impressum</h1>
      ${html}
    </div>
    </template>

    <style scoped>
    .container {
      display: grid;
      max-width: 64rem;
      margin-inline: auto;
    }
    </style>
  `,
    { parser: 'vue' },
  )

  const outputFilePath = join(process.cwd(), 'src', 'components', 'imprint.view.vue')

  await writeFile(outputFilePath, format(view, { parser: 'vue' }), { encoding: 'utf-8' })
}

generate()
  .then(() => {
    log.success('Successfully generated imprint.')
  })
  .catch((error) => {
    const message = error instanceof HttpError ? error.response.statusText : String(error)
    log.error('Failed to generate imprint.\n', message)
  })
