import * as fs from "fs";
import * as path from "path";
import { __dirname } from "../utils/esmPath";

/**
 * Recursively copies a directory
 * @param src Source directory
 * @param dest Destination directory
 * @param ignore List of file/folder names to ignore
 */
function copyDir(src: string, dest: string, ignore: string[] = []): void {
  // Ensure destination exists
  fs.mkdirSync(dest, { recursive: true });

  // Read directory entries
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Ignore specified entries
    if (ignore.includes(entry.name)) {
      console.log(`Skipping "${entry.name}" at "${srcPath}" as it is marked to be ignored.`);
      continue;
    }

    // Recursively copy directories or copy files
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, ignore);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Copies a single file (ensures destination directory exists)
 * @param src Source file
 * @param dest Destination file
 */
function copyFile(src: string, dest: string): void {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

/* ----------------------------------------
   COPY OPERATIONS
---------------------------------------- */

// Copy views directory
const viewsSrc = path.join(__dirname, "..", "views");
const viewsDest = path.join(__dirname, "..", "build", "views");

copyDir(viewsSrc, viewsDest, ["viewsRender"]);

console.log("Views directory copied successfully");
console.log("All files copied successfully");
