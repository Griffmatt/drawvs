import { type FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUserContext } from "~/context/userContext";
import { socket } from "~/assets/socket";
import { useGameContext } from "~/context/gameContext";

export default function Home() {
  const [selected, setSelected] = useState<"Create" | "Join">("Create");
  const [message, setMessage] = useState("blank");

  const { name, setName, code, setCode } = useUserContext();
  const { dispatchGame } = useGameContext();
  const router = useRouter();

  const handleNameChange = (value: string) => {
    if (value.length > 12) return;
    setMessage("blank")
    setName(value);
  };

  const handleCodeChange = (value: string) => {
    if (value.length > 6) return;
    setMessage("blank")
    setCode(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length !== 6) return;
    if (name.length < 1) return;
    if (selected === "Create") {
      socket.emit("create-room", {
        name,
        code,
      });
    } else {
      socket.emit("join-room", {
        name,
        code,
      });
    }
  };

  useEffect(() => {
    const userJoined = (
      data: { name: string; id: string; isAdmin: boolean }[]
    ) => {
      dispatchGame({
        type: "users",
        data: data,
      });
      void router.push(`/lobby`);
    };

    const roomNotFound = (data: { message: string }) => {
      setMessage(data.message);
    };

    const nameTaken = (data: { message: string }) => {
      setMessage(data.message);
    };

    socket.on("user-joined", userJoined);
    socket.on("room-not-found", roomNotFound);
    socket.on("name-taken", nameTaken);

    return () => {
      socket.off("user-joined", userJoined);
      socket.off("room-not-found", roomNotFound);
    };
  }, [router, dispatchGame]);

  return (
    <div className="grid gap-8 text-center">
      <h1>DRAWVS</h1>
      <div className="flex w-full flex-col gap-2 ">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="flex w-full justify-around">
              <button
                className={`w-full rounded-tl-xl bg-black/10 p-4 text-center ${
                  selected !== "Create" ? "m-1" : ""
                }`}
                onClick={() => setSelected("Create")}
                disabled={selected === "Create"}
              >
                <h2>Create</h2>
              </button>
              <button
                className={`w-full rounded-tr-xl bg-black/10 p-4 text-center ${
                  selected !== "Join" ? "m-1" : ""
                }`}
                onClick={() => setSelected("Join")}
                disabled={selected === "Join"}
              >
                <h2>Join</h2>
              </button>
            </div>
            <form
              className="grid gap-10 rounded-b-xl bg-black/10 p-8 text-center"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-4">
                <h3>Choose A Name</h3>
                <input
                  value={name}
                  onChange={(event) => handleNameChange(event.target.value)}
                />
              </div>
              <div className="grid gap-4">
                <h3>{selected === "Create" ? "Choose" : "Enter"} A Code</h3>
                <input
                  value={code}
                  onChange={(event) => handleCodeChange(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <button className="w-full rounded border-2 border-white bg-slate-300/20 px-2 py-4 text-3xl font-extrabold">
                  {selected === "Create" ? "Start" : "Join"}
                </button>
                <h3 className={`${message === "blank" ? "text-transparent": "text-red-600"}`}>{message}</h3>
              </div>
            </form>
          </div>
          <div className="rounded-xl border-2 border-black/10 p-4">
            <h2 className="text-center">How To Play</h2>
          </div>
        </div>
      </div>
      <div>
        <h4>Hi!</h4>
      </div>
    </div>
  );
}
