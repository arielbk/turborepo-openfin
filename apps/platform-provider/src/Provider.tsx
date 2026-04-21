import type OpenFin from "@openfin/core";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { Home } from "@openfin/workspace";
import { init } from "@openfin/workspace-platform";
import logo from "./assets/logo.svg";
import { register as registerHome } from "./home";
import type { CustomSettings, PlatformSettings } from "./shapes";

let isInitialized = false;

function Provider() {
	const [message, setMessage] = useState("Starting...");

	useEffect(() => {
		if (isInitialized) return;
		isInitialized = true;

		(async () => {
			try {
				setMessage("Workspace platform initializing");

				const settings = await getManifestCustomSettings();

				const platform = fin.Platform.getCurrentSync();
				await platform.once("platform-api-ready", async () => {
					await initializeWorkspaceComponents(settings.platformSettings, settings.customSettings);
					setMessage("Workspace platform initialized");
				});

				await initializeWorkspacePlatform(settings.platformSettings);
			} catch (err) {
				console.error(err);
				setMessage(`Error initializing platform: ${err instanceof Error ? err.message : err}`);
			}
		})();
	}, []);

	return (
		<div style={styles.root}>
			<header style={styles.header}>
				<img src={logo} alt="OpenFin" height={40} />
				<div>
					<h1 style={styles.title}>Platform Provider</h1>
					<p style={styles.tagline}>OpenFin Workspace host for the sandbox</p>
				</div>
			</header>
			<main style={styles.main}>
				<p>
					This window boots the workspace platform and registers the Home launcher.
					Use Home to open the <strong>Tickers</strong> and <strong>Quote</strong> views.
				</p>
				<div style={styles.status}>
					<span style={styles.statusLabel}>Status</span>
					<span style={styles.statusValue}>{message}</span>
				</div>
			</main>
		</div>
	);
}

/**
 * Boot the workspace platform runtime. Registers theme + default window options.
 * No custom actions yet — we'll add them when dock/store come back online.
 */
async function initializeWorkspacePlatform(platformSettings: PlatformSettings): Promise<void> {
	await init({
		browser: {
			defaultWindowOptions: {
				icon: platformSettings.icon,
				workspacePlatform: {
					pages: [],
					favicon: platformSettings.icon,
				},
			},
		},
		theme: [
			{
				label: "Default",
				default: "dark",
				palette: {
					brandPrimary: "#0A76D3",
					brandSecondary: "#383A40",
					backgroundPrimary: "#1E1F23",
				},
			},
		],
	});
}

/**
 * Register the workspace components we care about. For now that's just Home.
 * Dock / Store / Notifications will be added back as we migrate views.
 */
async function initializeWorkspaceComponents(
	platformSettings: PlatformSettings,
	customSettings?: CustomSettings,
): Promise<void> {
	await registerHome(platformSettings, customSettings?.apps);
	await Home.show();

	const providerWindow = fin.Window.getCurrentSync();
	await providerWindow.once("close-requested", async () => {
		await Home.deregister(platformSettings.id);
		await fin.Platform.getCurrentSync().quit();
	});
}

/**
 * Pull the platform + custom settings out of the manifest.fin.json.
 */
async function getManifestCustomSettings(): Promise<{
	platformSettings: PlatformSettings;
	customSettings?: CustomSettings;
}> {
	const app = await fin.Application.getCurrent();
	const manifest: OpenFin.Manifest & { customSettings?: CustomSettings } = await app.getManifest();
	return {
		platformSettings: {
			id: manifest.platform?.uuid ?? "",
			title: manifest.shortcut?.name ?? "",
			icon: manifest.platform?.icon ?? "",
		},
		customSettings: manifest.customSettings,
	};
}

const styles: Record<string, CSSProperties> = {
	root: {
		fontFamily: "system-ui, sans-serif",
		padding: "1.5rem",
		color: "#fff",
	},
	header: {
		display: "flex",
		alignItems: "center",
		gap: "1rem",
	},
	title: {
		margin: 0,
	},
	tagline: {
		margin: 0,
		opacity: 0.7,
	},
	main: {
		marginTop: "1.5rem",
		display: "flex",
		flexDirection: "column",
		gap: "1rem",
	},
	status: {
		display: "inline-flex",
		alignItems: "center",
		gap: "0.5rem",
		padding: "0.5rem 0.75rem",
		borderRadius: "6px",
		background: "rgba(255, 255, 255, 0.06)",
		border: "1px solid rgba(255, 255, 255, 0.08)",
		fontSize: "0.9rem",
		alignSelf: "flex-start",
	},
	statusLabel: {
		textTransform: "uppercase",
		letterSpacing: "0.08em",
		fontSize: "0.7rem",
		opacity: 0.6,
	},
	statusValue: {
		opacity: 0.95,
	},
};

export default Provider;
