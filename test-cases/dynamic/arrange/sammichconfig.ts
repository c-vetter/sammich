import { type SammichConfig } from "sammich"

const sammichConfig : SammichConfig = {
	path: `./path/to/translations`,
	locales: [`de-de`, `de-ch`, `de-at`],
	dynamic: true,
	importWithoutExtension: true,
}

export default sammichConfig
