import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Shortenr</title>
        <meta name="description" content="Shorten any web link for free" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div>Hi</div>
      </main>
    </>
  );
}
