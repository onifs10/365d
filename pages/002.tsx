import type { NextPage } from "next";
import Paper from "../components/Paper";
import React, { useCallback, useEffect, useRef } from "react";
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
import styles from "../styles/002.module.scss";
// @ts-ignore
import { lerp } from "canvas-sketch-util/math";
// @ts-ignore
import canavasSketch from "canvas-sketch";
import Canvas from "../components/Canvas";

const FULL_CIRCLE = Math.PI * 2;
const HALF_CIRCLE = Math.PI;

type sketchFunctionProps = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
};

const settings = {
  dimensions: [400, 400],
  pixelsPerInch: 300,
};

const sketchTwo = () => {
  const size = random.rangeFloor(10, 50);
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

// paper

const Paper002: NextPage = () => {
  const divRef = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback((canvas: HTMLCanvasElement) => {
    canavasSketch(sketchTwo, { ...settings, canvas });
  }, []);

  const redraw = () => {
    const canvas = divRef.current;
    if (canvas) {
      draw(canvas);
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
      const canvas = divRef.current;
      if (canvas) {
        draw(canvas);
      }
    }
  }, [divRef, draw]);

  return (
    <Paper
      pageTitle={"Day 002 Canvas Drawing"}
      pageDescription={"Day Two Exploting js -- Drawing on html canvas"}
      paperTitle={"Canvas Drawing (one)"}
      paperTip={
        "click on canvas to change image, or press enter to change image "
      }
    >
      <Canvas
        className={styles.canvas}
        ref={divRef}
        onClick={redraw}
        onKeyDown={handleKeyInteraction}
        tabIndex={0}
      />
    </Paper>
  );
};

export default Paper002;
