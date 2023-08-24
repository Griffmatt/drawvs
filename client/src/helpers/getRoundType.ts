import type { Rotation } from "~/assets/types/types";

export const getRoundType = (rotation: Rotation, round: number) => {
  const currentIndex = (round - 1) % rotation.length;

  return rotation[currentIndex];
};
