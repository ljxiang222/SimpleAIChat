import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [tailwindcss()],
    server: {
        host: "192.168.20.70",
        proxy: {
            "/api": {
                target: "http://192.168.20.40:9100", // URL твоего API
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
