import { NextPage } from "next";
import Paper from "../components/Paper";
import styles from "../styles/003.module.scss";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { get, r30, r60, SQRT_3, Vector, shuffle, range, pick } from "../utils";
const palettes = require("nice-color-palettes");

const patterns = ["*?", "p1", "p2", "p3"];

const Paper003: NextPage = () => {
  const divRef = useRef<HTMLCanvasElement | null>(null);
  const [selected, setSelected] = useState(pick([0, 1, 2, 3]));

  const drawSketch = useCallback(
    (
      canvas: HTMLCanvasElement,
      x: number,
      y: number,
      size: number,
      colors: string[]
    ) => {
      const context = canvas.getContext("2d");
      const points: Vector[] = [];
      for (let i = 0; i < 6; i++) {
        let xCordinate = x + size * Math.cos(((i % 6) * 2 * Math.PI) / 6);
        let yCordinate = y + size * Math.sin((i * 2 * Math.PI) / 6);
        points.push([xCordinate, yCordinate]);
      }

      const midPoints: Vector[] = points.map((_, i) => {
        const [x1, y1] = points[i];
        const [x2, y2] = points[(i + 1) % 6];
        return [(x1 + x2) / 2, (y1 + y2) / 2];
      });
      if (context) {
        context.strokeStyle = colors[0];
        context.lineWidth = 2;
      }

      function drawArc1(offset: number) {
        context?.save();
        if (context) {
          context.lineWidth = 3;
          context.strokeStyle = pick(colors);
        }
        context?.beginPath();
        context?.arc(
          ...get(points, offset),
          size / 2,
          r60 * (2 + offset),
          r60 * (4 + offset)
        );
        context?.stroke();
        context?.restore();
      }
      function drawArc2(offset: number) {
        const point: Vector = [
          x + size * Math.cos(offset * r60 + r30) * SQRT_3,
          y + size * Math.sin(offset * r60 + r30) * SQRT_3,
        ];
        context?.save();
        if (context) {
          context.lineWidth = 2;
          context.strokeStyle = pick(colors);
        }
        context?.beginPath();
        context?.arc(
          ...point,
          size * 1.5,
          r60 * (offset + 3),
          r60 * (offset + 4)
        );
        context?.stroke();
        context?.restore();
      }
      const drawLineThrough = (offset: number) => {
        context?.save();
        if (context) {
          context.lineWidth = 1;
          context.strokeStyle = pick(colors);
        }
        context?.beginPath();
        context?.moveTo(...get(midPoints, offset));
        context?.lineTo(...get(midPoints, offset + 3));
        context?.stroke();
        context?.restore();
      };

      //draw hexagon
      const drawaHexagon = () => {
        if (context) {
          context.beginPath();
          context.moveTo(...points[0]);
          for (let i = 1; i < points.length; i++) {
            context.lineTo(...points[i]);
          }
          context.closePath();
          context.stroke();
        }
      };

      //draw lines
      drawaHexagon();
      const _mode = patterns[selected];
      if (_mode === "p1") {
        const offset = Math.round(Math.random() * 5);
        drawArc1(offset);
        drawArc1(offset + 3);
        drawLineThrough(offset + 1);
      } else if (_mode === "p2") {
        const offset = Math.round(Math.random() * 5);
        drawArc2(offset);
        drawArc2(offset + 1);
        drawArc1(offset + 4);
      } else if (_mode === "p3") {
        const offset = Math.round(Math.random() * 5);
        drawArc2(offset + 2);
        drawArc2(offset + 5);
        drawLineThrough(offset + 5);
      } else {
        const shuffled = shuffle(range(6));
        for (let i = 0; i < 3; i++) {
          const a = shuffled[i * 2];
          const b = shuffled[i * 2 + 1];
          context?.save();
          if (context) {
            context.lineWidth = 3;
            context.strokeStyle = pick(colors);
          }
          context?.beginPath();
          context?.moveTo(...midPoints[a]);
          context?.lineTo(...midPoints[b]);
          context?.stroke();
          context?.restore();
        }
      }
    },
    [selected]
  );

  const draw = useCallback(
    (canvas: HTMLCanvasElement) => {
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
      const colors: string[] = pick(palettes);
      const colorsTwo: string[] = pick(palettes);
      const size = 30;
      const initX = -1;
      const initY = 18 - size * SQRT_3;
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 20; y++) {
          const xOffset = y % 2 ? size * 1.5 : 0;
          drawSketch(
            canvas,
            initX + x * size * 3 + xOffset,
            initY + y * size * SQRT_3 * 0.5,
            size,
            [...colors, ...colorsTwo]
          );
        }
      }
    },
    [drawSketch]
  );
  useEffect(() => {
    if (divRef.current) {
      draw(divRef.current);
    }
  }, [divRef, draw, selected]);
  return (
    <Paper
      pageTitle={"Day 003 Canvas Drawing"}
      pageDescription={"Drawing in canvas"}
      paperTitle={"Canvas sketch"}
      paperTip={"Change pattern by selecting any option below the canvas"}
    >
      <canvas
        className={styles.canvas}
        width="400"
        height="400"
        ref={divRef}
        tabIndex={0}
      />
      <div className={styles.options}>
        {patterns.map((pattern, index) => (
          <div
            key={index}
            className={`${styles.option} ${
              index === selected ? styles.selected : ""
            }`}
            onClick={() => setSelected(index)}
            onKeyPress={(event: React.KeyboardEvent<HTMLDivElement>) => {
              event.stopPropagation();
              if (event.key === "Enter") {
                setSelected(index);
              }
            }}
            tabIndex={0}
            title={pattern}
          >
            {pattern}
          </div>
        ))}
      </div>
    </Paper>
  );
};

export default Paper003;
