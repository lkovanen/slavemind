import { Vector, World } from './types';
import { getAngle, asVector, squaredDistance } from './helpers';

export const createWorld = (canvasWidth: number, canvasHeight: number): World => {
  const gravityAtSurface = 800;
  const planetRadius = canvasWidth / 2;
  const gravityCoeff = gravityAtSurface * Math.pow(planetRadius, 2);
  const planetSpeed = -0.001;

  const planet = {
    radius: planetRadius,
    center: {
      x: canvasWidth / 2,
      y: canvasHeight + planetRadius - 30
    },
    newCenter: {
      x: canvasWidth / 2,
      y: canvasHeight + planetRadius - 30
    }
  };

  const world = {
    gravity: (loc: Vector) => {
      return asVector(
        gravityCoeff / squaredDistance(loc, planet.center),
        getAngle(loc, planet.center)
      );
    },
    movePlanet: (planetIncrement: number, ms: number) => {
      planet.newCenter.y -= planetIncrement;
    },
    updatePlanet: (ms: number) => { return; },
    lastUpdateTime: 0,
    width: canvasWidth,
    height: canvasHeight,
    planet
  };

  world.updatePlanet = (ms: number) => {
    if (planet.center.y !== planet.newCenter.y) {
      const timeDelta = world.lastUpdateTime ? ms - world.lastUpdateTime : 0;
      if (Math.abs(planet.center.y - planet.newCenter.y) < planetSpeed) {
        planet.center.y = planet.newCenter.y;
      }
      planet.center.y = Math.max(planet.newCenter.y, planet.center.y + timeDelta * planetSpeed);
    }

    world.lastUpdateTime = ms;
  };

  return world;
};
