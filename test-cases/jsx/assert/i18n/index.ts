// generated by sammich 🎯

import { i18n as enUs } from "./en, US.jsx"
import { i18n as enUk } from "./en, UK.jsx"

export type Locale = `en, US` | `en, UK`

export function i18n (locale: Locale) {
	switch (locale) {
		case `en, US`: return enUs
		case `en, UK`: return enUk
	}
}
