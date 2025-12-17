import { sleep } from "./lib.js";

export const TYPE_COLOR = "color";
export const TYPE_FUNCTION = "function";

export default class {
  constructor(game, context, config) {
    this.canvas = context.canvas;
    this.canvasContext = context.canvas.getContext("2d");
    this.score = context.score;
    this.config = config;
    this.game = game;

    const start = () => {
      this.canvas.removeEventListener("click", start);
      this.run();
    };

    this.canvas.addEventListener("click", start);

    this.drawText("click to play", true);
  }

  async run() {
    for (;;) {
      const matrix = this.createMatrix();
      const { isGameOver, delay } = this.update(matrix);
      this.draw(matrix);
      if (isGameOver) break;
      else await sleep(delay);
    }

    this.drawText("git gud");
  }

  createMatrix() {
    const matrix = [];
    for (let x = 0; x < this.config.matrix.width; x++) {
      matrix[x] = [];
      for (let y = 0; y < this.config.matrix.height; y++) {
        matrix[x][y] = null;
      }
    }
    return matrix;
  }

  update(matrix) {
    const setScore = (score) => (this.score.textContent = score);

    return this.game.update(matrix, { setScore });
  }

  draw(matrix) {
    const blockWidth = this.canvas.width / this.config.matrix.width;
    const blockHeight = this.canvas.height / this.config.matrix.height;

    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let x = 0; x < matrix.length; x++)
      for (let y = 0; y < matrix[x].length; y++) {
        const element = matrix[x][y];
        if (element)
          switch (element.type) {
            case TYPE_COLOR:
              this.canvasContext.fillStyle = element.color;
              this.canvasContext.fillRect(
                x * blockWidth,
                y * blockHeight,
                blockWidth,
                blockHeight
              );
              break;
            case TYPE_FUNCTION:
              element.function(
                this.canvasContext,
                x * blockWidth,
                y * blockHeight,
                blockWidth,
                blockHeight
              );
          }
      }
  }

  drawText(text, clear) {
    if (clear)
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvasContext.font = "96px vernada";
    this.canvasContext.fillStyle = "black";

    this.canvasContext.textAlign = "center";
    this.canvasContext.textBaseline = "middle";

    this.canvasContext.fillText(
      text,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }
}
