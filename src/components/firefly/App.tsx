import * as React from 'react';
import { Firefly, Vector } from './types';
import { createFirefly } from './firefly';
import { createWorld } from './world';
import { squaredDistance } from './helpers';
import { HSVtoColor } from '../stars/color';
import { animateShape, AnimatedShape } from '../stars/App';
import './firefly.css';

const debug = false;

const backgroundColor = HSVtoColor(0, 0, 0.005);
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
const liveRadius = 12;
const hues = [0.0, 0.16];
const timeUntilRespawn = 1200;
const collectibleRadius = 8;
const planetIncrement = 7;

const initialLives = 3;

let livesLeft: number[] = [];
let flies: Firefly[] = [];
let score: number = 0;

let gameOver = true;
let collectible: AnimatedShape | null = null;

const getLifeLocation = (flyIndex: number, lifeIndex: number) => {
  const dir = (2 * flyIndex) - 1;
  return {
    x: canvasWidth / 2 + dir * lifeIndex * liveRadius * 2 + dir * 30,
    y: 16
  };
};

let world = createWorld(canvasWidth, canvasHeight);

const startGame = () => {
  score = 0;
  livesLeft = [initialLives, initialLives];
  gameOver = false;
  world = createWorld(canvasWidth, canvasHeight);
  flies = [
    createFirefly(hues[0], getLifeLocation(0, livesLeft[0] + 1), world),
    createFirefly(hues[1], getLifeLocation(1, livesLeft[1] + 1), world)
  ];
};
startGame();

const randomizeCollectible = () => {
  const margin = collectibleRadius * 3;
  const newLocation = {
    x: margin + Math.random() * (world.width - 2 * margin),
    y: margin + Math.random() * (world.height - 2 * margin)
  };
  if (squaredDistance(newLocation, world.planet.center) > Math.pow(world.planet.radius + margin, 2)) {
    collectible = animateShape(newLocation, collectibleRadius);
  }
};

