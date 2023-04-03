// This class was meant to control puzzle piece generation. It should have returned a piece that had random shape...
// Raw!
// TODO: decide this class' fate.
export default class GameManager {
    _board: Point[]

    constructor(edges: number = 10) {
        this._board = Array(edges);
    }

    generateBorder(): Point[] {
        let angles = Array.from({length: this._board.length}, () => Math.random() * 2 * Math.PI).sort();
        let radiuses = Array.from({length: this._board.length}, () => Math.random());

        for (let i = 0; i < this._board.length; i++) {
            // Calculate the x and y coordinates of the point using the angle and radius
            this._board[i] = new Point(radiuses[i] * Math.cos(angles[i]), radiuses[i] * Math.sin(angles[i]));
        }
        return this._board;
    }
}

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
