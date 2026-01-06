"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type MediaType = "image" | "video";
type MemeMeta = { url: string; type: MediaType };

export default function Memes({ identifier }: { identifier: string }) {
  const [src, setSrc] = useState("");
  const [type, setType] = useState<MediaType>("image");
  const [loading, setLoading] = useState(true);

  const [funniList, setFunniList] = useState<MemeMeta[]>([]);
  const [currentFunniIndex, setCurrentFunniIndex] = useState(-1);

  const abortRef = useRef<AbortController | null>(null);

  // Refs that always hold the latest values (avoids stale closures / dependency loops)
  const funniRef = useRef<MemeMeta[]>([]);
  const indexRef = useRef<number>(-1);

  useEffect(() => {
    funniRef.current = funniList;
  }, [funniList]);

  useEffect(() => {
    indexRef.current = currentFunniIndex;
  }, [currentFunniIndex]);

  const showAtIndex = useCallback((idx: number) => {
    const item = funniRef.current[idx];
    if (!item) return;

    setLoading(true);
    setCurrentFunniIndex(idx);
    setType(item.type);
    setSrc(item.url);
  }, []);

  const getPreviousMeme = useCallback(() => {
    const idx = indexRef.current;
    if (idx <= 0) return;
    showAtIndex(idx - 1);
  }, [showAtIndex]);

  const getNewMeme = useCallback(async () => {
    setLoading(true);

    // cancel any in-flight request
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    // If we already have a "next" meme in history, just go forward
    const idx = indexRef.current;
    const list = funniRef.current;

    if (idx >= 0 && idx < list.length - 1) {
      showAtIndex(idx + 1);
      return;
    }

    try {
      const res = await fetch(
        `/api/getMeme?id=${encodeURIComponent(identifier)}&rand=${Math.random()}`,
        { signal: ac.signal, cache: "no-store" }
      );

      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);

      const data = (await res.json()) as MemeMeta;

      setFunniList((prev) => {
        const next = [...prev, data];
        funniRef.current = next;
        return next;
      });

      setCurrentFunniIndex((prevIdx) => {
        const nextIdx = prevIdx + 1;
        indexRef.current = nextIdx;
        return nextIdx;
      });

      setType(data.type);
      setSrc(data.url);
      // loading will switch off via onLoad/onCanPlay handlers
    } catch (e: unknown) {
      const isAbort = e instanceof DOMException && e.name === "AbortError";
      if (!isAbort) {
        console.error(e);
        setSrc("");
        setLoading(false);
      }
    }
  }, [identifier, showAtIndex]);

  // Load ONCE when component mounts (no infinite loop)
  useEffect(() => {
    getNewMeme();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              unoptimized
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
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
