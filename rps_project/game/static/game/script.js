alert("THIS JS IS RUNNING");
let playerHealth = 100;
let compHealth = 100;

const playerImg = document.getElementById("player-img");
const compImg = document.getElementById("comp-img");


function getImage(choice) {
    return "/static/game/images/" + choice + ".png?v=" + new Date().getTime();
}


function getColor(h) {
    if (h > 70) return "#00ff88";
    if (h > 40) return "#ffee00";
    if (h > 15) return "#ff9900";
    if (h > 0) return "#ff2e2e";
    return "transparent";
}


function updateHealth() {
    const p = document.getElementById("player-health");
    const c = document.getElementById("comp-health");

    p.style.width = playerHealth + "%";
    c.style.width = compHealth + "%";

    p.style.background = getColor(playerHealth);
    c.style.background = getColor(compHealth);
}


function playGame(choice) {

    if (playerHealth <= 0 || compHealth <= 0) {
        alert("Game Over! Refresh to restart.");
        return;
    }

    
    const choices = ["rock1", "paper", "scissors"];
    const computer = choices[Math.floor(Math.random() * 3)];

    
    playerImg.src = getImage(choice);
    compImg.src = getImage(computer);

    
    playerImg.classList.remove("attack-left");
    compImg.classList.remove("attack-right");

    void playerImg.offsetWidth;
    void compImg.offsetWidth;

    
    playerImg.classList.add("attack-left");
    compImg.classList.add("attack-right");

    
    const flash = document.createElement("div");
    flash.innerText = " ";
    flash.className = "flash";
    document.body.appendChild(flash);

    setTimeout(() => {
        playerImg.classList.remove("attack-left");
        compImg.classList.remove("attack-right");
        flash.remove();
    }, 400);

    
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

    
    playerHealth = Math.max(playerHealth, 0);
    compHealth = Math.max(compHealth, 0);

    updateHealth();

    
    if (playerHealth === 0) {
        document.getElementById("result").innerText = "YOU LOST THE BATTLE";
    }

    if (compHealth === 0) {
        document.getElementById("result").innerText = "YOU WON THE BATTLE";
    }
}


window.onload = updateHealth;
console.log("NEW JS LOADED");