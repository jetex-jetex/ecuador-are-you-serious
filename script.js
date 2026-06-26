/* ============================================================
   Ecuador, Are You Serious? — all the playful interactivity.
   Pure vanilla JS, no dependencies, no build step.
   Everything here is good-natured soccer banter. ⚽😄
   ============================================================ */

/* ------------------------------------------------------------
   1. ROTATING TAUNTS
   Cheeky one-liners that cycle in the hero every few seconds.
   ------------------------------------------------------------ */
const taunts = [
  "One win over Germany and suddenly you're a footballing superpower? 😂",
  "Beating Germany once is like winning one hand of poker and retiring undefeated.",
  "We get it, you beat Germany. Should we frame it? Build a museum?",
  "Germany lost ONE game and you're acting like you lifted the World Cup. 🏆❓",
  "Plot twist: it counts as ONE win, not a national holiday.",
  "Ecuador beat Germany. In other news, water is wet and the bragging is eternal.",
  "Still waiting on that second World Cup title… we'll hold. ⏳",
  "Quito's altitude did more work than the strikers, let's be honest. ⛰️",
  "The win was real. So is our need to talk about literally anything else now.",
  "Congrats on the win! Now let's discuss the OTHER 90% of matches. 👀",
];

let tauntIndex = 0;
const tauntEl = document.getElementById("taunt");

// Show the first taunt immediately, then rotate on a timer.
function showTaunt() {
  // fade out, swap text, fade back in for a smooth transition
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
   2. OFFICIAL EXCUSE GENERATOR
   Spits out a random "reason" the win didn't count.
   ------------------------------------------------------------ */
const excuses = [
  "It was just a friendly. Friendlies don't count. Everyone knows that. 🤝",
  "Germany was clearly experimenting with a brand-new lineup. Science!",
  "The referee had a flight to catch and rushed the whole thing. ✈️",
  "Germany's bus got stuck in traffic and they played jet-lagged. 🚌",
  "It was windy. Statistically, wind favors the home team. 🌬️",
  "Germany's best players were 'resting.' All of them. At once.",
  "VAR was on a coffee break for the entire second half. ☕",
  "The ball was slightly rounder than regulation. Suspicious.",
  "Ecuador had the altitude advantage. And the gravity advantage. Probably.",
  "Germany was being polite. They're guests, after all. 🙇",
  "Mercury was in retrograde and Germany are very sensitive to astrology. ♏",
  "It was a Tuesday. Germany historically underperforms on Tuesdays.*",
  "The grass was the wrong shade of green and threw everyone off. 🟩",
  "Germany lent Ecuador their lucky cleats out of kindness. Big mistake.",
  "Honestly? We blinked and missed it, so it probably didn't happen. 😉",
];

const excuseBtn = document.getElementById("excuse-btn");
const excuseOutput = document.getElementById("excuse-output");
let lastExcuse = -1;

excuseBtn.addEventListener("click", () => {
  // Pick a random excuse that isn't the same as the last one shown.
  let idx;
  do {
    idx = Math.floor(Math.random() * excuses.length);
  } while (idx === lastExcuse && excuses.length > 1);
  lastExcuse = idx;

  excuseOutput.style.opacity = "0";
  setTimeout(() => {
    excuseOutput.textContent = "“" + excuses[idx] + "”";
    excuseOutput.style.opacity = "1";
  }, 200);

  // A little celebratory burst makes the button feel alive.
  launchConfetti(40);
});

/* ------------------------------------------------------------
   3. SCOREBOARD — animate the absurd stats counting up
   Uses IntersectionObserver so they count up when scrolled into view.
   ------------------------------------------------------------ */
function animateCount(el) {
  const target = Number(el.dataset.target);
  const duration = 1200; // ms
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    // easeOutQuad for a snappy finish
    const eased = 1 - (1 - progress) * (1 - progress);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(tick);
}

const statNumbers = document.querySelectorAll(".stat-number");
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target); // only animate once
      }
    });
  },
  { threshold: 0.5 }
);
statNumbers.forEach((n) => observer.observe(n));

/* ------------------------------------------------------------
   4. COUNTDOWN to "the next time it'll happen"
   Set absurdly far in the future for comedic effect.
   ------------------------------------------------------------ */
// The year 2525 — when scientists predict the next big upset. 🔭
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
   5. CONFETTI 🎉
   A tiny self-contained confetti system on a full-screen canvas.
   Triggered by clicking anywhere, or the dedicated buttons.
   ------------------------------------------------------------ */
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let confetti = [];

// Keep the canvas matched to the window size (and on resize).
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Confetti in Ecuador's colors, naturally.
const confettiColors = ["#ffdd00", "#0072ce", "#ef3340", "#ffffff"];

function launchConfetti(amount = 80, originX = null, originY = null) {
  const ox = originX ?? window.innerWidth / 2;
  const oy = originY ?? window.innerHeight / 3;

  for (let i = 0; i < amount; i++) {
    confetti.push({
      x: ox,
      y: oy,
      // random spread + upward-ish initial velocity
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -10 - 4,
      size: Math.random() * 8 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 20,
      life: 1, // fades from 1 -> 0
    });
  }
}

function renderConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((p) => {
    // physics: gravity + drag + fade
    p.vy += 0.3; // gravity
    p.vx *= 0.99; // air drag
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.spin;
    p.life -= 0.008;

    ctx.save();
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  });

  // Drop confetti that has faded or fallen off-screen.
  confetti = confetti.filter((p) => p.life > 0 && p.y < canvas.height + 50);

  requestAnimationFrame(renderConfetti);
}
renderConfetti(); // run the render loop continuously

// Click ANYWHERE to celebrate, bursting from the click point.
document.addEventListener("click", (e) => {
  launchConfetti(60, e.clientX, e.clientY);
});

// Dedicated celebrate button (in addition to the global click).
const celebrateBtn = document.getElementById("celebrate-btn");
celebrateBtn.addEventListener("click", () => {
  // Big double burst for extra drama. 🎊
  launchConfetti(120);
  setTimeout(() => launchConfetti(120, window.innerWidth / 2, window.innerHeight / 2), 250);
});
