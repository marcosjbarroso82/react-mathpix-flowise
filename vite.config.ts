import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  base: process.env.NODE_ENV === 'production' ? '/react-webcam-mathpix-ocr-explorer/' : '/',
  define: {
    __REACT_ROUTER_BASENAME__: JSON.stringify(process.env.NODE_ENV === 'production' ? '/react-webcam-mathpix-ocr-explorer' : '/'),
  },
});
