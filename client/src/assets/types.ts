type User = {
  name: string;
  id: string;
  isAdmin: boolean;
  done: boolean;
  images: Image[];
};

type Lines = {
  x: number;
  y: number;
  color: string;
  width: number;
}[][];

type Image = {
  id: number;
  prompt: string;
  image: Lines | null;
};

export type { User, Lines, Image };
