import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "#prisma": fileURLToPath(new URL("./prisma/generated", import.meta.url)),
      "#notify-prisma": fileURLToPath(
        new URL("./apps/notification-service/prisma/generated", import.meta.url),
      ),
      "#booking-prisma": fileURLToPath(
        new URL("./apps/booking-service/prisma/generated", import.meta.url),
      ),
      "#auth-prisma": fileURLToPath(
        new URL("./apps/auth-service/prisma/generated", import.meta.url),
      ),
      "@app/common": fileURLToPath(new URL("./libs/common/src/index.ts", import.meta.url)),
      "@app/contracts": fileURLToPath(new URL("./libs/contracts/src/index.ts", import.meta.url)),
      "@modules": fileURLToPath(new URL("./apps/travel-platform-api/src/modules", import.meta.url)),
      "@services": fileURLToPath(
        new URL("./apps/travel-platform-api/src/shared/services", import.meta.url),
      ),
      "@shared": fileURLToPath(new URL("./apps/travel-platform-api/src/shared", import.meta.url)),
      "@tests": fileURLToPath(new URL("./apps/travel-platform-api/src/tests", import.meta.url)),
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
      include: [
        "apps/**/src/**/*.service.ts",
        "apps/**/src/**/states/**",
        "apps/**/src/**/*.worker.ts",
      ],
      exclude: ["apps/**/*.spec.ts"],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
      },
    },
  },
});
