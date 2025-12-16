import { sleep } from "./lib.js";

export const TYPE_COLOR = "color";

export default class {
  constructor(game, context, config) {
    this.canvas = context.canvasContext;
    this.score = context.scoreElement;
    this.config = config;
    this.game = game;
  }

  async run() {
    for (;;) {
      const matrix = this.createMatrix();
      const isGameOver = this.update(matrix);
      this.draw(matrix);
      await sleep(400);
      if (isGameOver) break;
    }
  }

  createMatrix() {
    const matrix = [];
    for (let x = 0; x < this.config.field.width; x++) {
      matrix[x] = [];
      for (let y = 0; y < this.config.field.height; y++) {
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
    const blockWidth = this.config.canvas.width / this.config.field.width;
    const blockHeight = this.config.canvas.height / this.config.field.height;

    this.canvas.clearRect(
      0,
      0,
      this.config.canvas.width,
      this.config.canvas.height
    );

    for (let x = 0; x < matrix.length; x++)
      for (let y = 0; y < matrix[x].length; y++) {
        const element = matrix[x][y];
        if (element)
          switch (element.type) {
            case TYPE_COLOR:
              this.canvas.fillStyle = element.color;
              this.canvas.fillRect(
                x * blockWidth,
                y * blockHeight,
                blockWidth,
                blockHeight
              );
              break;
          }
      }
  }
}
