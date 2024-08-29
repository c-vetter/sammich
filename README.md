# sammich 
Typesafe UI internationalization, done right:
+ 0kb runtime weight
+ 0ms build-time overhead
+ instead of mere string interpolation, do anything you can code

## TOC
- [Usage](#usage)
	- [Parameters](#parameters)
		- [--dynamic](#--dynamic)
		- [--jsx](#--jsx)
		- [--omit-ext](#--omit-ext)
- [What does it do, how does it work?](#what-does-it-do-how-does-it-work)
- [What's with the name?](#whats-with-the-name)

--------

## Usage
```sh
npx sammich path/to/i18n [--dynamic] [--jsx] [--omit-ext] --- en de fr
```
Note the **triple** dash to work around `npx`'s arguments handling. Alternatively, use two double dashes.

Then in your code:
```tsx
import { i18n } from "./path/to/i18n"

const t = i18n("en")

print(t.simple.text)
print(t.arbitrary.functions("with", "arbitrary", "arguments"))

const Render = t.even.ReactComponents.if.you.want
print(<Render prop={value} />)
```

### Parameters
#### --dynamic
Generate dynamic imports instead of static ones, so that only the requested Locale is imported.

Use this for large data sets.

#### --jsx
Generate `.tsx`/`.jsx` files.

#### --omit-ext
Generate extension-less imports.

By default, the imports use `.js`/`.jsx` file extensions, as per [TypeScript defaults](https://www.typescriptlang.org/docs/handbook/modules/reference.html).

## What does it do, how does it work?
TypeScript does the heavy lifting, `sammich` is just a little helper to set you up correctly.

You could easily do all this without a package, there is no runtime dependency because nobody needs that.
This package exists to take care of boilerplate, enhance ease of repetition, and documentation.

## What's with the name?
A sandwich is simple but nourishing and you can [have it your way in almost every way](https://en.wikipedia.org/wiki/Sandwich#Gallery). You need nothing special for it – some bread and whatever you like to put in the middle.

A sammich, [as the UD tells us](https://www.urbandictionary.com/define.php?term=sammich), is a sandwich done *just right*.

`sammich` gives you the same features for UI internationalization.
