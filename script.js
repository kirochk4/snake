import Engine from "./game/engine.js";
import SnakeGame from "./game/snake.js";

const WIDTH = 600;
const HEIGHT = 600;

const canvasElement = document.getElementById("canvas");
canvasElement.width = WIDTH;
canvasElement.height = HEIGHT;

const context = {
  canvasContext: canvasElement.getContext("2d"),
  scoreElement: document.getElementById("score"),
};

const config = {
  canvas: {
    width: WIDTH,
    height: HEIGHT,
  },
  field: {
    width: 10,
    height: 10,
  },
};

new Engine(new SnakeGame(config.field), context, config).run();
