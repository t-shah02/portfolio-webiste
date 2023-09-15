import Bubble from "../canvasObjects/bubble";
import ICanvasObject from "../types/object";
import { getRandomCanvasObjectProperties, randomNumberFromInterval } from "../util";
import ICanvasEnvironment from "../types/environment";

class ScreenCanvas implements ICanvasEnvironment {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    objects: ICanvasObject[];

    static BUBBLE_COUNT: number = 50;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;
        this.objects = [];
    }

    init() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;

        document.addEventListener("resize", () => {
            this.canvas.width = document.body.clientWidth;
            this.canvas.height = document.body.clientHeight;
        });

        for (let i = 0; i < ScreenCanvas.BUBBLE_COUNT; i++) {
            const radius = randomNumberFromInterval(5, 15);
            const { x, y, dx, dy } = getRandomCanvasObjectProperties(this.canvas.width, this.canvas.height, 3, 3);
            this.objects.push(new Bubble(x, y, dx, dy, radius, this));
        }
    }

    getWidth(): number {
        return this.canvas.width;
    }

    getHeight(): number {
        return this.canvas.height;
    }

    animate(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.objects.forEach(object => {
            object.update();
            object.draw();
        })

        window.requestAnimationFrame(this.animate.bind(this));
    }

}

export default ScreenCanvas;