"use client";

import Image from "next/image";
import ReCaptcha from "./_captcha";
import { useState, useEffect, useRef } from "react";

export default function Tututudu() {
    const [maxShowed, setMaxShowed] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const showMax = () => {
        // After 5 seconds (if not already handled in ReCaptcha)
        setTimeout(() => {
        setMaxShowed(true);
        }, 3000);
    };

    useEffect(() => {
    if (maxShowed && audioRef.current) {
      // try to play the sound
      audioRef.current.play().catch((err: unknown) => {
        // safely log unknown catch value
        console.warn("Autoplay blocked:", err);
      });
    }
  }, [maxShowed]);

  return maxShowed ? (
    <div className="max-box">
      <Image
        src="/Images/maxbottom.jpg"
        alt="Kýbl"
        width={600}
        height={480}
      />
      <audio ref={audioRef} src="/Audio/maxaudio.mp3" loop />
    </div>
  ) : (
    <ReCaptcha maxShowed={maxShowed} showMax={showMax} />
  );
}