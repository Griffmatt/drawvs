import React from "react";
import { useState } from "react";
import { Canvas } from "~/components/UI/canvas";
import BackButton from "~/components/UI/doneButton";
import { UserList } from "~/components/userList";
import { useGameContext } from "~/context/gameContext";
import type { Image } from "~/assets/types";

export default function Show() {
  const { game } = useGameContext();
  const [index, setIndex] = useState(0);

  const images = game.images[index]?.images;

  if (!images) return;

  return (
    <>
      <div className="flex flex-col gap-4">
        <BackButton />
        <h2>Showcase</h2>
        <div className="grid grid-cols-3 gap-8">
          <UserList userId={game.images[index]?.userId} />
          <div className="col-span-2 rounded bg-black/20 p-4 aspect-square">
            <h2>Drawvs</h2>
            <ImagesShown setIndex={setIndex} images={images} />
          </div>
        </div>
      </div>
    </>
  );
}

interface ImagesShownProps {
  images: Image[];
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ImagesShown = ({ setIndex, images }: ImagesShownProps) => {
  const [imageIndex, setImageIndex] = useState(0);

  const handleNextSet = () => {
    setImageIndex(0);
    setIndex((prev) => prev + 1);
  };

  const handleNext = () => {
    setImageIndex((prev) => prev + 1);
  };
  return (
    <>
      <div className="overflow-y-scroll">
        {images.map((image, index) => {
          if (index > imageIndex + 1) return;
          if (index > imageIndex)
            return <button onClick={handleNext}>...</button>;
          if (index % 2 === 0) return <div key={image.id}>{image.prompt}</div>;
          return (
            <div key={image.id} className="aspect-[5/4] w-full">
              <Canvas image={image.image} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-end">
        {imageIndex === images.length - 1 && (
          <button
            onClick={handleNextSet}
            className="h-fit rounded bg-black/20 p-4"
          >
            next set
          </button>
        )}
      </div>
    </>
  );
};
