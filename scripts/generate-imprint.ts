import '@stefanprobst/request/fetch'

import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { log } from '@stefanprobst/log'
import config from '@stefanprobst/prettier-config'
import { HttpError, request } from '@stefanprobst/request'
import { format } from 'prettier'

import { url } from '../config/imprint.config'

async function generate() {
  const html = await request(url, { responseType: 'text' })

  const view = format(
    `
    <script lang="ts" setup>
    import '@/styles/prose.css'

    import MainContent from '@/components/main-content.vue'
    </script>

    <template>
    <main-content>
      <div class="prose mx-auto grid max-w-3xl gap-4 px-8 py-16">
        <h1 class="text-4xl font-extrabold">Impressum</h1>
        ${html}
      </div>
    </main-content>
    </template>
  `,
    { ...config, parser: 'vue' },
  )

  const outputFilePath = join(process.cwd(), 'src', 'views', 'imprint-view.vue')

  await writeFile(outputFilePath, view, { encoding: 'utf-8' })
}

generate()
  .then(() => {
    log.success('Successfully generated imprint.')
  })
  .catch((error) => {
    const message = error instanceof HttpError ? error.response.statusText : String(error)
    log.error('Failed to generate imprint.\n', message)
  })
