// constants
const CANVAS_EL = document.querySelector("#fieldCanvas");
const CANVAS_CTX = CANVAS_EL.getContext("2d"); // canvas context
const GENERATION_EL = document.querySelector("#generationCounter");


const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 350;
const CELL_PROPORTION = 5;
// CANVAS_EL.width = CANVAS_WIDTH;
// CANVAS_EL.height = CANVAS_HEIGHT;
const X_SIZE = Math.ceil(CANVAS_WIDTH / CELL_PROPORTION);
const Y_SIZE = Math.ceil(CANVAS_HEIGHT / CELL_PROPORTION);

const IDLE_TIME = 500; // ms
const GENERATION = 0;
const TIMEOUT_ID = 0;

let gameConfig = {
    CANVAS_WIDTH: CANVAS_WIDTH,
    CANVAS_HEIGHT: CANVAS_HEIGHT,
    CELL_PROPORTION: CELL_PROPORTION,
    X_SIZE: X_SIZE,
    Y_SIZE: Y_SIZE,
    IDLE_TIME: IDLE_TIME,
    GENERATION: GENERATION,
    TIMEOUT_ID: TIMEOUT_ID
}

/*
const defaultCanvasConfig = {
    fieldWidth: X_SIZE * 5,
    fieldHeight: Y_SIZE * 5,
    cellProportion: 5
}
*/

let updateGameConfig = (data) => {
    gameConfig = { ...gameConfig, ...data };

    CANVAS_EL.width = gameConfig.CANVAS_WIDTH;
    CANVAS_EL.height = gameConfig.CANVAS_HEIGHT;
}

// create the new field and fulfill it with 0 and 1's in a random distribution
const createFieldSeed = (xSize, ySize) => {
    return Array(ySize)
            .fill(0)
            .map(() => {
                return Array(xSize)
                        .fill(0)
                        .map(() => Math.round(Math.random()));
            });
}

let fieldMatrix = createFieldSeed(
    gameConfig.X_SIZE, 
    gameConfig.Y_SIZE);

// BUSINESS RULES
// https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
const fieldToString = (fieldMatrix) => {
    let parsedString = "";

    fieldMatrix.forEach((y_element) => {
        y_element.forEach((x_element) => {
            parsedString += x_element === 1 ? "[@]" : "[ ]";
        });
        parsedString += "\n"
    });

    return parsedString;
}

const computeAdjacentLives = (fieldMatrix, x_index, y_index) => {
    let adjacentLives = 0;

    for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
            if ((j === 0) && (i === 0)) {
                continue;
            }

            let translatedY = (j + y_index + gameConfig.Y_SIZE) % gameConfig.Y_SIZE
            let translatedX = (i + x_index + gameConfig.X_SIZE) % gameConfig.X_SIZE

            if (fieldMatrix[translatedY][translatedX] === 1) {
                adjacentLives++;
            }
        }
    }

    return adjacentLives;
}

const displayFieldOnConsole = (fieldMatrix) => {
    let fieldString = fieldToString(fieldMatrix);
    console.clear();
    console.log(fieldString);
}

const displayFieldOnCanvas = (fieldMatrix) => {
    const rectWidth = gameConfig.CELL_PROPORTION;
    const rectHeight = gameConfig.CELL_PROPORTION;
    CANVAS_CTX.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    fieldMatrix.forEach((y_element, y_index) => {
        y_element.forEach((x_element, x_index) => {
            // const drawFn = x_element === 1 ? CANVAS_CTX.fillRect : CANVAS_CTX.strokeRect;
            if (x_element === 1) {
                CANVAS_CTX.fillRect(
                    x_index * rectWidth, 
                    y_index * rectHeight, 
                    rectWidth, 
                    rectHeight);
            } else {
                CANVAS_CTX.strokeRect(
                    x_index * rectWidth, 
                    y_index * rectHeight, 
                    rectWidth, 
                    rectHeight);
            }
        });
    });
}

const updateFieldMatrix = (fieldMatrix) => {
    updateGenerationOnHTML(GENERATION_EL);
    // displayFieldOnConsole(fieldMatrix);
    displayFieldOnCanvas(fieldMatrix);

    // compute next generation
    let nextGenerationFieldMatrix =
        fieldMatrix.map((y_element, y_index) => {
            return y_element.map((x_element, x_index) => {
                let adjacentLives = computeAdjacentLives(fieldMatrix, x_index, y_index);

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

    fieldMatrix = nextGenerationFieldMatrix;
    timeoutId = setTimeout(() => updateFieldMatrix(nextGenerationFieldMatrix), IDLE_TIME);
}

const updateGenerationOnHTML = (el) => {
    const newGeneration = gameConfig.GENERATION++;
    el.innerHTML = `Generation ${newGeneration}`;
    gameConfig = { 
        ...gameConfig, 
        GENERATION: gameConfig.GENERATION++
    }
}

// HTML BINDINGS
document
    .querySelector("#start")
    .addEventListener("click", () => {
        updateFieldMatrix(fieldMatrix);
    });

document
    .querySelector("#stop")
    .addEventListener("click", () => {
        clearTimeout(timeoutId);
    });

document
    .querySelector("#reset")
    .addEventListener("click", () => {
        clearTimeout(timeoutId);
        GENERATION = 0;
        const fieldMatrix = createFieldSeed(X_SIZE, Y_SIZE);
        updateFieldMatrix(fieldMatrix);
    });

// TODO
document
    .querySelector("#fieldWidth")
    .addEventListener("change", (event) => {
        updateGameConfig({ CANVAS_WIDTH: event.target.value });
    });