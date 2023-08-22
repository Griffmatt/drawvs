import { useRouter } from "next/router";
import {
  type ReactNode,
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import { socket } from "~/assets/socket";
import type { Images, Lines, User } from "~/assets/types";

interface Context {
  game: Game;
  dispatchGame: (payload: Payload) => void;
}

interface Props {
  children: ReactNode;
}

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
  data: {
    id: number;
    prompt: string;
    image: Lines | null;
    userId: string;
  };
};

type PayloadG = {
  type: "reset";
  data: null;
};

type PayloadH = {
  type: "admin";
  data: {
    old: string;
    new: string;
  };
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
  images: Images[];
};

const gameContext = createContext({} as Context);

export const useGameContext = () => useContext(gameContext);
const initialState = {
  name: "Normal",
  users: [] as User[],
  rounds: 0,
  round: 1,
  images: [] as Images[],
};

export const GameContextProvider = ({ children }: Props) => {
  const router = useRouter();

  const reducer = (state: Game, action: Payload) => {
    const { type, data } = action;
    switch (type) {
      case "gameName":
        return { ...state, name: data };
      case "users":
        return { ...state, users: data };
      case "rounds":
        const images = Array.from({ length: Math.ceil(data) }, (_, index) => {
          return { id: index, prompt: "", image: null };
        });
        const usersInitImages = state.users.map((user) => {
          return { userId: user.id, images: images };
        });
        return { ...state, rounds: data, images: usersInitImages };
      case "round":
        const newRound = state.round + data
        return { ...state, round: newRound };
      case "image":
        const updatedImages = updateImages(state.images, data);
        return { ...state, images: updatedImages };
      case "all":
        return { ...state, name: data.name };
      case "reset":
        return initialState;
      default:
        return state;
    }
  };

  const [game, dispatchGame] = useReducer(reducer, initialState);

  useEffect(() => {
    const updateUsers = (data: User[]) => {
      dispatchGame({
        type: "users",
        data: data,
      });
    };

    const updateGame = (data: string) => {
      dispatchGame({
        type: "gameName",
        data: data,
      });
    };

    const receiveData = (data: typeof game) => {
      dispatchGame({
        type: "all",
        data: data,
      });
    };

    const sendData = (id: string) => {
      socket.emit("send-data", { data: game, id });
    };

    const kicked = () => {
      void router.replace("/");
    };

    const startGame = () => {
      dispatchGame({ type: "rounds", data: game.users.length });
      void router.push("/draw");
    };

    const receiveImage = (data: {
      id: number;
      prompt: string;
      image: Lines | null;
      userId: string;
    }) => {
      dispatchGame({
        type: "image",
        data: data,
      });
    };

    const updateAdmin = (data: { old: string; new: string }) => {
      dispatchGame({
        type: "admin",
        data: data,
      });
    };

    socket.on("update-users", updateUsers);
    socket.on("update-name", updateGame);
    socket.on("request-data", sendData);
    socket.on("receive-data", receiveData);
    socket.on("kicked", kicked);
    socket.on("start-game", startGame);
    socket.on("receive-image", receiveImage);
    socket.on("update-admin", updateAdmin);

    return () => {
      socket.off("update-users", updateUsers);
      socket.off("update-name", updateGame);
      socket.off("request-data", sendData);
      socket.off("receive-data", receiveData);
      socket.off("kicked", kicked);
      socket.off("start-game", startGame);
    };
  }, [dispatchGame, game, router]);

  return (
    <gameContext.Provider value={{ game, dispatchGame }}>
      {children}
    </gameContext.Provider>
  );
};

const updateImages = (
  Images: Images[],
  data: {
    id: number;
    prompt: string;
    image: Lines | null;
    userId: string;
  }
) => {
  const userImages = Images.map((user) => {
    if (user.userId === data.userId) {
      const images = user.images.map((image) => {
        if (image.id === data.id) {
          return {
            id: data.id,
            prompt: data.prompt,
            image: data.image,
          };
        }
        if (image.id === data.id + 1) {
          return {
            ...image,
            image: data.image,
            prompt: data.prompt,
          };
        }
        return image;
      });
      return { ...user, images: images };
    }
    return user;
  });

  return userImages;
};
