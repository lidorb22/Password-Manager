import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// הגדרה פשוטה ויציבה לתוסף כרום
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // הכניסה הראשית היא דף הפופ-אפ של התוסף
        main: 'index.html',
      },
    },
  },
})