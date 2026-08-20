import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@modules": fileURLToPath(new URL("./src/modules", import.meta.url)),
      "@pipes": fileURLToPath(new URL("./src/shared/pipes", import.meta.url)),
      "@services": fileURLToPath(new URL("./src/shared/services", import.meta.url)),
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
