import { useToolsContext } from "~/context/toolsContext";

export default function LineFadeTools() {
  const { width, setWidth } = useToolsContext();
  return (
    <section>
      <div className="grid grid-cols-5 gap-2 rounded bg-black/20 p-2">
        <button
          className={`flex h-16 w-16 items-center justify-center rounded-full border-4 bg-white/50 hover:bg-white/30 ${
            width === 2 ? "border-4 border-white" : "border-black/20"
          }`}
          onClick={() => setWidth(2)}
        >
          <div className="h-2 w-2 rounded-full bg-black/80" />
        </button>
        <button
          className={`flex h-16 w-16 items-center justify-center rounded-full border-4 bg-white/50 hover:bg-white/30 ${
            width === 4 ? "border-white" : "border-black/20"
          }`}
          onClick={() => setWidth(4)}
        >
          <div className="h-3 w-3 rounded-full bg-black/80" />
        </button>
        <button
          className={`flex h-16 w-16 items-center justify-center rounded-full border-4 bg-white/50 hover:bg-white/30 ${
            width === 8 ? "border-white" : "border-black/20"
          }`}
          onClick={() => setWidth(8)}
        >
          <div className="h-5 w-5 rounded-full bg-black/80" />
        </button>
        <button
          className={`flex h-16 w-16 items-center justify-center rounded-full border-4 bg-white/50 hover:bg-white/30 ${
            width === 16 ? "border-white" : "border-black/20"
          }`}
          onClick={() => setWidth(16)}
        >
          <div className="h-7 w-7 rounded-full bg-black/80" />
        </button>
        <button
          className={`flex h-16 w-16 items-center justify-center rounded-full border-4 bg-white/50 hover:bg-white/30 ${
            width === 32 ? "border-white" : "border-black/20"
          }`}
          onClick={() => setWidth(32)}
        >
          <div className="h-10 w-10 rounded-full bg-black/80" />
        </button>
      </div>
      <div></div>
    </section>
  );
}
