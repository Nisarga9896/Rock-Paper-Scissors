alert("THIS JS IS RUNNING");
let playerHealth = 100;
let compHealth = 100;

const playerImg = document.getElementById("player-img");
const compImg = document.getElementById("comp-img");

// CACHE FIX
function getImage(choice) {
    return "/static/game/images/" + choice + ".png?v=" + new Date().getTime();
}

// HEALTH COLOR
function getColor(h) {
    if (h > 70) return "#00ff88";
    if (h > 40) return "#ffee00";
    if (h > 15) return "#ff9900";
    if (h > 0) return "#ff2e2e";
    return "transparent";
}

// UPDATE HEALTH
function updateHealth() {
    const p = document.getElementById("player-health");
    const c = document.getElementById("comp-health");

    p.style.width = playerHealth + "%";
    c.style.width = compHealth + "%";

    p.style.background = getColor(playerHealth);
    c.style.background = getColor(compHealth);
}

// GAME FUNCTION
function playGame(choice) {

    if (playerHealth <= 0 || compHealth <= 0) {
        alert("Game Over! Refresh to restart.");
        return;
    }

    // ✅ FIXED: using rock1 everywhere
    const choices = ["rock1", "paper", "scissors"];
    const computer = choices[Math.floor(Math.random() * 3)];

    // UPDATE IMAGES
    playerImg.src = getImage(choice);
    compImg.src = getImage(computer);

    // RESET ANIMATION
    playerImg.classList.remove("attack-left");
    compImg.classList.remove("attack-right");

    void playerImg.offsetWidth;
    void compImg.offsetWidth;

    // ATTACK MOVE
    playerImg.classList.add("attack-left");
    compImg.classList.add("attack-right");

    // COLLISION 💥
    const flash = document.createElement("div");
    flash.innerText = " ";
    flash.className = "flash";
    document.body.appendChild(flash);

    setTimeout(() => {
        playerImg.classList.remove("attack-left");
        compImg.classList.remove("attack-right");
        flash.remove();
    }, 400);

    // ✅ FIXED GAME LOGIC
    if (
        (choice === "rock1" && computer === "scissors") ||
        (choice === "paper" && computer === "rock1") ||
        (choice === "scissors" && computer === "paper")
    ) {
        compHealth -= 20;
        document.getElementById("result").innerText = "YOU WIN";
    }
    else if (choice === computer) {
        document.getElementById("result").innerText = "DRAW";
    }
    else {
        playerHealth -= 20;
        document.getElementById("result").innerText = "YOU LOSE";
    }

    // NO NEGATIVE
    playerHealth = Math.max(playerHealth, 0);
    compHealth = Math.max(compHealth, 0);

    updateHealth();

    // FINAL RESULT
    if (playerHealth === 0) {
        document.getElementById("result").innerText = "YOU LOST THE BATTLE";
    }

    if (compHealth === 0) {
        document.getElementById("result").innerText = "YOU WON THE BATTLE";
    }
}

// LOAD
window.onload = updateHealth;
console.log("NEW JS LOADED");