const carCanvas = document.getElementById("carCanvas")
carCanvas.width = 200;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas")
networkCanvas.width = 300;
const networkCtx = networkCanvas.getContext("2d");


const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
let cars = generateCars(350)
let focusCar = cars[0]

if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if (i !== 0) {
            NeuralNetwork.mutate(cars[i].brain, 7.5);
        }
    }
}


const traffic = [
    new Car(road.laneCenter(0), -100, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(2), -100, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(1), -300, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(0), -500, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(0), -1000, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(2), -1000, 30, 50, "DUMMY", 0.8),
    new Car(road.laneCenter(2), -1200, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(0), -1200, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(0), -1400, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(1), -1700, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(0), -1900, 30, 50, "DUMMY", 0.9),
    new Car(road.laneCenter(1), -2400, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(2), -2400, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(0), -2500, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(2), -2500, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(1), -3000, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(2), -3200, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(0), -3200, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(0), -5000, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(0), -4000, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(1), -4000, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(1), -7000, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(2), -7500, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(1), -10000, 30, 50, "DUMMY", 1),
    new Car(road.laneCenter(0), -10000, 30, 50, "DUMMY", 1),
]


animate()


function generateCars(N) {
    return [...Array(N).keys()].map(_ => new Car(road.laneCenter(1), 100, 30, 50, "AI", 3, 'blue'))
}

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(focusCar.brain))
}

function discard() {
    localStorage.removeItem("bestBrain")
}

function bestCar(cars) {
    const minY = Math.min(...cars.map(c => c.y))
    return cars.find(c => c.y === minY)
}

function animate(time) {
    // cars = cars.filter(c => !c.damaged)
    traffic.forEach(c => c.update(road.borders, []))
    cars.forEach(car => car.update(road.borders, traffic))
    focusCar = bestCar(cars)
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight
    carCtx.save()
    carCtx.translate(0, -focusCar.y + carCanvas.height * 0.8)
    road.draw(carCtx);
    traffic.forEach(c => c.draw(carCtx,))
    carCtx.globalAlpha = 0.2
    cars.forEach(car => car.draw(carCtx))
    carCtx.globalAlpha = 1
    focusCar.draw(carCtx, true)
    carCtx.restore()

    networkCtx.lineDashOffset = -time / 50
    Visualizer.drawNetwork(networkCtx, cars[0].brain,cars)
    requestAnimationFrame(animate)

}

