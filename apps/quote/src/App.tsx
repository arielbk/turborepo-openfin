import { useEffect, useState } from "react";
import {
	AppChannels,
	isInstrumentContext,
	isWatchlistEvent,
	lookupInstrument,
	type InstrumentDetails,
} from "@repo/fdc3";
import "./App.css";

function App() {
	const [current, setCurrent] = useState<InstrumentDetails | null>(null);
	const [unknownTicker, setUnknownTicker] = useState<string | null>(null);
	const [watchlist, setWatchlist] = useState<string[]>([]);

	useEffect(() => {
		if (typeof fdc3 === "undefined") {
			console.error("FDC3 is not available");
			return;
		}

		let userChannelListener: { unsubscribe: () => void } | undefined;
		let watchlistChannelListener: { unsubscribe: () => void } | undefined;

		(async () => {
			userChannelListener = await fdc3.addContextListener((ctx) => {
				if (!isInstrumentContext(ctx)) return;
				const ticker = ctx.id?.ticker;
				if (!ticker) return;
				const details = lookupInstrument(ticker);
				if (details) {
					setCurrent(details);
					setUnknownTicker(null);
				} else {
					setCurrent(null);
					setUnknownTicker(ticker);
				}
			});

			const watchlistChannel = await fdc3.getOrCreateChannel(AppChannels.Watchlist);
			watchlistChannelListener = await watchlistChannel.addContextListener((ctx) => {
				if (!isWatchlistEvent(ctx)) return;
				const ticker = ctx.instrument.id?.ticker;
				if (!ticker) return;
				setWatchlist((prev) => {
					if (ctx.action === "add") {
						return prev.includes(ticker) ? prev : [...prev, ticker];
					}
					return prev.filter((t) => t !== ticker);
				});
			});
		})();

		return () => {
			userChannelListener?.unsubscribe();
			watchlistChannelListener?.unsubscribe();
		};
	}, []);

	return (
		<main className="view">
			<section className="detail">
				{current ? (
					<>
						<div className="detail-header">
							<span className="detail-ticker">{current.ticker}</span>
							<span className="detail-name">{current.name}</span>
						</div>
						<dl className="detail-grid">
							<dt>Sector</dt>
							<dd>{current.sector}</dd>
							<dt>Mock price</dt>
							<dd className="price">${current.mockPrice.toFixed(2)}</dd>
							<dt>About</dt>
							<dd>{current.blurb}</dd>
						</dl>
					</>
				) : unknownTicker ? (
					<p className="empty">Received <code>{unknownTicker}</code>, but it's not in the catalog.</p>
				) : (
					<p className="empty">Select a ticker from the Tickers view.</p>
				)}
			</section>

			<aside className="watchlist">
				<h2>Watchlist</h2>
				{watchlist.length === 0 ? (
					<p className="empty small">No pins yet. Star a row in Tickers.</p>
				) : (
					<ul>
						{watchlist.map((ticker) => {
							const details = lookupInstrument(ticker);
							return (
								<li key={ticker}>
									<span className="pin-ticker">{ticker}</span>
									{details && <span className="pin-name">{details.name}</span>}
								</li>
							);
						})}
					</ul>
				)}
			</aside>
		</main>
	);
}

export default App;
