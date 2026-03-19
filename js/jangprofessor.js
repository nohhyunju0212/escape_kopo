const grid = document.getElementById("inv-grid");
if (grid) {
  for (let i = 0; i < 20; i++) {
    const d = document.createElement("div");
    d.className = "inv-slot";
    d.id = "s" + i;
    grid.appendChild(d);
  }
}

const ITEMS = {
  memo: {
    t: "e",
    icon: "📝",
    inv: "📝",
    name: "교수님의 메모장",
    desc: "mEmo.\nduddjfh 2"
  },
  display: {
    t: "i",
    icon: "../images/o.png",
    inv: "../images/o.png",
    name: "교수님의 모니터",
    desc: "모니터를 켰는데 배경화면이 조금 이상하다.\n세모, 네모, 동그라미, 육각형\n왜 동그라미만 색깔이 다를까?"
  },
  severKey: {
    t: "i",
    icon: "../images/serverKey.png",
    inv: "../images/serverKey.png",
    name: "서버실 카드키",
    desc: "서버실 카드키"
  },
  Shelf: {
    t: "i",
    icon: "../images/confidential.png",
    inv: "../images/confidential.png",
    name: "confidential",
    desc: "교수님의 기밀문서.\n뭐라쓰지...."
  },
  locker: {
    t: "i",
    icon: "../images/N.png",
    inv: "../images/N.png",
    name: "나침반",
    desc: "..."
  },
  bookcase: {
    t: "e",
    icon: "📚",
    inv: "📚",
    name: "책꽂이",
    desc: "책꽂이 안에 책과 서류가 빽빽하게 꽂혀 있다."
  }
};

const PW = "0162";
let cur = null;
let col = [];

function showPopup(id, viewOnly) {
  const d = ITEMS[id];
  if (!d) return;

  document.getElementById("p-icon").innerHTML =
    d.t === "i" ? `<img src="${d.icon}" alt="${d.name}">` : d.icon;
  document.getElementById("p-title").textContent = d.name;
  document.getElementById("p-desc").textContent = d.desc;

  const popup = document.getElementById("popup");
  if (viewOnly) {
    popup.classList.add("view-mode");
  } else {
    popup.classList.remove("view-mode");
    cur = id;
  }
  popup.classList.add("show");
}

function openItem(id) {
  if (col.includes(id)) {
    showPopup(id, true);
    return;
  }
  showPopup(id, false);
}

function closePopup() {
  document.getElementById("popup").classList.remove("show", "view-mode");
  cur = null;
}

function takeItem() {
  if (!cur) return;

  const d = ITEMS[cur];
  const idx = col.length;
  col.push(cur);

  document.querySelectorAll(".hotspot").forEach((el) => {
    const onclickText = el.getAttribute("onclick") || "";
    if (onclickText.includes(`'${cur}'`) || onclickText.includes(`"${cur}"`)) {
      el.classList.add("taken");
    }
  });

  const s = document.getElementById("s" + idx);
  if (s) {
    s.innerHTML = d.t === "i"
      ? `<img src="${d.inv}" alt="${d.name}" title="${d.name}">`
      : d.inv;

    s.title = d.name;
    s.dataset.itemId = cur;
    s.classList.add("filled");
    s.onclick = () => openItem(s.dataset.itemId);
  }

  closePopup();
}

function goDesk() {
  location.href = "./jangprofessorDesk.html";
}

function gobook() {
  location.href = "./jangprofessorBookcase.html";
}

function toggleMap() {
  document.getElementById("map-panel").classList.toggle("open");
}

document.addEventListener("click", (e) => {
  const hud = document.getElementById("hud-topright");
  if (hud && !hud.contains(e.target)) {
    document.getElementById("map-panel").classList.remove("open");
  }
});

let tt = null;

function goRoom(roomName) {
  const roomPaths = {
    "강의실": "./classroom.html",
    "장석주 교수님 연구실": "./jangprofessorMain.html",
    "정원치 교수님 연구실": "./jungprofessor.html",
    "휴게실": "./lounge.html",
    "서버실": "./server-room.html"
  };

  document.getElementById("map-panel").classList.remove("open");

  const t = document.getElementById("toast");
  const targetPath = roomPaths[roomName];

  if (!targetPath) {
    t.textContent = `❗ ${roomName} 페이지가 아직 없습니다.`;
    t.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(() => t.classList.remove("show"), 2300);
    return;
  }

  t.textContent = `📍 ${roomName} 으로 이동합니다…`;
  t.classList.add("show");

  clearTimeout(tt);
  tt = setTimeout(() => {
    t.classList.remove("show");
    location.href = targetPath;
  }, 800);
}

const snd = new Audio("../sound/footstep.mp3");
snd.volume = 0.8;
snd.play().catch(() => {});

function openEsc() {
  [0, 1, 2, 3].forEach((i) => {
    document.getElementById("p" + i).value = "";
  });
  document.getElementById("pw-msg").textContent = "";
  document.getElementById("popup-esc").classList.add("show");
  setTimeout(() => document.getElementById("p0").focus(), 60);
}

function closeEsc() {
  document.getElementById("popup-esc").classList.remove("show");
}

function pi(i) {
  if (document.getElementById("p" + i).value.length === 1 && i < 3) {
    document.getElementById("p" + (i + 1)).focus();
  }
}

function pk(e, i) {
  if (e.key === "Backspace" && !document.getElementById("p" + i).value && i > 0) {
    document.getElementById("p" + (i - 1)).focus();
  }
  if (e.key === "Enter") {
    tryEscape();
  }
}

function tryEscape() {
  const pw = [0, 1, 2, 3].map((i) => document.getElementById("p" + i).value).join("");

  if (pw.length < 4) {
    document.getElementById("pw-msg").textContent = "4자리를 모두 입력해주세요.";
    return;
  }

  if (pw === PW) {
    closeEsc();
    document.getElementById("popup-success").classList.add("show");
  } else {
    document.getElementById("pw-msg").textContent = "🔒 비밀번호가 틀린 것 같다…";
    [0, 1, 2, 3].forEach((i) => {
      document.getElementById("p" + i).value = "";
    });
    document.getElementById("p0").focus();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closePopup();
    closeEsc();
  }
});