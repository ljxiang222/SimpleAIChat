import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [tailwindcss()],
    server: {
        host: "192.168.10.70",
        proxy: {
            "/api": {
                target: "http://192.168.10.9:11434", // URL твоего API
                rewrite: (path) => {
                    return path.replace(/^\/api/, "/api");
                },
                changeOrigin: true,
                secure: false,
            },
            cache: "no-cache",
        },
    },
});
