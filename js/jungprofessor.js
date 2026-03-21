const PW = "0162";
let cur = null;

/* 정원치 교수실에서 획득 가능한 아이템 */
const ROOM_ITEM_IDS = ["plant", "note", "necklace"];

/* ===============================
   핫스팟 상태 동기화
================================ */
function syncTakenHotspots() {
  document.querySelectorAll(".hotspot").forEach((el) => {
    const onclickText = el.getAttribute("onclick") || "";

    const matched = ROOM_ITEM_IDS.some((id) => {
      return InventoryManager.has(id) &&
        (onclickText.includes(`'${id}'`) || onclickText.includes(`"${id}"`));
    });

    if (matched) {
      el.classList.add("taken");
    } else {
      el.classList.remove("taken");
    }
  });
}

/* ===============================
   아이템 관련
================================ */
function hasItem(id) {
  return InventoryManager.has(id);
}

function addItem(id) {
  InventoryManager.add(id);
}

function showPopup(id, viewOnly) {
  const d = InventoryManager.getItemData(id);
  if (!d) return;

  const popup = document.getElementById("popup");
  if (!popup) return;

  document.getElementById("p-icon").innerHTML =
    d.t === "i" ? `<img src="${d.icon}" alt="${d.name}">` : d.icon;

  document.getElementById("p-title").textContent = d.name;
  document.getElementById("p-desc").textContent = d.desc;

  /* 핵심: 상태 완전 초기화 */
  popup.classList.remove("show", "view-mode");

  if (viewOnly || hasItem(id)) {
    popup.classList.add("view-mode");   // ← 획득 버튼 숨김
    cur = null;
  } else {
    cur = id;
  }

  popup.style.display = "flex";
  popup.classList.add("show");
}

function openItem(id) {
  playClickSound();
  if (hasItem(id)) {
    showPopup(id, true);
  } else {
    showPopup(id, false);
  }
}

function closePopup() {
  const popup = document.getElementById("popup");
  if (!popup) return;

  popup.classList.remove("show", "view-mode");
  popup.style.display = "none";
  cur = null;
}

function takeItem() {
  if (!cur) return;
  playClickSound();
  const takenId = cur;
  addItem(takenId);

  InventoryManager.render("inv-grid", true);
  syncTakenHotspots();

  closePopup();

  const t = document.getElementById("toast");
  if (t) {
    const d = InventoryManager.getItemData(takenId);
    t.textContent = `👜 ${d.name} 획득`;
    t.classList.add("show");

    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      t.classList.remove("show");
    }, 1500);
  }
}

/* ===============================
   MAP
================================ */
function toggleMap(e) {
  if (e) e.stopPropagation();
  playClickSound();

  const panel = document.getElementById("map-panel");
  if (panel) panel.classList.toggle("open");
}

let tt;

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

  const snd = new Audio("../sound/footstep.wav");
  snd.volume = 0.9;
  snd.currentTime = 0.05;
  snd.play().catch(() => {});

  if (t) {
    t.textContent = `📍 ${roomName} 으로 이동합니다…`;
    t.classList.add("show");
  }

  clearTimeout(tt);
  tt = setTimeout(() => {
    if (t) t.classList.remove("show");
    location.href = targetPath;
  }, 1600);
}

/* ===============================
   탈출
================================ */
function openEsc() {
  playClickSound();
  [0,1,2,3].forEach(i => {
    const el = document.getElementById("p" + i);
    if (el) el.value = "";
  });

  document.getElementById("pw-msg").textContent = "";

  const esc = document.getElementById("popup-esc");
  esc.style.display = "flex";
  esc.classList.add("show");

  setTimeout(() => document.getElementById("p0")?.focus(), 60);
}

function closeEsc() {
  playClickSound();
  const esc = document.getElementById("popup-esc");
  esc.classList.remove("show");
  esc.style.display = "none";
}

function pi(i) {
  const el = document.getElementById("p" + i);
  if (!el) return;

  el.value = el.value.replace(/[^0-9]/g, "").slice(0, 1);

  if (el.value && i < 3) {
    document.getElementById("p" + (i + 1))?.focus();
  }
}

function pk(e, i) {
  if (e.key === "Backspace" && !document.getElementById("p" + i).value && i > 0) {
    document.getElementById("p" + (i - 1))?.focus();
  }
  if (e.key === "Enter") tryEscape();
}

function tryEscape() {
  playClickSound();
  const pw = [0,1,2,3].map(i => document.getElementById("p" + i)?.value || "").join("");

  const msg = document.getElementById("pw-msg");

  if (pw.length < 4) {
    msg.textContent = "4자리 입력 필요";
    return;
  }

  if (pw === PW) {
    closeEsc();
    const suc = document.getElementById("popup-success");
    suc.style.display = "flex";
    suc.classList.add("show");
  } else {
    msg.textContent = "🔒 틀림";

    [0,1,2,3].forEach(i => {
      document.getElementById("p" + i).value = "";
    });

    document.getElementById("p0")?.focus();
  }
}

/* ===============================
   공통 이벤트
================================ */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closePopup();
    closeEsc();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  InventoryManager.render("inv-grid", true);
  syncTakenHotspots();

  /* 팝업 바깥 클릭 닫기 */
  const popup = document.getElementById("popup");
  if (popup) {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopup();
    });
  }

  /* 맵 외부 클릭 닫기 */
  document.addEventListener("click", (e) => {
    const hud = document.getElementById("hud-topright");
    const panel = document.getElementById("map-panel");
    if (hud && panel && !hud.contains(e.target)) {
      panel.classList.remove("open");
    }
  });
});