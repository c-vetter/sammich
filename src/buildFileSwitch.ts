import { outdent } from "outdent";
import { SammichConfigInternal } from "./buildConfig.js";
import { camelCase } from "case-anything";

export function buildFileSwitch (config: SammichConfigInternal) {
	const typeLocales = (
		config.localesAll
		.map(l => `\`${l}\``)
		.join(` | `)
	)

	return {
		name: `index.ts`,
		path: ``,
		content: (
			(
				config.dynamic
				? buildFileSwitchDynamic
				: buildFileSwitchStatic
			)(config, typeLocales)
			+ `\n`
		),
	}
}

function buildFileSwitchDynamic ({ extensionImport, localesAll, tokenConst } : SammichConfigInternal, typeLocales: string) {
	const tokenImport = camelCase(`import ${tokenConst}`)

	return outdent`
		export type Locale = ${typeLocales}

		function ${tokenImport} (locale: Locale) {
			switch (locale) {
				${
					localesAll
					.map(locale => (
						outdent`
							case \`${locale}\`: return import(\`./${locale}${extensionImport}\`)
						`
					))
					.join(`\n\t\t`)
				}
			}
		}

		export function ${tokenConst} (locale: Locale) {
			return ${tokenImport}(locale).then(({ ${tokenConst} }) => ${tokenConst})
		}
	`
}

function buildFileSwitchStatic ({ extensionImport, localesAll, tokenConst } : SammichConfigInternal, typeLocales: string) {
	return outdent`
		${
			localesAll
			.map(locale => (
				outdent`
					import { ${tokenConst} as ${camelCase(locale)} } from "./${locale}${extensionImport}"
				`
			))
			.join(`\n`)
		}

		export type Locale = ${typeLocales}

		export function ${tokenConst} (locale: Locale) {
			switch (locale) {
				${
					localesAll
					.map(locale => (
						outdent`
							case \`${locale}\`: return ${camelCase(locale)}
						`
					))
					.join(`\n\t\t`)
				}
			}
		}
	`
}
