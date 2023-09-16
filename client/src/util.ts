import { ICanvasObjectProperties } from "./types/object";

// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
export function randomNumberFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomCanvasObjectProperties(
  maxX: number,
  maxY: number,
  maxDx: number,
  maxDy: number,
): ICanvasObjectProperties {
  const x = randomNumberFromInterval(0, maxX);
  const y = randomNumberFromInterval(0, maxY);
  const dx = randomNumberFromInterval(1, maxDx);
  const dy = randomNumberFromInterval(1, maxDy);

  return {
    x,
    y,
    dx,
    dy,
  };
}
