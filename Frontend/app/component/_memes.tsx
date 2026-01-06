"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type MediaType = "image" | "video";

export default function Memes({ identifier }: { identifier: string }) {
  const [src, setSrc] = useState<string>("");
  const [type, setType] = useState<MediaType>("image");
  const [loading, setLoading] = useState<boolean>(true);
  const [funniList, setFunniList] = useState<string[]>([]);
  const [currentFunniIndex, setCurrentFunniIndex] = useState<number>(-1);
  const abortRef = useRef<AbortController | null>(null);

  function getPreviousMeme() {
    if (currentFunniIndex == -1){
      return;
    }
    else {
      // Decrease the funni index to show the previous meme
      setCurrentFunniIndex((prevIndex) => (prevIndex - 1 + funniList.length) % funniList.length);
    }

    setSrc(funniList[currentFunniIndex]);
  }

  const getNewMeme = async () => {
    setLoading(true);

    // cancel any in-flight request (prevents race conditions)
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    // If funni index is not at the end of the list, just move forward in the list
    if (currentFunniIndex < funniList.length - 1) {
      useEffect(() => {
        setCurrentFunniIndex((prevIndex) => prevIndex + 1);
        setSrc(funniList[currentFunniIndex + 1]);
        setLoading(false);
      }, []);
      return;
    }

    try {
      const res = await fetch(
        `/api/getMeme?id=${encodeURIComponent(identifier)}&rand=${Math.random()}`,
        { signal: ac.signal, cache: "no-store" }
      );

      if (!res.ok) throw new Error(`meta fetch failed: ${res.status}`);

      const data = (await res.json()) as { url: string; type: MediaType };
      setType(data.type);
      setSrc(data.url);
      setFunniList((prevList) => [...prevList, data.url]);
      setCurrentFunniIndex((prevIndex) => prevIndex + 1);
    } catch (e: unknown) {
      const isAbort = e instanceof DOMException && e.name === "AbortError";
      if (!isAbort) {
        console.error(e);
        setSrc("");
        setLoading(false);
      }
    }
  };

  // Load exactly once on first mount + cleanup on unmount
  useEffect(() => {
    getNewMeme();
      return () => abortRef.current?.abort();
  }, []);

  return (
    <div className="rand-memes">
      <h1 className="meme-title">Funni pictures</h1>

      <div
        style={{
          width: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
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
              unoptimized
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

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={getPreviousMeme} disabled={loading || currentFunniIndex <= 0}>
            Previous funni picture
          </button>
          <button onClick={getNewMeme} disabled={loading}>
            Another funni picture
          </button>
        </div>
      </div>
    </div>
  );
}