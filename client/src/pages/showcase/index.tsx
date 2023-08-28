import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { Canvas } from "~/components/UI/canvas";
import BackButton from "~/components/UI/backButton";
import { UserList } from "~/components/userList";
import { useGameContext } from "~/context/gameContext";
import type { Image, Rotation } from "~/assets/types/types";
import { useRouter } from "next/router";
import { socket } from "~/assets/socket";
import { getRoundType } from "~/helpers/getRoundType";

export default function Show() {
  const router = useRouter();
  const { game } = useGameContext();
  const [roundIndex, setRoundIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  const images = game.images[roundIndex]?.images;
  const finalImageReached = game.rounds === imageIndex + 1;
  const finalSRoundReached = game.images.length === roundIndex + 1;

  const isAdmin =
    game.users.filter((user) => user.id === socket.id)[0]?.isAdmin ?? false;

  useEffect(() => {
    if (game.users.length === 0) {
      void router.replace("/");
    }
  }, [game.users.length, router]);

  const handleNextRound = () => {
    nextRound();
    socket.emit("next-set");
  };

  const handleNextImage = () => {
    nextImage();
    socket.emit("next-image");
  };

  const nextRound = useCallback(() => {
    if (finalSRoundReached) {
      void router.replace("/lobby");
      return;
    }
    setImageIndex(0);
    setRoundIndex((prev) => prev + 1);
  }, [finalSRoundReached, router]);

  const nextImage = () => {
    setImageIndex((prev) => prev + 1);
  };

  useEffect(() => {
    socket.on("next-set-res", nextRound);
    socket.on("next-image-res", nextImage);
    return () => {
      socket.off("next-set-res", nextRound);
      socket.off("next-image-res", nextImage);
    };
  }, [nextRound]);

  return (
    <>
      <div className="flex h-full flex-col justify-center gap-2">
        <div className="flex justify-between">
          <BackButton />
          {finalImageReached && (
            <button
              onClick={handleNextRound}
              className="w-fit rounded border-4 border-black/20 bg-white/20 px-10 py-4 hover:bg-white/10"
              disabled={!isAdmin}
            >
              <h4>{finalSRoundReached ? "Finish" : "next set"}</h4>
            </button>
          )}
        </div>
        <h2>Showcase</h2>
        <div className="flex aspect-[7/4] gap-2 overflow-hidden">
          <UserList userId={game.images[roundIndex]?.userId} />
          <div className="flex w-[67%] flex-col overflow-hidden rounded bg-black/20 p-4">
            <h2>Drawvs</h2>
            {images && (
              <ImagesShown
                handleNextImage={handleNextImage}
                imageIndex={imageIndex}
                images={images}
                isAdmin={isAdmin}
                rotation={game.game.rotation}
              />
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
  handleNextImage: () => void;
  isAdmin: boolean;
  rotation: Rotation;
}

const ImagesShown = ({
  handleNextImage,
  imageIndex,
  images,
  isAdmin,
  rotation,
}: ImagesShownProps) => {
  const { game } = useGameContext();
  return (
    <div className="overflow-y-scroll">
      <div className="h-full gap-4 p-4">
        {images.map((image, index) => {
          const roundType = getRoundType(rotation, index + 1);
          const author = game.users.find((user) => user.id === image.authorId);
          console.log(image.authorId);
          if (index > imageIndex + 1) return;
          if (index > imageIndex)
            return (
              <button
                onClick={handleNextImage}
                disabled={!isAdmin}
                className="ml-auto h-fit w-fit rounded bg-white/30 px-4 py-2"
                key={image.id}
              >
                ...
              </button>
            );
          if (roundType === "story" || roundType === "prompt")
            return (
              <div
                key={image.id}
                className="my-3 ml-auto h-fit w-fit rounded bg-white/30 px-4 py-2 text-right"
              >
                <h4>{author?.name}</h4>
                {image.prompt}
              </div>
            );

          if (roundType === "draw" || roundType === "animation") {
            return (
              <div
                className="my-3 ml-auto aspect-[5/3] text-right lg:w-[75%]"
                key={image.id}
              >
                <h4>{author?.name}</h4>
                {image.image && <Canvas image={image.image} />}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
