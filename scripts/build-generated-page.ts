#!/usr/bin/env node
import { buildGeneratedPage } from "./generated-page/build.ts";
const [inputDirectory, workDirectory, outputDirectory, ...extra] =
  process.argv.slice(2);
if (!inputDirectory || !workDirectory || !outputDirectory || extra.length) {
  console.error(
    "Usage: pnpm build:generated-page INPUT_DIRECTORY WORK_DIRECTORY OUTPUT_DIRECTORY",
  );
  process.exitCode = 2;
} else {
  try {
    const artifact = await buildGeneratedPage({
      inputDirectory,
      workDirectory,
      outputDirectory,
    });
    console.log(
      JSON.stringify({
        archivePath: artifact.archivePath,
        build_hash: artifact.build_hash,
        routes: artifact.receipt.routes,
      }),
    );
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Generated page build failed",
    );
    process.exitCode = 1;
  }
}
