import React, { useEffect, useState } from "react";

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
    <div className="relative grid h-full grid-cols-7 gap-6 p-6">
      <GameArea />
      <h2 className="absolute left-10 top-0">
        {game.round}/{game.rounds}
      </h2>
      <h2 className="absolute right-10 top-0">{time}</h2>
    </div>
  );
}
