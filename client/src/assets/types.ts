type User = {
  name: string;
  id: string;
  isAdmin: boolean;
  done: boolean;
  images: {
    id: number;
    prompt: string;
    image: Image | null;
  }[];
};

type Image = {
  x: number;
  y: number;
  color: string;
  width: number;
}[][];

export type { User, Image };
