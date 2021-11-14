class Engine {
    constructor (data) {
        this.xSize = data.X_SIZE;
        this.ySize = data.Y_SIZE;
        this.fieldMatrix = this._createFieldSeed();
    }

    // Create the initial configuration of the field with random values
    _createFieldSeed() {
        return Array(this.ySize)
                .fill(0)
                .map(() => Array(this.xSize)
                            .fill(0)
                            .map(() => Math.round(Math.random()))
                );
    }

    // Count how many neighbors are live in the boundaries of a cell
    _computeAdjacentLives(x_index, y_index) {
        let adjacentLives = 0;
    
        for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
                if ((j === 0) && (i === 0)) {
                    continue;
                }
    
                let translatedY = (j + y_index + this.ySize) % this.ySize;
                let translatedX = (i + x_index + this.xSize) % this.xSize;
    
                if (this.fieldMatrix[translatedY][translatedX] === 1) {
                    adjacentLives++;
                }
            }
        }
    
        return adjacentLives;
    }

    computeNextGeneration() {
        const nextGeneration =
            this.fieldMatrix.map((y_element, y_index) => {
                return y_element.map((x_element, x_index) => {
                    let adjacentLives = this._computeAdjacentLives(x_index, y_index);

                    if ((x_element === 1) && ((adjacentLives === 2) || (adjacentLives === 3))) {
                        // Any live cell with two or three live neighbours survives
                        return 1;
                    } else if ((x_element === 0) && (adjacentLives === 3)) {
                        // Any dead cell with three live neighbours becomes a live cell
                        return 1;
                    } else {
                        // All other live cells die in the next generation. Similarly, all other dead cells stay dead
                        return 0;
                    }
                });
            });

        this.fieldMatrix = nextGeneration;

        return this;
    }

    getFieldMatrix() { 
        return this.fieldMatrix;
    };

    updateFieldConfig() {}
}