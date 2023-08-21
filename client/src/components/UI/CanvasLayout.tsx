import type { ReactNode } from "react";
import { useGameContext } from "~/context/gameContext";

interface Props {
    children: ReactNode;
    prompt?: string;
  }

export const CanvasLayout = ({ children, prompt }: Props) => {
    const { game } = useGameContext()
    return (
      <div className="aspect-[5/4] w-full">
        <div className="flex h-[20%] flex-col items-center justify-center gap-2 rounded-t bg-black/20">
          <h2>DRAWVS</h2>
          {game.round % 2 === 0 ? <h3>{prompt}</h3> : <h3>Describe this image!</h3>}
        </div>
        {children}
      </div>
    );
  };
  