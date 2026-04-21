/**
 * A tiny fake catalog used across the sandbox views.
 * Not part of FDC3 — this is just sample data both the broadcaster and
 * the listener can reference so "details" don't need a real market-data API.
 */
export interface InstrumentDetails {
	ticker: string;
	name: string;
	sector: string;
	mockPrice: number;
	blurb: string;
}

export const INSTRUMENT_CATALOG: Record<string, InstrumentDetails> = {
	MSFT: {
		ticker: "MSFT",
		name: "Microsoft Corporation",
		sector: "Technology",
		mockPrice: 412.33,
		blurb: "Cloud platforms, productivity software, gaming.",
	},
	AAPL: {
		ticker: "AAPL",
		name: "Apple Inc.",
		sector: "Technology",
		mockPrice: 195.12,
		blurb: "Consumer electronics, services, and wearables.",
	},
	GOOGL: {
		ticker: "GOOGL",
		name: "Alphabet Inc.",
		sector: "Communication Services",
		mockPrice: 174.88,
		blurb: "Search, advertising, Android, and cloud.",
	},
	NVDA: {
		ticker: "NVDA",
		name: "NVIDIA Corporation",
		sector: "Technology",
		mockPrice: 124.6,
		blurb: "GPUs and accelerated computing for AI workloads.",
	},
	AMZN: {
		ticker: "AMZN",
		name: "Amazon.com Inc.",
		sector: "Consumer Discretionary",
		mockPrice: 198.05,
		blurb: "E-commerce marketplace and AWS cloud.",
	},
	TSLA: {
		ticker: "TSLA",
		name: "Tesla Inc.",
		sector: "Consumer Discretionary",
		mockPrice: 221.47,
		blurb: "Electric vehicles, energy storage, and autonomy.",
	},
	META: {
		ticker: "META",
		name: "Meta Platforms Inc.",
		sector: "Communication Services",
		mockPrice: 512.2,
		blurb: "Social platforms and reality labs.",
	},
};

export function lookupInstrument(ticker: string): InstrumentDetails | undefined {
	return INSTRUMENT_CATALOG[ticker.toUpperCase()];
}
