import React, { useEffect } from "react";
import { useRouter } from "next/router";
import BackButton from "~/components/UI/backButton";
import { socket } from "~/assets/socket";
import { GAME_MODES } from "~/assets/gameModes";
import { useGameContext } from "~/context/gameContext";
import { UserList } from "~/components/userList";

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

  const handleGameChange = (mode: string) => {
    dispatchGame({
      type: "gameName",
      data: mode,
    });
    socket.emit("game-change", mode);
  };

  const startGame = () => {
    if (isAdmin) {
      socket.emit("starting-game");
    }
  };

  return (
    <>
      <div className="grid gap-4">
        <BackButton />
        <h2 className="h-fit">Lobby</h2>
        <div className="grid grid-cols-3 gap-8">
          <UserList />
          <div className="col-span-2 rounded  bg-black/20 p-4">
            <h3>Game Modes</h3>
            <div className="grid gap-2">
              {GAME_MODES.map((mode) => {
                return (
                  <button
                    className={`flex justify-center rounded bg-white/20 p-10 align-middle hover:bg-white/10 ${
                      mode.name === game.name ? "border-2 border-white" : ""
                    }`}
                    key={mode.name}
                    onClick={() => handleGameChange(mode.name)}
                    disabled={!isAdmin}
                  >
                    <h4>{mode.name}</h4>
                  </button>
                );
              })}
            </div>
          </div>
          {isAdmin && (
            <button
              className="col-span-full col-start-2 w-full bg-black/30 p-4"
              onClick={startGame}
            >
              <h3>Start</h3>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
