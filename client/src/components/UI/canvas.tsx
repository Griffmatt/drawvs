import { useState, useRef, useLayoutEffect } from "react";

interface Props {
  image: HTMLImageElement;
}

export const Canvas = ({ image }: Props) => {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (image.complete) {
      ctx?.clearRect(0, 0, dimensions.width, dimensions.height);
      ctx?.drawImage(image, 0, 0, dimensions.width, dimensions.height);
      return
    }
    image.onload = () => {
      ctx?.clearRect(0, 0, dimensions.width, dimensions.height);
      ctx?.drawImage(image, 0, 0, dimensions.width, dimensions.height);
    };
  }, [dimensions.height, dimensions.width, image]);

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
      <div className="h-full w-full rounded-b-2xl" ref={containerRef}>
        <canvas
          className="bg-white"
          height={dimensions.height}
          width={dimensions.width}
          ref={canvasRef}
        />
      </div>
    </>
  );
};
