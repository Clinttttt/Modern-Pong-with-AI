window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
    
    if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (gameRunning) {
            togglePause();
        }
    }
    if (e.key === "Escape") {
        showMenu();
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

function handlePlayerInput() {
    if (!gameRunning || gamePaused) return;

    if (keys['arrowup']) {
        player.dy = -player.speed;
    } else if (keys['arrowdown']) {
        player.dy = player.speed;
    } else {
        player.dy = 0;
    }

    if (gameMode === 'multiplayer') {
        if (keys['w']) {
            player2.dy = -player2.speed;
        } else if (keys['s']) {
            player2.dy = player2.speed;
        } else {
            player2.dy = 0;
        }
    }
}
