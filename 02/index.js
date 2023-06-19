const truchet = document.getElementById("truchet-image");
const context = truchet.getContext("2d");
const tileSize = 100;

const drawBase = (x, y, t) => {
  const delta = tileSize * (0.75 - 0.5 * t);

  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x, y + tileSize);
  context.lineTo(x + tileSize, y + tileSize);
  context.lineTo(x + delta, y + (tileSize - delta));
  context.closePath();
  context.fill();
};

drawBase(0, 0, 0);
context.translate(150, 50);
context.rotate(Math.PI / 2);
context.translate(-150, -50);
drawBase(100, 0, 0);
