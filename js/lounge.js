const PW = "0126";

let cur = null;
let tt = null;

/* 라운지에서 쓰는 아이템 id 목록 */
const LOUNGE_ITEMS = ["sofaNote", "serverNote", "locker415", "locker417", "letter"];

/* 상세 페이지 이동 */
function goLocker() {
  window.location.href = "./locker.html";
}

function goSofa() {
  window.location.href = "./sofa.html";
}

function goBack() {
  location.href = "lounge.html";
}

/* 이미지 팝업 */
function openImagePopup(imagePath) {
  const popup = document.getElementById("image-popup");
  const popupImage = document.getElementById("popup-image");
  if (!popup || !popupImage) return;

  popupImage.src = imagePath;
  popup.classList.add("show");
}

function closeImagePopup(event) {
  if (event && event.target !== event.currentTarget) return;

  const popup = document.getElementById("image-popup");
  const popupImage = document.getElementById("popup-image");
  if (!popup || !popupImage) return;

  popup.classList.remove("show");
  popupImage.src = "";
}

/* 서버실 쿨러 */
let coolerOn = true;
let coolerTimer = null;
let fireTriggered = false;
const COOLER_LIMIT_MS = 5000;

function cool() {
  if (fireTriggered) return;

  const coolerHotspot = document.getElementById("cooler-hotspot");
  const guideMsg = document.getElementById("guide-msg");
  const toast = document.getElementById("toast");

  if (coolerOn) {
    coolerOn = false;

    if (coolerHotspot) coolerHotspot.classList.remove("cooler-on");
    if (guideMsg) {
      guideMsg.textContent = "⚠ 쿨러가 꺼졌습니다. 5초 안에 다시 켜지 않으면 화재가 발생합니다.";
    }
    if (toast) {
      toast.textContent = "⚠ 쿨러 OFF — 5초 안에 다시 켜야 합니다.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1800);
    }

    clearTimeout(coolerTimer);
    coolerTimer = setTimeout(() => {
      triggerFireEvent();
    }, COOLER_LIMIT_MS);

    return;
  }

  coolerOn = true;
  clearTimeout(coolerTimer);
  coolerTimer = null;

  if (coolerHotspot) coolerHotspot.classList.add("cooler-on");
  if (guideMsg) guideMsg.textContent = "✅ 쿨러가 다시 작동합니다. 서버실이 안정화되었습니다.";
  if (toast) {
    toast.textContent = "❄ 쿨러 ON — 정상 상태로 복구되었습니다.";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
  }
}

function triggerFireEvent() {
  fireTriggered = true;
  coolerOn = false;
  coolerTimer = null;

  const coolerHotspot = document.getElementById("cooler-hotspot");
  const popupFire = document.getElementById("popup-fire");
  const guideMsg = document.getElementById("guide-msg");

  if (coolerHotspot) {
    coolerHotspot.classList.remove("cooler-on");
    coolerHotspot.classList.add("taken");
  }
  if (guideMsg) guideMsg.textContent = "🔥 쿨러 정지로 인해 서버실에 화재가 발생했습니다.";
  if (popupFire) popupFire.classList.add("show");

  setTimeout(() => {
    window.location.href = "./mainscreen.html";
  }, 3000);
}

/* 아이템 팝업 */
function showPopup(id, viewOnly = false) {
  const data = InventoryManager.getItemData(id);
  if (!data) return;

  const popup = document.getElementById("popup");
  const icon = document.getElementById("p-icon");
  const title = document.getElementById("p-title");
  const desc = document.getElementById("p-desc");

  if (!popup || !icon || !title || !desc) return;

  icon.innerHTML =
    data.t === "i"
      ? `<img src="${data.icon}" alt="${data.name}">`
      : data.icon;

  title.textContent = data.name;
  desc.textContent = data.desc;

  if (viewOnly) {
    popup.classList.add("view-mode");
    cur = null;
  } else {
    popup.classList.remove("view-mode");
    cur = id;
  }

  popup.classList.add("show");
}

function openItem(id) {
  playClickSound();
  if (InventoryManager.has(id)) {
    showPopup(id, true);
    return;
  }
  showPopup(id, false);
}

function closePopup() {
  const popup = document.getElementById("popup");
  if (!popup) return;
  popup.classList.remove("show", "view-mode");
  cur = null;
}

function takeItem() {
  if (!cur) return;
  playClickSound();
  InventoryManager.add(cur);
  InventoryManager.render("inv-grid", true);
  syncTakenHotspots();

  closePopup();

  const toast = document.getElementById("toast");
  const data = InventoryManager.getItemData(cur);

  if (toast && data) {
    toast.textContent = `👜 ${data.name} 획득`;
    toast.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(() => toast.classList.remove("show"), 1500);
  }
}

