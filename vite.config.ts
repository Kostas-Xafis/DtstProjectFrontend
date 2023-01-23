import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: "localhost",
		port: 7000,
		open: true,
		proxy: {
			"/api": {
				target: "http://localhost:8000/",
				changeOrigin: true,
			},
		},
	},
});
