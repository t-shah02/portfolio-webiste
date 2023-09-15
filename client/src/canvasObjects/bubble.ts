import ICanvasEnvironment from "../types/environment";
import ICanvasObject from "../types/object";

class Bubble implements ICanvasObject {
    public x: number;
    public y: number;
    public dx: number;
    public dy: number;
    public radius: number;
    public color: string;

    private _environment: ICanvasEnvironment;

    static BUBBLE_COLORS: string[] = ["green", "red", "brown", "blue", "pink", "purple"];

    constructor(x: number, y: number, dx: number, dy: number, radius: number, environment: ICanvasEnvironment) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this._environment = environment;

        const colorIndex = Math.floor(Math.random() * Bubble.BUBBLE_COLORS.length);
        this.color = Bubble.BUBBLE_COLORS[colorIndex];
    }

    update(): void {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < 0 || this.x >= this._environment.getWidth()) {
            this.dx *= -1;
        }

        if (this.y < 0 || this.y >= this._environment.getHeight()) {
            this.dy *= -1;
        }
    }

    draw(): void {
        this._environment.context.beginPath();
        this._environment.context.fillStyle = this.color;
        this._environment.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this._environment.context.fill();
    }

}

export default Bubble;