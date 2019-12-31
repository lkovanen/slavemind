import * as React from 'react';
import { randInt, randTime } from './random';
import { Point } from './types';
import { default as drawShapeAtOrigin } from './star';
import { secondsSince } from './helpers';
import { HSVtoColor } from './color';

export type AnimatedShape = {
  getLocation: () => Point,
  draw: (ctx: CanvasRenderingContext2D) => void,
  isVisible: () => boolean
};

let shapes: Array<AnimatedShape> = [];

let newShapeCenter: Point | null;
let newShapeTime: Date | null;

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const randomPoint = (margin: number): Point => {
  return {
    x: randInt(margin, canvasWidth - margin),
    y: randInt(margin, canvasHeight - margin)
  };
};

const drawShape = (ctx: CanvasRenderingContext2D, center: Point, size: number, rotation: number, color: string) => {
  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate(rotation);
  drawShapeAtOrigin(ctx, size, color);
  ctx.restore();
};

export const animateShape = (center: Point, size: number) => {
  const birth = new Date();
  const lifetimeSecond = randTime(60);

  const dampingCoeff = 0.8;
  const sizeVelocity = Math.PI * 2 / 2;
  
  const initialRotation = Math.random() * Math.PI * 2;
  const angularVelocity = Math.PI * 2 / randInt(5, 50) * (Math.random() > 0.5 ? 1 : -1);

  const color = HSVtoColor((birth.getTime() / 1000) % 60 / 59, 0.25, 0.85);

  const rotation = (t: number) => initialRotation + t * angularVelocity;
  const currentSize = (t: number) => size * (1 - Math.exp(-dampingCoeff * t) * Math.cos(sizeVelocity * t));
  const location = (t: number): Point => {
    if (t <= lifetimeSecond) {
      return center;
    }
    const yDelta = 40 * Math.pow(t - lifetimeSecond, 2) - 40 * (t - lifetimeSecond);
    return { x: center.x, y: center.y + yDelta };
  };

  return {
    getLocation: () => location(secondsSince(birth)),
    draw: (ctx: CanvasRenderingContext2D) => {
      const t = secondsSince(birth);
      drawShape(ctx, location(t), currentSize(t), rotation(t), color);
    },
    isVisible: () => {
      const t = secondsSince(birth);
      return location(t).y - currentSize(t) < canvasHeight;
    }
  };
};

const setBackground = (ctx: CanvasRenderingContext2D, color: string) => {
  ctx.fillStyle = color;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const createRandomShapes = (meanInterval: number) => {
  const minSize = 5;
  const maxSize = 50;
  
  const size = randInt(minSize, maxSize);
  const center = randomPoint(0);
  shapes.push(animateShape(center, size));

  setTimeout(() => createRandomShapes(meanInterval), randTime(meanInterval));
};

const cleanShapes = () => {
  shapes = shapes.filter(shape => shape.isVisible());
};

const drawShapes = (ctx: CanvasRenderingContext2D) => {
  shapes.forEach(shape => shape.draw(ctx));
};

const newShapeSize = (): number => {
  if (newShapeTime) {  
    const radiusPixelsPerSecond = 60;
    const maxSize = 300;
    const t = secondsSince(newShapeTime);
    return Math.min(2 + t * radiusPixelsPerSecond, maxSize);
  }
  return 0;
};

const drawShapeCreation = (ctx: CanvasRenderingContext2D) => {
  if (newShapeCenter && newShapeTime) {
    const radius = newShapeSize();
    
    const radGrad = ctx.createRadialGradient(
      newShapeCenter.x,
      newShapeCenter.y,
      Math.max(0, radius - 10),
      newShapeCenter.x,
      newShapeCenter.y,
      Math.max(1, radius)
    );
    radGrad.addColorStop(0, 'rgba(255, 0, 0, 0)');
    radGrad.addColorStop(1, 'rgba(255, 100, 100, 1)');
    
    ctx.beginPath();
    ctx.arc(newShapeCenter.x, newShapeCenter.y, radius, 0, Math.PI * 2);
    ctx.closePath();

    ctx.fillStyle = radGrad;
    ctx.fill();
  }
};

const startShapeCreation = (e: MouseEvent) => {
  newShapeTime = new Date();
  newShapeCenter = {
    x: e.clientX,
    y: e.clientY
  };
};

const endShapeCreation = (e: MouseEvent) => {
  if (newShapeCenter && newShapeTime) {
    const radius = newShapeSize();
    shapes.push(animateShape(newShapeCenter, radius));
  }
  newShapeTime = null;
  newShapeCenter = null;
};

const drawAll = (ctx: CanvasRenderingContext2D) => {
  setBackground(ctx, 'white');
  drawShapes(ctx);
  drawShapeCreation(ctx);
  window.requestAnimationFrame(() => drawAll(ctx));
};

class App extends React.Component {
  context: CanvasRenderingContext2D | null;
  
  componentDidMount() {
    if (this.context) {
      const meanGenerationInterval = 1000;
      this.context.canvas.addEventListener('mousedown', startShapeCreation);
      this.context.canvas.addEventListener('mouseup', endShapeCreation);
      createRandomShapes(meanGenerationInterval);
      setInterval(cleanShapes, 10 * meanGenerationInterval);
      drawAll(this.context);
    }
  }
  
  render() {
    return (
      <div>
      <canvas
        ref={canvas => this.context = canvas ? canvas.getContext('2d') : null}
        width={canvasWidth}
        height={canvasHeight}
      />
      </div>
    );
  }
}

export default App;
