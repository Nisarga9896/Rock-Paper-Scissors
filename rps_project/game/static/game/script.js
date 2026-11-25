const choiceButtons = Array.from(document.querySelectorAll(".choice"));
const labels = {
    rock1: "ROCK",
    paper: "PAPER",
    scissors: "SCISSORS",
};
const beats = {
    rock1: "scissors",
    paper: "rock1",
    scissors: "paper",
};
const images = Object.fromEntries(
    choiceButtons.map((button) => [button.dataset.choice, button.dataset.image])
);

const playerImg = document.getElementById("player-img");
const compImg = document.getElementById("comp-img");
const playerMove = document.getElementById("player-move");
const compMove = document.getElementById("comp-move");
const playerHealth = document.getElementById("player-health");
const compHealth = document.getElementById("comp-health");
const playerHealthTrack = document.getElementById("player-health-track");
const compHealthTrack = document.getElementById("comp-health-track");
const playerHealthValue = document.getElementById("player-health-value");
const compHealthValue = document.getElementById("comp-health-value");
const playerScore = document.getElementById("player-score");
const compScore = document.getElementById("comp-score");
const roundLabel = document.getElementById("round-label");
const streakLabel = document.getElementById("streak");
const result = document.getElementById("result");
const resultTitle = document.getElementById("result-title");
const resultDetail = document.getElementById("result-detail");
const resetButton = document.getElementById("reset");
const restartButton = document.getElementById("restart-match");
const pointsPlayer = document.getElementById("points-player");
const pointsComp = document.getElementById("points-comp");
const arena = document.querySelector(".arena");
const miniPlayerHealth = document.getElementById("mini-player-health");
const miniCompHealth = document.getElementById("mini-comp-health");
const miniPlayerScore = document.getElementById("mini-player-score");
const miniCompScore = document.getElementById("mini-comp-score");

const state = {
    playerHealth: 100,
    compHealth: 100,
    playerScore: 0,
    compScore: 0,
    streak: 0,
    round: 1,
    locked: false,
    token: 0,
};

function formatRound(value) {
    return String(value).padStart(2, "0");
}

function setHealth(fill, track, valueLabel, value, miniFill) {
    const level = value > 60 ? "high" : value > 30 ? "mid" : "low";
    fill.style.width = `${value}%`;
    fill.dataset.level = level;
    track.setAttribute("aria-valuenow", String(value));
    valueLabel.textContent = `${value}%`;
    miniFill.style.width = `${value}%`;
    miniFill.dataset.level = level;
}

function updateHUD() {
    setHealth(playerHealth, playerHealthTrack, playerHealthValue, state.playerHealth, miniPlayerHealth);
    setHealth(compHealth, compHealthTrack, compHealthValue, state.compHealth, miniCompHealth);
    playerScore.textContent = String(state.playerScore);
    compScore.textContent = String(state.compScore);
    miniPlayerScore.textContent = String(state.playerScore);
    miniCompScore.textContent = String(state.compScore);
    pointsPlayer.textContent = String(state.playerScore);
    pointsComp.textContent = String(state.compScore);
    streakLabel.textContent = String(state.streak);
    roundLabel.textContent = `ROUND ${formatRound(state.round)}`;
}

function setVerdict(title, detail, type) {
    result.dataset.result = type;
    resultTitle.textContent = title;
    resultDetail.textContent = detail;
    result.classList.remove("is-updating");
    void result.offsetWidth;
    result.classList.add("is-updating");
}

function restartAnimation(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
}

function setLocked(locked) {
    state.locked = locked;
    choiceButtons.forEach((button) => {
        button.disabled = locked;
    });
}

