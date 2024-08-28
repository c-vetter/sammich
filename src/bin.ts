#!/usr/bin/env node

import minimist from "minimist"
import { ti18n } from "./main.js";

const argv = minimist(
	process.argv
	.slice(2)
	.map(a => (a === `---` ? `--` : a)),
	{
		"--": true,
		boolean: [`dynamic`, `jsx`, `omit-ext`],
		string: [],
	}
)

ti18n({
	path: argv._[0],
	locales: argv["--"] as Array<string>,
	dynamic: Boolean(argv.dynamic),
	jsx: Boolean(argv.jsx),
	importWithoutExtension: argv[`omit-ext`],
})
.then(() => console.log(`i18n boilerplate generated at ${argv._[0]}`))
.catch((error) => {
	console.error((error as Error)[`message`] ?? error)
})
