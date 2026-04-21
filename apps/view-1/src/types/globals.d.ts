import type { fin as FinApi } from "@openfin/core";

// Activates the ambient `fdc3` global from the shared package.
import "@repo/fdc3/global";

declare global {
	const fin: typeof FinApi;
}
