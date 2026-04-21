import type { DesktopAgent } from "@finos/fdc3";

/**
 * Ambient declaration for the `fdc3` global injected by OpenFin (and any
 * FDC3-compliant container). Opt in per-app via:
 *
 *   // somewhere in a .d.ts file in the app's `src/`
 *   import "@repo/fdc3/global";
 *
 * or by adding `"@repo/fdc3/global"` to the app's tsconfig `types` array.
 */
declare global {
	const fdc3: DesktopAgent;
}

export {};
