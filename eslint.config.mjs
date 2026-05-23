import js from "@eslint/js"
import tseslint from "typescript-eslint"
import prettierConfig from "eslint-config-prettier/flat"
import globals from "globals"

export default tseslint.config(
	{
		ignores: ["node_modules/**", "src/js/**", ".remember/**"],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	prettierConfig,
	{
		files: ["src/ts/**/*.ts"],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				...globals.browser,
			},
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
)
