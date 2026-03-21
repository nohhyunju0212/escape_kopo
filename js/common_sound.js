const clickSound = new Audio("../sound/click.mp3");
clickSound.volume = 0.5;
clickSound.preload = "auto";

const footstepSound = new Audio("../sound/footstep.wav");
footstepSound.volume = 0.8;
footstepSound.preload = "auto";

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

function playSoundAndGo(url, soundType = "click") {
  const snd = soundType === "footstep" ? footstepSound : clickSound;
  let moved = false;
  let fallbackTimer = null;

  const movePage = () => {
    if (moved) return;
    moved = true;

    if (fallbackTimer) clearTimeout(fallbackTimer);
    snd.removeEventListener("ended", movePage);

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