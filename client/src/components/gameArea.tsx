import { useGameContext } from "~/context/gameContext";
import DrawingBoard from "./drawingBoard";
import DoneButton from "~/components/doneButton";
import ToolSelector from "~/components/toolSelector";
import LineFadeTools from "~/components/lineFadeTools";
import ColorSelector from "~/components/colorSelector";
import TextBoard from "./textBoard";
import { socket } from "~/assets/socket";
import type { ReactNode } from "react";

export default function GameArea() {
  const { game } = useGameContext();
  const id = socket.id;
  const index = game.users.findIndex((user) => user.id === id);

  const length = game.users.length;
  const userIndex = index + game.round - 1;
  const offSet = userIndex >= length ? userIndex - length : userIndex;
  const user = game.users[offSet];
  const image = user?.images[game.round - 1];

  if (!image || !user) return;

  return (
    <>
      {game.round % 2 === 0 ? (
        <>
          <div className="flex flex-col justify-center text-center">
            <ColorSelector />
          </div>
          <div className="col-span-5 grid gap-2">
            <Layout prompt={image.prompt} round={game.round}>
              <DrawingBoard image={image} userId={user.id} />
              <div className="flex justify-between">
                <LineFadeTools />
                <DoneButton />
              </div>
            </Layout>
          </div>
          <div className="flex flex-col justify-center text-center">
            <ToolSelector />
          </div>
        </>
      ) : (
        <div className="col-span-5 col-start-2 grid gap-2">
          <Layout round={game.round}>
            <TextBoard image={image} userId={user.id} />
          </Layout>
        </div>
      )}
    </>
  );
}

interface Layout {
  children: ReactNode;
  prompt?: string;
  round: number
}

const Layout = ({ children, prompt, round }: Layout) => {
  return (
    <div className="aspect-[5/4] w-full">
      <div className="flex h-[20%] flex-col items-center justify-center gap-2 rounded-t bg-black/20">
        <h2>DRAWVS</h2>
        {round % 2 === 0 ? <h3>{prompt}</h3> : <h3>Describe this image!</h3>}
      </div>
      {children}
    </div>
  );
};
