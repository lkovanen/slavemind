export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const randTime = (meanTime: number): number => {
  // Random time from exponential distribution.
  const rand = Math.random();
  if (rand === 0) {
    return randTime(meanTime);
  }
  return -Math.log(rand) * meanTime;
};