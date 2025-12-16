import { floor } from "./lib.js";
import { TYPE_COLOR } from "./engine.js";

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
    if (width < 6 || height < 6) throw new Error("Game field is too small.");

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
      const data = { type: TYPE_COLOR };
      if (index === 0) data.color = "green";
      else data.color = index % 2 !== 0 ? "darkgreen" : "green";
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
}
