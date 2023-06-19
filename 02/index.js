const truchet = document.getElementById("truchet-image");
const context = truchet.getContext("2d");
truchet.width = 500;
truchet.height = 500;
const tileSize = 20;

const rotations = {
  a: 0,
  b: Math.PI / 2,
  c: Math.PI,
  d: (Math.PI * 3) / 2,
};

const generator = [
  ["b", "a"],
  ["c", "d"],
];
const generatorX = generator[0].length;
const generatorY = generator.length;

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

const drawTile = (label, x, y, t) => {
  const rotation = rotations[label];
  const centerX = x + tileSize / 2;
  const centerY = y + tileSize / 2;

  if (rotation > 0) {
    context.translate(centerX, centerY);
    context.rotate(rotation);
    context.translate(-centerX, -centerY);
  }
  drawBase(x, y, t);
  if (rotation > 0) {
    context.translate(centerX, centerY);
    context.rotate(-rotation);
    context.translate(-centerX, -centerY);
  }
};

for (var i = 0; i <= 25; i++) {
  for (var j = 0; j <= 25; j++) {
    const tileLabel = generator[j % generatorY][i % generatorX];

    drawTile(tileLabel, i * tileSize, j * tileSize, Math.random());
  }
}
