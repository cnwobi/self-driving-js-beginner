class NeuralNetwork {

    constructor(neuronCounts) {
        this.levels = neuronCounts
            .slice(0, -1)
            .map((count, i) => new Level(count, neuronCounts[i + 1]))
    }

    static feedForward(givenInputs, network) {
        return network.levels
            .reduce((outputs, level) => Level.feedForward(outputs, level), givenInputs)
    }

    static mutate(network, amount = 1) {
        network.levels.forEach((level) => {

            level.biases = level.biases.map((bias) =>
                linearInterpolation(bias, Math.random() * 2 - 1, amount)
            )

            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; i < level.weights.length[j]; j++) {
                    level.weights[i][j] = linearInterpolation(level.weights[i][j], Math.random() * 2 - 1, amount)
                }

            }
        })

    }
}

class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount)
        this.weights = [...this.inputs.keys()].map(_ => new Array(outputCount))
        Level._randomize(this);
    }


    static _randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1
            }
        }


        level.biases = [...level.outputs.keys()].map(_ =>
            Math.random() * 2 - 1
        )
    }

    static feedForward(givenInputs, level) {
        level.inputs = [...givenInputs]
        level.outputs = [...level.outputs.keys()]
            .map((_, i) =>
                level.inputs.map((input, j) => input * level.weights[j][i]).reduce((a, b) => a + b, 0)
            ).map((sum, i) => sum > level.biases[i] ? 1 : 0)
        return level.outputs
    }
}
