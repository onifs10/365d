import { NextPage } from "next";
import { useEffect, useState } from "react";
import Paper from "../components/Paper";
import SliderComponent from "../components/slider";
import CanvasStyles from "../styles/canvas.module.scss";
import { pick, SQRT_3, Vector } from "../utils";
const palettes = require("nice-color-palettes");

const getPointyHaxgonalPoint = (size: number, center: Vector): Vector[] => {
  const points: Vector[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = 60 * i - 30;
    const angleInRad = (Math.PI / 180) * angle;
    let xCoordinate = center[0] + size * Math.cos(angleInRad);
    let yCoordinate = center[1] + size * Math.sin(angleInRad);
    points.push([xCoordinate, yCoordinate]);
  }
  return points;
};

const sketchFunction = (canvas: HTMLCanvasElement, size: number) => {
  const context = canvas.getContext("2d");
  context?.clearRect(0, 0, canvas.width, canvas.height);
  let offsetY = size / 2;
  let offsetX = -size / 2 / SQRT_3;
  let countY = Math.floor(canvas.width / size);
  for (let x = (SQRT_3 * size) / 2; x < canvas.width; x += SQRT_3 * size) {
    for (let y = 0; y < countY; y++) {
      let centerY = y * (size * 2 * (3 / 4));
      let centerX = x;
      if (y % 2 === 1) {
        centerX = x + (SQRT_3 * size) / 2;
      }
      let points = getPointyHaxgonalPoint(size, [
        centerX + offsetX,
        centerY + offsetY,
      ]);
      if (context) {
        context.beginPath();
        context.moveTo(...points[0]);
        for (let i = 1; i < points.length; i++) {
          context?.lineTo(...points[i]);
        }
        context.strokeStyle = pick(pick(palettes));
        context.lineWidth = 2;
        context.closePath();
        context.stroke();
      }
    }
  }
};

const Page005: NextPage = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState<number>(pick([20, 30, 15, 10, 7, 5]));
  useEffect(() => {
    if (canvas) {
      sketchFunction(canvas, size);
    }
  }, [canvas, size]);
  return (
    <Paper
      pageTitle={"Hex grid"}
      pageDescription={"Drawing hexagonal grids on canvas"}
      paperTitle={"Hexagonal grids (Pointy top)"}
      paperTip={"Change grid size using the slider below"}
    >
      <>
        <canvas
          ref={setCanvas}
          className={CanvasStyles.canvas}
          width="400"
          height="400"
        />
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
      </>
    </Paper>
  );
};

export default Page005;
