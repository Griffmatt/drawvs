import { COLORS } from "~/assets/colors";
import { useToolsContext } from "~/context/toolsContext";

export default function ColorSelector() {
  const {color, setColor} = useToolsContext()
  return (
    <section className="flex flex-col justify-center">
      <div className="grid gap-1 rounded bg-black/20 p-2">
        <div className="grid grid-cols-3 gap-2 border-b-2 border-white/20 p-2">
          {COLORS.map((colorInfo) => {
            return (
              <button
                key={colorInfo.name}
                className={`${colorInfo.name} aspect-square w-full rounded border-2 border-white/30`}
                onClick={() => setColor(colorInfo)}
              />
            );
          })}
        </div>
        <div
          className={`${color.name} h-20 w-full rounded border-2 border-white/30 bg-black `}
        />
      </div>
    </section>
  );
}
