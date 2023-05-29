"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vitePostCSSTreeShakeBuild = exports.buildCSSLibrary = void 0;
const fs = require("fs/promises");
const path = require("path");
const postcss_1 = require("postcss");
const postcss_preset_env_1 = require("postcss-preset-env");
// import { createRequire } from "node:module";
// const require = createRequire(import.meta.url);
async function buildCSSLibrary(inputDirectory, outputDirectory, plugins) {
    const files = await readDirectory(inputDirectory);
    const outputPath = path.resolve(outputDirectory);
    await Promise.all(files.map(async (file) => {
        const inputFilePath = path.join(inputDirectory, file);
        const outputFilePath = path.join(outputPath, file);
        const fileStats = await getFileStats(inputFilePath);
        if (fileStats.isDirectory()) {
            await createDirectory(outputFilePath);
            await buildCSSLibrary(inputFilePath, outputFilePath, plugins);
        }
        else if (fileStats.isFile() && path.extname(file) === ".css") {
            const inputCSS = await readFile(inputFilePath);
            const outputCSS = await processCSS(inputCSS, plugins);
            await writeFile(outputFilePath, outputCSS);
        }
    }));
}
exports.buildCSSLibrary = buildCSSLibrary;
async function readDirectory(directoryPath) {
    try {
        const files = await fs.readdir(directoryPath);
        return files;
    }
    catch (error) {
        throw new Error(`Error reading directory: ${directoryPath}`);
    }
}
async function getFileStats(filePath) {
    try {
        const stats = await fs.stat(filePath);
        return stats;
    }
    catch (error) {
        throw new Error(`Error getting file stats: ${filePath}`);
    }
}
async function createDirectory(directoryPath) {
    try {
        await fs.mkdir(directoryPath, { recursive: true });
    }
    catch (error) {
        throw new Error(`Error creating directory: ${directoryPath}`);
    }
}
async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath, "utf8");
        return data;
    }
    catch (error) {
        throw new Error(`Error reading file: ${filePath}`);
    }
}
async function writeFile(filePath, content) {
    try {
        await fs.writeFile(filePath, content, "utf8");
    }
    catch (error) {
        throw new Error(`Error writing file: ${filePath}`);
    }
}
async function processCSS(css, plugins) {
    // const postcss = require("postcss");
    const postcssPlugins = plugins || [postcss_preset_env_1.default];
    const result = await (0, postcss_1.default)(postcssPlugins).process(css, {
        from: undefined,
    });
    return result.css;
}
const vitePostCSSTreeShakeBuild = (options) => {
    return {
        name: "vitePostCSSTreeShakeBuild",
        buildEnd() {
            buildCSSLibrary(options.src, options.outDir, options.plugins);
        },
    };
};
exports.vitePostCSSTreeShakeBuild = vitePostCSSTreeShakeBuild;
