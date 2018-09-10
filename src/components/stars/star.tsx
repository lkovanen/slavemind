const drawStarAtOrigin = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
  const points = 5;
  const innerSize = size / 2.6;
  const rotationAngle = Math.PI / points;
  
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(size, 0);
  for (let i = 0; i < points * 2 - 1; i++) {
    ctx.rotate(rotationAngle);
    if (i % 2 === 0) {
      ctx.lineTo(innerSize, 0);
    } else {
      ctx.lineTo(size, 0);
    }
  }
  ctx.closePath();
  
  ctx.fillStyle = color;
  ctx.fill();
  
  ctx.restore();
};

export default drawStarAtOrigin;