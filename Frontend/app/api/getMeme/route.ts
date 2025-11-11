import { promises as fs } from 'fs';
import path from 'path';

const id_map: { [key: string]: string[] } = {};

// If ID not in map file, create new <id> : <array of memes>
// When request with ID comes, return random meme from that array and remove it from array
// If array is empty, refill it with all memes again

export const GET = async (request: Request) => {
  const memesFolder = path.join(process.cwd(), 'public', 'memes');
  let identifier = ''; // Get identifier from request, if there is any
  const url = new URL(request.url);
  identifier = url.searchParams.get('id') || '';
  try {
    const files = await fs.readdir(memesFolder);

    if (files.length === 0) {
      return new Response('No memes found', { status: 404 });
    }
    if (identifier == '') {
    const randomIndex = Math.floor(Math.random() * files.length);
    const randomMeme = files[randomIndex];

    // Read the meme file as a buffer (sanitize filename to prevent path traversal)
    const safeName = path.basename(randomMeme);
    const memePath = path.join(memesFolder, safeName);
    const normalized = path.resolve(memePath);
    const root = path.resolve(memesFolder) + path.sep;
    if (!normalized.startsWith(root)) {
      console.error('Attempt to access file outside memes directory:', randomMeme);
      return new Response('Invalid file', { status: 400 });
    }
    const memeBuffer = await fs.readFile(memePath);

    // Determine content type (basic version)
    const ext = path.extname(randomMeme).toLowerCase();
    const contentType =
      ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : ext === '.png'
        ? 'image/png'
        : ext === '.gif'
        ? 'image/gif'
        : ext === '.mp4'
        ? 'video/mp4'
        : 'application/octet-stream';

    // Return the image as binary data
    return new Response(new Uint8Array(memeBuffer), {
      headers: {
        'Content-Type': contentType,
      },
    });
    } else {
      if (!(identifier in id_map) || id_map[identifier].length === 0) {
        id_map[identifier] = [...files];
      }
      const memesArray = id_map[identifier];
      const randomIndex = Math.floor(Math.random() * memesArray.length);
      const randomMeme = memesArray[randomIndex];
      // Remove selected meme from array
      memesArray.splice(randomIndex, 1);

      // Read the meme file as a buffer
      const memePath = path.join(memesFolder, randomMeme);
      const memeBuffer = await fs.readFile(memePath);

      // Determine content type (basic version)
      const ext = path.extname(randomMeme).toLowerCase();
      const contentType =
        ext === '.jpg' || ext === '.jpeg'
          ? 'image/jpeg'
          : ext === '.png'
          ? 'image/png'
          : ext === '.gif'
          ? 'image/gif'
          : 'application/octet-stream';

      // Return the image as binary data
      return new Response(new Uint8Array(memeBuffer), {
        headers: {
          'Content-Type': contentType,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return new Response('Failed to read memes folder', { status: 500 });
  }
};