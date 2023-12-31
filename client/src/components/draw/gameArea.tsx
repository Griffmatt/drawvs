import { useGameContext } from "~/context/gameContext";
import DrawingBoard from "./drawingBoard";
import DoneButton from "~/components/UI/doneButton";
import ToolSelector from "~/components/draw/toolSelector";
import LineFadeTools from "~/components/draw/lineFadeTools";
import ColorSelector from "~/components/draw/colorSelector";
import TextBoard from "./textBoard";
import { CanvasLayout } from "../UI/CanvasLayout";
import { socket } from "~/assets/socket";
import type { Game } from "~/assets/types/game";
import { getRoundType } from "~/helpers/getRoundType";

export default function GameArea() {
  const { game } = useGameContext();
  const id = socket.id;
  const roundType = getRoundType(game.game.rotation, game.round);
  const { image, userImages, animationImage } = getImages(game, id, roundType);


  if (!image || !userImages || !roundType) return;

  if (roundType === "draw" || roundType === "animation") {
    return (
      <>
        <div className="flex flex-col justify-center text-center">
          <ColorSelector />
        </div>
        <div className="col-span-5 grid gap-2">
          <CanvasLayout message={image.prompt}>
            <DrawingBoard image={image} userId={userImages.userId} animationImage={animationImage} />
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
    );
  }

  if (roundType === "prompt" || roundType === "story") {
    return (
      <div className="col-span-5 col-start-2 grid gap-2">
        <TextBoard image={image} userId={userImages.userId} round={game.round} roundType={roundType} />
      </div>
    );
  }
}

const getImages = (game: Game, id: string, roundType?: string) => {
  const { users, images, round } = game;
  const index = users.findIndex((user) => user.id === id);
  let animationImage

  const length = users.length;
  const userIndex = index + round - 1;
  const offSet = userIndex >= length ? userIndex - (length * (Math.floor(userIndex / length))) : userIndex;
  const userImages = images[offSet];
  const image = userImages?.images[game.round - 1];

  if(roundType === "animation"){
    animationImage = userImages?.images[game.round-2]?.image
  }

  return { image, userImages, animationImage};
};


