const tileSize = 10;

const truchet = document.getElementById("truchet-image");
const context = truchet.getContext("2d");
const imageSource = document.getElementById("tom");
const imageCanvas = document.getElementById("image-canvas");
const imageContext = imageCanvas.getContext("2d", { willReadFrequently: true });

const scale = window.devicePixelRatio;

const generators = [
  // diamonds
  [
    "bdbdacac",
    "dbdbcaca",
    "bdbdacac",
    "dbdbcaca",
    "cacadbdb",
    "acacbdbd",
    "cacadbdb",
    "acacbdbd",
  ],
  // arrers
  ["dabc"],
  // non-touching
  // prettier-ignore
  [
    "ba",
    "cd"
  ],
  // wigglies
  // prettier-ignore
  [
    "ca",
    "ac"
  ],
  // opposite wigglies
  // prettier-ignore
  [
    "bd",
    "db"
  ],
  // circles
  // prettier-ignore
  [
    "bc",
    "ad"
  ],
  // rotating barbells
  // prettier-ignore
  [
    "cbad",
    "dabc",
    "adcb",
    "bcda"
  ],
  // chevrons
  // prettier-ignore
  [
    "dabc",
    "bcda"
  ],
];

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
  const rotation = (["a", "b", "c", "d"].indexOf(label) * Math.PI) / 2;
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

const resizeCanvases = (width, height) => {
  truchet.style.width = `${width}px`;
  truchet.style.height = `${height}px`;
  truchet.width = Math.floor(width * scale);
  truchet.height = Math.floor(height * scale);
  imageCanvas.width = width;
  imageCanvas.height = height;
  context.scale(scale, scale);
};

const renderTiledImage = (image) => {
  const width = 800;
  const height = (image.height * 800) / image.width;

  resizeCanvases(width, height);

  imageContext.drawImage(image, 0, 0, width, height);

  context.clearRect(0, 0, width, height);
  const generator = generators[Math.floor(Math.random() * generators.length)];
  const generatorX = generator[0].length;
  const generatorY = generator.length;

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
};

const imageInput = document.getElementById("image-input");
imageInput.addEventListener("change", async () => {
  const file = imageInput.files[0];

  if (file) {
    const bitmap = await createImageBitmap(file);
    renderTiledImage(bitmap);
  }

  false;
});

const imagePicker = document.getElementById("image-picker");
imagePicker.addEventListener("click", () => {
  imageInput.click();

  false;
});

const dropper = document.getElementById("image-dropper");
dropper.addEventListener("dragover", (event) => {
  event.stopPropagation();
  event.preventDefault();

  false;
});
dropper.addEventListener("drop", async (event) => {
  event.stopPropagation();
  event.preventDefault();
  let file;

  if (event.dataTransfer.items) {
    const item = event.dataTransfer.items[0];
    if (item.kind !== "file") {
      return;
    }
    file = item.getAsFile();
  } else {
    file = event.dataTransfer.files[0];
  }

  if (!/image/.test(file.type)) {
    return;
  }

  const bitmap = await createImageBitmap(file);
  renderTiledImage(bitmap);

  false;
});

imageSource.addEventListener("load", () => {
  renderTiledImage(imageSource);
});
imageSource.src = "tom_waits.png";
