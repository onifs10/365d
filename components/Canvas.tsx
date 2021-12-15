import { forwardRef, ForwardRefRenderFunction, PropsWithRef } from "react";
import canvasStyle from "../styles/canvas.module.scss";

export interface CanvasProps
  extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  height?: number;
  width?: number;
}
const CanvasRenderFunc: ForwardRefRenderFunction<
  HTMLCanvasElement,
  PropsWithRef<CanvasProps>
> = (Props, ref) => {
  return (
    <canvas
      {...Props}
      className={canvasStyle.canvas}
      ref={ref}
      width={Props.width || 400}
      height={Props.height || 400}
    ></canvas>
  );
};

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(CanvasRenderFunc);

export default Canvas;
