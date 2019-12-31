import { Vector } from './types';

const squaredLength = (v: Vector) => Math.pow(v.x, 2) + Math.pow(v.y, 2);

export const squaredDistance = (pointA: Vector, pointB: Vector) =>
  squaredLength({
    x: pointA.x - pointB.x,
    y: pointA.y - pointB.y
  });

export const getAngle = (fromPoint: Vector, toPoint?: Vector): number => {
  if (!toPoint) {
    return getAngle({ x: 0, y: 0 }, fromPoint);
  }
  return Math.atan2(toPoint.y - fromPoint.y, toPoint.x - fromPoint.x);
};

export const asVector = (strength: number, angle: number) => (
  {
    x: Math.cos(angle) * strength,
    y: Math.sin(angle) * strength,
  }
);

export const vectorLength = (v: Vector) => Math.sqrt(squaredLength(v));
