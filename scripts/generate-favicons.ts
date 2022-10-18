import { copyFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

import generateFavicons, { generateSocialImage } from '@stefanprobst/favicons'
import { log } from '@stefanprobst/log'

import { manifestFileName, metadata, openGraphImageName } from '../config/metadata.config'

async function generate() {
  const inputFilePath = join(process.cwd(), metadata.logo.href)
  const outputFolder = join(process.cwd(), 'public')

  await generateFavicons({
    inputFilePath,
    outputFolder,
    maskable: metadata.logo.maskable,
    manifestFileName,
    name: metadata.title,
    shortName: metadata.shortTitle,
  })

  if (extname(inputFilePath) === '.svg') {
    await copyFile(inputFilePath, join(outputFolder, 'icon.svg'))
  }

  await generateSocialImage(
    join(process.cwd(), metadata.image.href),
    join(outputFolder, openGraphImageName),
    { fit: metadata.image.fit },
  )
}

generate()
  .then(() => {
    log.success('Successfully generated favicons.')
  })
  .catch((error) => {
    const message = String(error)
    log.error('Failed to generate favicons.\n', message)
  })
