import Head from "next/head";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ConfettiExplosion, { ConfettiProps } from "react-confetti-explosion";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import axios from "axios";
import { z } from "zod";

const shortenRequestSchema = z.object({
  url: z.string().url(),
});

const shortenUrl = async (body: z.infer<typeof shortenRequestSchema>) => {
  return await axios.post("/api/shorten", body);
};

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isShortened, setIsShortened] = useState(false);
  const [confettiExploding, setConfettiExploding] = useState(false);

  const confettiProps: ConfettiProps = {
    force: 0.6,
    duration: 2000,
    particleCount: 100,
    width: 1000,
    colors: ["#9A0023", "#FF003C", "#AF739B", "#FAC7F3", "#F7DBF4"],
    onComplete: () => setConfettiExploding(false),
  };

  const shortenMutation = useMutation({
    mutationFn: shortenUrl,
    onSuccess: (data) => {
      console.log(data.data);
      setShortUrl(data.data.shortUrl);
      setIsShortened(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleCopiedToast = () => {
    toast.success("Copied to clipboard!");
  };

  const handleShorten = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const regexWithProtocol = new RegExp(
      "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"
    );
    const regexWithoutProtocol = new RegExp(
      "^([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"
    );

    let longUrl = originalUrl;

    if (regexWithoutProtocol.test(originalUrl)) {
      longUrl = `http://${originalUrl}`;
    }

    if (regexWithProtocol.test(longUrl)) {
      toast.dismiss("shorten");
      toast.promise(
        shortenMutation.mutateAsync({ url: longUrl }),
        {
          loading: "Shortening...",
          success: "Shortened!",
          error: "Failed to shorten",
        },
        {
          id: "shorten",
        }
      );
    } else {
      toast.dismiss("invalid-url");
      toast.error("Enter a valid URL!", {
        id: "invalid-url",
      });
      return;
    }
  };

  return (
    <>
      <Head>
        <title>Shortenr</title>
        <meta name="description" content="Shorten any web link for free" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-[url('/bg.webp')] font-nunito">
        {/* Header */}
        <div className="absolute top-10">
          <h1 className="text-center text-5xl font-bold">Shortenr</h1>
          <h2 className="text-center text-2xl">
            Shorten any web link for free!
          </h2>
        </div>
        {/* Content */}
        <div className="flex flex-col items-center justify-center gap-10">
          <form className="flex gap-1" onSubmit={handleShorten}>
            <input
              type="text"
              className="w-80 rounded-md bg-transparent px-2 py-1 shadow-2xl outline outline-1 backdrop-blur-2xl"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
            <button
              className="w-32 rounded-md bg-black px-3 py-2 text-white shadow-lg"
              type="submit"
            >
              Shorten
            </button>
          </form>
          {isShortened && (
            <div className="w-full rounded-md bg-green-500 p-4 font-bold outline outline-1">
              <CopyToClipboard
                text={shortUrl}
                // @ts-ignore
                className="flex w-full items-center justify-center"
              >
                <button
                  onClick={() => setConfettiExploding(!confettiExploding)}
                >
                  <span className="flex gap-6">
                    <div>{shortUrl}</div>
                    <svg
                      onClick={handleCopiedToast}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 transition-all hover:animate-bounce"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                      />
                    </svg>
                  </span>
                  {confettiExploding && (
                    <ConfettiExplosion {...confettiProps} />
                  )}
                </button>
              </CopyToClipboard>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
