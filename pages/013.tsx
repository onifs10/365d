import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Canvas from "../components/Canvas";
import Paper from "../components/Paper";
import SliderComponent from "../components/slider";
import { FrameBase, polar2cart, r15, r180, r90 } from "../utils";
import styles from "../styles/011.module.scss";

const Tips = (): JSX.Element => {
  return (
    <div>
      <h3>action</h3>
      <ul>
        <li>change the lenght of a branch</li>
        <li>change initial branch count</li>
        <li>click on canvas to re-render</li>
      </ul>
    </div>
  );
};
const Page013: NextPage = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [length, setLength] = useState<number>(5);
  const [branches, setBranches] = useState<number>(3);

  useEffect(() => {
    if (canvas.current) {
      const frameObj = new Frame(canvas.current, length, branches);
      setFrame(frameObj);
      frameObj.start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);

  useEffect(() => {
    if (frame) {
      frame.update(length, branches);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branches, length]);
  return (
    <Paper
      pageTitle={"Tree"}
      pageDescription={"growing tree"}
      paperTitle={"Tree"}
      paperTip={<Tips />}
    >
      <Canvas ref={canvas} onClick={() => frame && frame.start()} />
      <div className={styles.inputsDiv}>
        <div>
          <label htmlFor="slider">Lenght</label>
          <SliderComponent
            min={5}
            max={10}
            stepSize={1}
            labelStepSize={1}
            value={length}
            onChange={(len) => {
              setLength(len);
            }}
          />
        </div>
        <div>
          <label htmlFor="slider">branches</label>
          <SliderComponent
            min={1}
            max={6}
            stepSize={1}
            labelStepSize={1}
            value={branches}
            onChange={(size) => {
              setBranches(size);
            }}
          />
        </div>
      </div>
    </Paper>
  );
};

export default Page013;

const { random } = Math;
class Frame extends FrameBase {
  private steps: Function[] = [];
  private prevSteps: Function[] = [];
  private iterations = 0;
  private branches = 5;
  private length = 5;
  private playing = false;

  constructor(canvas: HTMLCanvasElement, length?: number, branches?: number) {
    super(canvas);
    if (length) {
      this.length = length;
    }

    if (branches) {
      this.branches = branches;
    }
  }

  update = (len: number, branches: number) => {
    this.length = len;
    this.branches = branches;
    this.start();
  };

  private step = (x: number, y: number, rad: number) => {
    const len = this.length * random();
    const [nx, ny] = polar2cart(x, y, len, rad);

    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.lineTo(nx, ny);
    this.context.stroke();

    const rad1 = rad + random() * r15;
    const rad2 = rad - random() * r15;

    if (
      nx < -100 ||
      nx > this.canvasSize.width + 100 ||
      ny < -100 ||
      ny > this.canvasSize.height + 100
    )
      return;

    if (this.iterations <= this.branches || random() > 0.5)
      this.steps.push(() => this.step(nx, ny, rad1));

    if (this.iterations <= this.branches || random() > 0.5)
      this.steps.push(() => this.step(nx, ny, rad2));
  };

  private sketchLines = () => {
    this.iterations += 1;
    this.prevSteps = this.steps;
    this.steps = [];
    if (!this.prevSteps.length) {
      this.playing = false;
    } else {
      this.prevSteps.forEach((i) => i());
    }
  };

  animate = () => {
    if (this.playing) {
      this.sketchLines();
      window.requestAnimationFrame(this.animate);
    }
  };

  start = () => {
    this.playing = false;
    this.context.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
    this.context.lineWidth = 1;
    this.context.strokeStyle = "green";
    this.prevSteps = [];
    this.iterations = 0;
    this.steps =
      random() < 0.5
        ? [
            () => this.step(0, random() * this.canvasSize.height, 0),
            () =>
              this.step(
                this.canvasSize.width,
                random() * this.canvasSize.height,
                r180
              ),
          ]
        : [
            () => this.step(random() * this.canvasSize.width, 0, r90),
            () =>
              this.step(
                random() * this.canvasSize.width,
                this.canvasSize.height,
                -r90
              ),
          ];
    this.playing = true;
    this.animate();
  };
}
