"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type MediaType = "image" | "video";

export default function Memes({ identifier }: { identifier: string }) {
  const [src, setSrc] = useState<string>("");
  const [type, setType] = useState<MediaType>("image");
  const [loading, setLoading] = useState<boolean>(true);
  const abortRef = useRef<AbortController | null>(null);

  const getNewMeme = async () => {
    setLoading(true);

    // cancel any in-flight request (prevents race conditions)
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch(
        `/api/getMeme?id=${encodeURIComponent(identifier)}&rand=${Math.random()}`,
        { signal: ac.signal, cache: "no-store" }
      );

      if (!res.ok) throw new Error(`meta fetch failed: ${res.status}`);

      const data = (await res.json()) as { url: string; type: MediaType };
      setType(data.type);
      setSrc(data.url);
      // loading will turn false on media events below
    } catch (e) {
      const isAbort =
      e instanceof DOMException && e.name === "AbortError";

    if (!isAbort) {
      console.error(e);
      setSrc("");
      setLoading(false);
    }
    }
  };

  useEffect(() => {
    getNewMeme();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier]);

  return (
    <div className="rand-memes">
      <h1 className="meme-title">Funni pictures</h1>

      <div style={{ position: "relative", width: 500, height: 500 }}>
        {type === "video" ? (
          <video
            key={src}
            src={src}
            controls
            width={500}
            height={500}
            autoPlay
            loop
            preload="metadata"
            onLoadStart={() => setLoading(true)}
            onWaiting={() => setLoading(true)}
            onCanPlay={() => setLoading(false)}
            onPlaying={() => setLoading(false)}
            onError={() => setLoading(false)}
            style={{marginBottom: 45 }}
          />
        ) : (
          <Image
            key={src}
            src={src}
            alt="Random Meme"
            width={500}
            height={500}
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
            // Add margin to bottom 20px
            style={{marginBottom: 45 }}
          />
        )}

        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              background: "rgba(0,0,0,0.35)",
              color: "white",
              fontSize: 18,
              borderRadius: 8,
            }}
          >
            Loading…
          </div>
        )}
      </div>

      <br />
      <button onClick={getNewMeme} disabled={loading}>
        Another funni picture
      </button>
    </div>
  );
}