/* ============================================================
   Ecuador, Are You Serious? — all the playful interactivity.
   Pure vanilla JS, no dependencies, no build step.
   Every joke is built from REAL facts about Ecuador's 2026
   World Cup Group E run. All good-natured banter. ⚽😄

   The facts (for reference):
   - Ecuador 2–1 Germany, 25 Jun 2026, Group E, MetLife Stadium.
   - Despite winning, Ecuador finished 3rd — below Germany AND Ivory Coast.
   - Germany finished top and had ALREADY qualified before kickoff.
   - Ecuador had scored 0 goals in the tournament before this game.
   - First two games: lost to Ivory Coast, drew Curaçao (pop. ~150k).
   - Ecuador advanced only as a "best third-placed team."
   - Germany scored in the 2nd min (Sané); Ecuador won it in the 77th (Plata).
   ============================================================ */

/* ------------------------------------------------------------
   1. ROTATING TAUNTS — each one rooted in a real stat.
   ------------------------------------------------------------ */
const taunts = [
  "Final score: Ecuador 2, Germany 1. Final standings: Germany 1st, Ecuador 3rd. Math is undefeated. 😅",
  "You beat a team that had ALREADY qualified. They were basically on holiday. 🏖️",
  "Germany scored in the 2nd minute. You needed until the 77th. But sure — total domination. ⏱️",
  "Zero goals in your first two games. Then you 'woke up' against a team with nothing to play for.",
  "You lost to Ivory Coast, drew Curaçao (pop. 150k), and finished 3rd. CHAMPIONS! 🥉",
  "Germany had nothing to play for. You had everything. You STILL finished below them. Poetry. 📜",
  "You qualified as a 'best third-placed team.' Through the side door. 🚪",
  "Beating an already-qualified Germany in a dead rubber isn't a trophy — but enjoy the parade. 🎉",
  "One competitive goal in three games and it's a national holiday now? 📅",
  "Curaçao has ~150,000 people and held you to a draw. Let that marinate. 🇨🇼",
];

let tauntIndex = 0;
const tauntEl = document.getElementById("taunt");

// Show a taunt, fading out/in so the layout doesn't jump.
function showTaunt() {
  tauntEl.style.opacity = "0";
  setTimeout(() => {
    tauntEl.textContent = taunts[tauntIndex];
    tauntEl.style.opacity = "1";
    tauntIndex = (tauntIndex + 1) % taunts.length;
  }, 400);
}

showTaunt(); // first one right away
setInterval(showTaunt, 4000); // then every 4 seconds

/* ------------------------------------------------------------
   2. GROUP E goals-before-this-game counter.
   Dramatically "ticks up"… and lands on the grand total of 0.
   ------------------------------------------------------------ */
const goalsCounter = document.getElementById("goals-counter");
const goalsCaption = document.getElementById("goals-caption");

// Plays a little drumroll of digits, then reveals the truth: zero.
function dramaticZero() {
  let ticks = 0;
  const maxTicks = 14;
  const roll = setInterval(() => {
    // flicker some "hopeful" numbers to build suspense
    goalsCounter.textContent = Math.floor(Math.random() * 9) + 1;
    ticks++;
    if (ticks >= maxTicks) {
      clearInterval(roll);
      goalsCounter.textContent = "0";
      goalsCaption.textContent =
        "That's right: ZERO goals in the first two games. Then came the dead rubber. 🥁";
    }
  }, 110);
}

// Only run the drumroll when the counter scrolls into view.
const goalsObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        dramaticZero();
        obs.unobserve(entry.target); // only once
      }
    });
  },
  { threshold: 0.6 }
);
goalsObserver.observe(goalsCounter);

/* ------------------------------------------------------------
   3. ASTERISK REVEAL — flip the script: the WINNER needs excuses.
   Each click reveals the next asterisk; when all are shown,
   the button resets so it can be replayed.
   ------------------------------------------------------------ */
const asteriskBtn = document.getElementById("asterisk-btn");
const asterisks = Array.from(document.querySelectorAll("#asterisk-list li"));
let revealed = 0;

