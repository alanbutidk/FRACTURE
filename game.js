window.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startButton");
  const startScreen = document.getElementById("startScreen");
  const difficultyButtons = document.querySelectorAll(".difficulty");
  const toggleAudioBtn = document.getElementById("toggleAudio");
  const gameScreen = document.getElementById("gameScreen");
  const heartbeat = document.getElementById("heartbeatSFX");
  const ambient = document.getElementById("ambientLoop");
  const restartBtn = document.getElementById("restartBtn");

  let isMuted = false;
  let keys = {};
  let playerSpeed = 1;
  let enemySpeed = 1;

  let player = {
    x: 450,
    y: 250,
    size: 20,
    speed: playerSpeed
  };

  let loopId;

  startBtn.addEventListener("click", () => {
    heartbeat.volume = 0.7;
    if (!isMuted) heartbeat.play();

    setTimeout(() => {
      ambient.volume = 0.3;
      ambient.loop = true;
      if (!isMuted) ambient.play();

      startScreen.classList.add("fade-out");

      setTimeout(() => {
        startScreen.style.display = "none";
        gameScreen.style.display = "block";
        gameScreen.classList.add("fade-in");
        initGame();
      }, 1500);
    }, 1000);
  });

  restartBtn.addEventListener("click", () => {
    location.reload();
  });

  difficultyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      playerSpeed = parseFloat(btn.dataset.player);
      enemySpeed = parseFloat(btn.dataset.enemy);
      player.speed = playerSpeed;

      difficultyButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  toggleAudioBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    ambient.muted = isMuted;
    heartbeat.muted = isMuted;
    toggleAudioBtn.textContent = isMuted ? "🔇 Sound Off" : "🔊 Sound On";
  });

  function initGame() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let enemy = {
      x: 100,
      y: 100,
      size: 20,
      speed: enemySpeed
    };

    document.addEventListener("keydown", (e) => {
      keys[e.key.toLowerCase()] = true;
    });

    document.addEventListener("keyup", (e) => {
      keys[e.key.toLowerCase()] = false;
    });

    function triggerJumpscare() {
  const video = document.getElementById('jumpscareVideo');
  video.style.display = 'block';
  video.currentTime = 0;
  video.play().catch(e => {
    console.error("Jumpscare video error:", e);
  });

  // Kill the game canvas or pause it
  if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(animId); // or your loop ID

  // Optional: Hide video after playing
  video.onended = () => {
    video.style.display = 'none';
    location.reload(); // or restart game, show menu
  };
}

    function update() {
      player.speed = playerSpeed;
      enemy.speed = enemySpeed;

      let dx = player.x - enemy.x;
      let dy = player.y - enemy.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 1) {
        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;
      }

      if (keys["w"] || keys["arrowup"]) player.y -= player.speed;
      if (keys["s"] || keys["arrowdown"]) player.y += player.speed;
      if (keys["a"] || keys["arrowleft"]) player.x -= player.speed;
      if (keys["d"] || keys["arrowright"]) player.x += player.speed;

      player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
      player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

      if (
        player.x < enemy.x + enemy.size &&
        player.x + player.size > enemy.x &&
        player.y < enemy.y + enemy.size &&
        player.y + player.size > enemy.y
      ) {
        cancelAnimationFrame(loopId);
        triggerJumpscare();
        return;
      }
    }

    function draw() {
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ff3333";
      ctx.fillRect(player.x, player.y, player.size, player.size);

      ctx.fillStyle = "#880000";
      ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);

      ctx.fillStyle = "#f00";
      ctx.font = "24px monospace";
      ctx.fillText("It will never stop chasing you...", 50, 100);
    }

    function gameLoop() {
      update();
      draw();
      loopId = requestAnimationFrame(gameLoop);
    }

    gameLoop();
  }
});
