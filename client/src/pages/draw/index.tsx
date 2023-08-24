import React, { useEffect } from "react";

import { useRouter } from "next/router";
import { useGameContext } from "~/context/gameContext";
import GameArea from "~/components/draw/gameArea";
import { socket } from "~/assets/socket";

export default function Draw() {
  const router = useRouter();
  const { game, dispatchGame } = useGameContext();
  const isAdmin = game.users.filter((user) => user.id === socket.id)[0]
    ?.isAdmin;

  useEffect(() => {
    if (game.users.length === 0) {
      void router.replace("/");
    }
  }, [game.users.length, router]);

  useEffect(() => {
    const nextRound = () => {
      if (game.round === game.rounds) {
        void router.replace("/showcase");
        return
      }
      dispatchGame({
        type: "round",
        data: 1,
      });
    };

    socket.on("round-done", nextRound);
    return () => {
      socket.off("round-done", nextRound);
    };
  }, [dispatchGame, game.round, game.rounds, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAdmin) {
        if (game.time === 0) {
          socket.emit("done", isAdmin);
          return;
        }
        dispatchGame({
          type: "time",
          data: game.time - 1,
        });
        socket.emit("update-time", game.time - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatchGame, game.time, isAdmin]);

  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <div className="relative grid grid-cols-7 gap-6">
        <GameArea />
        <h2 className="absolute left-10 top-0">
          {game.round}/{game.rounds}
        </h2>
        <h2 className="absolute right-10 top-0">{game.time}</h2>
      </div>
    </div>
  );
}
