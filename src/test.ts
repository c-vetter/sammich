import { join, dirname } from "node:path"
import { fileURLToPath } from 'node:url'

import test from "ava"
import fsExtra from "fs-extra"
import readdirp from "readdirp"

import { sammich } from "./main.js"

const { copy, emptyDir, readFile, readdirSync } = fsExtra

test(`minimum data`, async t => {
	await Promise.all([
		// @ts-expect-error
		t.throwsAsync(async () => await sammich()),
		// @ts-expect-error
		t.throwsAsync(async () => await sammich({})),
		// @ts-expect-error
		t.throwsAsync(async () => await sammich({
			path: ``,
		})),
		// @ts-expect-error
		t.throwsAsync(async () => await sammich({
			locales: [],
		})),
		// @ts-expect-error
		t.throwsAsync(async () => await sammich({
			locales: [`en`],
		})),
		t.throwsAsync(async () => await sammich({
			path: ``,
			locales: []
		})),
	])
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dirTests = `${__dirname }/../test-cases`
const dirTestresults = `${__dirname }/../-test-cases`

const dirArrange = (dirCase: string, ...path: ReadonlyArray<string>) => join(dirTests, dirCase, `arrange`, ...path)
const dirAct = (dirCase: string, ...path: ReadonlyArray<string>) => join(dirTestresults, dirCase, ...path)
const dirAssert = (dirCase: string, ...path: ReadonlyArray<string>) => join(dirTests, dirCase, `assert`, ...path)

for (const dirCase of readdirSync(dirTests)) {
	test(`generate: ${dirCase}`, async t => {
		await emptyDir(dirAct(dirCase))

		await copy(dirArrange(dirCase), dirAct(dirCase))

		const { default: config } = await import(`file:` + dirAct(dirCase, `sammichconfig.ts`))
		config.path = dirAct(dirCase, config.path)

		await sammich(config)

		t.deepEqual(...(
			await Promise.all([
				getDirectoryContents(dirAct(dirCase)),
				getDirectoryContents(dirAssert(dirCase))
			])
		))
	})
}

function getDirectoryContents (path: string) {
	return (
		readdirp.promise(path)
		.then(dir => Promise.all(
			dir
			.map(file => file.path)
			.sort()
			.map(file => (
				readFile(join(path, file))
				.then(buffer => String(buffer))
				.then(content => ({
					path: file,
					content: content
				}))
			))
		))
	)
}
