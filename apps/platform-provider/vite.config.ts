import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// OpenFin's manifest references a fixed URL, so we lock the dev server to 5173.
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		strictPort: true,
	},
});
