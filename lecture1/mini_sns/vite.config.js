import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ai-vibe-coding 저장소의 GitHub Pages 배포 경로
export default defineConfig({
  base: '/mini_sns/',
  plugins: [react()],
});
