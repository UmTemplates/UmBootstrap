// Issue #332: move Image feature values from the old `image` alias to
// `featurePropertyFeatureImage` in the uSync content files.
//
// Two cases:
//   rename  - the value is still there under `image`
//   restore - the block's values were wiped in March 2026 (c6a62a5, e0e8e53).
//             The original values text is copied from git history, then renamed.
//
// Dry run by default. Writes only with --apply. Use --limit N to stage.
//
//   node planning/workflows/bulk-edits/fix_feature_image_alias.mjs
//   node planning/workflows/bulk-edits/fix_feature_image_alias.mjs --apply --limit 1

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const FEATURE_IMAGE_KEY = "dfab01ba-2429-4be9-a894-3c6c4c49df94";
const OLD = "image";
const NEW = "featurePropertyFeatureImage";

// Last commits before each wipe, newest first.
const RESTORE_FROM = ["c6a62a5", "0522410"];

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const contentDir = join(root, "Umbootstrap.Web/uSync/v17/Content");

function gitShow(commit, file) {
  try {
    return execSync(`git show ${commit}:Umbootstrap.Web/uSync/v17/Content/${file}`, {
      cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1e8,
    });
  } catch {
    return null;
  }
}

// Index of the "]" closing the "[" at `open`, skipping brackets inside strings.
function closeBracket(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      for (i++; i < text.length && text[i] !== '"'; i++) if (text[i] === "\\") i++;
    } else if (c === "[") depth++;
    else if (c === "]" && --depth === 0) return i;
  }
  return -1;
}

// Raw text of a block's values array, e.g. `[\n {...}\n ]`, or null.
function rawValues(text, blockKey) {
  const keyAt = text.indexOf(`"key": "${blockKey}"`);
  if (keyAt < 0) return null;
  const open = text.indexOf("[", text.indexOf(`"values":`, keyAt));
  const close = closeBracket(text, open);
  return close < 0 ? null : text.slice(open, close + 1);
}

// Find the block's original values in history, as raw text and parsed.
function historicValues(file, blockKey) {
  for (const commit of RESTORE_FROM) {
    const old = gitShow(commit, file);
    const raw = old && rawValues(old, blockKey);
    if (!raw) continue;
    const parsed = JSON.parse(raw);
    if (parsed.length && parsed.every((v) => v.alias === OLD)) return { commit, raw, parsed };
  }
  return null;
}

const apply = process.argv.includes("--apply");
const limitArg = process.argv.indexOf("--limit");
const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : Infinity;

// Every block object (has contentTypeKey + values) anywhere in the JSON.
function* blocks(node) {
  if (Array.isArray(node)) for (const n of node) yield* blocks(n);
  else if (node && typeof node === "object") {
    if (typeof node.contentTypeKey === "string" && Array.isArray(node.values)) yield node;
    for (const v of Object.values(node)) yield* blocks(v);
  }
}

// The uSync property values that hold JSON, as { start, end, json }.
function jsonValues(text) {
  const out = [];
  const re = /<!\[CDATA\[(\{[\s\S]*?\})\]\]>/g;
  let m;
  while ((m = re.exec(text))) {
    try {
      out.push({ start: m.index + 9, end: m.index + 9 + m[1].length, json: JSON.parse(m[1]) });
    } catch {
      // Not JSON: leave it alone.
    }
  }
  return out;
}

