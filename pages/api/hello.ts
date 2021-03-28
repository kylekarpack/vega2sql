import knex, { Knex } from "knex";
import type { NextApiRequest, NextApiResponse } from "next";
import { TopLevelSpec } from "vega-lite";

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
	let query = client.table(client.raw(table));
	select(query, spec);
	group(query, spec);
	return query.toString();
};

const group = (query: Knex.QueryBuilder, spec: TopLevelSpec): void => {
	const encoding = (spec as any).encoding;
	for (let key in encoding) {
		const obj = encoding[key];
		if (!obj.aggregate) {
			query = query.groupByRaw(obj.field);
		}
	}
};

const select = (query: Knex.QueryBuilder, spec: TopLevelSpec): void => {
	const selectStatement = Object.values((spec as any).encoding)
		.map((el: any) => {
			return el.aggregate ? `${el.aggregate}(${el.field})` : el.field;
		})
		.join(", ");
	query = query.select(client.raw(selectStatement));
};

export default (req: NextApiRequest, res: NextApiResponse) => {
	const tableName: string = req.query?.table?.toString() || "table";
	const query = vegaLite2Sql(tableName, spec);

	res.status(200).send(query);
};
