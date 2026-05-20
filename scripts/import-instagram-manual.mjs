#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse as parseCsv } from "csv-parse/sync";

const CATEGORY_ALIASES = new Map([
  ["beach ceremony", "ceremony"],
  ["wedding ceremony", "ceremony"],
  ["ceremonia", "ceremony"],
  ["beach reception", "reception"],
  ["wedding reception", "reception"],
  ["pareja", "portraits"],
  ["couple portraits", "portraits"],
  ["bridal portraits", "portraits"],
  ["event details", "details"],
  ["decor details", "details"]
]);

function normalizeString(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function toSlug(value) {
  return normalizeString(value).replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-");
}

export function mapInstagramCategory(rawCategory) {
  const normalized = normalizeString(rawCategory);

  if (!normalized) {
    return "general";
  }

  const mappedAlias = CATEGORY_ALIASES.get(normalized);
  if (mappedAlias) {
    return mappedAlias;
  }

  if (normalized.includes("ceremony")) return "ceremony";
  if (normalized.includes("reception")) return "reception";
  if (normalized.includes("portrait")) return "portraits";
  if (normalized.includes("detail")) return "details";
  if (normalized.includes("party")) return "party";
  if (normalized.includes("cenote")) return "cenote";
  if (normalized.includes("beach")) return "beach";

  return toSlug(normalized) || "general";
}

function parseSortOrder(value) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function firstNonEmpty(values) {
  for (const value of values) {
    const normalized = String(value ?? "").trim();
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

export function normalizeInstagramRow(row) {
  const title = firstNonEmpty([row.title, row.caption, row.headline]) ?? "Instagram post";
  const permalink = String(row.permalink ?? "").trim();

  return {
    _type: "galleryItem",
    title,
    category: mapInstagramCategory(row.category),
    instagramPermalink: permalink,
    source: "instagram",
    isFeatured: false,
    sortOrder: parseSortOrder(row.sortOrder)
  };
}

export function parseInstagramCsv(content) {
  const parsed = parseCsv(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true
  });

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed;
}

function parseRows(content, extension) {
  if (extension === ".json") {
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      throw new Error("JSON input must be an array of rows.");
    }
    return parsed;
  }

  return parseInstagramCsv(content);
}

function parseCliArgs(argv) {
  const args = {
    dryRun: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    const next = argv[i + 1];

    if (current === "--input" && next) {
      args.input = next;
      i += 1;
      continue;
    }

    if (current === "--output" && next) {
      args.output = next;
      i += 1;
      continue;
    }

    if (current === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (current === "--help" || current === "-h") {
      args.help = true;
      continue;
    }

    throw new Error(`Unknown argument: ${current}`);
  }

  return args;
}

function printUsage() {
  console.log(`Manual Instagram import helper

Usage:
  node scripts/import-instagram-manual.mjs --input <file.csv|file.json> [--output <file.json>] [--dry-run]

Examples:
  node scripts/import-instagram-manual.mjs --input ./data/instagram.csv --dry-run
  node scripts/import-instagram-manual.mjs --input ./data/instagram.csv --output ./data/gallery-import.json
`);
}

function defaultOutputPath(inputPath) {
  return inputPath.replace(/\.(csv|json)$/iu, ".gallery-import.json");
}

export async function runManualInstagramImport(argv = process.argv.slice(2)) {
  const args = parseCliArgs(argv);

  if (args.help || !args.input) {
    printUsage();
    return args.help ? 0 : 1;
  }

  const inputPath = resolve(args.input);
  const extension = extname(inputPath).toLowerCase();
  if (extension !== ".csv" && extension !== ".json") {
    throw new Error("Input file must end with .csv or .json");
  }

  const rawContent = await readFile(inputPath, "utf8");
  const rows = parseRows(rawContent, extension);
  const mapped = rows.map(normalizeInstagramRow);

  if (args.dryRun) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          totalRows: mapped.length,
          preview: mapped.slice(0, 3)
        },
        null,
        2
      )
    );
    return 0;
  }

  const outputPath = resolve(args.output ?? defaultOutputPath(inputPath));
  await writeFile(outputPath, `${JSON.stringify(mapped, null, 2)}\n`, "utf8");

  console.log(`Wrote ${mapped.length} records to ${outputPath}`);
  return 0;
}

function isMainModule() {
  if (!process.argv[1]) {
    return false;
  }

  return import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
}

if (isMainModule()) {
  runManualInstagramImport().then((exitCode) => {
    if (exitCode !== 0) {
      process.exit(exitCode);
    }
  }).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
