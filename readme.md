# Vite PostCSS TreeShake Build Plugin

## Installation

```bash
npm i -D vite-postcss-tsb
```

## Usages

```js
// vite.config.js
import { defineConfig } from "vite";
import { vitePostCSSTreeShakeBuild } from "vite-postcss-tsb";
export default defineConfig({
  plugins: [
    vitePostCSSTreeShakeBuild({
      src: "src/assets/theme",
      outDir: "dist/theme",
    }),
  ],
});
```

## Options

| Option     | Required | Description                         |
| ---------- | -------- | ----------------------------------- |
| src        | Yes      | Entry directory of css              |
| outDir     | Yes      | Output root Directory               |
| plugins    | No       | Array of PostCSS plugins            |
| extensions | No       | Array of file extensions to process |
