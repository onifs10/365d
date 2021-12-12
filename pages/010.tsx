import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Canvas from "../components/Canvas";
import Paper from "../components/Paper";
import { r30, r60, r90, range, SQRT_3, Vector } from "../utils";

class Frame {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  private canvasSize: {
    width: number;
    height: number;
  };
  private size: number;
  private wireframe: boolean = true;
  private readonly startTime: number = Date.now() + 1000;
  constructor(canvas: HTMLCanvasElement, size: number) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.canvasSize = {
      width: canvas.width,
      height: canvas.height,
    };
    this.size = size;
  }
  // function to draw shapes
  draw = (vec: Vector[]) => {
    if (this.context) {
      this.context.beginPath();
      this.context.moveTo(...vec[0]);
      vec.slice(1).forEach((v) => this.context?.lineTo(...v));
      this.context.lineTo(...vec[0]);
      if (this.wireframe) {
        this.context.stroke();
      } else {
        this.context.fill();
      }
    }
  };

  clear = () => {
    if (this.context) {
      this.context.clearRect(
        0,
        0,
        this.canvasSize.width,
        this.canvasSize.height
      );
      this.context.strokeStyle = "green";
    }
  };

  rotate(vec: Vector[], rad = 0): Vector[] {
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    return vec.map(([x, y]) => [x * cos - y * sin, y * cos + x * sin]);
  }

  move(vec: Vector[], dx = 0, dy = 0): Vector[] {
    return vec.map(([x, y]) => [x + dx, y + dy]);
  }

  init = () => {
    const s = this.size;
    const hs = s / 2;
    const r3s = (s * SQRT_3) / 2;
    const d = s / 2 + r3s;
    const amount = Math.ceil(this.canvasSize.width / d) + 1;
    const offset = -hs;

    //diamond shape coordinates
    const diamond: Vector[] = [
      [-hs, 0],
      [0, -r3s],
      [hs, 0],
      [0, r3s],
    ];

    //square shape coordinates
    const square: Vector[] = [
      [-hs, -hs],
      [-hs, hs],
      [hs, hs],
      [hs, -hs],
    ];

    const animate = () => {
      const t = Math.max(Date.now() - this.startTime, 0);
      const duration = 2400;
      const turn = Math.trunc(t / duration) % 2;
      const cycle = Math.trunc(t / duration) % 4;
      let r = (t / duration) * r90;
      this.clear();

      if (turn) {
        if (cycle === 1) r += r90;

        let h = this.rotate(diamond, r);
        let v = this.rotate(diamond, r + r90); //  pus rotation by r30
        for (let x of range(amount)) {
          for (let y of range(amount)) {
            this.draw(
              this.move((x + y) % 2 ? h : v, x * d + offset, y * d + offset)
            );
          }
        }
      } else {
        let h, v;
        if (cycle == 2) {
          h = this.rotate(square, r + r60); // push rotation  by r30
          v = this.rotate(square, r - r60); // delay rotation by r30
        } else {
          h = this.rotate(square, r + r30); // push rotation  by r30
          v = this.rotate(square, r - r30); // delay rotation by r30
        }
        for (let x of range(amount)) {
          for (let y of range(amount)) {
            this.draw(
              this.move(
                (x + y) % 2 ? h : v,
                (x - 0.5) * d + offset,
                (y - 0.5) * d + offset
              )
            );
          }
        }
      }
      window.requestAnimationFrame(animate);
    };

    animate();
  };
}

const Page010: NextPage = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);

  useEffect(() => {
    if (!frame && canvas.current) {
      const frame = new Frame(canvas.current, 40);
      setFrame(frame);
      frame.init();
    }
  }, [canvas, frame]);
  return (
    <Paper
      pageTitle={"Nagating Illusion"}
      pageDescription={"nice illusttioin using canvas animation"}
      paperTitle={"Negating illusion"}
      paperTip={""}
    >
      <Canvas ref={canvas} />
    </Paper>
  );
};

export default Page010;
