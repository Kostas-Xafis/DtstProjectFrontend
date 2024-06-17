import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
	const env = loadEnv("", process.cwd());
	return {
		plugins: [react()],
		server: {
			host: "localhost",
			port: 7000,
			open: true,
			proxy: {
				"/api": {
					target: env.VITE_BACKEND_URL || "http://localhost:8000/",
					changeOrigin: true,
				},
			},
			strictPort: true,
		},
		preview: {
			host: "localhost",
			port: 7000,
			open: true,
			proxy: {
				"/api": {
					target: env.VITE_BACKEND_URL || "http://localhost:8000/",
					changeOrigin: true,
				},
			},
			strictPort: true,
		}
	};
});
