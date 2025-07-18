const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById("scoreBoard");
const difficultyButton = document.getElementById("difficultyButton");
const muteButton = document.getElementById("muteButton");
const countdownElement = document.getElementById("countdown");
const pauseOverlay = document.getElementById("pauseOverlay");

// Game settings
canvas.width = 1000;
canvas.height = 680;
let gameMode = 'singleplayer';
let difficulty = 'medium';
let muted = false;
let screenShake = 0;
let audioContext, bounceBuffer, clapBuffer, scoreBuffer;

// Game objects
const paddleWidth = 16, paddleHeight = 140, ballSize = 18;
const player = { 
    x: 40, 
    y: canvas.height/2 - paddleHeight/2, 
    dy: 0, 
    score: 0, 
    powerup: null,
    speed: 14,
    moving: false
};

const player2 = {
    x: canvas.width - 56,
    y: canvas.height/2 - paddleHeight/2,
    dy: 0,
    score: 0,
    speed: 14,
    moving: false
};

const ai = { 
    x: canvas.width - 56, 
    y: canvas.height/2 - paddleHeight/2, 
    dy: 0, 
    score: 0,
    reaction: 0.8,
    errorRate: 0.2,
    maxSpeed: 9,
    acceleration: 0.5
};

const ball = { 
    x: canvas.width/2, 
    y: canvas.height/2, 
    dx: 7, 
    dy: 7,
    originalSpeed: 7
};

let powerups = [];
let particles = [];
let gameRunning = false;
let gamePaused = false;
let countdownActive = false;
let countdownValue = 3;
let keys = {};

const DIFFICULTY = {
    easy: { reaction: 0.6, errorRate: 0.4, maxSpeed: 7 },
    medium: { reaction: 0.8, errorRate: 0.2, maxSpeed: 9 },
    hard: { reaction: 1.0, errorRate: 0.1, maxSpeed: 11 }
};

const POWERUP_TYPES = {
    SPEED_BOOST: { color: '#f6d', duration: 4000 },
    MULTI_BALL: { color: '#9f6', duration: 0 }
};
