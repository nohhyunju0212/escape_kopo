

const PW = "0162";
let cur = null;

/* common_inventory에 장석주 교수실 아이템 주입 */
(function registerJangItems() {
  if (typeof InventoryManager === "undefined") return;
  const current = InventoryManager.load();

  // InventoryManager 내부 item data에 접근할 수 없으니
  // open/show/render용으로 현재 페이지에서 JANG_ITEMS도 같이 참조
})();

function getMergedItemData(id) {
  if (typeof InventoryManager !== "undefined") {
    const common = InventoryManager.getItemData(id);
    if (common) return common;
  }
  return JANG_ITEMS[id] || null;
}

function hasItem(id) {
  if (typeof InventoryManager === "undefined") return false;
  return InventoryManager.has(id);
}

function addItem(id) {
  if (typeof InventoryManager === "undefined") return;
  if (!InventoryManager.getItemData(id) && JANG_ITEMS[id]) {
    // common_inventory에 없는 장석주 교수실 전용 아이템은
    // localStorage 저장만 하고 현재 페이지에서는 별도 렌더링 처리
    const items = InventoryManager.load();
    if (!items.includes(id)) {
      items.push(id);
      InventoryManager.save(items);
    }
  } else {
    InventoryManager.add(id);
  }
}

function loadAllItems() {
  if (typeof InventoryManager === "undefined") return [];
  return InventoryManager.load();
}

function renderMergedInventory() {
  const grid = document.getElementById("inv-grid");
  if (!grid) return;

  if (grid.children.length === 0) {
    for (let i = 0; i < 20; i++) {
      const d = document.createElement("div");
      d.className = "inv-slot";
      d.id = "inv-slot-" + i;
      grid.appendChild(d);
    }
  }

  const items = loadAllItems();

  for (let i = 0; i < 20; i++) {
    const slot = document.getElementById("inv-slot-" + i);
    if (!slot) continue;
    slot.innerHTML = "";
    slot.classList.remove("filled");
    slot.title = "";
    slot.onclick = null;
  }

  items.forEach((id, idx) => {
    const slot = document.getElementById("inv-slot-" + idx);
    const data = getMergedItemData(id);
    if (!slot || !data) return;

    slot.innerHTML =
      data.t === "i"
        ? `<img src="${data.inv}" alt="${data.name}" title="${data.name}">`
        : data.inv;

    slot.title = data.name;
    slot.classList.add("filled");
    slot.onclick = () => showPopup(id, true);
  });
}

function syncTakenHotspots() {
  document.querySelectorAll(".hotspot").forEach((el) => {
    const onclickText = el.getAttribute("onclick") || "";

    const matched = loadAllItems().some((itemId) => {
      return (
        onclickText.includes(`'${itemId}'`) ||
        onclickText.includes(`"${itemId}"`)
      );
    });

    if (matched) {
      el.classList.add("taken");
    } else {
      el.classList.remove("taken");
    }
  });
}

function showPopup(id, viewOnly) {
  const d = getMergedItemData(id);
  if (!d) return;

  document.getElementById("p-icon").innerHTML =
    d.t === "i" ? `<img src="${d.icon}" alt="${d.name}">` : d.icon;
  document.getElementById("p-title").textContent = d.name;
  document.getElementById("p-desc").textContent = d.desc;

  const popup = document.getElementById("popup");

  if (viewOnly || hasItem(id)) {
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
  if (hasItem(id)) {
    showPopup(id, true);
    return;
  }
  showPopup(id, false);
}

function closePopup() {
  playClickSound();
  document.getElementById("popup").classList.remove("show", "view-mode");
  cur = null;
}

function takeItem() {
  if (!cur) return;
  playClickSound();
  addItem(cur);
  renderMergedInventory();
  syncTakenHotspots();
  closePopup();

  const t = document.getElementById("toast");
  if (t) {
    const d = getMergedItemData(cur);
    t.textContent = d ? `👜 ${d.name} 획득` : "👜 아이템 획득";
    t.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      t.classList.remove("show");
    }, 1500);
  }
}

function goDesk() {
  playClickSound();
  setTimeout(() => {
    location.href = "./jangprofessorDesk.html";
  }, 300);
  
}

function gobook() {
  playClickSound();
  setTimeout(() => {
    location.href = "./jangprofessorBookcase.html";
  }, 300);
 
}

function goMain() {
  playClickSound();
  setTimeout(() => {
    location.href = "./jangprofessorMain.html";
  }, 300);


}

function toggleMap() {
  playClickSound();
  const panel = document.getElementById("map-panel");
  if (panel) panel.classList.toggle("open");
}

document.addEventListener("click", (e) => {
  const hud = document.getElementById("hud-topright");
  const panel = document.getElementById("map-panel");

  if (hud && panel && !hud.contains(e.target)) {
    panel.classList.remove("open");
  }
});

let tt = null;

function goRoom(roomName) {
  const roomPaths = {
    "강의실": "./classroom.html",
    "장석주 교수님 연구실": "./jangprofessorMain.html",
    "정원치 교수님 연구실": "./jungprofessor.html",
    "라운지": "./lounge.html",
    "서버실": "./server.html"
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

function openEsc() {
  playClickSound();
  [0, 1, 2, 3].forEach((i) => {
    const el = document.getElementById("p" + i);
    if (el) el.value = "";
  });

  const msg = document.getElementById("pw-msg");
  if (msg) msg.textContent = "";

  const popupEsc = document.getElementById("popup-esc");
  if (popupEsc) popupEsc.classList.add("show");

  setTimeout(() => {
    const p0 = document.getElementById("p0");
    if (p0) p0.focus();
  }, 60);
}

function closeEsc() {
  playClickSound();
  const popupEsc = document.getElementById("popup-esc");
  if (popupEsc) popupEsc.classList.remove("show");
}

function pi(i) {
  const input = document.getElementById("p" + i);
  if (!input) return;

  input.value = input.value.replace(/[^0-9]/g, "").slice(0, 1);

  if (input.value.length === 1 && i < 3) {
    const next = document.getElementById("p" + (i + 1));
    if (next) next.focus();
  }
}

function pk(e, i) {
  const input = document.getElementById("p" + i);

  if (e.key === "Backspace" && input && !input.value && i > 0) {
    const prev = document.getElementById("p" + (i - 1));
    if (prev) prev.focus();
  }

  if (e.key === "Enter") {
    tryEscape();
  }
}

function tryEscape() {
  playClickSound();
  const pw = [0, 1, 2, 3]
    .map((i) => document.getElementById("p" + i)?.value || "")
    .join("");

  const msg = document.getElementById("pw-msg");

  if (pw.length < 4) {
    if (msg) msg.textContent = "4자리를 모두 입력해주세요.";
    return;
  }

  if (pw === PW) {
    closeEsc();
    const success = document.getElementById("popup-success");
    if (success) success.classList.add("show");
  } else {
    if (msg) msg.textContent = "🔒 비밀번호가 틀린 것 같다…";

    [0, 1, 2, 3].forEach((i) => {
      const el = document.getElementById("p" + i);
      if (el) el.value = "";
    });

    const p0 = document.getElementById("p0");
    if (p0) p0.focus();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closePopup();
    closeEsc();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderMergedInventory();
  syncTakenHotspots();
});

