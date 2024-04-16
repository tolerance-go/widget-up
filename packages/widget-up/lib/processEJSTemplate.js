// ejsTemplateProcessor.js

import fs from "fs-extra";
import path from "path";
import ejs from "ejs";

export async function processEJSTemplate(
  templatePath,
  outputPath,
  templateData
) {
  try {
    const data = await fs.readFile(templatePath, "utf8");
    const rendered = ejs.render(data, templateData);
    await fs.outputFile(outputPath, rendered);
    console.log(`EJS template processed and file created at: ${outputPath}`);
  } catch (error) {
    console.error("Error processing EJS template:", error);
    throw error; // Rethrow to ensure Rollup knows the process failed.
  }
}