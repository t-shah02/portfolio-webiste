
export interface CanvasObjectProperties {
    x: number
    y: number
    dx: number
    dy: number
}

interface CanvasObject {
    x: number
    y: number
    dx: number
    dy: number

    update: () => void
    draw: () => void
}

export default CanvasObject;