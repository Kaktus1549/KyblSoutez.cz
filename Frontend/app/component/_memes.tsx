"use client";
import Image from "next/image";
import { useState } from "react";

export default function Memes() {
  const [memeUrl, setMemeUrl] = useState("/api/getMeme");
  const identifier = Math.random() < 0.5 ? 'user123' : ''; // Example identifier logic

  const getNewMeme = () => {
    // Add random query param to bypass browser cache
    setMemeUrl(`/api/getMeme?rand=${Math.random()}&id=${identifier}`);
  };

  return (
    <div className="rand-memes">
      <h1 className="meme-title">Funni pictures</h1>

      <Image
        key={memeUrl}
        src={memeUrl}
        alt="Random Meme"
        width={500}
        height={500}
      />

      <br />
      <button
        onClick={getNewMeme}
      >
        Another funni picture
      </button>
    </div>
  );
}
