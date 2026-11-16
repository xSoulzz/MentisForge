import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        frequencies: fileURLToPath(new URL('./frequencies/index.html', import.meta.url)),
        terms: fileURLToPath(new URL('./terms/index.html', import.meta.url)),
        mindBrain: fileURLToPath(new URL('./pathways/mind-brain/index.html', import.meta.url)),
        selfMastery: fileURLToPath(new URL('./pathways/self-mastery/index.html', import.meta.url)),
        growthChange: fileURLToPath(new URL('./pathways/growth-change/index.html', import.meta.url)),
        deeperLibrary: fileURLToPath(new URL('./pathways/deeper-library/index.html', import.meta.url)),
        bodyVitality: fileURLToPath(new URL('./topics/body-vitality/index.html', import.meta.url)),
        selfMeaning: fileURLToPath(new URL('./topics/self-meaning/index.html', import.meta.url)),
        attentionLearning: fileURLToPath(new URL('./topics/attention-learning/index.html', import.meta.url)),
        neuroplasticity: fileURLToPath(new URL('./topics/neuroplasticity/index.html', import.meta.url)),
      },
    },
  },
})
