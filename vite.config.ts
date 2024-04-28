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
					target: env.BACKEND_URL,
					changeOrigin: true,
				},

			},
			strictPort: true,
		},
		preview: {
			port: 7000,
			open: true,
			host: "localhost",
			proxy: {
				"/api": {
					target: env.BACKEND_URL,
					changeOrigin: true,
				},
			},
			strictPort: true,
		}
	};
});
