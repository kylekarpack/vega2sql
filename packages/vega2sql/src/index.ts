import {knex} from "knex";
import { TopLevelSpec } from "vega-lite";
import { FieldPredicate } from "vega-lite/build/src/predicate";

const client = knex({
	client: "pg",
	connection: {},
});

const getFieldProp = (col: any): { [key: string]: string } | string => {
	return col.as ? { [col.as]: col.field } : col.field;
};

const filter = (query: any, spec: TopLevelSpec): void => {
	if (spec.transform) {
		for (let transform of spec.transform) {
			const filter: FieldPredicate = (transform as any).filter;
			if (filter && filter.field) {
				if ("equal" in filter) {
					query = query.where({ [filter.field]: filter.equal });
				} else if ("lt" in filter) {
					query = query.where(filter.field, "<", filter.lt);
				} else if ("gt" in filter) {
					query = query.where(filter.field, ">", filter.gt);
				} else if ("range" in filter) {
					query = query.whereBetween(filter.field, filter.range);
				} else {
					throw `Filter ${JSON.stringify(filter)} is not valid`;
				}
			}
		}
	}
};

const group = (query: any, spec: TopLevelSpec): void => {
	const encoding = (spec as any).encoding;
	for (let key in encoding) {
		const obj = encoding[key];
		if (!obj.aggregate) {
			query = query.groupBy(obj.field);
		}
	}
};

const select = (query: any, spec: TopLevelSpec): void => {
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

const vegaLite2Sql = (table: string, spec: TopLevelSpec): string => {
	let query = client.table(table);
	select(query, spec);
	filter(query, spec);
	group(query, spec);
	return query.toString();
};

export default vegaLite2Sql;
