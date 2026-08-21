import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// GitHub Pages 사용자 사이트(루트 서빙)이므로 base는 기본값("/") 그대로 둔다.
export default defineConfig({
  plugins: [react()],
  test: {
    // 브라우저 API는 setup.ts에서 필요한 것만 흉내 낸다 (jsdom 의존성 회피).
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.ts"],
  },
});
