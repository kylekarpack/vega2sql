import vegaLite2Sql from "vega2sql";

const spec = {
	$schema: "https://vega.github.io/schema/vega-lite/v5.json",
	data: [],
	mark: "bar",
	encoding: {
		x: { aggregate: "mean", field: "yield" },
		y: { field: "variety", as: "var2" },
		color: { field: "site" },
	},
	transform: [{ filter: { field: "yield", oneOf: [0, 100] } }],
};

export default (req, res) => {

	const tableName = req.query?.table?.toString() || "table";
	const query = vegaLite2Sql(tableName, spec);

	res.status(200).send(query);
};