// Rename, by text, the `"alias": "image"` line inside each matching block.
// Each block is located by its unique "key", so nested blocks cannot confuse it.
function fixValue(file, raw, json, report) {
  let text = raw;
  for (const b of blocks(json)) {
    if (b.contentTypeKey === FEATURE_IMAGE_KEY && b.values.length === 0) {
      const hist = historicValues(file, b.key);
      if (!hist) {
        report.empty.push(`block ${b.key}: empty, no history to restore`);
        continue;
      }
      const at = text.indexOf(`"key": "${b.key}"`);
      const emptyAt = text.indexOf(`"values": []`, at);
      const restored = hist.raw.replaceAll(`"alias": "${OLD}"`, `"alias": "${NEW}"`);
      text = text.slice(0, emptyAt) + `"values": ${restored}` + text.slice(emptyAt + `"values": []`.length);
      report.restored.push({ key: b.key, commit: hist.commit, values: hist.parsed });
      continue;
    }
    const aliases = b.values.map((v) => v.alias);
    if (!aliases.includes(OLD)) continue;
    if (b.contentTypeKey !== FEATURE_IMAGE_KEY) {
      report.skipped.push(`block ${b.key}: '${OLD}' on another element type ${b.contentTypeKey}`);
      continue;
    }
    if (aliases.includes(NEW)) {
      report.skipped.push(`block ${b.key}: has both '${OLD}' and '${NEW}'`);
      continue;
    }
    const keyAt = text.indexOf(`"key": "${b.key}"`);
    const aliasAt = text.indexOf(`"alias": "${OLD}"`, keyAt);
    const nextBlock = text.indexOf(`"contentTypeKey"`, keyAt);
    if (keyAt < 0 || aliasAt < 0 || (nextBlock > -1 && aliasAt > nextBlock)) {
      report.skipped.push(`block ${b.key}: could not locate alias in text`);
      continue;
    }
    text = text.slice(0, aliasAt) + `"alias": "${NEW}"` + text.slice(aliasAt + `"alias": "${OLD}"`.length);
    report.renamed++;
  }
  return text;
}

// Prove the only changes are the renames and the restores, nothing else.
function verify(before, after, restored) {
  const b = JSON.parse(before);
  const a = JSON.parse(after);
  for (const blk of blocks(b)) {
    if (blk.contentTypeKey !== FEATURE_IMAGE_KEY) continue;
    const r = restored.find((x) => x.key === blk.key);
    if (r) blk.values = structuredClone(r.values);
    for (const v of blk.values) if (v.alias === OLD) v.alias = NEW;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

const files = readdirSync(contentDir).filter((f) => f.endsWith(".config")).sort();
let changedFiles = 0;
let total = 0;
let totalRestored = 0;
const allSkipped = [];
const allEmpty = [];

for (const file of files) {
  if (changedFiles >= limit) break;
  const path = join(contentDir, file);
  const original = readFileSync(path, "utf8");
  const values = jsonValues(original);
  const report = { renamed: 0, restored: [], skipped: [], empty: [] };

  let updated = original;
  // Work backwards so earlier offsets stay valid.
  for (const v of [...values].reverse()) {
    const raw = updated.slice(v.start, v.end);
    const before = report.restored.length;
    const fixed = fixValue(file, raw, v.json, report);
    if (fixed !== raw) {
      if (!verify(raw, fixed, report.restored.slice(before))) {
        console.error(`STOP: ${file} verification failed, nothing written.`);
        process.exit(1);
      }
      updated = updated.slice(0, v.start) + fixed + updated.slice(v.end);
    }
  }

  allSkipped.push(...report.skipped.map((s) => `${file}: ${s}`));
  allEmpty.push(...report.empty.map((s) => `${file}: ${s}`));
  if (report.renamed === 0 && report.restored.length === 0) continue;

  changedFiles++;
  total += report.renamed;
  totalRestored += report.restored.length;
  const parts = [];
  if (report.renamed) parts.push(`renamed ${report.renamed}`);
  for (const r of report.restored) parts.push(`restored ${r.key.slice(0, 8)} from ${r.commit}`);
  console.log(`${apply ? "WROTE" : "would change"}  ${file.padEnd(46)} ${parts.join(", ")}`);
  if (apply) writeFileSync(path, updated, "utf8");
}

console.log(`\n${apply ? "Applied" : "Dry run"}: ${total} renamed, ${totalRestored} restored, in ${changedFiles} files.`);
if (allSkipped.length) {
  console.log(`\nSkipped (${allSkipped.length}):`);
  for (const s of allSkipped) console.log(`  ${s}`);
}
if (allEmpty.length) {
  console.log(`\nLeft empty, nothing in history (${allEmpty.length}):`);
  for (const s of allEmpty) console.log(`  ${s}`);
}
