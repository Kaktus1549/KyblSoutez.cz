"use client";
import Mainpage from "./component/_main";
import Tututudu from "./component/_max";
import Loading from "./component/_loading";
import { useEffect, useState } from "react";

export default function Home() {
  const [showMax, setShowMax] = useState(false);
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    const random = Math.random();
    setShowMax(random < 0.3);
    setDecided(true);
  }, []);

  if (!decided) return(
    <Loading />
  )

  return showMax ? <Tututudu /> : <Mainpage />;
}
