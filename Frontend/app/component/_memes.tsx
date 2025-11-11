"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Memes({ identifier }: { identifier: string }) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const blobRef = useRef<string | null>(null);

  // load a media URL, detect content-type and create object URL
  const loadMedia = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      const isVideo = contentType.startsWith("video") || /\.mp4(\?|$)/i.test(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      // revoke previous blob url
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
      blobRef.current = objectUrl;

      setMediaUrl(objectUrl);
      setMediaType(isVideo ? "video" : "image");
    } catch (err) {
      console.error("Failed to load media:", err);
      setMediaUrl(null);
      setMediaType(null);
    }
  };

  const getNewMeme = () => {
    const url = `/api/getMeme?rand=${Math.random()}&id=${encodeURIComponent(
      identifier
    )}`;
    loadMedia(url);
  };

  // load initial meme when identifier changes
  useEffect(() => {
    getNewMeme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, []);

  if (!mediaUrl) {
    return <div>Loading...</div>;
  }

  if (mediaType === null) {
    return <div>Failed to load media. Try again!</div>;
  }

  return (
    <div className="rand-memes">
      <h1 className="meme-title">Funni pictures</h1>

      {mediaType === "video" ? (
        <video key={mediaUrl ?? "video"} src={mediaUrl ?? undefined} controls width={500} autoPlay loop onError={() => setMediaType(null)}></video>
      ) : mediaType === "image" ? (
        <Image key={mediaUrl ?? "img"} src={mediaUrl} alt="Random Meme" width={500} height={500} onError={() => setMediaType("video")} />
      ) : (
        <div>Loading...</div>
      )}

      <br />
      <button onClick={getNewMeme}>Another funni picture</button>
    </div>
  );
}
