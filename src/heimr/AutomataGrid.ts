type HexGridOptions = {
  cellDiameter: number;
  borderWidth: number;
  width: number;
  height: number;
};

export type GridCell = {
  hexPoints: string;
  center: number;
  top: number;
  left: number;
};

export type Coords = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

const hexCoords: Coords[] = [
  { x: 60, y: 26 },
  { x: 45, y: 52 },
  { x: 15, y: 52 },
  { x: 0, y: 26 },
  { x: 15, y: 0 },
  { x: 45, y: 0 }
];

function gridCell(
  { x, y }: Coords,
  cellDiameter: number,
  borderWidth: number
): GridCell {
  const scale = cellDiameter / 52;
  const hexPoints = hexCoords
    .map(({ x, y }) => ({
      x: x * scale + borderWidth,
      y: y * scale + borderWidth
    }))
    .map(({ x, y }) => `${x},${y}`)
    .join("  ");

  const hexWidth = 45 * scale;
  const hexHeight = 52 * scale;
  const center = 30 * scale + borderWidth;

  const top = x * hexWidth;
  const left = hexHeight / 2 + y * hexHeight - ((x % 2) * hexHeight) / 2;

  return { hexPoints, center, top, left };
}

export default class AutomataGrid {
  gridSize: Size;
  width: number;
  height: number;
  cells: { [propName: string]: GridCell };

  constructor({ cellDiameter, borderWidth, width, height }: HexGridOptions) {
    this.width = width;
    this.height = height;
    const scale = cellDiameter / 52;

    this.gridSize = {
      width: width * 45 * scale + 2 * borderWidth + 15 * scale,
      height: height * 52 * scale + 2 * borderWidth + 26 * scale
    };

    this.cells = {};
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const newCell = gridCell({ x, y }, cellDiameter, borderWidth);
        const cellKey = coordsToStr({ x, y });
        this.cells[cellKey] = newCell;
      }
    }
  }
}

export const coordsToStr = ({ x, y }: Coords): string => {
  const letter = String.fromCharCode(65 + x);
  return letter + y;
};

export const strToCoords = (str: string): Coords => {
  const x = str.charCodeAt(0) - 65;
  const y = parseInt(str.substr(1));
  return { x, y };
};
