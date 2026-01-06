import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const id_map: Record<string, string[]> = {};

function pickMeme(files: string[], identifier: string) {
  if (!identifier) {
    return files[Math.floor(Math.random() * files.length)];
  }

  if (!(identifier in id_map) || id_map[identifier].length === 0) {
    id_map[identifier] = [...files];
  }

  const arr = id_map[identifier];
  const idx = Math.floor(Math.random() * arr.length);
  const meme = arr[idx];
  arr.splice(idx, 1);
  return meme;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const identifier = url.searchParams.get("id") || "";

  const memesFolder = path.join(process.cwd(), "public", "memes");
  const files = await fs.readdir(memesFolder);

  if (files.length === 0) {
    return new Response("No memes found", { status: 404 });
  }

  const filename = path.basename(pickMeme(files, identifier));
  const ext = path.extname(filename).toLowerCase();

  const type = ext === ".mp4" ? "video" : "image";

  // add cache buster so each selection is a unique URL in the browser cache
  const publicUrl = `/memes/${encodeURIComponent(filename)}?v=${Math.random()}`;

  return Response.json(
    { url: publicUrl, type },
    { headers: { "Cache-Control": "no-store" } }
  );
}
