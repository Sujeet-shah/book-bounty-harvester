
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      jsxImportSource: 'react',
      // The SWC plugin doesn't use babel, so we remove that configuration
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add base path configuration
  base: "./",
  build: {
    // Improve sourcemaps for better debugging
    sourcemap: true,
    // Make sure all paths are relative
    assetsInlineLimit: 0,
  }
}));
