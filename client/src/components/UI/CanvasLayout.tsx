import type { ReactNode } from "react";
interface Props {
  children: ReactNode;
  message: string;
}

export const CanvasLayout = ({ children, message }: Props) => {

  return (
    <div className="aspect-[5/4] w-full">
      <div className="flex h-[20%] flex-col items-center justify-center gap-2 rounded-t bg-black/20">
        <h2>DRAWVS</h2>
        <h3>{message}</h3>
      </div>
      {children}
    </div>
  );
};
