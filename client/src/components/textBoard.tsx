import { useGameContext } from "~/context/gameContext";
import { useEffect, useState } from "react";
import { socket } from "~/assets/socket";
import type { Image } from "~/assets/types";

interface Props {
  image: Image;
  userId: string;
}

export default function TextBoard({ image, userId }: Props) {
  const { game, dispatchGame } = useGameContext();
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const roundDone = () => {
      dispatchGame({
        type: "image",
        data: { ...image, prompt: prompt, userId: userId },
      });
      socket.emit("send-image", { ...image, prompt: prompt });
    };
    socket.on("round-done", roundDone);
    return () => {
      socket.off("round-done", roundDone);
    };
  }, [dispatchGame, image, prompt, userId]);

  return (
    <div className="flex h-[80%] w-full flex-col justify-center gap-10 rounded-b-2xl bg-black/30 p-10 text-center">
      <h2>
        {game.round === 1
          ? "Write a prompt for someone to draw!"
          : "Describe this image"}
      </h2>
      <input
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
      />
    </div>
  );
}
