import { join } from "node:path"

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from "@rollup/plugin-node-resolve"
import copy from 'rollup-plugin-copy'
import dts from "rollup-plugin-dts"

const transpiled = (path = ``) => join(`./-transpiled`, path).replace(/\\/g, `/`)
const root = (path = ``) => join(`.`, path).replace(/\\/g, `/`)

export default [
	{
		input: transpiled(`main.js`),
		output: {
			file: root(`main.js`),
		},
		plugins: [
			commonjs(),
			nodeResolve(),
			copy({
				targets: [
					{
						src: transpiled(`bin.js`),
						dest: root(),
					}
				],
				verbose: true,
			})
		],
	},

	{
		input: transpiled(`main.d.ts`),
		output: { file: root(`types.d.ts`) },
		plugins: [ dts() ],
	},
]
