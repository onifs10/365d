import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Canvas from "../components/Canvas";
import Paper from "../components/Paper";
import {
  distance,
  FrameBase,
  r60,
  sketchFunctionProps,
  SQRT_3,
  Vector,
} from "../utils";
const random = require("canvas-sketch-util/random");
// @ts-ignore
import canavasSketch from "canvas-sketch";
import { throws } from "assert";

// math functions
const { abs, atan2, max, min } = Math;

const Page013: NextPage = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);

  useEffect(() => {
    if (canvas.current) {
      const frame = new Frame(canvas.current);
      setFrame(frame);
      frame.init();
    }
  }, [canvas]);
  return (
    <Paper
      pageTitle={"Lines"}
      pageDescription={"moving lines"}
      paperTitle={"Lines"}
      paperTip={"move mouse over canvas"}
    >
      <Canvas ref={canvas} />
    </Paper>
  );
};

export default Page013;

class Frame extends FrameBase {
  private settings: {
    dimensions: Vector;
    pixelsPerInch: number;
    canvas: HTMLCanvasElement;
    animate?: boolean;
    fps?: number;
  };
  private mouseEvent: MouseEvent | null = null;
  private margin: number = 10;
  private columns: number = 30;
  private rows: number = 30;
  private n: number = 10;
  private len: number = 9;
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.settings = {
      dimensions: [400, 400],
      pixelsPerInch: 300,
      canvas: this.canvas,
      // animate: true,
      // fps: 10,
    };
  }

  sketch = ({ render }: { render: () => void }) => {
    // re-render on move movement
    this.canvas.addEventListener("mousemove", (evt) => {
      this.mouseEvent = evt;
      render();
    });

    return ({ context, width, height, frame }: sketchFunctionProps) => {
      context.strokeStyle = "green";
      context.fillStyle = "green";
      context.clearRect(0, 0, width, height);
      let mouseX: number = this.canvasSize.cx,
        mouseY: number = this.canvasSize.cy;

      if (this.mouseEvent) {
        let { clientX, clientY } = this.mouseEvent;
        mouseX = clientX - this.canvas.offsetLeft;
        mouseY = clientY - this.canvas.offsetTop;
      }

      for (let i = 0; i < this.rows - 1; i++) {
        for (let j = 0; j < this.columns - 1; j++) {
          const q = i - this.rows / 2;
          const r = j - this.columns / 2;
          const s = -q - r;

          if (abs(q) > this.n || abs(r) > this.n || abs(s) > this.n) continue;

          // getting each line position

          // https://www.redblobgames.com/grids/hexagons/#hex-to-pixel-axial
          const currentOffset = {
            x:
              this.canvasSize.cx +
              this.margin * (q * SQRT_3 + (r * SQRT_3) / 2),
            y: this.canvasSize.cx + this.margin * ((r * 3) / 2),
          };

          // diatance from line to mouse position
          const d = distance(
            [currentOffset.x, currentOffset.y],
            [mouseX, mouseY]
          );

          // gravity is
          const gravity = 1 - min(d / 500, 1);

          const length = this.len * gravity;
          const delta = {
            x: currentOffset.x + length / 2 - this.margin / 2 - mouseX,
            y: currentOffset.y - mouseY,
          };
          let theta = atan2(delta.y, delta.x);
          theta += r60 * gravity;

          context.save();
          context.beginPath();
          context.translate(currentOffset.x, currentOffset.y);
          context.rotate(theta);
          context.moveTo(0, 0);
          context.lineTo(length, 0);
          context.closePath();
          context.stroke();
          context.arc(length, 0, 2, 0, 360);
          context.fill();
          context.restore();
        }
      }
    };
  };

  init = () => {
    this.canvas.style.border = "none";
    canavasSketch(this.sketch, this.settings);
  };
}
