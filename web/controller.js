class Controller {
    constructor (CANVAS_EL, GENERATION_EL) {
        this.CANVAS_EL = CANVAS_EL;
        this.CANVAS_CTX = this.CANVAS_EL.getContext("2d"); // canvas context
        this.GENERATION_EL = GENERATION_EL;

        const CANVAS_WIDTH = 600;
        const CANVAS_HEIGHT = 400;
        const CELL_PROPORTION = 8;
        const X_SIZE = Math.floor(CANVAS_WIDTH / CELL_PROPORTION);
        const Y_SIZE = Math.floor(CANVAS_HEIGHT / CELL_PROPORTION);
        const IDLE_TIME = 500; // ms
        const GENERATION = 0;
        const TIMEOUT_ID = 0;

        this.gameConfig = {
            CANVAS_WIDTH: CANVAS_WIDTH,
            CANVAS_HEIGHT: CANVAS_HEIGHT,
            CELL_PROPORTION: CELL_PROPORTION,
            X_SIZE: X_SIZE,
            Y_SIZE: Y_SIZE,
            IDLE_TIME: IDLE_TIME,
            GENERATION: GENERATION,
            TIMEOUT_ID: TIMEOUT_ID
        }

        this.engine = new Engine(this.gameConfig);
    }

    _updateGameConfig(data) {
        if (data.CANVAS_WIDTH && data.CANVAS_WIDTH !== this.gameConfig.CANVAS_WIDTH) {
            CANVAS_EL.width = this.gameConfig.CANVAS_WIDTH;
        } else if (data.CANVAS_HEIGHT && data.CANVAS_HEIGHT !== this.gameConfig.CANVAS_HEIGHT) {
            CANVAS_EL.height = this.gameConfig.CANVAS_HEIGHT;
        }
    
        this.gameConfig = { ...this.gameConfig, ...data };
    }

    _displayFieldOnConsole(fieldMatrix) {
        let parsedString = "";
    
        fieldMatrix.forEach((y_element) => {
            y_element.forEach((x_element) => {
                parsedString += x_element === 1 ? "[@]" : "[ ]";
            });
            parsedString += "\n"
        });
    
        console.clear();
        console.log(parsedString);
    }

    _displayFieldOnCanvas(fieldMatrix) {
        const rectWidth = this.gameConfig.CELL_PROPORTION;
        const rectHeight = this.gameConfig.CELL_PROPORTION;
        this.CANVAS_CTX.clearRect(0, 0, this.gameConfig.CANVAS_WIDTH, this.gameConfig.CANVAS_HEIGHT);
    
        fieldMatrix.forEach((y_element, y_index) => {
            y_element.forEach((x_element, x_index) => {
                if (x_element === 1) {
                    this.CANVAS_CTX.fillRect(
                        x_index * rectWidth, 
                        y_index * rectHeight, 
                        rectWidth, 
                        rectHeight);
                } else {
                    this.CANVAS_CTX.strokeRect(
                        x_index * rectWidth, 
                        y_index * rectHeight, 
                        rectWidth, 
                        rectHeight);
                }
            });
        });
    }

    _setNextGeneration() {
        this._updateGameConfig({ GENERATION: ++this.gameConfig.GENERATION });
        this.GENERATION_EL.innerHTML = `Generation: ${this.gameConfig.GENERATION}`;
    }

    _computeAndDisplayNextGeneration() {
        const fieldMatrix = this.engine
            .computeNextGeneration()
            .getFieldMatrix();
    
        this._setNextGeneration();
        // this._displayFieldOnConsole(fieldMatrix);
        this._displayFieldOnCanvas(fieldMatrix);
    }

    displayInitialConfig() {
        const fieldMatrix = this.engine.getFieldMatrix();
        this._displayFieldOnCanvas(fieldMatrix);
    }

    startGame() {
        const timeoutId = setInterval(() => this._computeAndDisplayNextGeneration(), this.gameConfig.IDLE_TIME);
        this._updateGameConfig({ TIMEOUT_ID: timeoutId }); 
    }

    pauseGame() {
        clearInterval(this.gameConfig.TIMEOUT_ID);
    }
}


// ====================================================
const CANVAS_EL = document.querySelector("#fieldCanvas");
const GENERATION_EL = document.querySelector("#generationCounter");

const controller = new Controller(CANVAS_EL, GENERATION_EL);

controller.displayInitialConfig();


// HTML BINDINGS
document
    .querySelector("#start")
    .addEventListener("click", () => controller.startGame());

document
    .querySelector("#stop")
    .addEventListener("click", () => controller.pauseGame());

document
    .querySelector("#reset")
    .addEventListener("click", () => {
        clearTimeout(gameConfig.TIMEOUT_ID);
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

// TODO
document
    .querySelector("#fieldHeight")
    .addEventListener("change", (event) => {
        updateGameConfig({ CANVAS_HEIGHT: event.target.value });
    });