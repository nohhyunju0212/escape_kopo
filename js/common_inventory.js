const InventoryManager = (() => {
  const STORAGE_KEY = "global_escape_inventory";

  const ITEM_DATA = {
    sofaNote: {
  t: "e",
  icon: "📝",
  inv: "📝",
  name: "찢어진 메모",
  desc:
    "소파 밑에 끼어 있던 작은 메모.\n\n" +
    "「 ...110... 」\n\n" +
    "정체 모를 숫자가 적혀 있다.\n탈출 비밀번호와 관련이 있어 보인다."
},

serverNote: {
  t: "e",
  icon: "📝",
  inv: "📝",
  name: "메모 모음",
  desc:
    "서버실 벽에 붙어있는 메모.\n\n" +
    "「 ...... 」\n\n" +
    "~~~ 가 적혀 있다.\n탈출 비밀번호와 관련이 있어 보인다."
},

locker415: {
  t: "e",
  icon: "📚",
  inv: "📚",
  name: "쌓여있는 책",
  desc:
    "지저분한 사물함 속 쌓여있는 책.\n\n" +
    "「 ...110... 」\n\n" +
    "정체 모를 숫자가 적혀 있다.\n탈출 비밀번호와 관련이 있어 보인다."
},

locker417: {
  t: "e",
  icon: "🥢🥄",
  inv: "🥢🥄",
  name: "수저포크",
  desc:
    "수저와 포크...\n\n" +
    "학생들이 배달 음식을 많이 시켜먹은 듯하다.\n이건 필요없겠지?"
},

letter: {
  t: "e",
  icon: "✉️",
  inv: "✉️",
  name: "편지",
  desc:
    "이 편지는 영국에서 최초로 시작되어...\n\n" +
    "에이씨...\n7통을 보내야 한다고?"
},
    plant: {
      t: "e",
      icon: "🪨",
      inv: "🪨",
      name: "교수님의 애완돌",
      desc: '매끄럽고 동그란 돌멩이.\n교수님이 화분 옆에 소중히 올려두었다.\n뒷면에 작게 "행운을 빌어" 라고 새겨져 있다.'
    },
    note: {
      t: "e",
      icon: "📝",
      inv: "📝",
      name: "숫자가 적힌 쪽지",
      desc: '키보드 밑에 끼워진 작은 메모지.\n\n「  0  」\n\n이 숫자가 비밀번호의 단서일까…'
    },
    necklace: {
      t: "i",
      icon: "../images/pro2.jpg",
      inv: "../images/pro2.jpg",
      name: "교수증",
      desc: "파티션에 걸린 목걸이.\n안에 교수증이 들어있다.\n정원치 교수님의 얼굴과 이름이 적혀있다."
    },
    paper: {
      t: "i",
      icon: "../images/paper.png",
      inv: "../images/paper.png",
      name: "구겨진 종이",
      desc: "심하게 구겨진 종이다.\n펴보니 숫자와 메모가 희미하게 적혀 있다."
    },
    keyboard: {
      t: "e",
      icon: "📝",
      inv: "📝",
      name: "숫자가 적힌 쪽지",
      desc: "숫자가 적혀 있는 쪽지다."
    },
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

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function has(id) {
    return load().includes(id);
  }

  function add(id) {
    const items = load();
    if (!items.includes(id)) {
      items.push(id);
      save(items);
    }
  }

  function getItemData(id) {
    return ITEM_DATA[id] || null;
  }

  function ensureSlots(gridId = "inv-grid") {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    if (grid.children.length > 0) return;

    for (let i = 0; i < 20; i++) {
      const d = document.createElement("div");
      d.className = "inv-slot";
      d.id = `${gridId}-slot-${i}`;
      grid.appendChild(d);
    }
  }

  function showItemPopup(id) {
    const d = getItemData(id);
    if (!d) return;

    const popup = document.getElementById("popup");
    const icon = document.getElementById("p-icon");
    const title = document.getElementById("p-title");
    const desc = document.getElementById("p-desc");

    if (!popup || !icon || !title || !desc) return;

    icon.innerHTML = d.t === "i"
      ? `<img src="${d.icon}" alt="${d.name}">`
      : d.icon;

    title.textContent = d.name;
    desc.textContent = d.desc;

    popup.style.display = "flex";
    popup.classList.add("show");
  }

  function closeItemPopup() {
    const popup = document.getElementById("popup");
    if (!popup) return;
    popup.classList.remove("show");
    popup.style.display = "none";
  }

  function render(gridId = "inv-grid", clickable = true) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    ensureSlots(gridId);

    const items = load();

    for (let i = 0; i < 20; i++) {
      const slot = document.getElementById(`${gridId}-slot-${i}`);
      if (!slot) continue;
      slot.innerHTML = "";
      slot.classList.remove("filled");
      slot.title = "";
      slot.onclick = null;
      slot.dataset.itemId = "";
    }

    items.forEach((id, idx) => {
      const slot = document.getElementById(`${gridId}-slot-${idx}`);
      const data = ITEM_DATA[id];
      if (!slot || !data) return;

      slot.innerHTML =
        data.t === "i"
          ? `<img src="${data.inv}" alt="${data.name}" title="${data.name}">`
          : data.inv;

      slot.classList.add("filled");
      slot.title = data.name;
      slot.dataset.itemId = id;

      if (clickable) {
  slot.onclick = function () {
    if (typeof playClickSound === "function") {
      playClickSound();
    }
    showItemPopup(this.dataset.itemId);
  };
}
    });
  }

  return {
    load,
    save,
    has,
    add,
    getItemData,
    ensureSlots,
    render,
    showItemPopup,
    closeItemPopup
  };
})();