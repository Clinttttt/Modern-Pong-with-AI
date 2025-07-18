function drawGame() {
    const offsetX = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
    const offsetY = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
    ctx.setTransform(1, 0, 0, 1, offsetX, offsetY);
    screenShake = Math.max(0, screenShake - 1);

    ctx.fillStyle = "#000318";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#9cf";
    ctx.shadowColor = "#6df";
    ctx.shadowBlur = 20;

    ctx.fillRect(player.x, player.y, paddleWidth, paddleHeight);
    const rightPaddle = gameMode === 'multiplayer' ? player2 : ai;
    ctx.fillRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    powerups.forEach(pwr => {
        ctx.fillStyle = POWERUP_TYPES[pwr.type].color;
        ctx.beginPath();
        ctx.arc(pwr.x, pwr.y, 12, 0, Math.PI * 2);
        ctx.fill();
    });

    particles.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;
        p.alpha -= 0.04;
        p.dy += 0.15;
        ctx.fillStyle = `${p.color}${Math.round(p.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.alpha <= 0) particles.splice(i, 1);
    });

    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function initAudio() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const bounceDuration = 0.15;
    bounceBuffer = audioContext.createBuffer(1, audioContext.sampleRate * bounceDuration, audioContext.sampleRate);
    const bounceData = bounceBuffer.getChannelData(0);
    for (let i = 0; i < bounceData.length; i++) {
        const t = i / audioContext.sampleRate;
        bounceData[i] = Math.sin(2 * Math.PI * 500 * t) * Math.exp(-t * 20) * 0.6;
    }

    const scoreDuration = 0.8;
    scoreBuffer = audioContext.createBuffer(1, audioContext.sampleRate * scoreDuration, audioContext.sampleRate);
    const scoreData = scoreBuffer.getChannelData(0);
    for (let i = 0; i < scoreData.length; i++) {
        const t = i / scoreData.length;
        scoreData[i] = Math.sin(2 * Math.PI * (300 + t * 200) * t) * (1 - t) * 0.5;
    }
}

function playBounce() {
    if (muted || !audioContext) return;
    const source = audioContext.createBufferSource();
    source.buffer = bounceBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

function playScore() {
    if (muted || !audioContext) return;
    const source = audioContext.createBufferSource();
    source.buffer = scoreBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

function gameLoop() {
    handlePlayerInput();

    if (gameRunning && !gamePaused && !countdownActive) {
        movePlayer();
        moveAI();
        moveBall();
        updatePowerups();
    }

    drawGame();
    requestAnimationFrame(gameLoop);
}

gameLoop();
