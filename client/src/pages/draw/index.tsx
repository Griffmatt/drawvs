import React, { useEffect, useState } from "react";

import DoneButton from "~/components/doneButton";
import DrawingBoard from "~/components/drawingBoard";
import ToolSelector from "~/components/toolSelector";
import LineFadeTools from "~/components/lineFadeTools";
import ColorSelector from "~/components/colorSelector";
import { useRouter } from "next/router";
import { useUserContext } from "~/context/userContext";
import { useGameContext } from "~/context/gameContext";

export default function Draw() {
  const router = useRouter();
  const { name } = useUserContext();
  const { game } = useGameContext();
  const [time, setTime] = useState(60);

  useEffect(() => {
    if (name === "") {
      void router.replace("/");
    }
  }, [name, router]);

  useEffect(() => {
    const interval = setInterval(() => setTime((prev) => prev - 1), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid h-full grid-cols-7 gap-6 p-6">
      <div className="flex flex-col justify-center text-center">
        <h2>1/{game.rounds}</h2>
        <ColorSelector />
      </div>
      <div className="col-span-5 grid gap-2">
        <div className="aspect-[5/4] w-full">
          <div className="flex h-[20%] items-center justify-center rounded-t bg-black/20">
            <h2>DRAWVS</h2>
          </div>
          <DrawingBoard />
        </div>
        <div className="flex justify-between">
          <LineFadeTools />
          <DoneButton />
        </div>
      </div>
      <div className="flex flex-col justify-center text-center">
        <h2>{time}</h2>
        <ToolSelector />
      </div>
    </div>
  );
}
