import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import Sitemap from "vite-plugin-sitemap";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    Sitemap({
      hostname: "https://www.Sonnerconstruction.org/",
      dynamicRoutes: ["/", "/#about", "/#faq", "/privacy", "/terms", "/cookie"],
      exclude: ["/404", "/private"],
      outDir: "dist",
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date(),
    }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
