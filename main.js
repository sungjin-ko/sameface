const countSelect = document.getElementById("count");
const spinButton = document.getElementById("spin");
const result = document.getElementById("result");
const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");

const MIN_COUNT = 2;
const MAX_COUNT = 20;
const COLORS = [
  "#ffd0e6",
  "#ffe6f3",
  "#ffc2dd",
  "#ffeef8",
  "#ffb3d1",
  "#ffd9ec"
];

let currentRotation = 0;

function buildOptions() {
  for (let i = MIN_COUNT; i <= MAX_COUNT; i += 1) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = `${i}명`;
    countSelect.appendChild(option);
  }
  countSelect.value = "6";
}

function drawWheel(count) {
  const size = wheel.width;
  const radius = size / 2;
  const segmentAngle = (Math.PI * 2) / count;
  const startOffset = -Math.PI / 2;

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(radius, radius);

  for (let i = 0; i < count; i += 1) {
    const start = startOffset + i * segmentAngle;
    const end = start + segmentAngle;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fill();

    ctx.strokeStyle = "#f4a9c7";
    ctx.lineWidth = 2;
    ctx.stroke();

    const labelAngle = start + segmentAngle / 2;
    ctx.save();
    ctx.rotate(labelAngle);
    ctx.translate(radius * 0.66, 0);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = "#8a2a5e";
    ctx.font = "bold 18px 'Fira Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(i + 1), 0, 0);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.08, 0, Math.PI * 2);
  ctx.fillStyle = "#ff5aa5";
  ctx.fill();
  ctx.restore();
}

function spinWheel() {
  const count = Number(countSelect.value);
  const segmentDeg = 360 / count;
  const winnerIndex = Math.floor(Math.random() * count);
  const offsetToWinner = -(winnerIndex + 0.5) * segmentDeg;
  const extraSpins = 5 * 360;
  const targetRotation = currentRotation + extraSpins + offsetToWinner;

  spinButton.disabled = true;
  result.textContent = "돌리는 중...";

  wheel.style.transform = `rotate(${targetRotation}deg)`;

  setTimeout(() => {
    currentRotation = targetRotation % 360;
    result.textContent = `결과: ${winnerIndex + 1}번`;
    spinButton.disabled = false;
  }, 3900);
}

buildOptions();
drawWheel(Number(countSelect.value));

countSelect.addEventListener("change", () => {
  drawWheel(Number(countSelect.value));
});

spinButton.addEventListener("click", spinWheel);
