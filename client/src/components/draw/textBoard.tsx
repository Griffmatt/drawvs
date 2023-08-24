import { useGameContext } from "~/context/gameContext";
import { useEffect, useState } from "react";
import { socket } from "~/assets/socket";
import type { Image } from "~/assets/types/types";
import DoneButton from "~/components/UI/doneButton";
import { CanvasLayout } from "../UI/CanvasLayout";
import { Canvas } from "../UI/canvas";

interface Props {
  image: Image;
  userId: string;
  round: number;
  roundType: string;
}

export default function TextBoard({ image, userId, round, roundType }: Props) {
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
      setPrompt("")
    };
    socket.on("round-done", roundDone);
    return () => {
      socket.off("round-done", roundDone);
    };
  }, [dispatchGame, image, prompt, userId]);

  const message = getMessage(round, roundType);

  if (round === 1 || roundType === "story") {
    return (
      <>
        <CanvasLayout message={image.prompt}>
          <div className="flex h-[80%] w-full flex-col justify-center gap-10 rounded-b-2xl bg-black/30 p-10 text-center">
            {image.image && <canvas className="absolute z-20" />}
            <h2>{message}</h2>
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
    );
  }

  return (
    <>
      <CanvasLayout message={message}>
        <div className="h-[80%] w-full">
          {image.image && <Canvas image={image.image} />}
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
  );
}

const getMessage = (round: number, roundType: string) => {
  if (roundType === "story") {
    if (round === 1) {
      return "Write the first part of the story!";
    }
    return "Continue the story!";
  }
  if (roundType === "prompt") {
    if (round === 1) {
      return "Write a prompt for someone to draw!";
    }
    return "Describe the image";
  }
  return "";
};
