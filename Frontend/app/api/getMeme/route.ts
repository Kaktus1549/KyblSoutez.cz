import { promises as fs } from 'fs';
import path from 'path';

export const GET = async () => {
  const memesFolder = path.join(process.cwd(), 'public', 'memes');

  try {
    const files = await fs.readdir(memesFolder);

    if (files.length === 0) {
      return new Response('No memes found', { status: 404 });
    }

    const randomIndex = Math.floor(Math.random() * files.length);
    const randomMeme = files[randomIndex];

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
  } catch (error) {
    console.error(error);
    return new Response('Failed to read memes folder', { status: 500 });
  }
};