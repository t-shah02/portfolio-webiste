import CanvasObject from "../canvasObjects/object";

interface CanvasEnvironment {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    objects: CanvasObject[]

    init: () => void
    getWidth: () => number
    getHeight: () => number
    animate: () => void

}

export default CanvasEnvironment;