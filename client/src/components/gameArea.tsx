import { useGameContext } from "~/context/gameContext";
import DrawingBoard from "./drawingBoard";
import DoneButton from "~/components/doneButton";
import ToolSelector from "~/components/toolSelector";
import LineFadeTools from "~/components/lineFadeTools";
import ColorSelector from "~/components/colorSelector";
import TextBoard from "./textBoard";
import { CanvasLayout } from "./UI/CanvasLayout";
import { socket } from "~/assets/socket";

export default function GameArea() {
  const { game } = useGameContext();
  const id = socket.id;
  const index = game.users.findIndex((user) => user.id === id);

  const length = game.users.length;
  const userIndex = index + game.round - 1;
  const offSet = userIndex >= length ? userIndex - length : userIndex;
  const userImages = game.images[offSet];
  const image = userImages?.images[game.round - 1];

  if (!image || !userImages) return;

  return (
    <>
      {game.round % 2 === 0 ? (
        <>
          <div className="flex flex-col justify-center text-center">
            <ColorSelector />
          </div>
          <div className="col-span-5 grid gap-2">
            <CanvasLayout prompt={image.prompt}>
              <DrawingBoard image={image} userId={userImages.userId} />
            </CanvasLayout>
            <div className="flex justify-between">
              <LineFadeTools />
              <DoneButton />
            </div>
          </div>
          <div className="flex flex-col justify-center text-center">
            <ToolSelector />
          </div>
        </>
      ) : (
        <div className="col-span-5 col-start-2 grid gap-2">
          <TextBoard image={image} userId={userImages.userId} />
        </div>
      )}
    </>
  );
}
