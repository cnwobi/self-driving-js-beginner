
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

        for (let i = 0; i < this._rayCount; i++) {
            const factor = () => this._rayCount === 1 ? 0.5 : i / (this._rayCount - 1)


            const rayAngle = linearInterpolation(this._raySpread / 2,
                -this._raySpread / 2,
                factor()) + this._car.angle;
            const start = {x: this._car.x, y: this._car.y}
            const end = {
                x: this._car.x - Math.sin(rayAngle) * this._rayLength,
                y: this._car.y - Math.cos(rayAngle) * this._rayLength
            }
            this._rays.push([start, end])
        }
    }

    update(roadBorders) {
        this._castRays();
        this.readings = []
        this._rays.forEach(ray => {
            this.readings.push(this.getReading(ray, roadBorders))
        })


    }

    draw(ctx) {
        this._rays.forEach((ray,index) => {
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

    getReading(ray, roadBorders) {
        const touches = roadBorders
            .map(border => getIntersection(ray[0], ray[1], border[0], border[1]))
            .filter(intersection => intersection)

        if (touches.length === 0) {
            return null;
        }

        const minOffSet = Math.min(...touches.map(e => e.offset))

        return touches.find(e => e.offset === minOffSet)
    }
}
