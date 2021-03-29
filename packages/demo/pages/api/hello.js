import Vega2Sql from "vega2sql";

const builder = new Vega2Sql();

const spec = {
	$schema: "https://vega.github.io/schema/vega-lite/v5.json",
	data: [],
	mark: "bar",
	encoding: {
		x: { aggregate: "mean", field: "yield" },
		y: { field: "variety", as: "var2" },
		color: { field: "site" },
	},
	transform: [
		{ filter: { field: "yield", oneOf: [0, 10, 100, 1000, 10000] } },
		{ filter: { field: "yield", gte: 19000 } },
	],
};

export default (req, res) => {
	const tableName = req.query?.table?.toString() || "table";
	const query = builder.vegaLite2Sql(tableName, spec);

	res.status(200).send(query);
};
