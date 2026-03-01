import devtoolsJson from "vite-plugin-devtools-json"
import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"
import fs from "fs"

const httpsConfig =
  fs.existsSync(".certs/key.pem") && fs.existsSync(".certs/cert.pem")
    ? { key: fs.readFileSync(".certs/key.pem"), cert: fs.readFileSync(".certs/cert.pem") }
    : undefined

export default defineConfig({
  plugins: [sveltekit(), devtoolsJson()],
  server: {
    https: httpsConfig,
    host: true,
  },
})
