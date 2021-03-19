import Head from "next/head";
import styles from "../styles/Home.module.css";
import { VegaLite } from "react-vega"

const spec = {
	$schema: "https://vega.github.io/schema/vega-lite/v5.json",
	description: "A simple bar chart with embedded data.",
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
	mark: "bar",
	encoding: {
		x: { field: "a", type: "nominal", axis: { labelAngle: 0 } },
		y: { field: "b", type: "quantitative" },
	},
};

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>Vega to SQL</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<VegaLite spec={spec} data={spec.data} />
			</main>

			<footer className={styles.footer}></footer>
		</div>
	);
}
