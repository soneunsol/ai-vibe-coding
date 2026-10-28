import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** GitHub Pages 배포 경로(/ai-vibe-coding/my-community/) 기준 설정 */
export default defineConfig({
  base: '/my-community/',
  plugins: [react()],
});
