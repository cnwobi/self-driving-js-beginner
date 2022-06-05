class Sensor {
    constructor(car) {
        this._car = car
        this._rayCount = 20
        this._rayLength = 150
        this._raySpread = Math.PI / 2

        this._rays = []
        this.readings = []
    }

    _castRays() {
        this._rays = []
        this._rays = [...Array(this._rayCount).keys()].map(i => this.getStartAndEnd(i))
    }


    getStartAndEnd(i) {
        const factor = () => this._rayCount === 1 ? 0.5 : i / (this._rayCount - 1)
        const rayAngle = linearInterpolation(this._raySpread / 2,
            -this._raySpread / 2,
            factor()) + this._car.angle;
        const start = {x: this._car.x, y: this._car.y}
        const end = {
            x: this._car.x - Math.sin(rayAngle) * this._rayLength,
            y: this._car.y - Math.cos(rayAngle) * this._rayLength
        }
        return [start, end];
    }

    update(roadBorders,traffic) {
        this._castRays();
        this.readings = this._rays.map(ray => this.getReading(ray, roadBorders,traffic))
    }

    draw(ctx) {
        this._rays.forEach((ray, index) => {
            const end = this.readings[index] ? this.readings[index] : ray[1]
            ctx.beginPath()
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.moveTo(ray[0].x, ray[0].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()

            ctx.beginPath()
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(ray[1].x, ray[1].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
        })

    }

    getReading(ray, roadBorders, traffic) {
        const allTrafficPoints = traffic.flatMap(c =>
        c.polygon.map((pt,i) => [pt, c.polygon[(i + 1) % c.polygon.length]])
        )


        const touches = [...roadBorders,...allTrafficPoints]
            .map(border => getIntersection(ray[0], ray[1], border[0], border[1]))
            .filter(intersection => intersection)

        if (touches.length === 0) {
            return null;
        }

        return touches.find(e => e.offset === Math.min(...touches.map(e => e.offset)))
    }
}
