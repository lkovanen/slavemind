export type Vector = {
  x: number,
  y: number
};

export type TailVector = {
  t: number,
  loc: Vector
};

export type Firefly = {
  mass: number,
  radius: number,
  hue: number,
  tailTime: number,
  force: Vector,
  drag: Vector,
  thrust: Vector,
  location: Vector,
  velocity: Vector,
  lastUpdateTime: number,
  freezeUntil: number,
  keyLeft: boolean,
  keyRight: boolean,
  tail: TailVector[],
  update: (ms: number) => void,
  die: (ms: number) => void,
  isDead: boolean,
  offScreenTime: number,
  shouldUpdate: boolean
};

export type World = {
  lastUpdateTime: number,
  gravity: (loc: Vector) => Vector,
  movePlanet: (planetIncrement: number, ms: number) => void,
  updatePlanet: (ms: number) => void,
  width: number,
  height: number,
  planet: {
    radius: number,
    center: Vector,
    newCenter: Vector
  }
};
