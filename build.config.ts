import { defineBuildConfig } from "unbuild";
import fs from "fs/promises";
export default defineBuildConfig({
  entries: ["src/index"],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  failOnWarn: false,
  hooks: {
    "build:done": async () => {
      await fs.copyFile("./package.json", "dist/package.json");
      await fs.copyFile("./readme.md", "./dist/readme.md");
      await fs.copyFile("./LICENCE", "./dist/LICENCE");
    },
  },
});
