import { useRouter } from "next/router";
import {
  type ReactNode,
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import { socket } from "~/assets/socket";

interface Context {
  game: Game;
  dispatchGame: (payload: Payload) => void;
}

interface Props {
  children: ReactNode;
}

type User = { name: string; id: string; isAdmin: boolean };

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
type Payload = PayloadA | PayloadB | PayloadC | PayloadD;

type Game = {
  name: string;
  users: User[];
  rounds: number;
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
        return { ...state, rounds: data };
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
  };

  const [game, dispatchGame] = useReducer(reducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const updateUsers = (
      data: { name: string; id: string; isAdmin: boolean }[]
    ) => {
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

    socket.on("update-users", updateUsers);
    socket.on("update-name", updateGame);
    socket.on("request-data", sendData);
    socket.on("receive-data", receiveData);
    socket.on("kicked", kicked);
    socket.on("start-game", startGame);

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
