//@ts-nocheck
import { Vector } from ".";

export function initCanvas(
  canvas: HTMLCanvasElement,
  width = 400,
  height = 400,
  _dpi?: number
) {
  const ctx = canvas.getContext("2d")!;

  const dpr = window.devicePixelRatio || 1;
  const bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;

  const dpi = _dpi || dpr / bsr;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = dpi * width;
  canvas.height = dpi * height;
  ctx.scale(dpi, dpi);

  return { ctx, dpi };
}

export const getPointyHaxgonalPoint = (
  size: number,
  center: Vector
): Vector[] => {
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

export const getFlatHaxgonalPoint = (
  size: number,
  center: Vector
): Vector[] => {
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

export class FrameBase {
  protected context: CanvasRenderingContext2D;
  protected canvasSize: {
    width: number;
    height: number;
    cx: number;
    cy: number;
  };
  protected canvas: HTMLCanvasElement;
  protected cleanUp: () => void = () => {};
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const { ctx } = initCanvas(canvas);
    this.context = ctx;
    this.canvasSize = {
      width: canvas.width,
      height: canvas.height,
      cx: canvas.width / 2,
      cy: canvas.height / 2,
    };
  }

  destroy = () => {
    this.cleanUp();
  };
}

export type sketchFunctionProps = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  frame?: number;
};
