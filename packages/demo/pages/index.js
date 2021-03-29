import Head from "next/head";
import styles from "../styles/Home.module.css";
import Vega2Sql from "vega2sql";

const spec = {
	$schema: "https://vega.github.io/schema/vega-lite/v5.json",
	data: [],
	mark: "bar",
	encoding: {
		x: { aggregate: "mean", field: "yield" },
		y: { field: "variety", as: "var2" },
		color: { field: "site" },
	},
	transform: [
		{ filter: { field: "yield", oneOf: [0, 10, 100, 1000, 10000] } },
		{ filter: { field: "date", range: [new Date(), new Date()] } },
	],
};

const builder = new Vega2Sql("pg");
const sql = builder.vegaLite2Sql("tablename", spec);

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				{sql}

				
			</main>

			<footer className={styles.footer}>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer">
					Powered by{" "}
					<img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
				</a>
			</footer>
		</div>
	);
}
