window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;

  class Player {
    constructor(game) {
      this.game = game;
    }

    draw(context) {
      context.beginPath();
      context.arc(100, 100, 50, 0, Math.PI * 2);
      context.fill();
    }
  }

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player = new Player(this);
    }

    render(context) {
      this.player.draw(context);
    }
  }

  const game = new Game(canvas);
  game.render(ctx);

  function animate() {}
});
