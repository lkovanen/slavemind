export const secondsSince = (date: Date): number => {
  const now = new Date();
  return (now.getTime() - date.getTime()) / 1000;
};
