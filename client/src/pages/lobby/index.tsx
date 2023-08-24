import React, { useEffect } from "react";
import { useRouter } from "next/router";
import BackButton from "~/components/UI/backButton";
import { socket } from "~/assets/socket";
import { GAME_MODES } from "~/assets/gameModes";
import { useGameContext } from "~/context/gameContext";
import { UserList } from "~/components/userList";
import type { GameInfo } from "~/assets/types/game";

export default function Lobby() {
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
    dispatchGame({
      type: "reset-game",
      data: null,
    });
  }, [dispatchGame]);

  const handleGameChange = (gameInfo: GameInfo) => {
    dispatchGame({
      type: "gameInfo",
      data: gameInfo,
    });
    socket.emit("game-change", gameInfo);
  };

  const startGame = () => {
    if (isAdmin) {
      socket.emit("starting-game");
    }
  };

  return (
    <>
      <div className="flex h-full flex-col justify-center gap-2">
        <div className="flex justify-between">
          <BackButton />
          {isAdmin && (
            <button
              className="w-fit rounded border-4 border-black/20 bg-white/20 px-10 py-4 hover:bg-white/10"
              onClick={startGame}
            >
              <h4>Start</h4>
            </button>
          )}
        </div>
        <h2 className="h-fit">Lobby</h2>
        <div className="flex gap-2 overflow-hidden">
          <UserList />
          <div className="aspect[5/4] col-span-2 w-[67%] rounded bg-black/20 p-4">
            <h3>Game Modes</h3>
            <div className="grid gap-2">
              {GAME_MODES.map((gameInfo) => {
                return (
                  <button
                    className={`flex justify-center rounded bg-white/20 p-6 align-middle hover:bg-white/10 ${
                      gameInfo.name === game.name ? "border-2 border-white" : ""
                    }`}
                    key={gameInfo.name}
                    onClick={() => handleGameChange(gameInfo)}
                    disabled={!isAdmin}
                  >
                    <h4>{gameInfo.name}</h4>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
