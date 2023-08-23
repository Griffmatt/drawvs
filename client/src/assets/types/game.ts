import type { Images, User, UserImage } from "./types";

type PayloadA = {
  type: "gameName";
  data: string;
};
type PayloadB = {
  type: "users";
  data: User[];
};
type PayloadC = {
  type: "all";
  data: {
    name: string;
    users: User[];
  };
};

type PayloadD = {
  type: "rounds";
  data: number;
};

type PayloadE = {
  type: "round";
  data: number;
};

type PayloadF = {
  type: "image";
  data: UserImage;
};

type PayloadG = {
  type: "reset" | "reset-game";
  data: null;
};

type PayloadH = {
  type: "time";
  data: number;
};

type Payload =
  | PayloadA
  | PayloadB
  | PayloadC
  | PayloadD
  | PayloadE
  | PayloadF
  | PayloadG
  | PayloadH;

type Game = {
  name: string;
  users: User[];
  rounds: number;
  round: number;
  time: number;
  images: Images[];
};

export type { Game, Payload };