const drawBackground = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = backgroundColor;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const drawPlanet = (ctx: CanvasRenderingContext2D) => {
  const gradient = ctx.createRadialGradient(
    world.planet.center.x, world.planet.center.y, world.planet.radius - 70,
    world.planet.center.x, world.planet.center.y, world.planet.radius
  );
  gradient.addColorStop(0, backgroundColor);
  gradient.addColorStop(1, HSVtoColor(0, 0, 0.2));
  ctx.fillStyle = gradient;
  ctx.strokeStyle = HSVtoColor(0, 0, 0.35);

  ctx.beginPath();
  ctx.arc(world.planet.center.x, world.planet.center.y, world.planet.radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

const drawLives = (flyIndex: number, ctx: CanvasRenderingContext2D, ms: number) => {
  const fly = flies[flyIndex];

  for (let lifeIndex = 1; lifeIndex <= livesLeft[flyIndex]; lifeIndex++) {
    const loc = getLifeLocation(flyIndex, lifeIndex);
    let radius = liveRadius;

    const gradient = ctx.createRadialGradient(loc.x, loc.y, 0, loc.x, loc.y, liveRadius);
    if (fly.isDead && fly.offScreenTime && ms > fly.offScreenTime && lifeIndex === livesLeft[flyIndex]) {
      const value = 0.3 + 0.7 * Math.min(1, (ms - fly.offScreenTime) / timeUntilRespawn);
      radius = value * fly.radius + (1 - value) * liveRadius;
      gradient.addColorStop(0.2 * value, HSVtoColor(fly.hue, 0.8, value));
    } else {
      gradient.addColorStop(0, HSVtoColor(fly.hue, 0.8, 0.4));
    }
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(loc.x, loc.y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }
};

const drawFirefly = (fly: Firefly, ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = HSVtoColor(fly.hue, 0.8, 1.0);
  ctx.beginPath();
  ctx.arc(fly.location.x, fly.location.y, fly.radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
};

const drawScore = (ctx: CanvasRenderingContext2D) => {
  const x = canvasWidth / 2;
  const y = 16;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = HSVtoColor(0, 0, 0.6);
  ctx.font = '22px Helvetica';
  ctx.textAlign = 'center';
  ctx.fillText(score.toString(), x, y);
};

const drawVector = (fly: Firefly, force: Vector, color: string, ctx: CanvasRenderingContext2D) => {
  const scale = 0.25;
  ctx.fillStyle = HSVtoColor(fly.hue, 0.8, 1.0);
  ctx.beginPath();
  ctx.moveTo(fly.location.x, fly.location.y);
  ctx.lineTo(fly.location.x + force.x * scale, fly.location.y + force.y * scale);
  ctx.strokeStyle = color;
  ctx.closePath();
  ctx.stroke();
};

const drawForces = (fly: Firefly, ctx: CanvasRenderingContext2D) => {
  drawVector(fly, world.gravity(fly.location), 'red', ctx);
  drawVector(fly, fly.thrust, 'yellow', ctx);
  drawVector(fly, fly.drag, 'blue', ctx);
  drawVector(fly, fly.force, 'white', ctx);
};

const drawTail = (fly: Firefly, ctx: CanvasRenderingContext2D, ms: number) => {
  fly.tail.forEach(({ t, loc }) => {
    const fraction = Math.pow(1 - Math.max((ms - t) / fly.tailTime), 2);
    ctx.fillStyle = HSVtoColor(fly.hue, 0.8, 0.7 * fraction);
    ctx.beginPath();
    ctx.arc(loc.x, loc.y, 0.7 * fly.radius * fraction, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  });
};

const drawDebugInfo = (fly: Firefly, ctx: CanvasRenderingContext2D, ms: number) => {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Position: ${Math.round(fly.location.x)}, ${Math.round(fly.location.y)}`, 10, 30);
  ctx.fillText(`Velocity: ${Math.round(fly.velocity.x)}, ${Math.round(fly.velocity.y)}`, 10, 50);
  ctx.fillText(`Force: ${Math.round(fly.force.x)}, ${Math.round(fly.force.y)}`, 10, 70);
  ctx.fillText(`Planet: ${Math.round(world.planet.center.x)}, ${Math.round(world.planet.center.y)}`, 10, 90);
};

const drawHint = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = HSVtoColor(0, 0.0, 0.3);
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`Game Over! Final score: ${score}`, canvasWidth / 2, canvasHeight / 2 - 20);
  ctx.fillText('Press ESC to fly again.', canvasWidth / 2, canvasHeight / 2 + 20);
};

const updatePlayerStatus = () => {
  gameOver = flies[1].isDead && livesLeft[1] === 0 &&
    flies[0].isDead && livesLeft[0] === 0;
};

const canHaveCollisions = (ms: number) =>
  flies.every(fly => !fly.isDead && fly.freezeUntil < ms);

const checkCollision = (ms: number) => {
  const collisionRadius = flies[0].radius + flies[1].radius + 2;
  const xDiff = flies[0].location.x - flies[1].location.x;
  const yDiff = flies[0].location.y - flies[1].location.y;

  if (xDiff * xDiff + yDiff * yDiff <= collisionRadius * collisionRadius) {
    if (Math.abs(xDiff) > 2 * Math.abs(yDiff)) {
      const freezeUntil = ms + 500;
      flies[0].freezeUntil = freezeUntil;
      flies[1].freezeUntil = freezeUntil;
      flies[0].velocity.x = Math.sign(xDiff) * 100;
      flies[1].velocity.x = -Math.sign(xDiff) * 100;
    } else if (yDiff > 0) {
      flies[0].die(ms);
    } else {
      flies[1].die(ms);
    }
  }
};

const checkCollection = (fly: Firefly, ms: number) =>
  collectible && squaredDistance(fly.location, collectible.getLocation()) < Math.pow(collectibleRadius, 2);

const canRespawn = (flyIndex: number, ms: number) => {
  const fly = flies[flyIndex];
  return livesLeft[flyIndex] > 0 && fly.offScreenTime && ms > fly.offScreenTime + timeUntilRespawn;
};

const respawn = (flyIndex: number, ms: number) => {
  const loc = getLifeLocation(flyIndex, livesLeft[flyIndex]);
  flies[flyIndex] = createFirefly(hues[flyIndex], loc, world);
  livesLeft[flyIndex] -= 1;
};

const drawAll = (ctx: CanvasRenderingContext2D, ms: number) => {
  drawBackground(ctx);
  drawLives(0, ctx, ms);
  drawLives(1, ctx, ms);

  flies.forEach((fly, i) => {
    if (fly.shouldUpdate) {
      fly.update(ms);
      drawTail(fly, ctx, ms);
    }
    drawFirefly(fly, ctx);

    if (checkCollection(fly, ms)) {
      score += 1;
      world.movePlanet(planetIncrement, ms);
      collectible = null;
    }
  });

  world.updatePlanet(ms);
  drawPlanet(ctx);
  drawScore(ctx);

  if (collectible && collectible.isVisible()) {
    collectible.draw(ctx);
  } else {
    randomizeCollectible();
  }

  if (canHaveCollisions(ms)) {
    checkCollision(ms);
  }

  if (flies[0].isDead || flies[1].isDead) {
    updatePlayerStatus();

    if (flies[0].isDead && canRespawn(0, ms)) {
      respawn(0, ms);
    }
    if (flies[1].isDead && canRespawn(1, ms)) {
      respawn(1, ms);
    }
  }

  if (debug) {
    drawDebugInfo(flies[1], ctx, ms);
    drawForces(flies[1], ctx);
  }

  if (gameOver) {
    drawHint(ctx);
  }

  window.requestAnimationFrame((_ms: number) => drawAll(ctx, _ms));
};

const onKey = (event: KeyboardEvent, value: boolean) => {
  switch (event.key) {
    case 'a': flies[0].keyLeft = value; break;
    case 's': flies[0].keyRight = value; break;
    case 'k': flies[1].keyLeft = value; break;
    case 'l': flies[1].keyRight = value; break;
    case 'Escape':
      if (value) {
        startGame();
      }
      break;
    default: break;
  }
};

const setFlyLocation = (e: MouseEvent) => {
  flies[1].shouldUpdate = false;
  flies[1].location = {
    x: e.clientX,
    y: e.clientY
  };
};

const continueUpdate = (e: MouseEvent) => {
  flies[1].shouldUpdate = true;
};

class App extends React.Component {
  context: CanvasRenderingContext2D | null;

  componentDidMount() {
    if (this.context) {
      document.addEventListener('keydown', (e: KeyboardEvent) => onKey(e, true), false);
      document.addEventListener('keyup', (e: KeyboardEvent) => onKey(e, false), false);
      if (debug) {
        this.context.canvas.addEventListener('mousedown', setFlyLocation);
        this.context.canvas.addEventListener('mouseup', continueUpdate);
      }
      drawAll(this.context, 0);
    }
  }

  render() {
    return (
      <div className="game-container">
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
