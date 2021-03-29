const nodeExternals = require("webpack-node-externals");

module.exports = {
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.plugins = config.plugins.concat([
			new webpack.NormalModuleReplacementPlugin(
				/\.\.\/migrate/,
				function () {}
			),
			new webpack.NormalModuleReplacementPlugin(/\.\.\/seed/, function () {}),
			new webpack.IgnorePlugin(/mariasql/, /\/knex\//),
			new webpack.IgnorePlugin(/mssql/, /\/knex\//),
			new webpack.IgnorePlugin(/mysql/, /\/knex\//),
			new webpack.IgnorePlugin(/mysql2/, /\/knex\//),
			new webpack.IgnorePlugin(/oracle/, /\/knex\//),
			new webpack.IgnorePlugin(/oracledb/, /\/knex\//),
			new webpack.IgnorePlugin(/pg-query-stream/, /\/knex\//),
			new webpack.IgnorePlugin(/sqlite3/, /\/knex\//),
			new webpack.IgnorePlugin(/strong-oracle/, /\/knex\//),
			new webpack.IgnorePlugin(/pg-native/, /\/pg\//),
		]);
		return config;
	},
};
