const MONITOR_DATA = {
  wb3: { img: "../images/whatnum.png", title: "칠판", desc: "숫자가 적혀있다." },
  wb4: { img: "../images/birth.png", title: "알 수 없는 종이", desc: "누군가의 생일이 적혀있다." }
};

const PW = "0162";
let tt = null;

function openMonitor(id) {
  playClickSound();

  const data = MONITOR_DATA[id];
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

function monitor1() {
  playClickSound();
  setTimeout(() => {
    location.href = "prof_com.html";
  }, 300);
}

function monitor2() {
  playClickSound();
  setTimeout(() => {
    location.href = "my_com.html";
  }, 300);
}

function monitor3() {
  openMonitor("wb3");
}

function monitor4() {
  openMonitor("wb4");
}

function closeMonitor() {
  playClickSound();

  const screen = document.getElementById("monitorScreen");
  if (!screen) return;
  if (!screen.classList.contains("active") && screen.style.display === "none") return;

  screen.classList.remove("active");

  setTimeout(() => {
    if (!screen.classList.contains("active")) {
      screen.style.display = "none";
    }
  }, 250);
}

function toggleMap() {
  playClickSound();

  const panel = document.getElementById("map-panel");
  if (panel) {
    panel.classList.toggle("open");
  }
}
function goRoom(roomName) {
  const roomPaths = {
    "강의실": "./classroom.html",
    "장석주 교수님 연구실": "./jangprofessorMain.html",
    "정원치 교수님 연구실": "./jungprofessor.html",
    "라운지": "./lounge.html",
    "서버실": "./server-room.html"
  };

  const panel = document.getElementById("map-panel");
  if (panel) panel.classList.remove("open");

  const t = document.getElementById("toast");
  const targetPath = roomPaths[roomName];

  if (!targetPath) {
    if (t) {
      t.textContent = `❗ ${roomName} 페이지가 아직 없습니다.`;
      t.classList.add("show");
      clearTimeout(tt);
      tt = setTimeout(() => t.classList.remove("show"), 2300);
    }
    return;
  }

  // 🔥 발소리 직접 객체 생성
  const snd = new Audio("../sound/footstep.wav");
  snd.volume = 0.8;

  snd.play().catch(() => {
    window.location.href = targetPath;
  });

  const duration = snd.duration || 3; // 못 가져오면 3초

  if (t) {
    t.textContent = `📍 ${roomName} 으로 이동합니다…`;
    t.classList.add("show");
  }

  clearTimeout(tt);
  tt = setTimeout(() => {
    if (t) t.classList.remove("show");
    window.location.href = targetPath;
  }, 1600);
}
function openEsc() {
  playClickSound();

  [0, 1, 2, 3].forEach(i => {
    const el = document.getElementById("p" + i);
    if (el) el.value = "";
  });

  const msg = document.getElementById("pw-msg");
  const popup = document.getElementById("popup-esc");
  const first = document.getElementById("p0");

  if (msg) msg.textContent = "";
  if (popup) popup.style.display = "flex";

  setTimeout(() => {
    if (first) first.focus();
  }, 60);
}

function closeEsc() {
  playClickSound();

  const esc = document.getElementById("popup-esc");
  if (!esc) return;
  esc.style.display = "none";
}

function pi(i) {
  const el = document.getElementById("p" + i);
  if (!el) return;

  el.value = el.value.replace(/[^0-9]/g, "").slice(0, 1);

  if (el.value.length === 1 && i < 3) {
    const next = document.getElementById("p" + (i + 1));
    if (next) next.focus();
  }
}

function pk(e, i) {
  const current = document.getElementById("p" + i);
  if (!current) return;

  if (e.key === "Backspace") {
    if (current.value === "" && i > 0) {
      e.preventDefault();
      const prev = document.getElementById("p" + (i - 1));
      if (prev) {
        prev.value = "";
        prev.focus();
      }
    }
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    tryEscape();
  }
}

function tryEscape() {
  playClickSound();

  const pw = [0, 1, 2, 3]
    .map(i => document.getElementById("p" + i)?.value || "")
    .join("");

  const msg = document.getElementById("pw-msg");

  if (pw.length < 4) {
    if (msg) msg.textContent = "4자리를 모두 입력해주세요.";
    return;
  }

  if (pw === PW) {
    closeEsc();
    const success = document.getElementById("popup-success");
    if (success) success.style.display = "flex";
  } else {
    if (msg) msg.textContent = "🔒 비밀번호가 틀린 것 같다…";
    [0, 1, 2, 3].forEach(i => {
      const el = document.getElementById("p" + i);
      if (el) el.value = "";
    });
    const first = document.getElementById("p0");
    if (first) first.focus();
  }
}

function closePopup() {
  playClickSound();
  InventoryManager.closeItemPopup();
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeMonitor();
    closeEsc();
    closePopup();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  InventoryManager.render("inv-grid", true);

  const screen = document.getElementById("monitorScreen");
  if (screen) {
    screen.addEventListener("click", e => {
      if (e.target === screen) closeMonitor();
    });
  }

  document.addEventListener("click", e => {
    const hud = document.getElementById("hud-topright");
    const panel = document.getElementById("map-panel");
    if (hud && panel && !hud.contains(e.target)) {
      panel.classList.remove("open");
    }
  });

  const popup = document.getElementById("popup");
  if (popup) {
    popup.addEventListener("click", e => {
      if (e.target === popup) closePopup();
    });
  }
});