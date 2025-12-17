import GameEngine from "./game/engine.js";
import SnakeGame from "./game/snake.js";

const WIDTH = 600;
const HEIGHT = 600;

const canvasElement = document.getElementById("canvas");
const scoreElement = document.getElementById("score");

canvasElement.width = WIDTH;
canvasElement.height = HEIGHT;

const context = {
  canvas: canvasElement,
  score: scoreElement,
};

const config = {
  matrix: {
    width: 10,
    height: 10,
  },
};

new GameEngine(new SnakeGame(config.matrix), context, config);
