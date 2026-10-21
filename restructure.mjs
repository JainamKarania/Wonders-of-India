#!/usr/bin/env node
// Restructures the project into client/ and server/, with feature folders
// inside client/src, and rewrites every relative import.
//
//   node restructure.mjs                 dry run: prints the plan, changes nothing
//   node restructure.mjs --apply         moves files, rewrites imports, patches configs
//   node restructure.mjs --apply --delete-stale
//                                        also deletes known-stale files, but only
//                                        if nothing imports them
//
// Run from the project root, on a clean git branch.

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const APPLY = process.argv.includes("--apply");
const DELETE_STALE = process.argv.includes("--delete-stale");
const FORCE = process.argv.includes("--force");

// ---------------------------------------------------------------- the plan

const C = "client/src";

const FEATURE_MOVES = {
  "src/Components/Navbar.jsx": `${C}/layout/Navbar.jsx`,
  "src/Components/Footer.jsx": `${C}/layout/Footer.jsx`,

  "src/Components/HomeScreen.jsx": `${C}/pages/HomeScreen.jsx`,
  "src/Components/Hero.jsx": `${C}/features/home/Hero.jsx`,
  "src/Components/Destination.jsx": `${C}/features/home/Destination.jsx`,

  "src/Components/Services.jsx": `${C}/components/sections/Services.jsx`,
  "src/Components/Reviews.jsx": `${C}/components/sections/Reviews.jsx`,
  "src/Components/PartnersSponsers.jsx": `${C}/components/sections/PartnersSponsors.jsx`,
  "src/Components/CTA.jsx": `${C}/components/sections/CTA.jsx`,

  "src/Components/itinearies/Itineraries.jsx": `${C}/features/destinations/Itineraries.jsx`,
  "src/Components/ItineraryModal.jsx": `${C}/features/destinations/ItineraryModal.jsx`,
  "src/Components/DestinationCTA.jsx": `${C}/features/destinations/DestinationCTA.jsx`,
  "src/recommendations/RecommendedDestinations.jsx": `${C}/features/destinations/RecommendedDestinations.jsx`,

  "src/booking/BookingForm.jsx": `${C}/features/booking/BookingForm.jsx`,
  "src/booking/BookingHero.jsx": `${C}/features/booking/BookingHero.jsx`,
  "src/Components/BookingsCTA.jsx": `${C}/features/booking/BookingsCTA.jsx`,

  "src/Components/userprofile/SideBar.jsx": `${C}/features/account/SideBar.jsx`,
  "src/Components/userprofile/BookingDetails.jsx": `${C}/features/account/BookingDetails.jsx`,
  "src/Components/userprofile/ChangeTripModal.jsx": `${C}/features/account/ChangeTripModal.jsx`,
  "src/Components/userprofile/UserProfileCTA.jsx": `${C}/features/account/UserProfileCTA.jsx`,
  "src/Components/BookingHistory.jsx": `${C}/features/account/BookingHistory.jsx`,
  "src/Components/transactions/TransactionDetails.jsx": `${C}/features/account/TransactionDetails.jsx`,

  "src/Components/auth/Auth.jsx": `${C}/features/auth/Auth.jsx`,
  "src/Components/context/AuthContext.jsx": `${C}/features/auth/AuthContext.jsx`,
  "src/Components/routes/ProtectedRoute.jsx": `${C}/features/auth/ProtectedRoute.jsx`,

  "src/chat/ChatWidget.jsx": `${C}/features/chat/ChatWidget.jsx`,
  "src/chat/ChatWindow.jsx": `${C}/features/chat/ChatWindow.jsx`,
  "src/chat/useChat.js": `${C}/features/chat/useChat.js`,

  "src/Components/AboutMe.jsx": `${C}/features/about/AboutMe.jsx`,
  "src/Components/AboutUSCTA.jsx": `${C}/features/about/AboutUsCTA.jsx`,

  "src/Components/ContactUs.jsx": `${C}/features/contact/ContactUs.jsx`,
  "src/Components/ContactUsCTA.jsx": `${C}/features/contact/ContactUsCTA.jsx`,

  "src/api/axios.js": `${C}/services/axios.js`,
  "src/api/itineraries.js": `${C}/services/itineraries.js`,
};

