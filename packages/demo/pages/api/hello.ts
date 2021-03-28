import knex, { Knex } from "knex";
import type { NextApiRequest, NextApiResponse } from "next";
import { TopLevelSpec } from "vega-lite";
import {
	FieldEqualPredicate,
	FieldPredicate,
} from "vega-lite/build/src/predicate";

const spec: TopLevelSpec = {
	$schema: "https://vega.github.io/schema/vega-lite/v5.json",
	data: [],
	mark: "bar",
	encoding: {
		x: { aggregate: "mean", field: "yield", as: "yield" },
		y: { field: "variety", as: "var11" },
		color: { field: "site" },
	},
	transform: [{ filter: { field: "yield", range: [0, 100] } }],
};

const client = knex({
	client: "postgres",
	connection: {},
});

const vegaLite2Sql = (table: string, spec: TopLevelSpec): string => {
	let query = client.table(table);
	select(query, spec);
	filter(query, spec);
	group(query, spec);
	return query.toString();
};

const getFieldProp = (col): { [key: string]: string } | string => {
	return col.as ? { [col.as]: col.field } : col.field;
};

const filter = (query: Knex.QueryBuilder, spec: TopLevelSpec): void => {
	if (spec.transform) {
		for (let transform of spec.transform) {
			const filter: FieldPredicate = transform.filter;
			if (filter && filter.field) {
				if ("equal" in filter) {
					query = query.where({ [filter.field]: filter.equal });
				} else if ("lt" in filter) {
					query = query.where(filter.field, "<", filter.lt);
				} else if ("gt" in filter) {
					query = query.where(filter.field, ">", filter.gt);
				} else if ("range" in filter) {
					query = query.whereBetween(filter.field, filter.range);
				}
			}
		}
	}
};

const group = (query: Knex.QueryBuilder, spec: TopLevelSpec): void => {
	const encoding = (spec as any).encoding;
	for (let key in encoding) {
		const obj = encoding[key];
		if (!obj.aggregate) {
			query = query.groupBy(obj.field);
		}
	}
};

const select = (query: Knex.QueryBuilder, spec: TopLevelSpec): void => {
	Object.values((spec as any).encoding).forEach((el: any) => {
		const fieldProp = getFieldProp(el);
		const aggregate = el.aggregate?.toLowerCase() ?? el.op?.toLowerCase();
		switch (aggregate) {
			case "sum":
				query = query.sum(fieldProp);
				break;
			case "count":
				query = query.count(fieldProp);
				break;
			case "mean":
			case "average":
			case "avg":
				query = query.avg(fieldProp);
				break;
			case "min":
				query = query.min(fieldProp);
				break;
			case "max":
				query = query.max(fieldProp);
				break;
			default:
				if (aggregate) {
					throw `Aggregate "${aggregate}" not yet supported`;
				}
				query = query.select(fieldProp);
		}
	});
};

export default (req: NextApiRequest, res: NextApiResponse) => {
	const tableName: string = req.query?.table?.toString() || "table";
	const query = vegaLite2Sql(tableName, spec);

	res.status(200).send(query);
};
