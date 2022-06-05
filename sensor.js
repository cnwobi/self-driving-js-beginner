class Sensor {
    constructor(car) {
        this._car = car
        this._rayCount = 3
        this._rayLength = 100
        this._raySpread = Math.PI / 4

        this._rays = []
    }

    update() {
        for (let i = 0; i < this._rayCount; i++) {
            const rayAngle = linearInterpolation(this._raySpread / 2,
                -this._raySpread / 2,
                i / this._rayCount);
            const start = {x: this._car.x, y: this._car.y}
            const end = {
                x: this._car.x - Math.sin(rayAngle) * this._rayLength,
                y: this._car.y - Math.cos(rayAngle) * this._rayLength
            }
            this._rays.push([start, end])
        }
    }

    draw(ctx) {
        this._rays.forEach(ray => {
            ctx.beginPath()
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.moveTo(ray[0].x, ray[0].y)
            ctx.lineTo(ray[1].x, ray[1].y)
            ctx.stroke()
        })

    }

}
