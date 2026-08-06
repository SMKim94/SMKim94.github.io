import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages 사용자 사이트(루트 서빙)이므로 base는 기본값("/") 그대로 둔다.
export default defineConfig({
  plugins: [react()],
});
