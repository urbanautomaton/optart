const width = 800;
const height = 900;
const tileSize = 10;

const truchet = document.getElementById("truchet-image");
const context = truchet.getContext("2d");
const imageSource = document.getElementById("tom");
const imageCanvas = document.getElementById("image-canvas");
const imageContext = imageCanvas.getContext("2d", { willReadFrequently: true });

imageContext.drawImage(imageSource, 0, 0, width, height);

const scale = window.devicePixelRatio;
truchet.style.width = `${width}px`;
truchet.style.height = `${height}px`;
truchet.width = Math.floor(width * scale);
truchet.height = Math.floor(height * scale);

context.scale(scale, scale);

const rotations = {
  a: 0,
  b: Math.PI / 2,
  c: Math.PI,
  d: (Math.PI * 3) / 2,
};

const generators = [
  [
    ["b", "a"],
    ["c", "d"],
  ],
  [
    ["c", "a"],
    ["a", "c"],
  ],
];

const generator = generators[Math.floor(Math.random() * generators.length)];
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

for (var i = 0; i <= width / tileSize; i++) {
  for (var j = 0; j <= height / tileSize; j++) {
    const tileLabel = generator[j % generatorY][i % generatorX];
    const x = i * tileSize;
    const y = j * tileSize;
    const tileData = imageContext.getImageData(x, y, tileSize, tileSize).data;
    const t =
      Array.from(tileData).reduce((a, b) => a + b) / (tileData.length * 255);

    drawTile(tileLabel, x, y, t);
  }
}
