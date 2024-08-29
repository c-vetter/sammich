import { buildConfig, SammichConfig } from "./buildConfig.js"
import { buildFileLocale } from "./buildFileLocale.js"
import { buildFileSwitch } from "./buildFileSwitch.js"
import { writeFiles } from "./writeFiles.js"

export type { SammichConfig } from "./buildConfig.js"

export async function sammich (configExternal: SammichConfig) {
	const config = buildConfig(configExternal)

	const fileSwitch = buildFileSwitch(config)
	const filesLocale = config.localesAll.map(locale => buildFileLocale(config, locale))

	return await writeFiles(config, [
		fileSwitch,
		...filesLocale,
	])
}
