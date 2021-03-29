import { knex, Knex } from "knex";
import { TopLevelSpec } from "vega-lite";
import { FieldPredicate } from "vega-lite/build/src/predicate";

class Vega2Sql {
	private readonly client: Knex;
	private query: Knex.QueryBuilder;

	constructor(client: "pg" | "mysql" = "pg") {
		this.client = knex({
			client,
			connection: {},
		});
	}

	public vegaLite2Sql = (table: string, spec: TopLevelSpec): string => {
		this.query = this.client.table(table);
		this.select(spec);
		this.filter(spec);
		this.group(spec);
		return this.query.toString();
	};

	private getFieldProp = (col: any): { [key: string]: string } | string => {
		return col.as ? { [col.as]: col.field } : col.field;
	};

	private filter = (spec: TopLevelSpec): void => {
		if (spec.transform) {
			for (let transform of spec.transform) {
				const filter: FieldPredicate = (transform as any).filter;
				if (filter && filter.field) {
					if ("equal" in filter) {
						this.query = this.query.where({ [filter.field]: filter.equal });
					} else if ("lt" in filter) {
						this.query = this.query.where(filter.field, "<", filter.lt);
					} else if ("lte" in filter) {
						this.query = this.query.where(filter.field, "<=", filter.lte);
					} else if ("gt" in filter) {
						this.query = this.query.where(filter.field, ">", filter.gt);
					} else if ("gte" in filter) {
						this.query = this.query.where(filter.field, ">=", filter.gte);
					} else if ("range" in filter) {
						this.query = this.query.whereBetween(filter.field, filter.range);
					} else if ("oneOf" in filter) {
						this.query = this.query.whereIn(
							filter.field as any,
							filter.oneOf as any
						);
					} else if ("valid" in filter) {
						this.query = this.query.whereNotNull(filter.field);
					} else {
						throw `Filter ${JSON.stringify(filter)} is not valid`;
					}
				}
			}
		}
	};

	private group = (spec: TopLevelSpec): void => {
		const encoding = (spec as any).encoding;
		for (let key in encoding) {
			const obj = encoding[key];
			if (!obj.aggregate) {
				this.query = this.query.groupBy(obj.field);
			}
		}
	};

	private select = (spec: TopLevelSpec): void => {
		Object.values((spec as any).encoding).forEach((el: any) => {
			const fieldProp = this.getFieldProp(el);
			const aggregate = el.aggregate?.toLowerCase() ?? el.op?.toLowerCase();
			switch (aggregate) {
				case "sum":
					this.query = this.query.sum(fieldProp);
					break;
				case "count":
					this.query = this.query.count(fieldProp);
					break;
				case "mean":
				case "average":
				case "avg":
					this.query = this.query.avg(fieldProp);
					break;
				case "min":
					this.query = this.query.min(fieldProp);
					break;
				case "max":
					this.query = this.query.max(fieldProp);
					break;
				default:
					if (aggregate) {
						throw `Aggregate "${aggregate}" not yet supported`;
					}
					this.query = this.query.select(fieldProp);
			}
		});
	};
}

export default Vega2Sql;