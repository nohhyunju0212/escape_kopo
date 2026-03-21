const PASSWORD = "9917";
const DEFAULT_IMAGE = "../images/hyun_3.png";
const SOLVED_IMAGE = "../images/hyun_3_open.png";
const STORAGE_KEY = "computerSolved_prof";

function moveNext(index) {
  const current = document.getElementById("p" + index);
  if (!current) return;

  current.value = current.value.replace(/[^0-9]/g, "").slice(0, 1);

  if (current.value.length === 1 && index < 3) {
    const next = document.getElementById("p" + (index + 1));
    if (next) next.focus();
  }
}

function handleBackspace(event, index) {
  const current = document.getElementById("p" + index);
  if (!current) return;

  if (event.key === "Backspace") {
    if (current.value === "" && index > 0) {
      event.preventDefault();
      const prev = document.getElementById("p" + (index - 1));
      if (prev) {
        prev.value = "";
        prev.focus();
      }
    }
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    checkPassword();
  }
}

function applySolvedState() {
  const bgImage = document.getElementById("bgImage");
  const passwordBox = document.getElementById("passwordBox");

  if (bgImage) bgImage.src = SOLVED_IMAGE;
  if (passwordBox) passwordBox.style.display = "none";
}

function checkPassword() {
  playClickSound();
  const pw =
    (document.getElementById("p0")?.value || "") +
    (document.getElementById("p1")?.value || "") +
    (document.getElementById("p2")?.value || "") +
    (document.getElementById("p3")?.value || "");

  const msg = document.getElementById("pw_msg");
  if (!msg) return;

  if (pw === PASSWORD) {
    msg.style.color = "#66ff99";
    msg.textContent = "비밀번호가 맞았습니다!";

    localStorage.setItem(STORAGE_KEY, "true");
    applySolvedState();
  } else {
    msg.style.color = "#ff6666";
    msg.textContent = "비밀번호가 틀렸습니다.";

    ["p0", "p1", "p2", "p3"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    document.getElementById("p0")?.focus();
  }
}

function handleComputerClick() {
  const solved = localStorage.getItem(STORAGE_KEY) === "true";
  if (solved) applySolvedState();
}

function goBack() {
  playClickSound();
  setTimeout(() => {
    location.href = "classroom.html";
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  const solved = localStorage.getItem(STORAGE_KEY) === "true";
  const bgImage = document.getElementById("bgImage");

  if (solved) {
    applySolvedState();
  } else {
    if (bgImage) bgImage.src = DEFAULT_IMAGE;
    document.getElementById("p0")?.focus();
  }
});