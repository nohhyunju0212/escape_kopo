/* =========================
   공용 효과음
========================= */
const clickSound = new Audio("../sound/click.mp3");
clickSound.volume = 0.5;
clickSound.preload = "auto";

const footstepSound = new Audio("../sound/footstep.wav");
footstepSound.volume = 0.8;
footstepSound.preload = "auto";

/* =========================
   배경음악 설정
========================= */
const BGM_SRC = "../sound/basic_music.mp3";
const BGM_ENABLED_KEY = "escape_bgm_enabled";
const BGM_TIME_KEY = "escape_bgm_time";

let bgm = new Audio(BGM_SRC);
bgm.loop = true;
bgm.volume = 0.35;
bgm.preload = "auto";

/* 처음 접속 시 기본값: ON */
if (localStorage.getItem(BGM_ENABLED_KEY) === null) {
  localStorage.setItem(BGM_ENABLED_KEY, "true");
}

/* 저장된 재생 위치 불러오기 */
const savedBgmTime = parseFloat(localStorage.getItem(BGM_TIME_KEY) || "0");
if (!isNaN(savedBgmTime)) {
  bgm.currentTime = savedBgmTime;
}

/* =========================
   효과음 함수
========================= */
function playClickSound() {
  try {
    clickSound.pause();
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  } catch (e) {}
}

function playFootstepSound() {
  try {
    footstepSound.pause();
    footstepSound.currentTime = 0;
    footstepSound.play().catch(() => {});
  } catch (e) {}
}

/* =========================
   배경음악 함수
========================= */
function isBgmEnabled() {
  return localStorage.getItem(BGM_ENABLED_KEY) !== "false";
}

function saveBgmTime() {
  try {
    localStorage.setItem(BGM_TIME_KEY, String(bgm.currentTime || 0));
  } catch (e) {}
}

function playBgm() {
  if (!isBgmEnabled()) return;

  try {
    const savedTime = parseFloat(localStorage.getItem(BGM_TIME_KEY) || "0");
    if (!isNaN(savedTime) && Math.abs(bgm.currentTime - savedTime) > 1) {
      bgm.currentTime = savedTime;
    }

    bgm.play().catch(() => {});
  } catch (e) {}
}

function pauseBgm() {
  try {
    bgm.pause();
    saveBgmTime();
  } catch (e) {}
}

function toggleMusic() {
  const enabled = isBgmEnabled();

  if (enabled) {
    localStorage.setItem(BGM_ENABLED_KEY, "false");
    pauseBgm();
  } else {
    localStorage.setItem(BGM_ENABLED_KEY, "true");
    playBgm();
  }

  updateMusicButtonUI();
}

function updateMusicButtonUI() {
  const btn = document.getElementById("btn-music");
  const icon = document.getElementById("music-icon");
  const label = document.getElementById("music-label");

  if (!btn || !icon || !label) return;

  if (isBgmEnabled()) {
    icon.textContent = "🔊";
    label.textContent = "배경음악";
    btn.style.borderColor = "";
    btn.style.color = "";
  } else {
    icon.textContent = "🔇";
    label.textContent = "음소거";
    btn.style.borderColor = "rgba(255,255,255,0.2)";
    btn.style.color = "rgba(255,255,255,0.35)";
  }
}

/* =========================
   첫 사용자 상호작용 시 BGM 시작
   (브라우저 자동재생 제한 대응)
========================= */
function tryStartBgmOnce() {
  if (isBgmEnabled() && bgm.paused) {
    playBgm();
  }
  updateMusicButtonUI();
}

document.addEventListener("click", tryStartBgmOnce, { once: true });
document.addEventListener("keydown", tryStartBgmOnce, { once: true });

/* =========================
   페이지 이동 + 효과음
========================= */
function playSoundAndGo(url, soundType = "click") {
  const snd = soundType === "footstep" ? footstepSound : clickSound;
  let moved = false;
  let fallbackTimer = null;

  const movePage = () => {
    if (moved) return;
    moved = true;

    if (fallbackTimer) clearTimeout(fallbackTimer);
    snd.removeEventListener("ended", movePage);

    saveBgmTime();
    location.href = url;
  };

  try {
    snd.pause();
    snd.currentTime = 0;
    snd.addEventListener("ended", movePage, { once: true });

    fallbackTimer = setTimeout(movePage, 1500);

    snd.play().catch(() => {
      movePage();
    });
  } catch (e) {
    movePage();
  }
}

/* =========================
   자동 저장
========================= */
setInterval(() => {
  if (!bgm.paused) {
    saveBgmTime();
  }
}, 500);

window.addEventListener("beforeunload", () => {
  saveBgmTime();
});

window.addEventListener("DOMContentLoaded", () => {
  updateMusicButtonUI();

  /* 이 페이지 로드 직후에도 ON 상태면 이어서 재생 시도 */
  if (isBgmEnabled()) {
    playBgm();
  }
});