function markSelected(choice) {
    choiceButtons.forEach((button) => {
        const selected = button.dataset.choice === choice;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
}

function randomChoice() {
    const keys = Object.keys(labels);
    return keys[Math.floor(Math.random() * keys.length)];
}

function isMatchOver() {
    return state.playerHealth === 0 || state.compHealth === 0;
}

function resolveRound(choice, computer) {
    let outcome;
    if (beats[choice] === computer) {
        outcome = "win";
    } else if (choice === computer) {
        outcome = "draw";
    } else {
        outcome = "lose";
    }

    let title;
    let detail;

    if (outcome === "win") {
        state.compHealth = Math.max(0, state.compHealth - 10);
        state.playerScore += 1;
        state.streak += 1;
        title = isMatchOver() ? "MATCH OVER — U WON" : "U WON";
        detail = `${labels[choice]} defeats ${labels[computer]}. +1 point.`;
    } else if (outcome === "lose") {
        state.playerHealth = Math.max(0, state.playerHealth - 10);
        state.compScore += 1;
        state.streak = 0;
        title = isMatchOver() ? "MATCH OVER — U LOSE" : "U LOSE";
        detail = `${labels[computer]} defeats ${labels[choice]}. +1 point to CPU.`;
    } else {
        title = "DRAW";
        detail = `Both systems deployed ${labels[choice]}. No damage.`;
    }

    if (!isMatchOver()) {
        state.round += 1;
    }
    updateHUD();

    if (isMatchOver()) {
        detail = `Final score ${state.playerScore}–${state.compScore}. Press RESTART to run it back.`;
        document.body.classList.add("match-over");
    }

    setVerdict(title, detail, outcome);
    setLocked(false);
}

function resetMatch(silent) {
    state.token += 1;
    state.playerHealth = 100;
    state.compHealth = 100;
    state.playerScore = 0;
    state.compScore = 0;
    state.streak = 0;
    state.round = 1;

    document.body.classList.remove("match-over");
    resetButton.textContent = "RESET MATCH";
    playerImg.src = images.rock1;
    compImg.src = images.rock1;
    playerImg.classList.remove("is-attacking");
    compImg.classList.remove("is-revealing");
    playerMove.textContent = "STANDBY";
    compMove.textContent = "STANDBY";

    choiceButtons.forEach((button) => {
        button.classList.remove("is-selected");
        button.setAttribute("aria-pressed", "false");
    });

    setLocked(false);
    updateHUD();

    if (!silent) {
        setVerdict("ARENA RESET", "Choose a move to begin a new match.", "idle");
    }
}

function play(choice) {
    if (!images[choice] || state.locked) {
        return;
    }

    if (isMatchOver()) {
        resetMatch(true);
    }

    const token = ++state.token;
    const computer = randomChoice();

    setLocked(true);
    markSelected(choice);
    playerImg.src = images[choice];
    compImg.src = images[computer];
    playerMove.textContent = labels[choice];
    compMove.textContent = "SCANNING";
    setVerdict("ENGAGING", `${labels[choice]} deployed. Reading opponent...`, "idle");
    restartAnimation(playerImg, "is-attacking");
    restartAnimation(compImg, "is-revealing");

    setTimeout(() => {
        if (token !== state.token) {
            return;
        }
        compMove.textContent = labels[computer];
        resolveRound(choice, computer);
    }, 420);
}

choiceButtons.forEach((button) => {
    button.addEventListener("click", () => play(button.dataset.choice));
});

resetButton.addEventListener("click", () => resetMatch(false));
restartButton.addEventListener("click", () => resetMatch(false));

document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) {
        return;
    }

    const target = event.target;
    if (target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) {
        return;
    }

    const index = ["1", "2", "3"].indexOf(event.key);
    if (index !== -1) {
        event.preventDefault();
        play(choiceButtons[index].dataset.choice);
    } else if (event.key.toLowerCase() === "r") {
        resetMatch(false);
    }
});
function syncMiniHud() {
    const rect = arena.getBoundingClientRect();
    const arenaGone = rect.bottom < 180 || rect.top > window.innerHeight - 100;
    document.body.classList.toggle("is-scrolled", arenaGone && window.scrollY > 60);
}

window.addEventListener("scroll", syncMiniHud, { passive: true });
window.addEventListener("resize", syncMiniHud);

updateHUD();
syncMiniHud();
