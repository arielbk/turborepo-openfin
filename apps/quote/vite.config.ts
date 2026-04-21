import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// OpenFin's view manifest references a fixed URL, so we lock the port.
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5175,
		strictPort: true,
	},
});
