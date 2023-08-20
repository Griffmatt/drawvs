import { useToolsContext } from "~/context/toolsContext";

const TOOLS = ["Draw", "Erase", "Fill", "", "", ""];

export default function ToolSelector() {
  const { tool, setTool, handleDecrease, handleIncrease } = useToolsContext();
  return (
    <div className="grid gap-2 rounded bg-black/20 p-2">
      <div className="grid grid-cols-2 gap-2 border-white/20 p-2">
        {TOOLS.map((toolInfo, index) => {
          return (
            <button
              key={index}
              className={`aspect-square w-full rounded border-2 ${
                toolInfo === tool ? "border-white" : "border-white/30"
              }`}
              onClick={() => setTool(toolInfo)}
            >
              {toolInfo}
            </button>
          );
        })}
        <button
          className="aspect-square w-full rounded border-2
          border-white/30"
          onClick={handleDecrease}
        >
          Back
        </button>
        <button
          className="aspect-square w-full rounded border-2
          border-white/30"
          onClick={handleIncrease}
        >
          Forward
        </button>
      </div>
    </div>
  );
}
