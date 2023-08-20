import { useGameContext } from "~/context/gameContext";
import DrawingBoard from "./drawingBoard";
import TextBoard from "./textBoard";
import { socket } from "~/assets/socket";

export default function GameArea() {
  const { game } = useGameContext();
  const id = socket.id;
  const index = game.users.findIndex((user) => user.id === id);

  const length = game.users.length;
  const userIndex = index + game.round - 1;
  const offSet = userIndex >= length ? userIndex - length : userIndex;
  const user = game.users[offSet];
  if (user?.images[0] === undefined) return;
  const image = { ...user.images[0], userId: user.id };

  return (
    <div className="aspect-[5/4] w-full">
      <div className="flex h-[20%] flex-col items-center justify-center gap-2 rounded-t bg-black/20">
        <h2>DRAWVS</h2>
        {game.round % 2 === 0 && <h3>{image.prompt}</h3>}
      </div>
      {game.round % 2 === 0 ? (
        <DrawingBoard image={image} />
      ) : (
        <TextBoard image={image} />
      )}
    </div>
  );
}
