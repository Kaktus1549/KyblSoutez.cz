"use client";

import Image from "next/image";
import { useState } from "react";
import Memes from "./_memes";

export default function Mainpage() {
    const [counter, setCounter] = useState<number | string>(0);

    // Increment counter, if counter is bigger than 255, set to "Fu*ck numbers"
    const incrementCounter = () => {
        setCounter((prevCounter) => {
            if (typeof prevCounter === "number") {
                if (prevCounter >= 255) {
                    return "Fu*ck numbers";
                }
                return prevCounter + 1;
            }
            return prevCounter;
        });
    };

    return (
        <>
            <div className="meme">
                <Image className="meme-img" src="/Images/Kybl.png" alt="Kýbl" width={250} height={250} />
                <Image className="meme-img" src="/Images/Soutez.png" alt="Soutěž" width={250} height={250} />
            </div>
            <div className="meme-main">
                <h1 className="meme-title">KýblSoutěž</h1>
                <p className="meme-text">Please do not confuse with KyberSoutěž, this is a completely different thing!!!!! We are heavily specialized in organizing bucket challanges. Join our cult of bucket lovers and pray that our lord and savior The Big Kýbl will bless us with his wisdom. And remember you all, The Big Kýbl sees us all.</p>
                <Memes />

                <h1 className="meme-title">Button clicker</h1>
                <p className="meme-text">This doesn&apos;t have any meaning, just click the button as hard as you can.</p>
                <div className="meme-cont">
                    <a>Hehe counter goes brrrr: <span id="counter">{counter}</span></a>
                    <button id="increment-btn" onClick={incrementCounter}>Brrrrr</button>
                </div>
                <div className="meme-footer">
                    <p>Powered by <a href="https://kaktusgame.eu">sheer will</a></p>
                </div>
            </div>
        </>
    );
}