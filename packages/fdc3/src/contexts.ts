import type { Context, Contact, Instrument } from "@finos/fdc3";

/**
 * Strongly-typed factories for the FDC3 context payloads this workspace uses.
 * Keep the raw `@finos/fdc3` types as the source of truth; these helpers just
 * make it harder to forget a required field (like `type` or `id.ticker`).
 */

export function createInstrumentContext(input: {
	ticker: string;
	name?: string;
	isin?: string;
	cusip?: string;
}): Instrument {
	const { ticker, name, isin, cusip } = input;
	return {
		type: "fdc3.instrument",
		name,
		id: {
			ticker,
			...(isin ? { ISIN: isin } : {}),
			...(cusip ? { CUSIP: cusip } : {}),
		},
	};
}

export function createContactContext(input: { name: string; email?: string }): Contact {
	const { name, email } = input;
	return {
		type: "fdc3.contact",
		name,
		id: email ? { email } : {},
	};
}

/** Narrow a generic Context to an Instrument at runtime. */
export function isInstrumentContext(context: Context): context is Instrument {
	return context.type === "fdc3.instrument";
}

/** Narrow a generic Context to a Contact at runtime. */
export function isContactContext(context: Context): context is Contact {
	return context.type === "fdc3.contact";
}
