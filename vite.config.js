import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build`         → normal production build (dist/)
// `npm run build:single`  → one self-contained index.html (dist-single/) for quick previews
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: mode === 'single' ? { assetsInlineLimit: 100_000_000, outDir: 'dist-single' } : {},
}))
