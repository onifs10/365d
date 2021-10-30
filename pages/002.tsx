import type { NextPage } from "next";
import Paper from "../components/Paper";
import React, { useCallback, useEffect, useRef } from "react";
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
import styles from "../styles/002.module.scss";

const FULL_CIRCLE = Math.PI * 2;
const HALF_CIRCLE = Math.PI;

type sketchFunctionProps = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
};

const Paper002: NextPage = () => {
  const divRef = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback((context: CanvasRenderingContext2D) => {
    const drawingFunction = sketchTwo(random.rangeFloor(10, 50));
    drawingFunction({ context, width: 400, height: 400 });
  }, []);

  const redraw = () => {
    const context = divRef.current?.getContext("2d");
    if (context) {
      context.clearRect(0, 0, 500, 500);
      draw(context);
    }
  };

  const handleKeyInteraction = (
    event: React.KeyboardEvent<HTMLCanvasElement>
  ) => {
    if (event.key === "Enter" || event.code === "Space") {
      redraw();
    }
  };
  useEffect(() => {
    if (divRef.current) {
      const context = divRef.current.getContext("2d");
      if (context) {
        draw(context);
      }
    }
  }, [divRef, draw]);

  return (
    <Paper
      pageTitle={"Day 002 Canvas Drawing"}
      pageDescription={"Day Two Exploting js -- Drawing on html canvas"}
      paperTitle={"Canvas Drawing"}
      paperTip={
        "click on canvas to change image, or press enter to change image "
      }
    >
      <canvas
        className={styles.canvas}
        width="400"
        height="400"
        ref={divRef}
        onClick={redraw}
        onKeyDown={handleKeyInteraction}
        tabIndex={0}
      ></canvas>
    </Paper>
  );
};

export default Paper002;

const sketchTwo = (size: number) => {
  const colors = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colors);

  const createGrid = (matrix: number) => {
    const points = [];
    const count = matrix;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = random.noise2D(u, v);
        points.push({
          position: [u, v],
          radius: Math.abs(radius * 0.1),
          color: random.pick(palette),
          rotate: random.noise2D(u, v),
        });
      }
    }
    return points;
  };
  const points = createGrid(size).filter(() => random.value() > 0.5);
  const margin = 20;

  return ({ context, width, height }: sketchFunctionProps) => {
    //add backgroud white
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    //sketch each point
    points.forEach(({ position: [u, v], radius, color, rotate }) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      //cricles
      context.beginPath();
      context.arc(x, y, radius * width * 0.5, 0, FULL_CIRCLE, false);
      context.fillStyle = color;
      context.fill();

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px Arial`;
      context.translate(x, y);
      context.rotate(rotate);
      context.fillText("=", 0, 0);
      context.restore();
    });
  };
};
