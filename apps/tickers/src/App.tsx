import { useEffect, useState } from "react";
import * as Notifications from "@openfin/notifications";
import { AppChannels, createInstrumentContext } from "@repo/fdc3";
import "./App.css";

function App() {
	const [notificationActionMessage, setNotificationActionMessage] = useState("");

	useEffect(() => {
		let disposed = false;

		(async () => {
			try {
				await Notifications.register();
				if (disposed) return;

				Notifications.addEventListener("notification-action", (event) => {
					const customData = event.result["customData"];
					console.log("Notification clicked:", customData);
					setNotificationActionMessage(String(customData ?? ""));
				});
			} catch (err) {
				console.error("Failed to register notifications", err);
			}
		})();

		return () => {
			disposed = true;
		};
	}, []);

	async function showNotification() {
		await Notifications.create({
			platform: fin.me.identity.uuid,
			title: "Simple Notification",
			body: "This is a simple notification",
			toast: "transient",
			buttons: [
				{
					title: "Click me",
					type: "button",
					cta: true,
					onClick: {
						customData: "custom notification data",
					},
				},
			],
		});
	}

	async function broadcastInstrumentOnCurrentChannel() {
		if (typeof fdc3 === "undefined") {
			console.error("FDC3 is not available");
			return;
		}
		await fdc3.broadcast(
			createInstrumentContext({ ticker: "MSFT", name: "Microsoft Corporation" }),
		);
	}

	async function broadcastInstrumentOnAppChannel() {
		if (typeof fdc3 === "undefined") {
			console.error("FDC3 is not available");
			return;
		}
		const appChannel = await fdc3.getOrCreateChannel(AppChannels.Custom);
		await appChannel.broadcast(createInstrumentContext({ ticker: "AAPL", name: "Apple Inc." }));
	}

	return (
		<main className="view">
			<header>
				<h1>Tickers</h1>
				<p className="subtitle">Broadcasts FDC3 instruments and fires notifications.</p>
			</header>

			<section className="actions">
				<button onClick={showNotification}>Show Notification</button>
				<button onClick={broadcastInstrumentOnCurrentChannel}>Broadcast FDC3 Context</button>
				<button onClick={broadcastInstrumentOnAppChannel}>
					Broadcast FDC3 Context on App Channel
				</button>
			</section>

			{notificationActionMessage && (
				<p className="action-message">Notification action: {notificationActionMessage}</p>
			)}
		</main>
	);
}

export default App;
