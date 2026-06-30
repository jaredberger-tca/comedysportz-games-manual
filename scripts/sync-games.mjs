import fs from "node:fs/promises";
import { parse } from "csv-parse/sync";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvggrRBGFSel_DZjmc2XNNdKG75BKa2avV4uzGpRyBNEpOFnccG-C6gQeC6ubUUNeYqBTXg44ETqYB/pub?gid=2006290001&single=true&output=csv";

console.log("🎭 Syncing ComedySportz Games...");

const response = await fetch(CSV_URL);

if (!response.ok) {
  throw new Error(`Failed to fetch Google Sheet: ${response.status}`);
}

const csv = await response.text();

const records = parse(csv, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

const games = records
  .filter((game) => game.game_name && game.slug)
  .map((game) => ({
    id: game.game_id,
    manualOrder: Number(game.manual_order),
    title: game.game_name,
    slug: game.slug,
    type: game.type,
    group: game.type,
    category: game.category,
    refereeIntroduction: game.referee_intro,
    description: game.description,
    alternateNames: game.alternate_names,
    variations: game.variations,
    sourcePages: game.source_pages,
    reviewStatus: game.review_status,
    publishStatus: game.publish_status,
    specialNote: game.notes,
  }));

await fs.writeFile("./src/data/games.json", JSON.stringify(games, null, 2));

console.log(`✅ Wrote ${games.length} games to src/data/games.json`);