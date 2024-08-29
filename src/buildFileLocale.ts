import { outdent } from "outdent";
import { SammichConfigInternal } from "./buildConfig.js";
import { FileObject } from "./writeFiles.js";

export function buildFileLocale (config: SammichConfigInternal, locale: string) : FileObject {
	const extension = config.jsx ? `tsx` : `ts`

	return {
		name: `${locale}.${extension}`,
		path: ``,
		content: (
			(
				locale === config.localeDefault
				? buildFileLocaleDefault
				: buildFileLocaleExtension
			)(config, locale)
			+ `\n`
		),
	}
}

function buildFileLocaleDefault (config: SammichConfigInternal, locale: string) {
	const {
		sample,
		tokenConst,
		tokenType,
	} = config

	return outdent`
		// this is the default locale, its data type will be expected on the extension locales

		const ${tokenConst} = ${sample(locale)}

		//

		// look but don't touch. the following makes the i18n objects readonly
		const _${tokenConst} : ${tokenType} = ${tokenConst}
		export { _${tokenConst} as ${tokenConst} }

		export type ${tokenType} = DeepReadonly<typeof ${tokenConst}>

		// there are more sophisticated versions, but this is good enough
		type DeepReadonly<T> = (
			T extends (...args: infer A) => infer R
			? (...args: A) => DeepReadonly<R>
			: { readonly [K in keyof T]: DeepReadonly<T[K]> }
		)
	`
}

function buildFileLocaleExtension (config: SammichConfigInternal, locale: string) {
	const {
		extensionImport,
		localeDefault,
		sample,
		tokenConst,
		tokenType,
	} = config

	return outdent`
		// this is an extension locale and therefore gets its type from the default locale ("./${localeDefault}")
		import type { ${tokenType} } from "./${localeDefault}${extensionImport}";

		export const ${tokenConst} : ${tokenType} = ${sample(locale)}
	`
}
