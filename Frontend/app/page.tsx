"use client";
import Mainpage from "./component/_main";
import Tututudu from "./component/_max";
import Loading from "./component/_loading";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";

export default function Home() {
  const [showMax, setShowMax] = useState(false);
  const [decided, setDecided] = useState(false);
  let max: boolean | null = null ;

  try{
        const searchParams = useSearchParams();
        max = searchParams.get('max') === 'true';
    }
    catch{
        console.error("Error while parsing max :(");
    }

  useEffect(() => {
    const random = Math.random();
    setShowMax(random < 0.3);
    setDecided(true);
  }, []);

  if (!decided) return(
    <Loading />
  )
  if (max !== null && max === true) {
    return <Tututudu />;
  }

  return showMax ? <Tututudu /> : <Mainpage />;
}
