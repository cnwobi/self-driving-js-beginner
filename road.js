function linearInterpolation(_left, _right, number) {
    return _left + (_right - _left) * number
}

class Road {
    constructor(x, width, lanes = 3) {
        this._x = x
        this._width = width
        this._lanes = lanes

        this._left = this._x - this._width / 2
        this._right = this._x + this._width / 2

        const infinity = 10000;
        this._top = -infinity
        this._bottom = infinity

    }

    laneCenter(index) {
        const laneIndex = Math.max(Math.min(index,this._lanes - 1),0)
        const laneWidth = this._width / this._lanes
        return this._left + laneWidth / 2 + laneIndex * laneWidth
    }

    draw(ctx) {
        ctx.lineWidth = 5
        ctx.strokeStyle = "white";

        for (let i = 0; i <= this._lanes; i++) {
            const x = linearInterpolation(this._left, this._right, i / this._lanes)
            ctx.setLineDash(i > 0 && i < this._lanes ? [20, 20] : []);
            ctx.beginPath()
            ctx.moveTo(x, this._top)
            ctx.lineTo(x, this._bottom)
            ctx.stroke();
        }
    }
}
