import { useRouter } from "next/router";
import {
  type ReactNode,
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import { socket } from "~/assets/socket";
import type { Game, Payload, GameInfo } from "~/assets/types/game";
import type { Images, User, UserImage } from "~/assets/types/types";
import { loadImage } from "~/helpers/loadImage";

interface Context {
  game: Game;
  dispatchGame: (payload: Payload) => void;
}

interface Props {
  children: ReactNode;
}

const gameContext = createContext({} as Context);

export const useGameContext = () => useContext(gameContext);
const initialState: Game = {
  users: [],
  rounds: 0,
  round: 1,
  time: 60,
  images: [],
  game: {
    name: "Normal",
    rotation: ["prompt", "draw"],
    minPlayers: 2,
    roundsPerPlayer: 1,
  },
};

export const GameContextProvider = ({ children }: Props) => {
  const router = useRouter();

  const reducer = (state: Game, action: Payload) => {
    const { type, data } = action;
    switch (type) {
      case "gameInfo":
        return { ...state, game: data };
      case "users":
        return { ...state, users: data };
      case "rounds":
        const rounds = state.users.length * state.game.roundsPerPlayer;
        const images = Array.from({ length: rounds }, (_, index) => {
          return { id: index, prompt: "", image: null, authorId: "" };
        });
        const usersInitImages = state.users.map((user) => {
          return { userId: user.id, images: images, authorId: ""};
        });
        return { ...state, rounds: rounds, images: usersInitImages };
      case "round":
        const newRound = state.round + data;
        return { ...state, round: newRound, time: 60 };
      case "image":
        const updatedImages = updateImages(state.images, data);
        return { ...state, images: updatedImages };
      case "all":
        return { ...state, name: data.name };
      case "reset":
        return initialState;
      case "time":
        return { ...state, time: data };
      case "reset-game":
        return { ...initialState, users: state.users };
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

    const updateGame = (data: GameInfo) => {
      dispatchGame({
        type: "gameInfo",
        data: data,
      });
    };

    const receiveData = (data: { name: string; users: User[] }) => {
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
      const userLength = game.users.length;
      if (userLength < game.game.minPlayers) return;
      dispatchGame({ type: "rounds", data: userLength });
      void router.push("/draw");
    };

    const receiveImage = (data: {
      id: number;
      prompt: string;
      image: string;
      userId: string;
      authorId: string;
    }) => {
      const newImage = loadImage(data.image);
      const newData = {
        ...data,
        image: newImage,
      };
      dispatchGame({
        type: "image",
        data: newData,
      });
    };

    const updateTime = (time: number) => {
      dispatchGame({
        type: "time",
        data: time,
      });
    };

    socket.on("update-users", updateUsers);
    socket.on("update-game-mode", updateGame);
    socket.on("request-data", sendData);
    socket.on("receive-data", receiveData);
    socket.on("kicked", kicked);
    socket.on("start-game", startGame);
    socket.on("receive-image", receiveImage);
    socket.on("update-time-res", updateTime);

    return () => {
      socket.off("update-users", updateUsers);
      socket.off("update-game-mode", updateGame);
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

const updateImages = (Images: Images[], data: UserImage) => {
  const userImages = Images.map((user) => {
    if (user.userId === data.userId) {
      const images = user.images.map((image) => {
        if (image.id === data.id) {
          return {
            id: data.id,
            prompt: data.prompt,
            image: data.image,
            authorId: data.authorId
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
