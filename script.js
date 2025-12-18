import GameEngine from "./game/engine.js";
import SnakeGame from "./game/snake.js";

let canvasWidth, canvasHeight;
if (window.innerWidth > window.innerHeight)
  canvasWidth = canvasHeight = window.innerHeight * 0.8;
else canvasWidth = canvasHeight = window.innerWidth * 0.8;

const canvasElement = document.getElementById("canvas");
const scoreElement = document.getElementById("score");

canvasElement.width = canvasWidth;
canvasElement.height = canvasHeight;

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
