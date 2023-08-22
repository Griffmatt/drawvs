import { socket } from "~/assets/socket";

export default function DoneButton() {
const handleClick = () => {
    socket.emit("done");
  };

  return (
    <button
      className="h-fit w-fit rounded border-4 border-black/20 bg-white/20 px-10 py-4 hover:bg-white/10"
      onClick={handleClick}
    >
      <h4>Done</h4>
    </button>
  );
}
