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

const vegaLite2Sql = (table: string, spec: TopLevelSpec): string => {
	let query = client.table(table);
	query = query.select(getSelect(spec));
	return query.toString();
};

const getSelect = (spec: any): string => {
	return Object.values(spec.encoding).map(el => el.field).join(",")
}

export default (req: NextApiRequest, res: NextApiResponse) => {
	const tableName: string = req.query?.table?.toString() || "table";
	const query = vegaLite2Sql(tableName, spec);

	res.status(200).send(query);
};