// Vercel only treats files under a root-level api/ folder as endpoints, so each
// route's real code moves to server/routes and api/ keeps a one-line wrapper.
const ROUTES = [
  ["api/bookings/index.js", "server/routes/bookings.js", "api/bookings/index.js"],
  ["api/bookings/[id].js", "server/routes/bookingById.js", "api/bookings/[id].js"],
  ["api/chat/index.js", "server/routes/chat.js", "api/chat/index.js"],
  ["api/contact/index.js", "server/routes/contact.js", "api/contact/index.js"],
  ["api/destinations/index.js", "server/routes/destinations.js", "api/destinations/index.js"],
  ["api/itinerary/index.js", "server/routes/itinerary.js", "api/itinerary/index.js"],
  ["api/partners/index.js", "server/routes/partners.js", "api/partners/index.js"],
  ["api/recommedation/index.js", "server/routes/recommendations.js", "api/recommendations/index.js"],
  ["api/reviews/index.js", "server/routes/reviews.js", "api/reviews/index.js"],
  ["api/services/index.js", "server/routes/services.js", "api/services/index.js"],
  ["api/stats/index.js", "server/routes/stats.js", "api/stats/index.js"],
];

const SERVER_LIB = ["api/lib/supabaseAdmin.js", "server/lib/supabaseAdmin.js"];

const STALE = [
  "src/Components/userprofile/EditBookingModal.jsx",
  "src/Components/utils/authStorage.js",
  "src/Components/utils/bookingstorage.js",
  "src/Components/utils/pricing.js",
  "src/App.css",
];

// ---------------------------------------------------------------- helpers

const CODE_EXT = /\.(js|jsx|mjs|cjs|ts|tsx)$/;
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".vercel"]);
const RESOLVE_EXTS = ["", ".js", ".jsx", ".mjs", ".json", ".css"];
const posix = (p) => p.split(path.sep).join("/");
const q = (p) => JSON.stringify(p);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(posix(path.relative(ROOT, full)));
  }
  return out;
}

if (!fs.existsSync(path.join(ROOT, "package.json"))) {
  console.error("Run this from the project root (the folder with package.json).");
  process.exit(1);
}
if (fs.existsSync(path.join(ROOT, "client")) || fs.existsSync(path.join(ROOT, "server"))) {
  console.error("A client/ or server/ folder already exists. Has this already been run?");
  process.exit(1);
}

const allFiles = walk(ROOT).filter((f) => f !== "restructure.mjs");
const exactSet = new Set(allFiles);
const lowerIndex = new Map(allFiles.map((f) => [f.toLowerCase(), f]));
const actual = (rel) => lowerIndex.get(rel.toLowerCase());
const isGit = fs.existsSync(path.join(ROOT, ".git"));

if (APPLY && isGit && !FORCE) {
  const dirty = execSync("git status --porcelain", { cwd: ROOT }).toString().trim();
  if (dirty) {
    console.error("You have uncommitted changes. Commit or stash them first (or pass --force).\n" + dirty);
    process.exit(1);
  }
}

// ---------------------------------------------------------------- import graph

