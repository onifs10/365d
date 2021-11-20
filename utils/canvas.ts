import { Vector } from ".";

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

export const getFlatHaxgonalPoint = (size: number, center: Vector): Vector[] => {
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
