// generated by ti18n 🎯

import { i18n as en } from "./en.js"
import { i18n as de } from "./de.js"

export type Locale = `en` | `de`

export function i18n (locale: Locale) {
	switch (locale) {
		case `en`: return en
		case `de`: return de
	}
}
