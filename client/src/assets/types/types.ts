type User = {
  name: string;
  id: string;
  isAdmin: boolean;
  done: boolean;
};

type Lines = {
  x: number;
  y: number;
  color: string;
  width: number;
}[][];

type UserImage = Image & {
  userId: string
}

type Image = {
  id: number;
  prompt: string;
  image: HTMLCanvasElement | HTMLImageElement | null;
};

type Images = {
  userId: string;
  images: Image[];
};


type Rotation = readonly ["prompt", "draw"] | readonly ["animation"] | readonly ["story"];

export type { User, Lines, Image, Images, UserImage, Rotation };
