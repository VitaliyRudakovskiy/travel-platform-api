import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "./vitest.config.mjs";

// Integration tests: real AppModule + real Postgres (travel_platform_test). Run with `pnpm test:int`.
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ["src/tests/integration/**/*.int-spec.ts"],
      globalSetup: ["src/tests/integration/setup/global-setup.ts"],
      setupFiles: ["src/tests/integration/setup/env.ts"],
      // All files share one database: run them one after another to avoid cross-file interference.
      fileParallelism: false,
      testTimeout: 15_000,
      hookTimeout: 30_000,
    },
  }),
);
