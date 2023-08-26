import {
  useState,
  createContext,
  useContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

interface Context {
  color: {
    code: string;
    name: string;
  };
  setColor: Dispatch<
    SetStateAction<{
      code: string;
      name: string;
    }>
  >;
  width: number;
  setWidth: Dispatch<SetStateAction<number>>;
  tool: string;
  setTool: Dispatch<SetStateAction<string>>;
  handleDecrease: () => void;
  handleIncrease: () => void;
  currentLine: number;
  setCurrentLine: Dispatch<SetStateAction<number>>;
  opacity: number
  setOpacity: Dispatch<SetStateAction<number>>
}

interface Props {
  children: ReactNode;
}

const ToolsContext = createContext({} as Context);

export const useToolsContext = () => useContext(ToolsContext);

export const ToolsContextProvider = ({ children }: Props) => {
  const [color, setColor] = useState({
    code: "#000000",
    name: "black",
  });
  const [width, setWidth] = useState(8);
  const [tool, setTool] = useState("Draw");
  const [currentLine, setCurrentLine] = useState(0);
  const [opacity, setOpacity] = useState(100)

  const handleDecrease = () => {
    const plusOne = currentLine + 1;
    setCurrentLine(plusOne);
  };
  const handleIncrease = () => {
    if (currentLine === 0) return;
    const minusOne = currentLine - 1;
    setCurrentLine(minusOne);
  };

  return (
    <ToolsContext.Provider
      value={{
        color,
        setColor,
        width,
        setWidth,
        tool,
        setTool,
        handleDecrease,
        handleIncrease,
        currentLine,
        setCurrentLine,
        opacity,
        setOpacity
      }}
    >
      {children}
    </ToolsContext.Provider>
  );
};
