import { basename, join, resolve } from "node:path"
import { camelCase, pascalCase } from "case-anything"
import { outdent } from "outdent"

export type SammichConfig = {
	readonly path: string
	readonly dynamic?: boolean
	readonly importWithoutExtension?: boolean
	readonly jsx?: boolean
	readonly locales: ReadonlyArray<string>
	readonly localeDefault?: string
	// readonly integration?: `none` | `preact` | `react`
}

export type SammichConfigInternal = {
	readonly dynamic: boolean
	readonly extensionImport: string
	readonly jsx: boolean
	readonly localeDefault: string
	readonly localesExtension: ReadonlyArray<string>
	readonly localesAll: ReadonlyArray<string>
	readonly path: (...segments: ReadonlyArray<string>) => string
	readonly sample: (locale: string) => string
	readonly tokenConst: string
	readonly tokenType: string
}

export function buildConfig (config: SammichConfig): SammichConfigInternal {
	if (!config.path) {
		throw new Error(`path must be a non-empty string`)
	}

	if (
		!Array.isArray(config.locales)
		|| config.locales.length === 0
	) {
		throw new Error(`locales must be a non-empty array of strings`)
	}

	const {
		path,
		dynamic = false,
		importWithoutExtension = false,
		jsx = false,
		locales,
		localeDefault = locales[0],
	} = config

	const pathFull = resolve(path)

	const name = basename(pathFull)
	const tokenConst = fixNumberCase(camelCase(name))
	const tokenType = fixNumberCase(pascalCase(name))

	const localesExtra = (
		Array.from(new Set(locales))
		.filter(locale => locale !== localeDefault)
		.sort((a,b) => Number(a.localeCompare(b)))
	)

	const localesAll = [localeDefault, ...localesExtra]

	const extensionImport = (
		importWithoutExtension
		? ``
		: (
			jsx
			? `.jsx`
			: `.js`
		)
	)

	return {
		dynamic,
		extensionImport,
		jsx,
		localeDefault,
		localesExtension: localesExtra,
		localesAll,
		path(...segments: ReadonlyArray<string>) {
			return join(pathFull, ...segments)
		},
		sample: makeSample(jsx),
		tokenConst,
		tokenType,
	};
}

function makeSample(jsx: boolean) {
	return function sample(locale: string) {
		return (
			outdent`
				{
					staticStrings: \`Translations for "${locale}"\`,
					functions: (hello: string, world: string) => \`Say \${hello} to \${world}\`,
					nest: {
						keys: {
							as: {
								deep: {
									as: {
										you: {
											like: \`No magic, just your structure\`
										},
									},
								},
							},
						},
					},
					${ jsx ? `jsx: () => <div>Components are cool, too</div>` : `` }
				}
			`
			.replace(/\n\s*\n/g, `\n`)
		)
	}
}

function fixNumberCase(token: string) {
	return token.replace(/\d+\w/g, (s) => s.toLocaleLowerCase())
}

