const ignorePlugin = require("esbuild-plugin-ignore");

const common = {
	entryPoints: ["src/index.ts"],
	bundle: true,
	minify: false,
	external: ["knex"],
	watch: {
		onRebuild(error, result) {
			if (error) {
				console.error("watch build failed:", error);
			} else {
				console.error("watch build succeeded:", result);
			}
		},
	},
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
};

require("esbuild")
	.build({
		...common,
		platform: "browser",
		outfile: "dist/browser.js",
	})
	.catch(() => process.exit(1));

require("esbuild")
	.build({
		...common,
		platform: "node",
		target: "node10.4",
		outfile: "dist/index.js",
	})
	.catch(() => process.exit(1))
	.then((r) => r.stop());
