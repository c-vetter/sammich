import { type Ti18nConfig } from "ti18n"

const ti18nConfig : Ti18nConfig = {
	path: `./path/to/translations`,
	locales: [`de-de`, `de-ch`, `de-at`],
	dynamic: true,
	importWithoutExtension: true,
}

export default ti18nConfig
