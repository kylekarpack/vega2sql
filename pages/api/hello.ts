// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TopLevelSpec } from "vega-lite";
import knex from "knex";
import type { NextApiRequest, NextApiResponse } from 'next'


const spec: TopLevelSpec = {
	$schema: "https://vega.github.io/schema/vega-lite/v5.json",
	data: [],
	mark: "bar",
	encoding: {
		x: { aggregate: "sum", field: "yield" },
		y: { field: "variety" },
		color: { field: "site" },
	},
};

const client = knex({
	client: "postgres",
	connection: {},
});


export default (req: NextApiRequest, res: NextApiResponse) => {
	const tableName: string = req.query?.table?.toString() || "table";
	const query = client.table(tableName).select("*").where({ "1": "1" });

	res.status(200).send(query.toString());
};
