import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  // This solved: Cannot read properties of null (reading 'useContext') #10455: https://github.com/remix-run/remix/issues/10455
  optimizeDeps: {
    exclude: ['com.chrome.devtools.json']
  },
  server: {
    host: true,
    warmup: {
      clientFiles: [
        './app/**/!(*.server|*.test)*.tsx', // Include all .tsx files except server and test files (add more patterns if required)
      ],
    },
  },
});
