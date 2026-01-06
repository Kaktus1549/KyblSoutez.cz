"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type MediaType = "image" | "video";
type MemeMeta = { url: string; type: MediaType };

export default function Memes({ identifier }: { identifier: string }) {
  const [src, setSrc] = useState<string>("");
  const [type, setType] = useState<MediaType>("image");
  const [loading, setLoading] = useState<boolean>(true);

  const [funniList, setFunniList] = useState<MemeMeta[]>([]);
  const [currentFunniIndex, setCurrentFunniIndex] = useState<number>(-1);

  const abortRef = useRef<AbortController | null>(null);

  const getNewMeme = useCallback(async () => {
    setLoading(true);

    // cancel any in-flight request (prevents race conditions)
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    // If we already have "next" in history, just move forward
    if (currentFunniIndex >= 0 && currentFunniIndex < funniList.length - 1) {
      const nextIndex = currentFunniIndex + 1;
      const next = funniList[nextIndex];
      setCurrentFunniIndex(nextIndex);
      setType(next.type);
      setSrc(next.url);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/getMeme?id=${encodeURIComponent(identifier)}&rand=${Math.random()}`,
        { signal: ac.signal, cache: "no-store" }
      );

      if (!res.ok) throw new Error(`meta fetch failed: ${res.status}`);

      const data = (await res.json()) as MemeMeta;

      // push into history
      setFunniList((prev) => [...prev, data]);

      // move index to the new last item
      setCurrentFunniIndex((prevIndex) => prevIndex + 1);

      setType(data.type);
      setSrc(data.url);
      // loading will turn false via onLoad/onCanPlay handlers (or keep setLoading(false) if you want)
    } catch (e: unknown) {
      const isAbort = e instanceof DOMException && e.name === "AbortError";
      if (!isAbort) {
        console.error(e);
        setSrc("");
        setLoading(false);
      }
    }
  }, [identifier, currentFunniIndex, funniList]);

  const getPreviousMeme = useCallback(() => {
    if (currentFunniIndex <= 0) return;

    const prevIndex = currentFunniIndex - 1;
    const prev = funniList[prevIndex];
    if (!prev) return;

    setLoading(true);
    setCurrentFunniIndex(prevIndex);
    setType(prev.type);
    setSrc(prev.url);
  }, [currentFunniIndex, funniList]);

  // Load exactly once on first mount + cleanup on unmount
  useEffect(() => {
    getNewMeme();
    return () => abortRef.current?.abort();
  }, [getNewMeme]);

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
