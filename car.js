class Car {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y;
        this._width = width;
        this._height = height;
        this._speed = 0
        this._acceleration = 0.3
        this._friction = 0.05;
        this._maxSpeed = 2.5
        this._angle = 0

        this._sensor = new Sensor(this)
        this._controls = new Controls()
    }

    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(-this._angle)

        ctx.beginPath();
        ctx.rect(-this._width / 2,
            -this._height / 2,
            this._width,
            this._height);

        ctx.fill();
        ctx.restore();
        this._sensor.draw(ctx)
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
                this._angle += 0.03 * flip
            }

            if (this._controls.right) {
                this._angle -= 0.03 * flip;
            }
        }
        this.x -= Math.sin(this._angle) * this._speed

        this.y -= Math.cos(this._angle) * this._speed
    }
    update() {
        this._move()
        this._sensor.update()

    }
}
