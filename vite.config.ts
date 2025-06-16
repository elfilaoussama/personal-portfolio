import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";
import { seo } from "vite-plugin-seo";
import ssr from "vite-plugin-ssr/plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    seo({
      title: "Oussama EL FILA | Professional Portfolio",
      description: "Professional portfolio showcasing my work and skills",
      url: "https://oussama-elfila.dev",
      image: "https://oussama-elfila.dev/favicon.svg"
    }),
    ssr(),
    compression()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          vendor: ["@tanstack/react-query", "wouter"]
        }
      }
    }
  }
});
