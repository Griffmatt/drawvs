import React, { useEffect } from "react";
import { useState } from "react";
import { Canvas } from "~/components/UI/canvas";
import BackButton from "~/components/UI/backButton";
import { UserList } from "~/components/userList";
import { useGameContext } from "~/context/gameContext";
import type { Image } from "~/assets/types";
import { useRouter } from "next/router";
import { socket } from "~/assets/socket";

export default function Show() {
  const router = useRouter();
  const { game } = useGameContext();
  const [index, setIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  const images = game.images[index]?.images;

  const isAdmin =
    game.users.filter((user) => user.id === socket.id)[0]?.isAdmin ?? false;

  useEffect(() => {
    if (game.users.length === 0) {
      void router.replace("/");
    }
  }, [game.users.length, router]);

  const handleNextSet = () => {
    setImageIndex(0);
    setIndex((prev) => prev + 1);
    socket.emit("next-set");
  };

  useEffect(() => {
    const nextSet = () => {
      setImageIndex(0);
      setIndex((prev) => prev + 1);
    };

    const nextImage = () => {
      setImageIndex((prev) => prev + 1);
    };

    socket.on("next-set-res", nextSet);
    socket.on("next-image-res", nextImage);

    return () => {
      socket.off("next-set-res", nextSet);
      socket.off("next-image-res", nextImage);
    };
  }, []);

  if (!images) return;

  return (
    <>
      <div className="flex flex-col gap-4">
        <BackButton />
        <h2>Showcase</h2>
        <div className="grid grid-cols-3 gap-8">
          <UserList userId={game.images[index]?.userId} />
          <div className="col-span-2 aspect-[5/4] rounded bg-black/20 p-4">
            <h2>Drawvs</h2>
            <ImagesShown
              setImageIndex={setImageIndex}
              imageIndex={imageIndex}
              images={images}
              isAdmin={isAdmin}
            />
          </div>
          <div className="col-span-full flex justify-end">
            {imageIndex === images.length - 1 && (
              <button
                onClick={handleNextSet}
                className="h-fit rounded bg-black/20 p-4"
                disabled={!isAdmin}
              >
                next set
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

interface ImagesShownProps {
  images: Image[];
  imageIndex: number;
  setImageIndex: React.Dispatch<React.SetStateAction<number>>;
  isAdmin: boolean;
}

const ImagesShown = ({
  setImageIndex,
  imageIndex,
  images,
  isAdmin,
}: ImagesShownProps) => {
  const handleNext = () => {
    setImageIndex((prev) => prev + 1);
    socket.emit("next-image");
  };
  return (
    <div className="flex h-full flex-col gap-2 overflow-y-scroll p-4">
      {images.map((image, index) => {
        if (index > imageIndex + 1) return;
        if (index > imageIndex)
          return (
            <button
              onClick={handleNext}
              disabled={!isAdmin}
              className="h-fit w-fit rounded bg-white/30 px-4 py-2"
            >
              ...
            </button>
          );
        if (index % 2 === 0)
          return (
            <div
              key={image.id}
              className="h-fit w-fit rounded bg-white/30 px-4 py-2"
            >
              {image.prompt}
            </div>
          );
        return (
          <div key={image.id} className="aspect-[5/3.2]">
            {image.image && <Canvas image={image.image} />}
          </div>
        );
      })}
    </div>
  );
};
