import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "#prisma": fileURLToPath(new URL("./prisma/generated", import.meta.url)),
      "@modules": fileURLToPath(new URL("./src/modules", import.meta.url)),
      "@pipes": fileURLToPath(new URL("./src/shared/pipes", import.meta.url)),
      "@services": fileURLToPath(new URL("./src/shared/services", import.meta.url)),
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
      "@tests": fileURLToPath(new URL("./src/tests", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Spec (Stage II, 4.6) requires >= 60% coverage of the business logic layer:
      // services, the booking State pattern and the notifications worker.
      include: ["src/**/*.service.ts", "src/**/states/**", "src/**/*.worker.ts"],
      exclude: ["src/**/*.spec.ts"],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
      },
    },
  },
});
