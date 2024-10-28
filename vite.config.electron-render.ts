import { resolve } from "node:path"

import { defineConfig } from "vite"

import config from "./configs/vite.electron-render.config"
import { render } from "./package.json"
import compressAndFingerprintPlugin from "./plugins/vite/compress"

export default defineConfig({
  ...config,
  base: "./",
  plugins: [
    ...config.plugins,
    compressAndFingerprintPlugin(resolve(import.meta.dirname, "dist"), {
      minimum: render.minimum,
    }),
  ],
})