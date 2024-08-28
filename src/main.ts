import { buildConfig, Ti18nConfig } from "./buildConfig.js"
import { buildFileLocale } from "./buildFileLocale.js"
import { buildFileSwitch } from "./buildFileSwitch.js"
import { writeFiles } from "./writeFiles.js"

export type { Ti18nConfig } from "./buildConfig.js"

export async function ti18n (configExternal: Ti18nConfig) {
	const config = buildConfig(configExternal)

	const fileSwitch = buildFileSwitch(config)
	const filesLocale = config.localesAll.map(locale => buildFileLocale(config, locale))

	return await writeFiles(config, [
		fileSwitch,
		...filesLocale,
	])
}
