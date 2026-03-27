import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = '/OnlineCinemaSolder_FrontendProject/'

export default defineConfig({
  base: repoName,
  plugins: [react()],
})