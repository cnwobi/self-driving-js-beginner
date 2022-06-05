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

function animate(time) {

    traffic.forEach( c => c.update(road.borders,[]))
    cars.forEach(car => car.update(road.borders,traffic))

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight
    carCtx.save()
    carCtx.translate(0,-cars[0].y + carCanvas.height * 0.8)
    road.draw(carCtx);
    traffic.forEach(c => c.draw(carCtx,"green"))
    carCtx.globalAlpha = 0.2
    cars.forEach(car => car.draw(carCtx,"blue"))
    carCtx.globalAlpha = 1
    cars[0].draw(carCtx,"blue",true)
    carCtx.restore()

    networkCtx.lineDashOffset = -time/50
    Visualizer.drawNetwork(networkCtx,cars[0].brain)
    requestAnimationFrame(animate)

}

