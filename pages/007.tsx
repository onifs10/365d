import { NextPage } from "next";
import { MouseEvent, useEffect, useState } from "react";
import Canvas from "../components/Canvas";
import Paper from "../components/Paper";
const palettes = require("nice-color-palettes");
import { getPointyHaxgonalPoint, pick, Vector } from "../utils";

const cursor = { x: 0, y: 0 };

class Particle {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  particleTrailWidth: number;
  strokeColor: string;
  theta: number;
  rotateSpeed: number;
  t: number;
  size: number;
  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    particleTrailWidth: number,
    strokeColor: string,
    rotateSpeed: number
  ) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.particleTrailWidth = particleTrailWidth;
    this.strokeColor = strokeColor;
    this.theta = Math.random() * Math.PI * 2;
    this.rotateSpeed = rotateSpeed;
    this.t = Math.random() * 100;
    this.size = Math.random();
  }

  rotate(index: number) {
    this.theta += this.rotateSpeed;
    this.x = (cursor.x + this.size * 100 * index) % 400;
    this.y = cursor.y + Math.sin(this.theta) * this.t;
    let points: Vector[] = getPointyHaxgonalPoint(this.size * 40, [
      this.x,
      this.y,
    ]);

    //draw hexagon
    this.context.beginPath();
    this.context.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) {
      this.context?.lineTo(...points[i]);
    }
    this.context.strokeStyle = this.strokeColor;
    this.context.lineWidth = 2;
    this.context.closePath();
    this.context.stroke();

    //draw center lines
    for (let i = 0; i < points.length; i += 2) {
      this.context.beginPath();
      this.context.moveTo(...points[i]);
      this.context.lineTo(this.x, this.y);
      this.context.strokeStyle = this.strokeColor;
      this.context.lineWidth = 2;
      this.context.closePath();
      this.context.stroke();
    }
  }
}

class AnimatedFrame {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  particles: Particle[];
  particlesCount: number;
  constructor(canvas: HTMLCanvasElement, particaleCount: number) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    cursor.x = canvas.width / 2;
    cursor.y = canvas.height / 2;
    this.particles = [];
    this.particlesCount = particaleCount;
  }
  init() {
    this.generateParticles();
    this.anim();
  }
  private generateParticles() {
    for (let i = 0; i < this.particlesCount; i++) {
      this.particles[i] = new Particle(
        this.context!,
        cursor.x,
        cursor.y,
        4,
        pick<string>(pick<string[]>(palettes)),
        0.02
      );
    }
  }
  anim() {
    requestAnimationFrame(this.anim.bind(this));
    this.context!.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((particle, i) => particle.rotate(i));
  }

  setCursor(e: MouseEvent<HTMLCanvasElement>) {
    cursor.y = e.clientY - this.canvas.offsetTop;
    cursor.x = e.clientX - this.canvas.offsetLeft;
  }
}

const Page007: NextPage = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [animationFrame, setFrame] = useState<AnimatedFrame | undefined>();
  useEffect(() => {
    if (canvas) {
      const Frame = new AnimatedFrame(canvas, 10);
      setFrame(Frame);
      Frame.init();
    }
  }, [canvas]);
  return (
    <Paper
      pageTitle={"Canvas Animation"}
      pageDescription={
        "basic canvas animation using  requestAnimationFrame function"
      }
      paperTitle={"Canvas Animation"}
      paperTip={"put mouse over canvas to move boxes"}
    >
      <Canvas
        ref={setCanvas}
        width={400}
        height={400}
        onMouseMove={(e) => {
          animationFrame && animationFrame.setCursor(e);
        }}
      />
    </Paper>
  );
};

export default Page007;
