import { copyFile, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

import generateFavicons, { generateSocialImage } from '@stefanprobst/favicons'
import { log } from '@stefanprobst/log'

import { manifestFileName, metadata, openGraphImageName } from '../config/metadata.config'

async function generate() {
	const publicFolder = join(process.cwd(), 'public')
	const inputFilePath = join(process.cwd(), metadata.logo.href)
	const outputFolder = publicFolder

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

	const robots = `User-agent: *\nAllow: /\n`
	await writeFile(join(publicFolder, 'robots.txt'), robots, { encoding: 'utf-8' })
}

generate()
	.then(() => {
		log.success('Successfully generated favicons.')
	})
	.catch((error) => {
		const message = String(error)
		log.error('Failed to generate favicons.\n', message)
	})