asteriskBtn.addEventListener("click", () => {
  if (revealed < asterisks.length) {
    asterisks[revealed].classList.add("show");
    revealed++;
    // Update the label as we go.
    if (revealed === asterisks.length) {
      asteriskBtn.textContent = "Wow. That's a lot of asterisks. (Reset)";
    } else {
      asteriskBtn.textContent = `Reveal the Next Asterisk * (${revealed}/${asterisks.length})`;
    }
    launchConfetti(18); // a tiny, humble burst per reveal
  } else {
    // Reset to replay the bit.
    asterisks.forEach((li) => li.classList.remove("show"));
    revealed = 0;
    asteriskBtn.textContent = "Reveal the Asterisks *";
  }
});

/* ------------------------------------------------------------
   4. COUNTDOWN to "the next win that actually mattered."
   Set absurdly far in the future for comedic effect.
   ------------------------------------------------------------ */
// The year 2525 — when scientists predict the next meaningful win. 🔭
const targetDate = new Date("2525-01-01T00:00:00").getTime();

const yearsEl = document.getElementById("years");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
  const now = Date.now();
  let diff = Math.max(targetDate - now, 0);

  const MS = 1000;
  const MIN = MS * 60;
  const HOUR = MIN * 60;
  const DAY = HOUR * 24;
  const YEAR = DAY * 365; // close enough for a joke timer

  const years = Math.floor(diff / YEAR);
  diff -= years * YEAR;
  const days = Math.floor(diff / DAY);
  diff -= days * DAY;
  const hours = Math.floor(diff / HOUR);
  diff -= hours * HOUR;
  const minutes = Math.floor(diff / MIN);
  diff -= minutes * MIN;
  const seconds = Math.floor(diff / MS);

  yearsEl.textContent = years.toLocaleString();
  daysEl.textContent = days;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ------------------------------------------------------------
   5. CONFETTI 🥉 — deliberately TINY and humble, in bronze-medal
   spirit. Clicking anywhere also pops a little "3rd place!" text.
   ------------------------------------------------------------ */
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let confetti = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Mostly bronze, with a little Ecuador color sprinkled in.
const confettiColors = ["#cd7f32", "#cd7f32", "#ffdd00", "#0072ce", "#ef3340"];

// Note: sizes are intentionally small — a humble, 3rd-place celebration.
function launchConfetti(amount = 30, originX = null, originY = null) {
  const ox = originX ?? window.innerWidth / 2;
  const oy = originY ?? window.innerHeight / 3;

  for (let i = 0; i < amount; i++) {
    confetti.push({
      x: ox,
      y: oy,
      vx: (Math.random() - 0.5) * 6, // weaker spread = sadder confetti
      vy: Math.random() * -6 - 2, // a feeble little pop
      size: Math.random() * 3 + 1.5, // tiny pieces
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 16,
      life: 1,
    });
  }
}

function renderConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((p) => {
    p.vy += 0.28; // gravity
    p.vx *= 0.99; // air drag
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.spin;
    p.life -= 0.012; // fade a touch faster — the joy doesn't last

    ctx.save();
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  });

  confetti = confetti.filter((p) => p.life > 0 && p.y < canvas.height + 50);
  requestAnimationFrame(renderConfetti);
}
renderConfetti();

// Pop a small floating "3rd place!" text at a screen position.
const popMessages = ["🥉 3rd place!", "Below Germany! 🥉", "Still 3rd! 🎉", "Best of the third-placed! 🚪"];
let popIndex = 0;
function popCelebrationText(x, y) {
  const el = document.createElement("div");
  el.className = "celebrate-pop";
  el.textContent = popMessages[popIndex % popMessages.length];
  popIndex++;
  el.style.left = x + "px";
  el.style.top = y + "px";
  document.body.appendChild(el);
  // remove after the float-up animation finishes
  setTimeout(() => el.remove(), 1300);
}

// Click ANYWHERE to celebrate (humbly), bursting from the click point.
document.addEventListener("click", (e) => {
  launchConfetti(24, e.clientX, e.clientY);
  popCelebrationText(e.clientX, e.clientY);
});

// Dedicated "Celebrate (Humbly)" button — still humble, just a bit more.
const celebrateBtn = document.getElementById("celebrate-btn");
celebrateBtn.addEventListener("click", () => {
  // A modest double-pop. Don't get carried away — it's 3rd place. 🥉
  launchConfetti(40);
  setTimeout(() => launchConfetti(30, window.innerWidth / 2, window.innerHeight / 2.5), 220);
});
