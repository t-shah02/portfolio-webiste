export interface ICanvasObjectProperties {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface ICanvasObject {
  x: number;
  y: number;
  dx: number;
  dy: number;

  update: () => void;
  draw: () => void;
}

export default ICanvasObject;
