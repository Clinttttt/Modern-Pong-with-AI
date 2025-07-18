function startGame(mode) {
    gameMode = mode;
    document.getElementById("gameMenu").style.display = "none";
    resetGame();
    initAudio();
    gameRunning = true;
    gamePaused = false;
    startCountdown();
}

function startCountdown() {
    countdownActive = true;
    countdownValue = 3;
    showCountdownNumber();
}

function showCountdownNumber() {
    if (countdownValue <= 0) {
        countdownElement.textContent = 'GO!';
        countdownElement.className = 'countdown-show';
        playBounce();
        setTimeout(() => {
            countdownElement.textContent = '';
            countdownElement.className = '';
            countdownActive = false;
        }, 1000);
        return;
    }

    countdownElement.textContent = countdownValue;
    countdownElement.className = 'countdown-show';
    playBounce();
    
    setTimeout(() => {
        countdownElement.className = '';
        countdownValue--;
        setTimeout(() => showCountdownNumber(), 200);
    }, 800);
}

function showMenu() {
    document.getElementById("gameMenu").style.display = "flex";
    gameRunning = false;
    gamePaused = false;
    pauseOverlay.style.display = "none";
    countdownActive = false;
    countdownElement.textContent = '';
    countdownElement.className = '';
}

function cycleDifficulty() {
    const difficulties = Object.keys(DIFFICULTY);
    const currentIndex = difficulties.indexOf(difficulty);
    difficulty = difficulties[(currentIndex + 1) % difficulties.length];
    
    ai.reaction = DIFFICULTY[difficulty].reaction;
    ai.errorRate = DIFFICULTY[difficulty].errorRate;
    ai.maxSpeed = DIFFICULTY[difficulty].maxSpeed;
    
    difficultyButton.textContent = `⚙️ Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
    difficultyButton.style.background = `rgba(40, 60, 90, ${0.8 + (currentIndex * 0.1)})`;
}

function toggleMute() {
    muted = !muted;
    muteButton.textContent = muted ? '🔇 Sound Off' : '🔊 Sound On';
    muteButton.style.background = muted ? 'rgba(90, 40, 40, 0.9)' : 'rgba(40, 60, 90, 0.9)';
}

function showControls() {
    alert(`🎮 CONTROLS 🎮\n\nPlayer 1: Arrow Up/Down\nPlayer 2: W/S (multiplayer)\n\n⏯️ Space: Pause/Resume\n🏠 Esc: Game Menu\n\n💡 Powerups:\n- Pink: Speed Boost\n- Green: Multi-Ball\n\n🏆 SURVIVAL MODE: No score limit - play until you want to stop!`);
}
