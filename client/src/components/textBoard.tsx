import { useGameContext } from "~/context/gameContext";
import { useEffect, useState } from "react";
import type { Image } from "~/assets/types";
import { socket } from "~/assets/socket";

interface Props {
  image: {
    userId: string;
    id: number;
    prompt: string;
    image: Image | null;
  };
}

export default function TextBoard({ image }: Props) {
  const { game, dispatchGame } = useGameContext();
  const [input, setInput] = useState("");

  useEffect(() => {
    const roundDone = () => {
      dispatchGame({
        type: "image",
        data: { ...image, prompt: input },
      });
      socket.emit("send-image", { ...image, prompt: input });
    };
    socket.on("round-done", roundDone);
    return () => {
      socket.off("round-done", roundDone);
    };
  }, [dispatchGame, image, input]);

  return (
    <div className="flex h-[80%] w-full flex-col justify-center gap-10 rounded-b-2xl bg-black/30 p-10 text-center">
      <h2>
        {game.round === 1
          ? "Write a prompt for someone to draw!"
          : "Describe this image"}
      </h2>
      <input value={input} onChange={(event) => setInput(event.target.value)} />
    </div>
  );
}
