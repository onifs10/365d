import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Canvas from "../components/Canvas";
import Paper from "../components/Paper";
import { FrameBase, pick, r180, r90 } from "../utils";
const palettes = require("nice-color-palettes");

const Page012: NextPage = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  useEffect(() => {
    if (canvas.current) {
      const frame = new Frame(canvas.current);
      setFrame(frame);
      frame.init().animate();
    }
  }, [canvas]);
  return (
    <Paper
      pageTitle={"Box-Circle"}
      pageDescription={
        "Animation on canvas showing transition from box to circle and vise versa"
      }
      paperTitle={"Box -> Circle"}
      paperTip={""}
    >
      <Canvas ref={canvas} />
    </Paper>
  );
};

class Frame extends FrameBase {
  private startTime: number = Date.now();
  private readonly duration: number = 100;
  private particles: Particle[] = [];
  private iterations: number = 0;
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    canvas.style.border = "none";
    this.context!.strokeStyle = "green";
    this.context!.lineWidth = 2;
  }

  private remove = () => {
    this.particles.pop();
  };

  private clear = () => {
    this.context?.clearRect(
      0,
      0,
      this.canvasSize.width,
      this.canvasSize.height
    );
  };

  init = () => {
    if (this.context) {
      const particle = new Particle(
        this.context,
        this.canvasSize,
        this.canvasSize.height,
        this.remove,
        pick(pick<string[]>(palettes))
      );
      this.particles.unshift(particle);
    }
    return this;
  };

  addP = () => {};

  animate = () => {
    // this.drawRoundRect(this.canvasSize.height - this.offset, 1000);
    // this.drawRectRound(200, 2);
    if (this.particles.length) {
      this.clear();
      this.iterations++;
      this.particles.forEach((p) => p.sketch());
      if (this.iterations % this.duration === 0) {
        this.particles.forEach((p) => p.change());
        this.init();
      }
      window.requestAnimationFrame(this.animate);
    }
  };

  // interation = () => {};
}

class Particle {
  private offset: number = 10;
  private arcSize: number = -1;
  private turn: boolean = true;
  constructor(
    private context: CanvasRenderingContext2D,
    private canvasSize: {
      width: number;
      height: number;
      cx: number;
      cy: number;
    },
    private size: number,
    private destroy: () => void,
    private color: string = "green"
  ) {}

  // creates arc at the corners of a square till it forms a full circle
  private drawRoundRect = (size = 0, r = 0) => {
    const { cx, cy } = this.canvasSize;
    const x = cx - size / 2;
    const y = cy - size / 2;
    r = Math.min(r, size / 2);

    if (this.context) {
      this.context.save();
      this.context.beginPath();
      this.context.strokeStyle = this.color;
      this.context.fillStyle = this.color;

      // start top border
      this.context.moveTo(x + r, y);
      this.context.lineTo(x + size - r, y);

      //draw top right border raduis
      this.context.arc(x + size - r, y + r, r, -r90, 0);

      //draw left border
      this.context.moveTo(x + size, y + r);
      this.context.lineTo(x + size, y + size - r);

      //bottom right arc
      this.context.arc(x + size - r, y + size - r, r, 0, r90);
      //bottom line
      this.context.moveTo(x + size - r, y + size);
      this.context.lineTo(x + r, y + size);

      //bottom left arc
      this.context.arc(x + r, y + size - r, r, r90, r180);
      //left border
      this.context.moveTo(x, y + size - r);
      this.context.lineTo(x, y + r);

      // top left arc
      this.context.arc(x + r, y + r, r, r180, -r90);
      //   this.context.closePath();

      // this.context.closePath();
      this.context.stroke();

      // this.context.fill();

      this.context.restore();
    }
  };

  // create box from a circle

  // this is sketching 4 arc with large raduis that itercepts
  private drawRectRound = (size = 0, d = 0) => {
    const hs = size / 2;

    const h = hs + d;

    const rad = Math.atan2(hs, h);
    const r = h / Math.cos(rad);
    const { cx, cy } = this.canvasSize;
    if (this.context) {
      this.context.save();

      this.context.beginPath();
      this.context.strokeStyle = this.color;
      this.context.fillStyle = this.color;

      //top arc
      this.context.arc(cx, cy + d, r, -r90 - rad, -r90 + rad);

      // right arc
      this.context.arc(cx - d, cy, r, -rad, +rad);

      // bottom arc
      this.context.arc(cx, cy - d, r, r90 - rad, r90 + rad);

      // left ard
      this.context.arc(cx + d, cy, r, r180 - rad, r180 + rad);

      // this.context.closePath();
      this.context.stroke();
      // this.context.fill();
      this.context.restore();
    }
  };

  sketch = () => {
    this.arcSize += 1;
    if (this.turn) {
      this.drawRoundRect(
        this.size - this.offset,
        this.arcSize * 0.02 * this.size
      );
    } else {
      this.drawRectRound(this.size - this.offset, this.arcSize * 50);
    }
  };

  change = () => {
    this.turn = !this.turn;
    if (this.size <= 30) {
      this.destroy();
    }
    if (!this.turn) {
      this.size = (this.size - 20) * 0.702;
      this.arcSize = 0;
    } else {
      this.size = this.size * 0.8;
    }
  };
}

export default Page012;
