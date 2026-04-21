import { useState } from "react";
import {
	AppChannels,
	INSTRUMENT_CATALOG,
	createInstrumentContext,
	createWatchlistEvent,
	type InstrumentDetails,
} from "@repo/fdc3";
import "./App.css";

const CATALOG = Object.values(INSTRUMENT_CATALOG);

function App() {
	const [selected, setSelected] = useState<string | null>(null);
	const [pinned, setPinned] = useState<Set<string>>(new Set());

	async function selectTicker(row: InstrumentDetails) {
		setSelected(row.ticker);
		if (typeof fdc3 === "undefined") {
			console.error("FDC3 is not available");
			return;
		}
		await fdc3.broadcast(createInstrumentContext({ ticker: row.ticker, name: row.name }));
	}

	async function togglePin(e: React.MouseEvent, row: InstrumentDetails) {
		e.stopPropagation();
		if (typeof fdc3 === "undefined") {
			console.error("FDC3 is not available");
			return;
		}
		const next = new Set(pinned);
		const action: "add" | "remove" = next.has(row.ticker) ? "remove" : "add";
		if (action === "add") next.add(row.ticker);
		else next.delete(row.ticker);
		setPinned(next);

		const channel = await fdc3.getOrCreateChannel(AppChannels.Watchlist);
		await channel.broadcast(
			createWatchlistEvent({
				action,
				instrument: createInstrumentContext({ ticker: row.ticker, name: row.name }),
			}),
		);
	}

	return (
		<main className="view">
			<header>
				<h1>Tickers</h1>
				<p className="subtitle">
					Click a row to broadcast a selection on the current FDC3 user channel.
					Click the star to toggle a watchlist pin on the <code>watchlist</code> app channel.
				</p>
			</header>

			<ul className="rows">
				{CATALOG.map((row) => {
					const isPinned = pinned.has(row.ticker);
					const isSelected = selected === row.ticker;
					return (
						<li
							key={row.ticker}
							className={`row ${isSelected ? "row--selected" : ""}`}
							onClick={() => selectTicker(row)}
						>
							<button
								type="button"
								className={`star ${isPinned ? "star--on" : ""}`}
								onClick={(e) => togglePin(e, row)}
								aria-label={isPinned ? `Unpin ${row.ticker}` : `Pin ${row.ticker}`}
							>
								{isPinned ? "★" : "☆"}
							</button>
							<span className="ticker">{row.ticker}</span>
							<span className="name">{row.name}</span>
							<span className="price">${row.mockPrice.toFixed(2)}</span>
						</li>
					);
				})}
			</ul>
		</main>
	);
}

export default App;
