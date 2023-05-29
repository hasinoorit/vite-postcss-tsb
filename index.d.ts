import type { Plugin } from "vite";
import type { AcceptedPlugin } from "postcss";
import postcss from "postcss";
export declare function buildCSSLibrary(
  inputDirectory: string,
  outputDirectory: string,
  plugins?: postcss.AcceptedPlugin[]
): Promise<void>;
interface VitePCTSB {
  src: string;
  outDir: string;
  plugins?: AcceptedPlugin[];
}
export declare const vitePostCSSTreeShakeBuild: (options: VitePCTSB) => Plugin;
export {};
