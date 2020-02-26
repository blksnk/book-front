import paper, { Path, Point, Color, Shape } from "paper";
const { Rectangle } = Path;

const createMultipleRandomPaths = ({
  count,
  color,
  margin,
  width,
  polygonsAllowed,
  maxSegmentCount,
  smoothAllowed,
  maxWidth,
  minWidth,
  forceSmooth,
  canvas
}) => {
  const paths = [];
  for (let i = 0; i < count; i++) {
    let path = [];

    if (polygonsAllowed) {
      path = createRandomPolygon({
        color,
        margin,
        width,
        maxSegmentCount,
        smoothAllowed,
        maxWidth,
        minWidth,
        forceSmooth,
        canvas
      });
    } else {
      path = createRandomLine({
        color,
        margin,
        width,
        maxWidth,
        minWidth,
        canvas
      });
    }
    paths.push(path);
  }
  return paths;
};

const createPath = ({ x1, y1, x2, y2, color, width }) => {
  let path = new Path();
  let start = new Point(x1, y1);
  let end = new Point(x2, y2);

  path.strokeColor = color || "#FFF";
  path.strokeWidth = width || 1;
  path.moveTo(start);
  path.lineTo(end);

  return path;
};

const generateRandomBoolean = () => {
  return Math.random() >= 0.5;
};

const generateRandomPoint = (margin, canvas) =>
  new Point(
    generateRandomX(margin || 0, canvas),
    generateRandomY(margin || 0, canvas)
  );

const createRandomLine = ({
  color,
  margin,
  width,
  maxWidth,
  minWidth,
  canvas
}) => {
  const x1 = generateRandomX(margin || 0, canvas);
  const x2 = generateRandomX(margin || 0, canvas);
  const y1 = generateRandomY(margin || 0, canvas);
  const y2 = generateRandomY(margin || 0, canvas);
  const c = color || generateRandomColor();
  const w = width || generateRandomValue(maxWidth || 10, minWidth || 1);
  return createPath({
    x1,
    x2,
    y1,
    y2,
    color: c,
    width: w
  });
};

export const createRandomCirle = ({
  point,
  radius,
  color,
  maxRadius,
  minRadius,
  margin,
  canvas
}) => {
  const circle = new Shape.Circle(
    point || generateRandomPoint(margin, canvas),
    radius || generateRandomValue(maxRadius || 200, minRadius || 10)
  );
  circle.fillColor = color || generateRandomColor();
};

const createRandomPolygon = ({
  color,
  margin,
  width,
  maxSegmentCount,
  smoothAllowed,
  maxWidth,
  minWidth,
  forceSmooth,
  canvas
}) => {
  const path = createRandomLine({
    color,
    margin,
    width,
    maxWidth,
    minWidth,
    canvas
  });
  const iterationCount = generateRandomValue(maxSegmentCount);
  if (iterationCount === 0) {
    return path;
  } else {
    for (let i = 0; i < iterationCount; i++) {
      path.add(generateRandomPoint(null, canvas));
    }
    if (smoothAllowed) {
      if (forceSmooth || generateRandomBoolean()) {
        path.smooth();
      }
    }
    return path;
  }
};

export const createBorder = ({ borderWidth, borderColor, canvas }) => {
  const { canvasHeight, canvasWidth } = getCanvasDimensions(canvas);
  const rect = new Rectangle(
    borderWidth / 2,
    borderWidth / 2,
    canvasWidth - borderWidth,
    canvasHeight - borderWidth
  );
  rect.strokeWidth = borderWidth;
  rect.strokeColor = borderColor;
  rect.fillColor = "transparent";
  paper.view.draw();
  return rect;
};

export const generateRgbColor = (r, g, b) => {
  return new Color(r / 255, g / 255, b / 255);
};

const generateRandomColor = () => {
  return new Color(Math.random(), Math.random(), Math.random());
};

const getCanvasDimensions = canvas => {
  const canvasWidth = canvas.getBoundingClientRect().width;
  const canvasHeight = canvas.getBoundingClientRect().height;
  return {
    canvasHeight,
    canvasWidth
  };
};

const generateRandomValue = (max, min) => {
  if (!min && !max) {
    // default is between 1 and 10
    return Math.round(Math.max(Math.random() * 10), 1);
  } else if (max && !min) {
    return Math.round(Math.max(Math.random() * max), 1);
  } else {
    return Math.round(Math.min(Math.max(Math.random() * max, min), max));
  }
};

const generateRandomX = (margin, canvas) => {
  const { canvasWidth } = getCanvasDimensions(canvas);
  return Math.round(Math.random() * (canvasWidth + margin)) - margin / 2;
};

const generateRandomY = (margin, canvas) => {
  const { canvasHeight } = getCanvasDimensions(canvas);
  return Math.round(Math.random() * (canvasHeight + margin)) - margin / 2;
};

const setBackgroundColor = (color, canvas) => {
  const { canvasHeight, canvasWidth } = getCanvasDimensions(canvas);
  const bg = new Rectangle(0, 0, canvasWidth, canvasHeight);
  bg.fillColor = color;
};

export const setupPaper = canvas => {
  paper.setup(canvas);
};

export const initGenerativeArt = (canvas, options) => {
  setBackgroundColor(generateRgbColor(0, 0, 0), canvas);
  const trueOptions = {
    count:
      options.count ||
      generateRandomValue(options.maxCount || 150, options.minCount || 25),
    color: options.color || generateRgbColor(255, 255, 255),
    maxWidth: options.maxWidth || 8,
    minWidth: options.minWidth || 4,
    margin: options.margin || generateRandomValue(100, 0),
    polygonsAllowed: options.polygonsAllowed || true,
    maxSegmentCount: options.maxSegmentCount || generateRandomValue(5, 2),
    smoothAllowed: options.smoothAllowed || true,
    forceSmooth: options.forceSmooth || false,
    canvas
  };
  createMultipleRandomPaths(trueOptions);

  if (options.circle && options.circle.maxCount > 0) {
    if (options.circle.maxCount > 1) {
      const circleCount = options.circle.minCount
        ? generateRandomValue(options.circle.maxCount, options.circle.minCount)
        : options.circle.maxCount;
      for (let i = 0; i < circleCount; i++) {
        createRandomCirle({
          canvas,
          ...options.circle
        });
      }
    } else {
      createRandomCirle({
        canvas,
        ...options.circle
      });
    }
  }

  if (options.border) {
    createBorder({
      canvas,
      borderWidth: options.border.width || 16,
      borderColor: options.border.color || generateRandomColor()
    });
  }

  paper.view.draw();
};

const clearCanvas = () => {
  paper.project.activeLayer.removeChildren();
  paper.view.draw();
};

export const refreshGenerativeArt = (canvas, options) => {
  clearCanvas();
  initGenerativeArt(canvas, options);
};
