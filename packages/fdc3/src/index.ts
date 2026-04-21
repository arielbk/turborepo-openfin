export * from "./contexts.js";
export * from "./channels.js";
export * from "./catalog.js";

// Re-export the FINOS types so consumers only depend on @repo/fdc3.
export type {
	Context,
	ContextHandler,
	Contact,
	Instrument,
	DesktopAgent,
	Channel,
} from "@finos/fdc3";
