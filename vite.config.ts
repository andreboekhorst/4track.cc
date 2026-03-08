import { svelte } from "@sveltejs/vite-plugin-svelte"
import { defineConfig } from "vite"
import fs from "fs"

const httpsConfig =
  fs.existsSync(".certs/key.pem") && fs.existsSync(".certs/cert.pem")
    ? { key: fs.readFileSync(".certs/key.pem"), cert: fs.readFileSync(".certs/cert.pem") }
    : undefined

export default defineConfig({
  plugins: [svelte()],
  publicDir: "static",
  resolve: {
    alias: {
      "$lib": "/src/lib",
    },
  },
  server: {
    https: httpsConfig,
    host: true,
  },
})
