import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [isShortened, setIsShortened] = useState(false);

  return (
    <>
      <Head>
        <title>Shortenr</title>
        <meta name="description" content="Shorten any web link for free" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-[url('/bg.webp')] font-nunito">
        {/* Header */}
        <div className="absolute top-10 text-5xl font-bold">Shortenr</div>
        {/* Content */}
        <div>
          <form className="flex gap-1">
            <input
              type="text"
              className="w-80 rounded-md bg-transparent px-2 py-1 shadow-2xl outline outline-1 backdrop-blur-2xl hover:shadow-black focus:shadow-black"
            />
            <button
              className="w-32 rounded-md border-none bg-black px-3 py-2 text-white shadow-lg"
              type="submit"
            >
              Shorten
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
