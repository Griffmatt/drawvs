import Head from "next/head";
import { type ReactNode } from "react";
import { GameContextProvider } from "~/context/gameContext";
import { ToolsContextProvider } from "~/context/toolsContext";
import { UserContextProvider } from "~/context/userContext";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Drawvs</title>
        <meta name="description" content="AI Powered Drawing Game" />
        <link rel="icon" href="/Drawvs.svg" />
      </Head>
      <UserContextProvider>
        <ToolsContextProvider>
          <GameContextProvider>
            <main className="grid h-screen place-items-center bg-gradient-to-bl from-indigo-800 via-purple-800 to-pink-800">
              <div className="h-fit w-full max-w-[90rem] flex-grow rounded-2xl p-6">
                {children}
              </div>
            </main>
          </GameContextProvider>
        </ToolsContextProvider>
      </UserContextProvider>
    </>
  );
}
