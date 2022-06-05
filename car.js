class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 2.5, color = "red") {
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

        this.useBrain = controlType === "AI"


        if (controlType !== "DUMMY") {
            this._sensor = new Sensor(this)
            this.brain = new NeuralNetwork([this._sensor.rayCount, 6, 4]);
        }
        this._controls = new Controls(controlType)

        this.img = new Image();
        this.img.src = "car.png"

        this.mask = document.createElement("canvas");
        this.mask.width = width;
        this.mask.height = height;

        const maskCtx = this.mask.getContext("2d");
        this.img.onload = () => {
            maskCtx.fillStyle = color;
            maskCtx.rect(0, 0, this._width, this._height);
            maskCtx.fill();

            maskCtx.globalCompositeOperation = "destination-atop";
            maskCtx.drawImage(this.img, 0, 0, this._width, this._height);
        }

    }


    draw(ctx, drawSensor = false) {
        if (this._sensor && drawSensor) {
            this._sensor.draw(ctx);
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        if (!this.damaged) {
            ctx.drawImage(this.mask,
                -this._width / 2,
                -this._height / 2,
                this._width,
                this._height);
            ctx.globalCompositeOperation = "multiply";
        }
        ctx.drawImage(this.img,
            -this._width / 2,
            -this._height / 2,
            this._width,
            this._height);
        ctx.restore();

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
            this.damaged = this._accessDamage(roadBoarders, traffic)
        }
        if (this._sensor) {
            this._sensor?.update(roadBoarders, traffic)
            const offsets = this._sensor?.readings.map(r => r == null ? 0 : 1 - r.offset)
            const outputs = NeuralNetwork.feedForward(offsets, this.brain)
            if (this.useBrain) {
                this._controls.forward = outputs[0]
                this._controls.left = outputs[1]
                this._controls.right = outputs[2]
                this._controls.reverse = outputs[3]
            }
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
