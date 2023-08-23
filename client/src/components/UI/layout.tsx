import Head from "next/head";
import { useLayoutEffect, type ReactNode, useState } from "react";
import { GameContextProvider } from "~/context/gameContext";
import { ToolsContextProvider } from "~/context/toolsContext";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const [width, setWidth] = useState(1024);
  useLayoutEffect(() => {
    const updateSize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <>
      <Head>
        <title>Drawvs</title>
        <meta name="description" content="AI Powered Drawing Game" />
        <link rel="icon" href="/Drawvs.svg" />
      </Head>
      <ToolsContextProvider>
        <GameContextProvider>
          <main className="flex h-screen justify-center items-center bg-gradient-to-bl from-indigo-800 via-purple-800 to-pink-800">
            {width >= 1024 ? (
              <div className="h-full w-full max-w-[100rem] rounded-2xl p-6">
                {children}
              </div>
            ) : (
              <p className="text-center">
                Drawvs is best enjoyed on screens 1024 or larger!
              </p>
            )}
          </main>
        </GameContextProvider>
      </ToolsContextProvider>
    </>
  );
}
