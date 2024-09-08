window.addEventListener("load", () => {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById("canvas");

  /**
   * @type {CanvasRenderingContext2D}
   */
  const ctx = canvas.getContext("2d");

  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";

  class Player {
    /**
     *
     * @param {Game} game
     */
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * 0.5;
      this.collisionY = this.game.height * 0.5;
      this.collisionRadius = 40;
      this.speedX = 0;
      this.speedY = 0;
      this.dx = 0;
      this.dy = 0;
      this.speedModifier = 5;
      this.image = document.getElementById("bull");
      this.spriteWidth = 255;
      this.spriteHeight = 256;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteY;
      this.frameX = 0;
      this.frameY = 0;
    }

    /**
     *
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );

      if (game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );

        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();

        context.beginPath();
        context.moveTo(this.collisionX, this.collisionY);
        context.lineTo(this.game.mouse.x, this.game.mouse.y);
        context.stroke();
      }
    }

    update() {
      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;
      // Angle from Player to Mouse
      const angle = Math.atan2(this.dy, this.dx);
      // Distance from Mouse to Player
      const distance = Math.hypot(this.dy, this.dx);

      if (angle < -2.74 && angle > 2.74) this.frameY = 6;
      else if (angle < -1.96) this.frameY = 7;
      else if (angle < -1.17) this.frameY = 0;
      else if (angle < -0.39) this.frameY = 1;
      else if (angle < 0.39) this.frameY = 2;
      else if (angle < 1.17) this.frameY = 3;
      else if (angle < 1.96) this.frameY = 4;
      else if (angle < 2.74) this.frameY = 5;

      if (distance > this.speedModifier) {
        this.speedX = this.dx / distance || 0;
        this.speedY = this.dy / distance || 0;
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }

      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;

      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 100;

      // Map boundaries
      if (this.collisionX < 0 + this.collisionRadius)
        this.collisionX = 0 + this.collisionRadius;
      if (this.collisionX > this.game.width - this.collisionRadius)
        this.collisionX = this.game.width - this.collisionRadius;
      if (this.collisionY < 260 + this.collisionRadius)
        this.collisionY = 260 + this.collisionRadius;
      if (this.collisionY > this.game.height - this.collisionRadius)
        this.collisionY = this.game.height - this.collisionRadius;

      this.game.obstacles.forEach((obstacle) => {
        const { collision, dx, dy, distance, sumOfRadii } = game.checkCollision(
          this,
          obstacle
        );
        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });
    }
  }

  class Obstacle {
    /**
     *
     * @param {Game} game
     */
    constructor(game) {
      this.game = game;

      this.collisionRadius = 60;
      this.collisionX = Math.random() * this.game.width;
      this.collisionY = Math.random() * this.game.height;

      /**
       * @type {HTMLImageElement}
       */
      this.image = document.getElementById("obstacles");
      this.spriteWidth = 250;
      this.spriteHeight = 250;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 80;
      this.frameX = Math.floor(Math.random() * 4);
      this.frameY = Math.floor(Math.random() * 3);
    }

    /**
     *
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );

      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );

        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
      }
    }

    update() {}
  }

  class Egg {
    /**
     *
     * @param {Game} game
     */
    constructor(game) {
      this.game = game;
      this.collisionRadius = 40;
      this.margin = this.collisionRadius * 2;
      this.collisionX =
        this.margin + Math.random() * (this.game.width - this.margin * 2);
      this.collisionY =
        this.game.topMargin +
        Math.random() * (this.game.height - this.game.topMargin - this.margin);
      this.image = document.getElementById("egg");
      this.spriteWidth = 110;
      this.spriteHeight = 135;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 30;
      this.hatchTimer = 0;
      this.hatchInterval = 3000;
      this.markedForDeletion = false;
    }

    /**
     *
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
      context.drawImage(this.image, this.spriteX, this.spriteY);

      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );

        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();

        context.fillText(
          Math.floor(this.hatchTimer / 1000),
          this.collisionX,
          this.collisionY
        );
      }
    }

    /**
     *
     * @param {number} deltaTime
     */
    update(deltaTime) {
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 30;

      // Collision
      let collisionObjects = [this.game.player, ...this.game.obstacles];
      collisionObjects.forEach((object) => {
        const { collision, distance, dx, dy, sumOfRadii } =
          this.game.checkCollision(this, object);

        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });

      // Hatching
      if (this.hatchTimer > this.hatchInterval) {
        this.game.hatchings.push(
          new Larva(this.game, this.collisionX, this.collisionY)
        );
        this.hatchTimer = 0;
        this.markedForDeletion = true;
        this.game.removeGameObjects();
      } else {
        this.hatchTimer += deltaTime;
      }
    }
  }

  class Larva {
    /**
     *
     * @param {Game} game
     * @param {number} x
     * @param {number} y
     */
    constructor(game, x, y) {
      this.game = game;
      this.collisionX = x;
      this.collisionY = y;
      this.collisionRadius = 30;
      this.image = document.getElementById("larva");
      this.spriteWidth = 150;
      this.spriteHeight = 150;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteY;
      this.speedY = 1 + Math.random();
      this.markedForDeletion = false;
      this.frameX = 0;
      this.frameY = Math.floor(Math.random() * 2);
    }

    /**
     *
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );

      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );

        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
      }
    }

    update() {
      this.collisionY -= this.speedY;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 35;

      // Move to safety
      if (this.collisionY < this.game.topMargin) {
        this.markedForDeletion = true;
        this.game.removeGameObjects();
        if (!this.game.gameOver) this.game.score++;
        for (let i = 0; i < 10; i++) {
          this.game.particles.push(
            new Firefly(this.game, this.collisionX, this.collisionY, "yellow")
          );
        }
      }

      // Collision
      let collisionObjects = [this.game.player, ...this.game.obstacles];
      collisionObjects.forEach((object) => {
        const { collision, distance, dx, dy, sumOfRadii } =
          this.game.checkCollision(this, object);

        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });

      // Collision with enemies
      this.game.enemies.forEach((enemy) => {
        const { collision } = this.game.checkCollision(this, enemy);

        if (collision) {
          this.markedForDeletion = true;
          this.game.removeGameObjects();
          this.game.lostHatchings++;
          for (let i = 0; i < 10; i++) {
            this.game.particles.push(
              new Spark(this.game, this.collisionX, this.collisionY, "blue")
            );
          }
        }
      });
    }
  }

  class Enemy {
    /**
     *
     * @param {Game} game
     */
    constructor(game) {
      this.game = game;
      this.collisionRadius = 30;
      this.speedX = Math.random() * 3 + 5;
      this.image = document.getElementById("toads");
      this.spriteWidth = 140;
      this.spriteHeight = 260;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.collisionX =
        this.game.width + this.width + Math.random() * this.game.width * 0.5;
      this.collisionY =
        this.game.topMargin +
        Math.random() * (this.game.height - this.game.topMargin);
      this.spriteX;
      this.spriteY;
      this.frameX = 0;
      this.frameY = Math.floor(Math.random() * 4);
    }

    /**
     *
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );

      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );

        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
      }
    }

    update() {
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height + 60;
      this.collisionX -= this.speedX;

      // Reset position on reach left edge
      if (this.spriteX + this.width < 0 && !this.game.gameOver) {
        this.collisionX =
          this.game.width + this.width + Math.random() * this.game.width * 0.5;

        this.collisionY =
          this.game.topMargin +
          Math.random() * (this.game.height - this.game.topMargin);

        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 4);
      }

      let collisionObjects = [this.game.player, ...this.game.obstacles];
      collisionObjects.forEach((object) => {
        const { collision, distance, dx, dy, sumOfRadii } =
          this.game.checkCollision(this, object);

        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });
    }
  }

  class Particle {
    /**
     *
     * @param {Game} game
     * @param {number} x
     * @param {number} y
     * @param {string} color
     */
    constructor(game, x, y, color) {
      this.game = game;
      this.collisionX = x;
      this.collisionY = y;
      this.color = color;
      this.radius = Math.floor(Math.random() * 10 + 5);
      this.speedX = Math.random() * 6 - 3;
      this.speedY = Math.random() * 2 + 0.5;
      this.angle = 0;
      this.va = Math.random() * 0.1 + 0.01;
      this.markedForDeletion = false;
    }

    /**
     *
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
      context.save();
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.radius,
        0,
        Math.PI * 2
      );
      context.fill();
      context.stroke();
      context.restore();
    }
  }

  class Firefly extends Particle {
    update() {
      this.angle += this.va;
      this.collisionX += Math.cos(this.angle) * this.speedX;
      this.collisionY -= this.speedY;
      if (this.collisionY < 0 - this.radius) {
        this.markedForDeletion = true;
        this.game.removeGameObjects();
      }
    }
  }

  class Spark extends Particle {
    update() {
      this.angle += this.va * 0.5;
      this.collisionX -= Math.cos(this.angle) * this.speedX;
      this.collisionY -= Math.sin(this.angle) * this.speedY;

      if (this.radius > 0.1) this.radius -= 0.05;
      if (this.radius < 0.2) {
        this.markedForDeletion = true;
        this.game.removeGameObjects();
      }
    }
  }

  class Game {
    /**
     *
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.debug = false;
      this.player = new Player(this);
      this.topMargin = 260;
      this.fps = 60;
      this.timer = 0;
      this.interval = 1000 / this.fps;
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.5,
        pressed: false,
      };
      this.score = 0;
      this.winScore = 5;
      this.lostHatchings = 0;
      this.gameObjects = [];
      this.numberOfObstacles = 10;
      this.obstacles = [];
      this.gameOver = false;

      // Eggs
      this.eggTimer = 0;
      this.eggInterval = 1000;
      this.maxEggs = 20;
      this.eggs = [];
      this.hatchings = [];

      // Enemies
      this.enemies = [];

      // Particles
      this.particles = [];

      canvas.addEventListener("mousedown", (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = true;
      });

      canvas.addEventListener("mouseup", (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = false;
      });

      canvas.addEventListener("mousemove", (e) => {
        if (this.mouse.pressed) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
      });

      window.addEventListener("keydown", (e) => {
        if (e.key === "d") this.debug = !this.debug;
        console.log("DEBUG MODE", this.debug);
      });
    }

    checkCollision(a, b) {
      const dx = a.collisionX - b.collisionX;
      const dy = a.collisionY - b.collisionY;
      const distance = Math.hypot(dy, dx);
      const sumOfRadii = a.collisionRadius + b.collisionRadius;
      return { collision: sumOfRadii > distance, distance, sumOfRadii, dx, dy };
    }

    addEgg() {
      this.eggs.push(new Egg(this));
    }

    addEnemy() {
      this.enemies.push(new Enemy(this));
    }

    /**
     *
     * @param {CanvasRenderingContext2D} context
     */
    render(context, deltaTime) {
      if (this.timer > this.interval) {
        context.clearRect(0, 0, game.width, game.height);
        this.gameObjects = [
          ...this.eggs,
          ...this.obstacles,
          ...this.enemies,
          ...this.hatchings,
          ...this.particles,
          this.player,
        ].sort((a, b) => a.collisionY - b.collisionY);

        this.gameObjects.forEach((object) => {
          object.draw(context);
          object.update(deltaTime);
        });

        // Draw status text
        context.save();
        context.textAlign = "left";
        context.font = "25px Arial";
        context.fillText("Score: " + this.score, 25, 50);
        context.fillText("Lost: " + this.lostHatchings, 25, 100);
        context.restore();

        // Win / Lose
        if (this.score >= this.winScore) {
          this.gameOver = true;
          context.save();
          context.fillStyle = "rgba(0, 0, 0, 0.5)";
          context.fillRect(0, 0, this.width, this.height);
          context.fillStyle = "white";
          context.textAlign = "center";
          let message1;
          let message2;

          if (this.lostHatchings <= 5) {
            message1 = "You win!";
            message2 = "You are a great protector!";
          } else {
            message1 = "You lost!";
            message2 = "Try again!";
          }

          context.font = "130px Helvetica";
          context.fillText(message1, this.width * 0.5, this.height * 0.5 - 100);
          context.font = "60px Helvetica";
          context.fillText(message2, this.width * 0.5, this.height * 0.5 + 100);

          context.restore();
        }

        this.timer = 0;
      }

      this.timer += deltaTime;

      // Add eggs periodically
      if (
        !this.gameOver &&
        this.eggTimer > this.eggInterval &&
        this.eggs.length < this.maxEggs
      ) {
        this.addEgg();
        this.eggTimer = 0;
      } else {
        this.eggTimer += deltaTime;
      }
    }

    removeGameObjects() {
      this.eggs = this.eggs.filter((egg) => !egg.markedForDeletion);
      this.hatchings = this.hatchings.filter(
        (hatching) => !hatching.markedForDeletion
      );
      this.particles = this.particles.filter(
        (particle) => !particle.markedForDeletion
      );
    }

    init() {
      for (let i = 0; i < 3; i++) this.addEnemy();

      let attempts = 0;
      while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
        let testObstacle = new Obstacle(this);
        let overlap = false;
        this.obstacles.forEach((obstacle) => {
          const dx = testObstacle.collisionX - obstacle.collisionX;
          const dy = testObstacle.collisionY - obstacle.collisionY;
          const distance = Math.hypot(dy, dx);
          const distanceBuffer = 150;
          const sumOfRadii =
            testObstacle.collisionRadius +
            obstacle.collisionRadius +
            distanceBuffer;
          if (distance < sumOfRadii) overlap = true;
        });
        if (
          !overlap &&
          testObstacle.spriteX > 0 &&
          testObstacle.spriteX < this.width - testObstacle.width &&
          testObstacle.collisionY > this.topMargin &&
          testObstacle.spriteY < this.height - testObstacle.width
        )
          this.obstacles.push(testObstacle);
        attempts++;
      }
    }
  }

  const game = new Game(canvas);
  game.init();

  let lastTime = 0;
  /**
   *
   * @param {number} timeStamp
   */
  function animate(timeStamp = 0) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);
  }

  animate();
});
