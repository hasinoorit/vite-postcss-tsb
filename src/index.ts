import type { Plugin } from "vite";
import type { Stats } from "fs";
import type { AcceptedPlugin } from "postcss";
import * as fs from "fs/promises";
import * as path from "path";
import postcss from "postcss";
import postcssPresetEnv from "postcss-preset-env";
// import { createRequire } from "node:module";

// const require = createRequire(import.meta.url);

export async function buildCSSLibrary(
  inputDirectory: string,
  outputDirectory: string,
  plugins?: AcceptedPlugin[]
): Promise<void> {
  const files = await readDirectory(inputDirectory);
  const outputPath = path.resolve(outputDirectory);

  await Promise.all(
    files.map(async (file) => {
      const inputFilePath = path.join(inputDirectory, file);
      const outputFilePath = path.join(outputPath, file);

      const fileStats = await getFileStats(inputFilePath);
      if (fileStats.isDirectory()) {
        await createDirectory(outputFilePath);
        await buildCSSLibrary(inputFilePath, outputFilePath, plugins);
      } else if (fileStats.isFile() && path.extname(file) === ".css") {
        const inputCSS = await readFile(inputFilePath);
        const outputCSS = await processCSS(inputCSS, plugins);
        await writeFile(outputFilePath, outputCSS);
      }
    })
  );
}

async function readDirectory(directoryPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(directoryPath);
    return files;
  } catch (error) {
    throw new Error(`Error reading directory: ${directoryPath}`);
  }
}

async function getFileStats(filePath: string): Promise<Stats> {
  try {
    const stats = await fs.stat(filePath);
    return stats;
  } catch (error) {
    throw new Error(`Error getting file stats: ${filePath}`);
  }
}

async function createDirectory(directoryPath: string): Promise<void> {
  try {
    await fs.mkdir(directoryPath, { recursive: true });
  } catch (error) {
    throw new Error(`Error creating directory: ${directoryPath}`);
  }
}

async function readFile(filePath: string): Promise<string> {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (error) {
    throw new Error(`Error reading file: ${filePath}`);
  }
}

async function writeFile(filePath: string, content: string): Promise<void> {
  try {
    await fs.writeFile(filePath, content, "utf8");
  } catch (error) {
    throw new Error(`Error writing file: ${filePath}`);
  }
}

async function processCSS(
  css: string,
  plugins?: AcceptedPlugin[]
): Promise<string> {
  // const postcss = require("postcss");
  const postcssPlugins = plugins || [postcssPresetEnv];
  const result = await postcss(postcssPlugins).process(css, {
    from: undefined,
  });
  return result.css;
}

interface VitePCTSB {
  src: string;
  outDir: string;
  plugins?: AcceptedPlugin[];
}

export const vitePostCSSTreeShakeBuild = (options: VitePCTSB): Plugin => {
  return {
    name: "vitePostCSSTreeShakeBuild",

    buildEnd() {
      buildCSSLibrary(options.src, options.outDir, options.plugins);
    },
  };
};
