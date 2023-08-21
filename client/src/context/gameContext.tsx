import { useRouter } from "next/router";
import {
  type ReactNode,
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import { socket } from "~/assets/socket";
import type { Lines, User } from "~/assets/types";

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
    userId: string
  };
};

type Payload = PayloadA | PayloadB | PayloadC | PayloadD | PayloadE | PayloadF;

type Game = {
  name: string;
  users: User[];
  rounds: number;
  round: number;
};

const gameContext = createContext({} as Context);

export const useGameContext = () => useContext(gameContext);

export const GameContextProvider = ({ children }: Props) => {
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
          return { ...user, images: images };
        });
        return { ...state, rounds: data, users: usersInitImages };
      case "round":
        console.log();
        return { ...state, round: state.round + data };
      case "image":
        const userImages = state.users.map((user) => {
          if (user.id === data.userId) {
            const imageData = {
              id: data.id,
              prompt: data.prompt,
              image: data.image
            }
            return { ...user, imageData };
          }
          return user;
        });
        return { ...state, users: userImages };
      case "all":
        return { ...state, name: data.name };
      default:
        return state;
    }
  };

  const initialState = {
    name: "Normal",
    users: [] as User[],
    rounds: 0,
    round: 1,
  };

  const [game, dispatchGame] = useReducer(reducer, initialState);
  const router = useRouter();

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

    socket.on("update-users", updateUsers);
    socket.on("update-name", updateGame);
    socket.on("request-data", sendData);
    socket.on("receive-data", receiveData);
    socket.on("kicked", kicked);
    socket.on("start-game", startGame);
    socket.on("receive-image", receiveImage);

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
