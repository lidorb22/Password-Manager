import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { viteStaticCopy } from "vite-plugin-static-copy";
import manifest from "./manifest.json";

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      host: "localhost",
    },
  },
  plugins: [
    react(),
    crx({ manifest }),
     /*Copies the content script CSS to the dist folder*/
    viteStaticCopy({
      targets: [
        {
          src: "src/content/inPageNotification.css",
          dest: ".",
        },
      ],
    }),
  ],
});