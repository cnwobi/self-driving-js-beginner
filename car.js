class Car {
    constructor(x, y, width, height) {
        this._x = x
        this._y = y;
        this._width = width;
        this._height = height;
        this._controls = new Controls()
        this._speed = 0
        this._acceleration = 0.3
        this._friction = 0.05;
        this._maxSpeed = 2.5
        this._angle = 0
    }

    draw(ctx) {
        ctx.save()
        ctx.translate(this._x, this._y)
        ctx.rotate(-this._angle)

        ctx.beginPath();
        ctx.rect(-this._width / 2,
            -this._height / 2,
            this._width,
            this._height);

        ctx.fill();
        ctx.restore();
    }

    update() {
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


        if (this._controls.left) {
            this._angle += 0.03
        }

        if (this._controls.right) {
            this._angle -= 0.03;
        }
        this._x -= Math.sin(this._angle) * this._speed

        this._y -= Math.cos(this._angle) * this._speed
        // this._y = Math.min(windowHeight - 30, this._y)
        // this._y = Math.max(30, this._y)
    }
}