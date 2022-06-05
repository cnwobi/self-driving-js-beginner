class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 2.5) {
        this.x = x
        this.y = y;
        this._width = width;
        this._height = height;
        this._speed = 0
        this._acceleration = 0.3
        this._friction = 0.05;
        this._maxSpeed = maxSpeed
        this.angle = 0
        this.damaged = false
        this.polygon = this._createPolygon()


        if (controlType !== "DUMMY") {
            this._sensor = new Sensor(this)
            this.brain = new NeuralNetwork([this._sensor.rayCount,6,4]);
        }
        this._controls = new Controls(controlType)

    }


    draw(ctx,color) {
        ctx.fillStyle = this.damaged ? "gray" : color
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        this.polygon
            .slice(1)
            .forEach(point => ctx.lineTo(point.x, point.y));
        ctx.fill();
        this._sensor?.draw(ctx)

    }


    _accessDamage(roadBorders, traffic) {

        return roadBorders.some(border => polysIntersect(this.polygon, border))
            || traffic.some(car => polysIntersect(this.polygon, car.polygon))
    }

    _move() {
        if (this._controls.forward) {
            this._speed += this._acceleration
        }

        if (this._controls.reverse) {
            this._speed -= this._acceleration
        }

        this._speed = Math.min(this._maxSpeed, this._speed)
        this._speed = Math.max(-this._maxSpeed, this._speed)

        if (this._speed > 0) {
            this._speed -= this._friction
        }

        if (this._speed < 0) {
            this._speed += this._friction
        }


        if (Math.abs(this._speed) < this._friction) {
            this._speed = 0
        }

        if (this._speed !== 0) {
            const flip = this._speed > 0 ? 1 : -1
            if (this._controls.left) {
                this.angle += 0.03 * flip
            }

            if (this._controls.right) {
                this.angle -= 0.03 * flip;
            }
        }
        this.x -= Math.sin(this.angle) * this._speed

        this.y -= Math.cos(this.angle) * this._speed
    }

    update(roadBoarders, traffic) {
        if (!this.damaged) {
            this._move()
            this.polygon = this._createPolygon()
            this.damaged = this._accessDamage(roadBoarders, traffic.filter(car => car !== this))
        }
        if(this._sensor) {
            this._sensor?.update(roadBoarders, traffic)
            const offsets = this._sensor?.readings.map(r => r == null ? 0 : 1 - r.offset)
            const outputs = NeuralNetwork.feedForward(offsets,this.brain)
            console.log(outputs)
        }
    }

    _createPolygon() {
        const rad = Math.hypot(this._width, this._height) / 2;
        const alpha = Math.atan2(this._width, this._height)

        const point1 = {
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        }
        const point2 = {
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        }
        const point3 = {
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        }

        const point4 = {
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        }
        return [point1, point2, point3, point4]

    }
}
