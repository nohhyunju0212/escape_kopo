function playClickSound() {
  const snd = new Audio("../sound/click.mp3");
  snd.volume = 0.5;
  snd.play().catch(() => {});
}

function playFootstepSound() {
  const snd = new Audio("../sound/footstep.mp3");
  snd.volume = 0.8;
  snd.play().catch(() => {});
}