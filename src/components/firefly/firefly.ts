import { Firefly, Vector, World } from './types';
import { getAngle, asVector, vectorLength, squaredDistance } from './helpers';

export const createFirefly = (
  hue: number,
  initialLocation: Vector,
  world: World
): Firefly => {
  const dragCoeff = 0.00003;
  const strength = 1000;
  const sideFreezeTimeMs = 500;

  const fly: Firefly = {
    mass: 0.6,
    radius: 3,
    hue: hue,
    tailTime: 600,
    location: initialLocation,
    force: { x: 0, y: 0 },
    thrust: { x: 0, y: 0 },
    drag: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    lastUpdateTime: 0,
    freezeUntil: 0,
    keyLeft: false,
    keyRight: false,
    tail: [],
    update: (ms: number) => { return; },
    die: (ms: number) => { return; },
    isDead: false,
    offScreenTime: 0,
    shouldUpdate: true
  };

  fly.die = (ms: number) => {
    fly.isDead = true;
  };

  const getThrust = (gravity: Vector) => {
    let angle = getAngle(gravity);
    if (fly.keyLeft && !fly.keyRight) {
      angle += Math.PI / 2;
    } else if (!fly.keyLeft && fly.keyRight) {
      angle -= Math.PI / 2;
    } else if (fly.keyLeft && fly.keyRight) {
      angle += Math.PI;
    } else {
      return { x: 0, y: 0 };
    }
    return asVector(strength, angle);
  };

  const getDrag = (ms: number) =>
    asVector(
      dragCoeff * Math.pow(vectorLength(fly.velocity), 3),
      getAngle(fly.velocity) + Math.PI
    );

  const updateForce = (ms: number) => {
    const gravity = world.gravity(fly.location);
    fly.drag = getDrag(ms);

    const freeze = fly.isDead || ms < fly.freezeUntil;
    fly.thrust = freeze ? { x: 0, y: 0 } : getThrust(gravity);

    fly.force = {
      x: gravity.x + fly.drag.x + fly.thrust.x,
      y: gravity.y + fly.drag.y + fly.thrust.y,
    };
  };

  const checkSideWalls = (ms: number) => {
    if (fly.location.x < 0) {
      fly.velocity.x = -fly.velocity.x;
      fly.freezeUntil = ms + sideFreezeTimeMs;
    } else if (fly.location.x > world.width) {
      fly.location.x = world.width - 0.1;
      fly.velocity.x = -fly.velocity.x;
      fly.freezeUntil = ms + sideFreezeTimeMs;
    }
  };

  const checkCeilingAndPlanet = (ms: number) => {
    if (!fly.isDead) {
      if (fly.location.y <= 0) {
        fly.die(ms);
        fly.velocity.y = 0;
      } else if (fly.location.y > world.height) {
        fly.die(ms);
      } else if (squaredDistance(fly.location, world.planet.center) <= Math.pow(world.planet.radius, 2)) {
        fly.die(ms);
        const gravity = world.gravity(fly.location);
        fly.velocity = asVector(800, getAngle(gravity) + Math.PI + 0.4 * (Math.random() - 0.5));
      }
    } else {
      if (fly.location.y > world.height && !fly.offScreenTime) {
        fly.offScreenTime = ms;
      }
    }
  };

  const updateTail = (ms: number) => {
    fly.tail = fly.tail.filter(({ t }) => ms - t < fly.tailTime);
    fly.tail.push({ t: ms, loc: { x: fly.location.x, y: fly.location.y } });
  };

  fly.update = (ms: number) => {
    const timeDelta = fly.lastUpdateTime ? (ms - fly.lastUpdateTime) / 1000 : 0;

    updateForce(ms);

    fly.velocity.x += fly.force.x * timeDelta / fly.mass;
    fly.velocity.y += fly.force.y * timeDelta / fly.mass;

    checkSideWalls(ms);
    checkCeilingAndPlanet(ms);

    fly.location.x += fly.velocity.x * timeDelta;
    fly.location.y += fly.velocity.y * timeDelta;

    updateTail(ms);

    fly.lastUpdateTime = ms;
  };

  return fly;
};
