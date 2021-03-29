import Head from "next/head";

const spec = {
	$schema: "https://vega.github.io/schema/vega-lite/v5.json",
	description: "A simple bar chart with embedded data.",
	mark: "bar",
	data: {
		values: [
			{ a: "A", b: 28 },
			{ a: "B", b: 55 },
			{ a: "C", b: 43 },
			{ a: "D", b: 91 },
			{ a: "E", b: 81 },
			{ a: "F", b: 53 },
			{ a: "G", b: 19 },
			{ a: "H", b: 87 },
			{ a: "I", b: 52 },
		],
	},
	encoding: {
		x: { field: "a", type: "nominal", axis: { labelAngle: 0 } },
		y: { field: "b", type: "quantitative" },
	},
};

const output =  "test" //	vegalite2Sql("table", spec)


export default function Home() {
	return (
		<div>
			<Head>
				<title>Vega to SQL</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				{output}
				{/* <VegaLite spec={spec} /> */}
			</main>

			<footer></footer>
		</div>
	);
}
