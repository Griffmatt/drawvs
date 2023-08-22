import { useRouter } from "next/router";
import { socket } from "~/assets/socket";

export default function BackButton() {
  const router = useRouter();

  const handleClick = () => {
    socket.emit("leave-room");
   void router.replace("/");
  };
  return (
    <button
      className="w-fit rounded border-4 border-black/20 bg-white/20 px-10 py-4 hover:bg-white/10"
      onClick={handleClick}
    >
      <h4>Back</h4>
    </button>
  );
}
