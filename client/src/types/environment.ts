import ICanvasObject from "./object";

interface ICanvasEnvironment {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    objects: ICanvasObject[]

    init: () => void
    getWidth: () => number
    getHeight: () => number
    animate: () => void

}

export default ICanvasEnvironment;