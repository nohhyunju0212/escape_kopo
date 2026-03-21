const DESK_DATA = {
  paper: {
    img: "../images/paper_zoom.png",
    title: "구겨진 종이",
    desc: "심하게 구겨진 종이다.\n펴보니 숫자와 메모가 희미하게 적혀 있다."
  },
  notebook: {
    img: "../images/notebook_zoom.png",
    title: "공책",
    desc: "여러 메모가 적혀 있는 공책이다.\n중요해 보이는 문장에 밑줄이 그어져 있다."
  }
};

function openDeskItem(id) {
  playClickSound();
  const data = DESK_DATA[id];
  if (!data) return;

  const img = document.getElementById("monitorImg");
  const title = document.getElementById("monitorTitle");
  const desc = document.getElementById("monitorDesc");
  const screen = document.getElementById("monitorScreen");

  if (!img || !title || !desc || !screen) return;

  img.src = data.img;
  img.alt = data.title;
  title.textContent = data.title;
  desc.textContent = data.desc;

  screen.style.display = "flex";
  requestAnimationFrame(() => screen.classList.add("active"));
}

function closeMonitor() {
  playClickSound();
  const screen = document.getElementById("monitorScreen");
  if (!screen) return;

  screen.classList.remove("active");
  setTimeout(() => {
    if (!screen.classList.contains("active")) {
      screen.style.display = "none";
    }
  }, 250);
}

function goBack() {
  playClickSound();
  setTimeout(() => {
    location.href = "classroom.html";
  }, 300);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMonitor();
});

document.addEventListener("DOMContentLoaded", () => {
  const screen = document.getElementById("monitorScreen");
  if (!screen) return;

  screen.addEventListener("click", (e) => {
    if (e.target === screen) closeMonitor();
  });
});