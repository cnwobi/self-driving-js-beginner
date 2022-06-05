const carCanvas = document.getElementById("carCanvas")
carCanvas.width = 200;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas")
networkCanvas.width = 300;
const networkCtx = networkCanvas.getContext("2d");


const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
const cars = generateCars(100)


const traffic = [
    new Car(road.laneCenter(1), -100, 30, 50, "DUMMY",1),
]




animate()


function generateCars(N) {
    return [...Array(N).keys()].map(_ => new Car(road.laneCenter(1),100,30,50,"AI"))
}

function bestCar(cars) {
    const minY = Math.min(...cars.map(c => c.y))
    return cars.find (c => c.y === minY)
}

function animate(time) {

    traffic.forEach( c => c.update(road.borders,[]))
    cars.forEach(car => car.update(road.borders,traffic))
    const focusCar = bestCar(cars)
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight
    carCtx.save()
    carCtx.translate(0,-focusCar.y + carCanvas.height * 0.8)
    road.draw(carCtx);
    traffic.forEach(c => c.draw(carCtx,"green"))
    carCtx.globalAlpha = 0.2
    cars.forEach(car => car.draw(carCtx,"blue"))
    carCtx.globalAlpha = 1
    focusCar.draw(carCtx,"blue",true)
    carCtx.restore()

    networkCtx.lineDashOffset = -time/50
    Visualizer.drawNetwork(networkCtx,cars[0].brain)
    requestAnimationFrame(animate)

}

