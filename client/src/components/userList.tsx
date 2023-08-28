import { useGameContext } from "~/context/gameContext";
import { socket } from "~/assets/socket";

interface Props {
  userId?: string;
  changeUser?: (id: string) => void;
}

export const UserList = ({ userId, changeUser }: Props) => {
  const { game, dispatchGame } = useGameContext();
  const filler = Array.from({ length: 8 - game.users.length }, () => "Empty");
  const isAdmin = game.users.filter((user) => user.id === socket.id)[0]
    ?.isAdmin;

  const kickPlayer = (id: string) => {
    socket.emit("kick-player", id);
    const users = game.users.filter((user) => user.id !== id);
    dispatchGame({
      type: "users",
      data: users,
    });
  };

  const checkChangePlayer = (playerId: string) => {
    if (changeUser) {
      changeUser(playerId);
    }
  };

  return (
    <div className="flex h-full w-[33%] flex-col gap-4 rounded bg-black/20 p-4">
      <h3 className="text-center">Players {game.users.length}/8</h3>
      <div className="flex flex-col gap-2 overflow-y-scroll">
        {game.users.map(player => {
          const isUser = player.id === userId;
          return (
            <div
              className={`flex items-center justify-between gap-3 rounded ${
                isUser ? "bg-black/30" : "bg-black/10"
              } h-fit w-full p-4`}
              key={player.id}
            >
              <button
                className="flex items-center gap-3"
                onClick={() => checkChangePlayer(player.id)}
              >
                <div className="h-14 w-14 rounded-full bg-black/50 text-center"></div>
                <h4>{player.name}</h4>
              </button>
              {player.isAdmin ? (
                <div className="h-8 w-8 rounded-full bg-yellow-600" />
              ) : (
                isAdmin && (
                  <button
                    className="h-8 w-8 rounded-full bg-red-500"
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
              <div className="h-14 w-14 rounded-full bg-black/50 text-center"></div>
              <h4>{player}</h4>
            </div>
          );
        })}{" "}
      </div>
    </div>
  );
};
