var fs = require("fs");
const nodeModules = {};
fs.readdirSync("node_modules")
	.filter((x) => {
		return [".bin"].indexOf(x) === -1;
	})
	.forEach((mod) => {
		nodeModules[mod] = `commonjs ${mod}`;
	});

delete nodeModules.vega2sql;

module.exports = {
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.externals = { knex: "commonjs knex" };
		// Important: return the modified config
		return config;
	},
};
