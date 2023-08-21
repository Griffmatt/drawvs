import { useGameContext } from "~/context/gameContext";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { socket } from "~/assets/socket";
import type { Image, Lines } from "~/assets/types";
import DoneButton from "~/components/doneButton";
import { useRedraw } from "~/hooks/useRedraw";
import { CanvasLayout } from "./UI/CanvasLayout";

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
            <Canvas image={image.image} />
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

interface Canvas {
  image: Lines;
}

const Canvas = ({ image }: Canvas) => {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { canvasRef } = useRedraw(image, dimensions.width, dimensions.height);

  useLayoutEffect(() => {
    const container = containerRef.current;

    const updateSize = () => {
      setDimensions({
        height: container?.offsetHeight ?? 0,
        width: container?.offsetWidth ?? 0,
      });
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return (
    <>
      <div className="h-[80%] w-full rounded-b-2xl" ref={containerRef}>
        <canvas
          className="absolute z-20 bg-white"
          height={dimensions.height}
          width={dimensions.width}
          ref={canvasRef}
        />
      </div>
    </>
  );
};
