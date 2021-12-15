import { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import Canvas from "../components/Canvas";
import Paper from "../components/Paper";
import { pick, range } from "../utils";
import styles from "../styles/011.module.scss";
import { Button } from "@blueprintjs/core";
import SliderComponent from "../components/slider";
const palettes = require("nice-color-palettes");

const MathContext = `const {${Object.getOwnPropertyNames(Math).join(
  ","
)}}=Math`;

const Page011: NextPage = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const iframe = useRef<HTMLIFrameElement | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [fumX, setFumX] = useState<string>("x + (random() - 0.5) * 8");
  const [fumY, setFumY] = useState<string>("y + (random() - 0.5) * 8");
  const [playing, setPlaying] = useState<boolean>(true);
  const [size, setSize] = useState<number>(pick([20, 30, 15, 10, 7, 5]));
  // track  formular change
  useEffect(() => {
    if (frame) {
      frame.stop();
      frame.addRandomizationFunc(fumX, fumY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fumX, fumY]);

  useEffect(() => {
    if (frame) {
      frame.updateSpeed(size);
    }
  }, [size, frame]);

  useEffect(() => {
    if (!frame && canvas.current && iframe.current) {
      const frame = new Frame(
        canvas.current,
        iframe.current,
        () => setPlaying(false),
        size
      );
      setFrame(frame);
      frame.init().addRandomizationFunc(fumX, fumY).animate();
    }
  }, [canvas, frame]);

  const handleButtonClick = useCallback(() => {
    if (frame) {
      playing ? frame.pause() : frame.start();
      setPlaying((v) => !v);
    }
  }, [frame, playing]);

  return (
    <Paper
      pageTitle={"Unpredictable"}
      pageDescription={"Print pixel dots on canvas randomly"}
      paperTitle={"Unpredictable"}
      paperTip={"Edit settings below"}
    >
      <Canvas ref={canvas} />
      <iframe
        sandbox="allow-same-origin"
        ref={iframe}
        style={{ display: "none" }}
      ></iframe>
      <div className={styles.inputsDiv}>
        <div className="x-input-div">
          <label htmlFor="x">{"x2 = (x,y,t) =>"} </label>
          <input
            type="text"
            value={fumX}
            onChange={(e) => setFumX(e.target.value)}
          />
        </div>
        <div className="y-inpt-div">
          <label htmlFor="y">{"y2 = (x,y,t) =>"} </label>
          <input
            type="text"
            value={fumY}
            onChange={(e) => setFumY(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="slider">speed</label>
          <SliderComponent
            min={5}
            max={30}
            stepSize={2}
            labelStepSize={5}
            value={size}
            onChange={(size) => {
              setSize(size);
            }}
          />
        </div>
        <div>
          <Button
            text={playing ? "pause" : "play"}
            intent={playing ? "primary" : "success"}
            onClick={handleButtonClick}
          />
        </div>
      </div>
    </Paper>
  );
};

class Frame {
  private context: CanvasRenderingContext2D | null;
  private canvasSize: {
    width: number;
    height: number;
  };
  private readonly runner: HTMLIFrameElement;
  private startTime: number = 0;
  private imageData: ImageData | null = null;
  private funcs: {
    x: (t: number, x: number, y: number) => number;
    y: (t: number, x: number, y: number) => number;
  } = {
    x: (t: number, x: number, y: number) => 0,
    y: (t: number, x: number, y: number) => 0,
  };
  private iterations: number = 2;
  private previousPosition: { x: number; y: number } = { x: 0, y: 0 };
  private playing: boolean = true;
  private emitStop: () => void;
  constructor(
    canvas: HTMLCanvasElement,
    runner: HTMLIFrameElement,
    emitStop: () => void,
    speed: number
  ) {
    this.context = canvas.getContext("2d");
    this.canvasSize = {
      width: canvas.width,
      height: canvas.height,
    };
    this.previousPosition.x = canvas.width / 2;
    this.previousPosition.y = canvas.height / 2;
    this.runner = runner;
    this.emitStop = emitStop;
    this.iterations = speed;
  }

  /**
   * this.imageData.data is a flat array of RGBA info of all pixels in an image
   */

  // draw pixel
  private drawPixel = (
    x: number,
    y: number,
    r: number,
    g: number,
    b: number
  ) => {
    if (this.imageData) {
      x = x % this.canvasSize.width;
      y = y % this.canvasSize.height;
      if (x < 0) x += this.canvasSize.width;
      if (y < 0) y += this.canvasSize.width;
      const pixelindex = (y * this.canvasSize.width + x) * 4; // multiplied by four because data arra is in RGBA order
      this.imageData.data[pixelindex] = r;
      this.imageData.data[pixelindex + 1] = g;
      this.imageData.data[pixelindex + 2] = b;
      this.imageData.data[pixelindex + 3] = 255;
    }
  };

  private clear = () => {
    for (const x of range(this.canvasSize.width)) {
      for (const y of range(this.canvasSize.height))
        this.drawPixel(x, y, 255, 255, 255);
    }
  };

  private iteration = () => {
    try {
      this.startTime += 1;
      const nx = +this.funcs.x(
        this.startTime,
        this.previousPosition.x,
        this.previousPosition.y
      );
      const ny = +this.funcs.y(
        this.startTime,
        this.previousPosition.x,
        this.previousPosition.y
      );
      const tx = Math.round(this.canvasSize.width / 2 + nx);
      const ty = Math.round(this.canvasSize.width / 2 - ny);

      this.drawPixel(tx, ty, 30, 130, 76);

      this.previousPosition = { x: nx, y: ny };
    } catch (e: any) {
      this.stop();
      console.log(e);
    }
  };

  init = () => {
    if (this.context) {
      this.imageData = this.context.createImageData(
        this.canvasSize.width,
        this.canvasSize.height
      );
    }
    this.context!.strokeStyle = "green";
    this.context!.lineWidth = 1;

    return this;
  };

  addRandomizationFunc = (funcX?: string, funcY?: string) => {
    try {
      if (this.runner.contentWindow) {
        if (funcX) {
          // @ts-ignore
          this.funcs.x = this.runner.contentWindow.eval(
            `()=>{
          ${MathContext};
          return (t,x,y) => {
            return ${funcX}
          }
        }`
          )();
        }
        if (funcY) {
          // @ts-ignore
          this.funcs.y = this.runner.contentWindow.eval(
            `()=>{
          ${MathContext};
          return (t,x,y) => {
            return ${funcY}
          }
        }`
          )();
        }
      }
      console.log(funcX, funcY, "ok");
    } catch (e: any) {
      this.stop();
      console.log(funcX, funcY, e.message);
    }
    return this;
  };

  animate = () => {
    try {
      for (let i = 0; i < this.iterations; i++) {
        this.iteration();
      }
      this.context?.putImageData(this.imageData!, 0, 0);
      if (this.playing) {
        window.requestAnimationFrame(this.animate);
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  stop = () => {
    this.playing = false;
    this.clear();
    this.startTime = 0;
    this.emitStop();
  };

  updateSpeed = (value: number) => {
    this.iterations = value;
  };
  start = () => {
    if (this.playing == false) {
      this.playing = true;
      this.animate();
    }
  };

  pause = () => {
    this.playing = false;
  };
}

export default Page011;
