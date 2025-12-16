import { floor } from "./lib.js";
import { TYPE_COLOR, TYPE_FUNCTION } from "./engine.js";

const DIRECTION_UP = "up";
const DIRECTION_DOWN = "down";
const DIRECTION_LEFT = "left";
const DIRECTION_RIGHT = "right";

const oppositeDirections = new Map([
  [DIRECTION_RIGHT, DIRECTION_LEFT],
  [DIRECTION_LEFT, DIRECTION_RIGHT],
  [DIRECTION_UP, DIRECTION_DOWN],
  [DIRECTION_DOWN, DIRECTION_UP],
]);

const directionKeys = new Map([
  ["arrowup", DIRECTION_UP],
  ["arrowdown", DIRECTION_DOWN],
  ["arrowleft", DIRECTION_LEFT],
  ["arrowright", DIRECTION_RIGHT],

  ["w", DIRECTION_UP],
  ["s", DIRECTION_DOWN],
  ["a", DIRECTION_LEFT],
  ["d", DIRECTION_RIGHT],

  ["ц", DIRECTION_UP],
  ["ы", DIRECTION_DOWN],
  ["ф", DIRECTION_LEFT],
  ["в", DIRECTION_RIGHT],
]);

export default class {
  constructor({ width, height }) {
    if (width < 6 || height < 1) throw new Error("Game field is too small.");

    this.width = width;
    this.height = height;

    this.direction = DIRECTION_LEFT;
    this.oldDirection = DIRECTION_LEFT;

    this.score = 0;

    this.snake = [
      {
        x: floor(width / 2),
        y: floor(height / 2),
      },
      {
        x: floor(width / 2) + 1,
        y: floor(height / 2),
      },
      {
        x: floor(width / 2) + 2,
        y: floor(height / 2),
      },
    ];

    this.apple = this.createApple();

    document.addEventListener("keydown", this.directionListener);
  }

  get directionListener() {
    return (event) => {
      const key = event.key.toLowerCase();
      if (directionKeys.has(key)) this.direction = directionKeys.get(key);
    };
  }

  updateState() {
    let { x: newX, y: newY } = this.snake[0];

    if (this.direction === oppositeDirections.get(this.oldDirection))
      this.direction = this.oldDirection;

    this.oldDirection = this.direction;
    switch (this.direction) {
      case DIRECTION_RIGHT:
        newX++;
        break;
      case DIRECTION_LEFT:
        newX--;
        break;
      case DIRECTION_UP:
        newY--;
        break;
      case DIRECTION_DOWN:
        newY++;
        break;
    }

    if (
      // out of bounds
      newX < 0 ||
      newX >= this.width ||
      newY < 0 ||
      newY >= this.height ||
      // self collision
      this.snake
        .slice(0, this.snake.length - 1)
        .some(
          (segment, index) =>
            index !== 0 && segment.x === newX && segment.y === newY
        )
    ) {
      return true;
    }

    this.snake.unshift({ x: newX, y: newY });

    if (newX === this.apple.x && newY === this.apple.y)
      this.score++, (this.apple = this.createApple());
    else this.snake.pop();

    return false;
  }

  updateMatrix(matrix, setScore) {
    this.snake.forEach((segment, index) => {
      let data;
      if (index === 0)
        data = {
          type: TYPE_FUNCTION,
          function: this.drawSnakeHeadFunction,
        };
      else
        data = {
          type: TYPE_COLOR,
          color: index % 2 === 0 ? "darkgreen" : "green",
        };

      matrix[segment.x][segment.y] = data;
    });

    matrix[this.apple.x][this.apple.y] = { type: TYPE_COLOR, color: "red" };

    setScore(this.score);
  }

  update(matrix, { setScore }) {
    const isGameOver = this.updateState(setScore);
    this.updateMatrix(matrix, setScore);
    return isGameOver;
  }

  createApple() {
    const free = [];

    for (let x = 0; x < this.width; x++)
      for (let y = 0; y < this.height; y++)
        if (this.snake.some((segment) => segment.x === x && segment.y === y))
          continue;
        else free.push({ x, y });

    return free[floor(Math.random() * free.length)];
  }

  get drawSnakeHeadFunction() {
    const direction = this.direction;
    return (ctx, x, y, width, height) => {
      ctx.fillStyle = "darkgreen";
      ctx.fillRect(x, y, width, height);

      const toothX = floor(width / 5);
      const toothW = floor(width / 6);
      const toothH = floor(height / 3);

      const mouthH = floor(height / 8);

      const eyeX = floor(width / 8);
      const eyeY = floor(height / 2);
      const eyeW = floor(width / 3);
      const eyeH = floor(height / 5);

      switch (direction) {
        case DIRECTION_RIGHT:
          ctx.fillStyle = "white";
          ctx.fillRect(x + width, y + toothX, -toothH, toothW);
          ctx.fillRect(
            x + width,
            y + height - (toothX + toothW),
            -toothH,
            toothW
          );
          ctx.fillStyle = "red";
          ctx.fillRect(
            x + width,
            y + toothX + toothW,
            -mouthH,
            height - (toothX + toothW) * 2
          );
          ctx.fillStyle = "yellow";
          ctx.fillRect(x + width - eyeY, y + eyeX, -eyeH, eyeW);
          ctx.fillRect(
            x + width - eyeY,
            y + height - (eyeX + eyeW),
            -eyeH,
            eyeW
          );
          break;
        case DIRECTION_LEFT:
          ctx.fillStyle = "white";
          ctx.fillRect(x, y + toothX, toothH, toothW);
          ctx.fillRect(x, y + height - (toothX + toothW), toothH, toothW);
          ctx.fillStyle = "red";
          ctx.fillRect(
            x,
            y + toothX + toothW,
            mouthH,
            height - (toothX + toothW) * 2
          );
          ctx.fillStyle = "yellow";
          ctx.fillRect(x + eyeY, y + eyeX, eyeH, eyeW);
          ctx.fillRect(x + eyeY, y + height - (eyeX + eyeW), eyeH, eyeW);
          break;
        case DIRECTION_UP:
          ctx.fillStyle = "white";
          ctx.fillRect(x + toothX, y, toothW, toothH);
          ctx.fillRect(x + height - (toothX + toothW), y, toothW, toothH);
          ctx.fillStyle = "red";
          ctx.fillRect(
            x + toothX + toothW,
            y,
            width - (toothX + toothW) * 2,
            mouthH
          );
          ctx.fillStyle = "yellow";
          ctx.fillRect(x + eyeX, y + eyeY, eyeW, eyeH);
          ctx.fillRect(x + width - (eyeX + eyeW), y + eyeY, eyeW, eyeH);
          break;
        case DIRECTION_DOWN:
          ctx.fillStyle = "white";
          ctx.fillRect(x + toothX, y + height, toothW, -toothH);
          ctx.fillRect(
            x + width - (toothX + toothW),
            y + height,
            toothW,
            -toothH
          );
          ctx.fillStyle = "red";
          ctx.fillRect(
            x + toothX + toothW,
            y + height,
            width - (toothX + toothW) * 2,
            -mouthH
          );
          ctx.fillStyle = "yellow";
          ctx.fillRect(x + eyeX, y + height - eyeY, eyeW, -eyeH);
          ctx.fillRect(
            x + width - (eyeX + eyeW),
            y + height - eyeY,
            eyeW,
            -eyeH
          );
          break;
      }
    };
  }
}