/* 맵 */
function toggleMap() {
  const panel = document.getElementById("map-panel");
  if (panel) panel.classList.toggle("open");
}

function goRoom(roomName) {
  const roomPaths = {
    "강의실": "./classroom.html",
    "정원치 교수님 연구실": "./jungprofessor.html",
    "장석주 교수님 연구실": "./jangprofessorMain.html",
    "라운지": "./lounge.html",
    "서버실": "./server-room.html"
  };

  const panel = document.getElementById("map-panel");
  if (panel) panel.classList.remove("open");

  const t = document.getElementById("toast");
  const targetPath = roomPaths[roomName];

  if (!t) {
    if (targetPath) window.location.href = targetPath;
    return;
  }

  if (!targetPath) {
    t.textContent = `❗ ${roomName} 페이지가 아직 없습니다.`;
    t.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(() => t.classList.remove("show"), 2300);
    return;
  }

  t.textContent = `📍 ${roomName} 으로 이동합니다…`;
  t.classList.add("show");

  const snd = new Audio("sound/footstep.mp3");
  snd.volume = 0.8;
  snd.play().catch(() => {});

  clearTimeout(tt);
  tt = setTimeout(() => {
    t.classList.remove("show");
    window.location.href = targetPath;
  }, 800);
}

/* 탈출 */
function openEsc() {
  [0, 1, 2, 3].forEach((i) => {
    const el = document.getElementById("p" + i);
    if (el) el.value = "";
  });

  const msg = document.getElementById("pw-msg");
  if (msg) msg.textContent = "";

  const popup = document.getElementById("popup-esc");
  if (!popup) return;

  popup.classList.add("show");
  setTimeout(() => {
    const first = document.getElementById("p0");
    if (first) first.focus();
  }, 60);
}

function closeEsc() {
  const popup = document.getElementById("popup-esc");
  if (popup) popup.classList.remove("show");
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

  if (e.key === "Backspace" && !current.value && i > 0) {
    e.preventDefault();
    const prev = document.getElementById("p" + (i - 1));
    if (prev) {
      prev.value = "";
      prev.focus();
    }
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    tryEscape();
  }
}

function tryEscape() {
  const pw = [0, 1, 2, 3]
    .map((i) => document.getElementById("p" + i)?.value || "")
    .join("");

  const msg = document.getElementById("pw-msg");
  if (!msg) return;

  if (pw.length < 4) {
    msg.textContent = "4자리를 모두 입력해주세요.";
    return;
  }

  if (pw === PW) {
    closeEsc();
    const success = document.getElementById("popup-success");
    if (success) success.classList.add("show");
  } else {
    msg.textContent = "🔒 비밀번호가 틀린 것 같다…";
    [0, 1, 2, 3].forEach((i) => {
      const el = document.getElementById("p" + i);
      if (el) el.value = "";
    });
    const first = document.getElementById("p0");
    if (first) first.focus();
  }
}

/* 이미 획득한 아이템 핫스팟 비활성화 */
function syncTakenHotspots() {
  document.querySelectorAll(".hotspot").forEach((el) => {
    const clickText = el.getAttribute("onclick") || "";
    let matched = false;

    for (const id of LOUNGE_ITEMS) {
      if (
        (clickText.includes(`'${id}'`) || clickText.includes(`"${id}"`)) &&
        InventoryManager.has(id)
      ) {
        matched = true;
      }
    }

    if (matched) {
      el.classList.add("taken");
    } else {
      el.classList.remove("taken");
    }
  });
}

function closeSuccessOnEsc() {
  const success = document.getElementById("popup-success");
  if (success) success.classList.remove("show");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closePopup();
    closeEsc();
    closeImagePopup();
    closeSuccessOnEsc();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  InventoryManager.render("inv-grid", true);
  syncTakenHotspots();

  const hud = document.getElementById("hud-topright");
  const mapPanel = document.getElementById("map-panel");
  document.addEventListener("click", (e) => {
    if (hud && mapPanel && !hud.contains(e.target)) {
      mapPanel.classList.remove("open");
    }
  });

  const popup = document.getElementById("popup");
  if (popup) {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopup();
    });
  }

  const escPopup = document.getElementById("popup-esc");
  if (escPopup) {
    escPopup.addEventListener("click", (e) => {
      if (e.target === escPopup) closeEsc();
    });
  }
});

let audioCtx = null;
document.addEventListener("click", () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const snd = new Audio("sound/click.mp3");
  snd.volume = 0.5;
  snd.play().catch(() => {});
});