import {
  useState,
  createContext,
  useContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

interface Context {
  name: string;
  code: string;
  setName: Dispatch<SetStateAction<string>>;
  setCode: Dispatch<SetStateAction<string>>;
}

interface Props {
  children: ReactNode;
}

const UserContext = createContext({} as Context);

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }: Props) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");



  return (
    <UserContext.Provider
      value={{
        name,
        setName,
        code,
        setCode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
