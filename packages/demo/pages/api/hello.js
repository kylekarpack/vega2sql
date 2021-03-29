import vegaLite2Sql from "vega2sql";

export default (req, res) => {
	const tableName = req.query?.table?.toString() || "table";
	const query = vegaLite2Sql(tableName, spec);

	res.status(200).send(query);
};