function resetGame() {
    player.score = 0;
    if (gameMode === 'multiplayer') {
        player2.score = 0;
    } else {
        ai.score = 0;
    }
    resetBall();
    updateScore();
    powerups = [];
    particles = [];
    player.powerup = null;
}

function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.dx = 7 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = 7 * (Math.random() > 0.5 ? 1 : -1);
    ball.originalSpeed = 7;
}

function updateScore() {
    if (gameMode === 'multiplayer') {
        scoreBoard.innerHTML = `<span>${player.score}</span><span>${player2.score}</span>`;
    } else {
        scoreBoard.innerHTML = `<span>${player.score}</span><span>${ai.score}</span>`;
    }
}

function moveAI() {
    if (gameMode === 'multiplayer') return;
    
    const predictX = ai.x - ball.x;
    const timeToImpact = Math.abs(predictX / ball.dx);
    const predictedY = ball.y + (ball.dy * timeToImpact);
    const targetY = Math.min(Math.max(
        predictedY + (Math.random() - 0.5) * ai.errorRate * 100, 
        0
    ), canvas.height - paddleHeight);

    const direction = targetY - ai.y > 0 ? 1 : -1;
    ai.dy = Math.min(ai.maxSpeed, Math.max(-ai.maxSpeed, ai.dy + direction * ai.acceleration));
    ai.y += ai.dy;
    ai.y = Math.max(0, Math.min(canvas.height - paddleHeight, ai.y));
}

function movePlayer() {
    player.y += player.dy;
    player.y = Math.max(0, Math.min(canvas.height - paddleHeight, player.y));
    
    if (gameMode === 'multiplayer') {
        player2.y += player2.dy;
        player2.y = Math.max(0, Math.min(canvas.height - paddleHeight, player2.y));
    }
}

function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    pauseOverlay.style.display = gamePaused ? 'flex' : 'none';
    if (!gamePaused) playBounce();
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y <= 0 || ball.y >= canvas.height - ballSize) {
        ball.dy *= -1;
        playBounce();
        createParticles(ball.x, ball.y);
    }

    const rightPaddle = gameMode === 'multiplayer' ? player2 : ai;
    if (checkPaddleCollision(player) || checkPaddleCollision(rightPaddle)) {
        ball.dx *= -1.1;
        ball.dy *= 1.05;
        screenShake = 5;
        playBounce();
        maybeSpawnPowerup();
        createParticles(ball.x, ball.y);
    }

    if (ball.x < 0) handleScore(gameMode === 'multiplayer' ? player2 : ai);
    if (ball.x > canvas.width) handleScore(player);
}

function checkPaddleCollision(paddle) {
    return ball.x < paddle.x + paddleWidth && 
           ball.x + ballSize > paddle.x &&
           ball.y < paddle.y + paddleHeight && 
           ball.y + ballSize > paddle.y;
}

function handleScore(scorer) {
    scorer.score++;
    updateScore();
    screenShake = 10;
    playScore();
    resetBall();
}

function createParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x, y,
            dx: (Math.random() - 0.5) * 8,
            dy: (Math.random() - 0.5) * 8,
            alpha: 1,
            size: Math.random() * 4 + 2,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
    }
}

function maybeSpawnPowerup() {
    if (Math.random() < 0.25) {
        powerups.push({
            x: ball.x,
            y: ball.y,
            type: Object.keys(POWERUP_TYPES)[Math.floor(Math.random() * 2)],
            timer: 400
        });
    }
}

function checkPowerupCollision(powerup, paddle) {
    return powerup.x > paddle.x - 25 &&
           powerup.x < paddle.x + paddleWidth + 25 &&
           powerup.y > paddle.y - 25 &&
           powerup.y < paddle.y + paddleHeight + 25;
}

function applyPowerup(powerup) {
    const type = POWERUP_TYPES[powerup.type];
    switch(powerup.type) {
        case 'SPEED_BOOST':
            ball.dx *= 1.6;
            ball.dy *= 1.6;
            setTimeout(() => {
                ball.dx = ball.originalSpeed * Math.sign(ball.dx);
                ball.dy = ball.originalSpeed * Math.sign(ball.dy);
            }, type.duration);
            break;
        case 'MULTI_BALL':
            createParticles(ball.x, ball.y);
            break;
    }
}

function updatePowerups() {
    powerups.forEach((pwr, index) => {
        pwr.timer--;
        if (pwr.timer <= 0) {
            powerups.splice(index, 1);
            return;
        }
        const rightPaddle = gameMode === 'multiplayer' ? player2 : ai;
        if (checkPowerupCollision(pwr, player) || checkPowerupCollision(pwr, rightPaddle)) {
            applyPowerup(pwr);
            powerups.splice(index, 1);
        }
    });
}
