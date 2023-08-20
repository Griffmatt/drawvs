import React, { useEffect } from "react";
import { useRouter } from "next/router";
import BackButton from "~/components/backButton";
import { socket } from "~/assets/socket";
import { GAME_MODES } from "~/assets/gameModes";
import { useGameContext } from "~/context/gameContext";

export default function Lobby() {
  const router = useRouter();
  const { game, dispatchGame } = useGameContext();
  console.log(game.users)
  const filler = Array.from({ length: 8 - game.users.length }, () => "Empty");
  const isAdmin = game.users.filter((user) => user.id === socket.id)[0]
    ?.isAdmin;

    useEffect(() => {
      if (game.users.length=== 0) {
        void router.replace("/");
      }
    }, [game.users.length, router]);

  const handleGameChange = (mode: string) => {
    dispatchGame({
      type: "gameName",
      data: mode,
    });
    socket.emit("game-change",  mode );
  };

  const kickPlayer = (id: string) => {
    socket.emit("kick-player", id);
    const users = game.users.filter((user) => user.id !== id);
    dispatchGame({
      type: "users",
      data: users,
    });
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
          <div className="grid gap-2 rounded  bg-black/20 p-4">
            <h3 className="text-center">Players {game.users.length}/8</h3>
            {game.users.map((player) => {
              return (
                <div
                  className="flex items-center justify-between gap-3 rounded bg-black/10 p-4"
                  key={player.id}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-black/50 text-center"></div>
                    <h4>{player.name}</h4>
                  </div>
                  {player.isAdmin ? (
                    <div className="h-6 w-6 rounded-full bg-yellow-600" />
                  ) : (
                    isAdmin && (
                      <button
                        className="h-6 w-6 rounded-full bg-red-500"
                        onClick={() => kickPlayer(player.id)}
                      />
                    )
                  )}
                </div>
              );
            })}
            {filler.map((player, index) => {
              return (
                <div
                  className="flex items-center gap-3 rounded bg-black/10 p-4"
                  key={index}
                >
                  <div className="h-10 w-10 rounded-full bg-black/50 text-center"></div>
                  <h4>{player}</h4>
                </div>
              );
            })}
          </div>
          <div className="col-span-2 rounded  bg-black/20 p-4">
            <h3>Game Modes</h3>
            <div className="grid gap-2">
              {GAME_MODES.map((mode) => {
                console.log();
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
