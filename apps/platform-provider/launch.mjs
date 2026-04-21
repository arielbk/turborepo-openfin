/**
 * Launches the OpenFin runtime against a manifest URL using the Node adapter.
 * Ctrl+C / Cmd+C shuts the platform down cleanly.
 */
import { connect, launch } from "@openfin/node-adapter";
import { setDefaultResultOrder } from "dns";

async function run(manifestUrl) {
	try {
		let quitRequested = false;
		let quit;

		const fin = await launchFromNode(manifestUrl);

		if (fin) {
			const manifest = await fin.System.fetchManifest(manifestUrl);

			if (manifest.platform?.uuid !== undefined) {
				quit = async () => {
					try {
						if (!quitRequested) {
							quitRequested = true;
							console.log("Calling platform quit");
							const platform = fin.Platform.wrapSync({ uuid: manifest.platform.uuid });
							await platform.quit();
						}
					} catch (err) {
						if (err.toString().includes("no longer connected")) {
							console.log("Platform no longer connected");
							process.exit();
						} else {
							console.error(err);
						}
					}
				};
				console.log(`Wrapped target platform: ${manifest.platform.uuid}`);
			} else {
				quit = async () => {
					try {
						if (!quitRequested) {
							quitRequested = true;
							const app = fin.Application.wrapSync({ uuid: manifest.startup_app.uuid });
							await app.quit();
						}
					} catch (err) {
						console.error(err);
					}
				};
			}

			process.on("exit", async () => {
				await quit();
			});
			process.on("SIGINT", async () => {
				await quit();
			});

			console.log(`Connected to manifest: ${manifestUrl}`);
			console.log(`Press Ctrl+C (or Cmd+C) to exit.`);
		}
	} catch (e) {
		console.error(`Error: Connection failed`);
		console.error(e.message);
	}
}

async function launchFromNode(manifestUrl) {
	try {
		const port = await launch({ manifestUrl });
		const fin = await connect({
			uuid: `dev-connection-${Date.now()}`,
			address: `ws://127.0.0.1:${port}`,
			nonPersistent: true,
		});

		fin.once("disconnected", () => {
			console.log("Platform disconnected, exiting process.");
			process.exit();
		});

		return fin;
	} catch (e) {
		console.error("Error: Failed launching manifest");
		console.error(e.message);
		if (e.message?.includes("Could not locate")) {
			console.error("Is the Vite dev server running and the manifest JSON valid?");
		}
	}
}

try {
	setDefaultResultOrder("ipv4first");
} catch {
	// older Node versions don't support this and don't need it
}

const launchArgs = process.argv.slice(2);
const manifest =
	launchArgs.length > 0 ? launchArgs[0] : "http://localhost:5173/platform/manifest.fin.json";
console.log(`Launching manifest: ${manifest}`);

run(manifest).catch((err) => console.error(err));
