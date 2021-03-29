const ignorePlugin = require("esbuild-plugin-ignore");

require("esbuild")
	.build({
		entryPoints: ["src/index.ts"],
		bundle: true,
		outfile: "dist/browser.js",
		external: ["knex"],
	})
	.catch(() => process.exit(1));

require("esbuild")
	.build({
		entryPoints: ["src/index.ts"],
		bundle: true,
		platform: "node",
		target: "node10.4",
		outfile: "dist/index.js",
		external: ["knex"],
		plugins: [
			ignorePlugin([
				{
					resourceRegExp: /pg-native$/,
					contextRegExp: /node_modules\/sequelize|node_modules\/pg/,
				},
				{
					resourceRegExp: /tedious|sqlite3|mariadb$/,
					contextRegExp: /node_modules\/sequelize/,
				},
			]),
		],
	})
	.catch(() => process.exit(1));
