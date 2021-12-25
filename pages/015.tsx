import Matter, { Runner } from "matter-js";
// @ts-ignore
import MatterAttractors from "matter-attractors";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Canvas from "../components/Canvas";
import Paper from "../components/Paper";
import { FrameBase, hslToRgb, random, range, timestamp, clamp } from "../utils";

Matter.use(MatterAttractors);

// constants
const { sin, cos, max, round } = Math;
const {
  Engine,
  Render,
  World,
  Bodies,
  MouseConstraint,
  Mouse,
  Composite,
  Events,
} = Matter;

//interfaces
interface Ball {
  hue: number;
  size: number;
  body: Matter.Body;
  roundness: number;
  edges: number;
  isEgg?: boolean;
}

const Page015: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  useEffect(() => {
    if (canvasRef.current && !frame && divRef.current) {
      const frameObj = new Frame(canvasRef.current, divRef.current);
      setFrame(frameObj);
      frameObj.init();
    }
  }, [canvasRef, frame, divRef]);
  return (
    <Paper
      pageTitle={"Gravity"}
      pageDescription={"Gravity"}
      paperTitle={"Gravity"}
      paperTip={""}
    >
      <div ref={divRef}>
        <Canvas ref={canvasRef} />
      </div>
    </Paper>
  );
};

class Frame extends FrameBase {
  private engine: Matter.Engine | null = null;
  //   private runner: Matter.Runner | null = null;
  private renderer: Matter.Render | null = null;
  private mouseConstraint: Matter.MouseConstraint | null = null;
  private mouse: Matter.Mouse | null = null;
  private balls: Ball[] = [];
  private seenEgg: boolean = false;
  private COG: Matter.Body | null = null;
  private div: HTMLDivElement;
  constructor(canvas: HTMLCanvasElement, div: HTMLDivElement) {
    super(canvas);
    this.div = div;
  }

  init = () => {
    this.engine = Engine.create();
    this.renderer = Render.create({
      element: this.div,
      canvas: this.canvas,
      engine: this.engine,
      options: {
        width: 400,
        height: 400,
        background: "transparent",
        wireframes: false,
        // @ts-ignore untyped
        // showVelocity: debug.value,
        // @ts-ignore untyped
        pixelRatio: "auto",
      },
    });
    this.engine.gravity.y = 0;

    this.createCOG();
    this.clone(this.clone(this.createBall(random(0.2, 0.6), random(30, 20))));
    //   this.createBall()
    this.initMouse();
    if (this.renderer && this.engine) {
      Runner.run(this.engine);
      Render.run(this.renderer);
    }
  };

  private createBall = (
    hue: number,
    size: number,
    roundness = 0.1,
    edges = 5,
    x = 200,
    y = 200,
    isEgg = false
  ) => {
    isEgg = isEgg || ((hue <= 0.02 || hue >= 0.99) && roundness > 0.7);
    const options: any = {
      frictionAir: 0.1,
      friction: 0,
      render: {
        fillStyle: `rgb(${hslToRgb(hue, 0.6, 0.6).join(",")})`,
        strokeStyle: "white",
        lineWidth: 2,
      },
    };

    if (isEgg) {
      options.render.sprite = {
        texture: "/020-goldfish.png",
        xScale: (size / 200) * 0.9,
        yScale: (size / 200) * 0.9,
      };
    }

    const body =
      roundness >= 0.7 || isEgg
        ? Bodies.circle(x, y, size, options)
        : Bodies.polygon(x, y, edges, size, {
            chamfer: { radius: range(edges).map((i) => roundness * size) },
            ...options,
          });

    const ball = { body, hue, size, roundness, edges, isEgg };
    this.balls.push(ball);

    World.add(this.engine!.world, body);
    if (!this.seenEgg && isEgg) {
      setTimeout(() => {
        alert("Congarts on finding the easter egg! 🎉 \nThanks for playing!");
      }, 800);
      this.seenEgg = true;
    }
    return ball;
  };

  private clone = (ball: Ball) => {
    const r = random(1, -1);
    let hue = ball.hue + random(0.07, -0.07);
    if (hue < 0) hue += 1;
    if (hue > 1) hue -= 1;
    const size =
      ball.size <= 20
        ? ball.size * random(1.2, 1)
        : max(ball.size * random(1.2, 0.8), 20);
    const offset = (ball.size + size) * 0.9;

    const roundness = clamp(ball.roundness + random(0.2, -0.2), 0, 0.75);
    let edges = ball.edges;
    if (roundness >= 0.75) edges = clamp(round(edges * random(2, -2)), 3, 7);

    return this.createBall(
      hue,
      size,
      roundness,
      edges,
      ball.body.position.x + offset * sin(r),
      ball.body.position.y + offset * cos(r),
      ball.isEgg
    );
  };

  private cleanup = () => {
    if (!this.engine) {
      return;
    }
    this.balls = this.balls.filter((b) => {
      const { x, y } = b.body.position;
      if (x > -100 && x < 500 && y > -100 && y < 500) return true;
      World.remove(this.engine!.world, b.body);
      return false;
    });
  };

  private createCOG = () => {
    const gravity = 6e-6;
    this.COG = Matter.Bodies.circle(200, 200, 6, {
      isStatic: true,
      render: {
        fillStyle: `red`,
        strokeStyle: "white",
        lineWidth: 2,
      },
      plugin: {
        attractors: [
          (bodyA: Matter.Body, bodyB: Matter.Body) => {
            return {
              x: (bodyA.position.x - bodyB.position.x) * gravity,
              y: (bodyA.position.y - bodyB.position.y) * gravity,
            };
          },
        ],
      },
    });
    this.COG.position.x = 300;
    World.add(this.engine!.world, this.COG!);
  };

  private initMouse = () => {
    if (!this.renderer || !this.engine) {
      return;
    }
    this.mouse = Mouse.create(this.renderer.canvas);
    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: this.mouse,
      // @ts-ignore
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });
    let start = 0;
    Events.on(this.mouseConstraint, "startdrag", (e) => {
      start = timestamp();
    });

    Events.on(this.mouseConstraint, "enddrag", (e) => {
      if (timestamp() - start > 300) return;
      const body = e.body;
      const ball = this.balls.find((i) => i.body === body);

      if (ball) {
        this.clone(ball);
        this.cleanup();
      }
    });

    Events.on(this.mouseConstraint, "mousemove", (e) => {
      if (this.COG) {
        // @ts-ignore
        this.COG.position = e.mouse.absolute;
      }
    });
    World.add(this.engine.world, this.mouseConstraint);
    this.renderer.mouse = this.mouse;
    // @ts-ignore
    this.renderer.element.style.zIndex = -1;
  };
}

export default Page015;