const IMPORT_RE = /(\bfrom\s+|\bimport\s+|\bimport\s*\(\s*)(["'])(\.[^"'\n]*)\2/g;
const ALIAS_RE = /(\bfrom\s+|\bimport\s+|\bimport\s*\(\s*)(["'])(@\/|\/src\/)[^"'\n]*\2/g;

function resolveImport(importerRel, spec) {
  const base = path.posix.normalize(path.posix.join(path.posix.dirname(importerRel), spec));
  const candidates = RESOLVE_EXTS.map((e) => ({ p: base + e, viaDir: false }));
  for (const e of [".js", ".jsx"]) candidates.push({ p: `${base}/index${e}`, viaDir: true });

  for (const c of candidates) {
    const found = actual(c.p);
    if (found) return { file: found, viaDir: c.viaDir, exact: exactSet.has(c.p) };
  }
  return null;
}

const sources = new Map();
for (const f of allFiles.filter((x) => CODE_EXT.test(x))) {
  sources.set(f, fs.readFileSync(path.join(ROOT, f), "utf8"));
}

const importedFiles = new Set();
for (const [file, text] of sources) {
  for (const m of text.matchAll(IMPORT_RE)) {
    const r = resolveImport(file, m[3]);
    if (r) importedFiles.add(r.file);
  }
}

const staleFound = STALE.map(actual).filter(Boolean);
const staleDeletable = staleFound.filter((f) => !importedFiles.has(f));
const staleStillUsed = staleFound.filter((f) => importedFiles.has(f));
const deleting = new Set(DELETE_STALE ? staleDeletable : []);

// ---------------------------------------------------------------- move map

const moveMap = new Map();
const wrappers = [];
const missing = [];

for (const [from, to] of Object.entries(FEATURE_MOVES)) {
  const found = actual(from);
  if (found) moveMap.set(found, to);
  else missing.push(from);
}

for (const [from, to, wrapperAt] of ROUTES) {
  const found = actual(from);
  if (!found) {
    missing.push(from);
    continue;
  }
  moveMap.set(found, to);
  const text = sources.get(found) ?? "";
  wrappers.push({ at: wrapperAt, target: to, hasConfig: /export\s+const\s+config\b/.test(text), from: found });
}

{
  const found = actual(SERVER_LIB[0]);
  if (found) moveMap.set(found, SERVER_LIB[1]);
  else missing.push(SERVER_LIB[0]);
}

for (const f of allFiles) {
  if (moveMap.has(f) || deleting.has(f)) continue;
  if (f.startsWith("src/") || f.startsWith("public/")) moveMap.set(f, `client/${f}`);
  else if (f === "index.html") moveMap.set(f, "client/index.html");
  else if (/^(db|drizzle|data|supabase)\//.test(f)) moveMap.set(f, `server/${f}`);
}

const targets = new Map();
for (const [from, to] of moveMap) {
  if (targets.has(to)) {
    console.error(`Two files would move to ${to}: ${targets.get(to)} and ${from}`);
    process.exit(1);
  }
  targets.set(to, from);
  if (exactSet.has(to) && !moveMap.has(to)) {
    console.error(`Refusing to overwrite existing file: ${to}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------- rewrite imports

const newContents = new Map();
const unresolved = [];
const aliasUses = [];
const crossBoundary = [];
let rewriteCount = 0;

const side = (p) => (p.startsWith("client/") ? "client" : p.startsWith("server/") ? "server" : "root");

for (const [file, original] of sources) {
  if (deleting.has(file)) continue;
  const newImporter = moveMap.get(file) ?? file;

  for (const m of original.matchAll(ALIAS_RE)) aliasUses.push(`${file}: ${m[0].trim()}`);

  const updated = original.replace(IMPORT_RE, (whole, lead, quote, spec) => {
    const resolved = resolveImport(file, spec);
    if (!resolved) {
      unresolved.push(`${file}: ${spec}`);
      return whole;
    }

    const newTarget = moveMap.get(resolved.file) ?? resolved.file;

    const a = side(newImporter);
    const b = side(newTarget);
    if ((a === "client" && b === "server") || (a === "server" && b === "client")) {
      crossBoundary.push(`${newImporter} imports ${newTarget}`);
    }

    const nothingMoved = newImporter === file && newTarget === resolved.file;
    if (nothingMoved && resolved.exact) return whole;

    const targetForSpec = resolved.viaDir ? path.posix.dirname(newTarget) : newTarget;
    let next = path.posix.relative(path.posix.dirname(newImporter), targetForSpec);
    if (!next) next = ".";

    const ext = path.posix.extname(resolved.file).toLowerCase();
    const hadExt = !resolved.viaDir && spec.toLowerCase().endsWith(ext);
    if (!hadExt && !resolved.viaDir) next = next.slice(0, next.length - ext.length);
    if (!next.startsWith(".")) next = `./${next}`;

    if (next === spec) return whole;
    rewriteCount += 1;
    return `${lead}${quote}${next}${quote}`;
  });

  if (updated !== original) newContents.set(file, updated);
}

// ---------------------------------------------------------------- config patches

const patches = [];

function planPatch(file, description, transform) {
  const found = actual(file);
  if (!found) {
    patches.push({ file, description, status: "missing" });
    return;
  }
  const text = fs.readFileSync(path.join(ROOT, found), "utf8");
  const next = transform(text);
  patches.push({ file: found, description, status: next === text ? "nochange" : "ok", next });
}

planPatch("tailwind.config.js", "point content globs at client/", (t) =>
  t
    .replace(/(["'`])\.\/index\.html\1/g, '$1./client/index.html$1')
    .replace(/(["'`])\.\/src\//g, "$1./client/src/")
);

planPatch("vite.config.js", "set root: client, envDir, outDir", (t) => {
  if (/root\s*:\s*["']client["']/.test(t)) return t;
  return t.replace(
    /defineConfig\(\s*\{/,
    'defineConfig({\n  root: "client",\n  envDir: "..",\n  build: { outDir: "../dist", emptyOutDir: true },'
  );
});

planPatch("drizzle.config.js", "point at server/db and server/drizzle", (t) =>
  t
    .replace(/(["'`])\.\/db\//g, "$1./server/db/")
    .replace(/(["'`])\.\/drizzle(?=["'`\/])/g, "$1./server/drizzle")
);

const stringPathHits = [];
const patchedFiles = new Set(patches.filter((p) => p.status === "ok").map((p) => p.file));
for (const [file, text] of sources) {
  if (deleting.has(file) || patchedFiles.has(file)) continue;
  text.split("\n").forEach((line, i) => {
    if (/^\s*(import|export)\b.*\bfrom\b/.test(line)) return;
    if (/["'`](\.{0,2}\/)?(db|drizzle|supabase|data)\/[^"'`]*["'`]/.test(line) && !/import\s*\(/.test(line)) {
      stringPathHits.push(`${file}:${i + 1}: ${line.trim()}`);
    }
  });
}

// ---------------------------------------------------------------- report

const orphans = allFiles.filter(
  (f) =>
    f.startsWith("src/") &&
    /\.(jsx?|css)$/.test(f) &&
    f !== "src/main.jsx" &&
    f !== "src/main.js" &&
    !importedFiles.has(f) &&
    !staleFound.includes(f)
);

console.log(APPLY ? "\n=== APPLYING ===\n" : "\n=== DRY RUN (nothing is changed) ===\n");

const groups = new Map();
for (const [from, to] of moveMap) {
  const dir = path.posix.dirname(to);
  if (!groups.has(dir)) groups.set(dir, []);
  groups.get(dir).push({ from, name: path.posix.basename(to) });
}
console.log(`Files to move: ${moveMap.size}`);
for (const [dir, items] of [...groups].sort()) {
  const renamed = items.filter((i) => path.posix.basename(i.from) !== i.name);
  const names = items.length > 8 ? `${items.length} files` : items.map((i) => i.name).join(", ");
  console.log(`  ${dir}/  ${names}${renamed.length ? `  (renamed: ${renamed.map((i) => path.posix.basename(i.from) + " -> " + i.name).join(", ")})` : ""}`);
}

console.log(`\nImports to rewrite: ${rewriteCount} (in ${newContents.size} files)`);

console.log(`\nVercel wrapper files to create in api/ (${wrappers.length}):`);
wrappers.forEach((w) => console.log(`  ${w.at}  ->  ${w.target}${w.hasConfig ? "  (re-exports config)" : ""}`));

console.log("\nConfig patches:");
for (const p of patches) {
  const label = { ok: "will patch", nochange: "NO CHANGE (edit by hand)", missing: "not found" }[p.status];
  console.log(`  ${p.file}: ${p.description} [${label}]`);
}

if (missing.length) {
  console.log("\nNot found, skipped (already moved or named differently):");
  missing.forEach((f) => console.log(`  ${f}`));
}
if (unresolved.length) {
  console.log("\nImports that could NOT be resolved (broken today, left untouched):");
  unresolved.forEach((u) => console.log(`  ${u}`));
}
if (crossBoundary.length) {
  console.log("\nWARNING: client and server code import each other:");
  [...new Set(crossBoundary)].forEach((u) => console.log(`  ${u}`));
}
if (aliasUses.length) {
  console.log("\nAlias imports found (not rewritten, check your vite alias config):");
  aliasUses.forEach((u) => console.log(`  ${u}`));
}
if (stringPathHits.length) {
  console.log("\nHard-coded paths in code that this script cannot rewrite, check by hand:");
  stringPathHits.forEach((u) => console.log(`  ${u}`));
}
if (staleDeletable.length) {
  console.log(`\nStale files that nothing imports${DELETE_STALE ? " (deleting)" : " (use --delete-stale to remove)"}:`);
  staleDeletable.forEach((f) => console.log(`  ${f}`));
}
if (staleStillUsed.length) {
  console.log("\nLooks stale but is still imported by something, left alone:");
  staleStillUsed.forEach((f) => console.log(`  ${f}`));
}
if (orphans.length) {
  console.log("\nOther files nothing imports (review and delete if unused):");
  orphans.forEach((f) => console.log(`  ${f}`));
}

if (!APPLY) {
  console.log("\nLooks right? Run again with --apply");
  process.exit(0);
}

// ---------------------------------------------------------------- apply

const run = (cmd) => execSync(cmd, { cwd: ROOT, stdio: "pipe" });

for (const [file, content] of newContents) {
  fs.writeFileSync(path.join(ROOT, file), content);
}

if (DELETE_STALE) {
  for (const f of staleDeletable) {
    if (isGit) {
      try {
        run(`git rm -f ${q(f)}`);
        continue;
      } catch {
        /* untracked */
      }
    }
    fs.rmSync(path.join(ROOT, f), { force: true });
  }
}

for (const [from, to] of moveMap) {
  fs.mkdirSync(path.dirname(path.join(ROOT, to)), { recursive: true });
  if (isGit) {
    try {
      run(`git mv ${q(from)} ${q(to)}`);
      continue;
    } catch {
      /* untracked file: plain rename */
    }
  }
  fs.renameSync(path.join(ROOT, from), path.join(ROOT, to));
}

for (const p of patches) {
  if (p.status === "ok") fs.writeFileSync(path.join(ROOT, p.file), p.next);
}

for (const w of wrappers) {
  const rel = path.posix.relative(path.posix.dirname(w.at), w.target);
  const spec = rel.startsWith(".") ? rel : `./${rel}`;
  const body = w.hasConfig
    ? `export { default, config } from "${spec}";\n`
    : `export { default } from "${spec}";\n`;
  fs.mkdirSync(path.dirname(path.join(ROOT, w.at)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, w.at), body);
  if (isGit) {
    try {
      run(`git add ${q(w.at)}`);
    } catch {
      /* ignore */
    }
  }
}

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) removeEmptyDirs(full);
  }
  if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}
for (const d of ["src", "public", "db", "drizzle", "data", "supabase", "api/lib", "api/recommedation"]) {
  removeEmptyDirs(path.join(ROOT, d));
}

console.log("\nDone.");
console.log("Next: run `npm run build`, then `npm run dev` and click through the app.");
console.log("If anything is wrong: git reset --hard");
