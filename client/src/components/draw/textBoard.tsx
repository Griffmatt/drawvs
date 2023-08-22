import { useGameContext } from "~/context/gameContext";
import { useEffect, useState } from "react";
import { socket } from "~/assets/socket";
import type { Image } from "~/assets/types";
import DoneButton from "~/components/UI/doneButton";
import { CanvasLayout } from "../UI/CanvasLayout";
import { Canvas } from "../UI/canvas";

interface Props {
  image: Image;
  userId: string;
}

export default function TextBoard({ image, userId }: Props) {
  const { dispatchGame } = useGameContext();
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const roundDone = () => {
      const imageData = { ...image, prompt: prompt, userId: userId };
      dispatchGame({
        type: "image",
        data: imageData,
      });
      socket.emit("send-image", imageData);
    };
    socket.on("round-done", roundDone);
    return () => {
      socket.off("round-done", roundDone);
    };
  }, [dispatchGame, image, prompt, userId]);

  return (
    <>
      {image.image ? (
        <>
          <CanvasLayout>
            <div className="h-[80%] w-full">
            <Canvas image={image.image} />
            </div>
          </CanvasLayout>
          <div className="flex justify-between">
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
            <DoneButton />
          </div>
        </>
      ) : (
        <>
          <CanvasLayout>
            <div className="flex h-[80%] w-full flex-col justify-center gap-10 rounded-b-2xl bg-black/30 p-10 text-center">
              {image.image && <canvas className="absolute z-20" />}
              <h2>Write a prompt for someone to draw!</h2>
              <input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
            </div>
          </CanvasLayout>
          <div className="flex justify-end">
            <DoneButton />
          </div>
        </>
      )}
    </>
  );
}


