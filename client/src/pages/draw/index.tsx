import React, { useEffect, useState } from "react";

import DoneButton from "~/components/doneButton";
import ToolSelector from "~/components/toolSelector";
import LineFadeTools from "~/components/lineFadeTools";
import ColorSelector from "~/components/colorSelector";
import { useRouter } from "next/router";
import { useGameContext } from "~/context/gameContext";
import GameArea from "~/components/gameArea";
import { socket } from "~/assets/socket";

export default function Draw() {
  const router = useRouter();
  const { game, dispatchGame } = useGameContext();
  const [time, setTime] = useState(60);

  useEffect(() => {
    if (game.users.length === 0) {
      void router.replace("/");
    }
  }, [game.users.length, router]);

  useEffect(() => {
    const nextRound = () => {
      setTime(60);
      dispatchGame({
        type: "round",
        data: 1,
      });
    };

    socket.on("round-done", nextRound);
    return () => {
      socket.off("round-done", nextRound);
    };
  }, [dispatchGame, setTime]);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setTime((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          socket.emit("done");
          return 0;
        }),
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="grid h-full grid-cols-7 gap-6 p-6">
      <div className="flex flex-col justify-center text-center">
        <h2>1/{game.rounds}</h2>
        <ColorSelector />
      </div>
      <div className="col-span-5 grid gap-2">
        <GameArea />
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
