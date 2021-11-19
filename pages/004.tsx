import { NextPage } from "next";
import { useEffect, useState } from "react";
import Paper from "../components/Paper";
import styles from "../styles/004.module.scss";
import { pick, SQRT_3, Vector } from "../utils";
const palettes = require("nice-color-palettes");

const getHaxgonalPoint = (size: number, center: Vector): Vector[] => {
  const points: Vector[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = 60 * i;
    const angleInRad = (Math.PI / 180) * angle;
    let xCoordinate = center[0] + size * Math.cos(angleInRad);
    let yCoordinate = center[1] + size * Math.sin(angleInRad);
    points.push([xCoordinate, yCoordinate]);
  }
  return points;
};

const sketchFunction = (canvas: HTMLCanvasElement, size: number) => {
  const context = canvas.getContext("2d");
  let offsetX = size / 2;
  let offsetY = -size / 2 / SQRT_3;
  let countX = Math.floor(canvas.width / size);
  for (let y = (SQRT_3 * size) / 2; y < canvas.width; y += SQRT_3 * size) {
    for (let x = 0; x < countX; x++) {
      let centerX = x * (size * 2 * (3 / 4));
      let centerY = y;
      if (x % 2 === 1) {
        centerY = y + (SQRT_3 * size) / 2;
      }
      let points = getHaxgonalPoint(size, [
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

const Page004: NextPage = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (canvas) {
      sketchFunction(canvas, pick([20, 30, 10, 5]));
    }
  }, [canvas]);
  return (
    <Paper
      pageTitle={"Hex grid"}
      pageDescription={"Drawing hexagonal grids on canvas"}
      paperTitle={"Hexagonal grids"}
      paperTip={""}
    >
      <canvas
        ref={setCanvas}
        className={styles.canvas}
        width="400"
        height="400"
      />
    </Paper>
  );
};

export default Page004;
