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
    const data = DESK_DATA[id];
    if (!data) return;

    document.getElementById("monitorImg").src = data.img;
    document.getElementById("monitorImg").alt = data.title;
    document.getElementById("monitorTitle").textContent = data.title;
    document.getElementById("monitorDesc").textContent = data.desc;

    const screen = document.getElementById("monitorScreen");
    screen.style.display = "flex";
    requestAnimationFrame(() => screen.classList.add("active"));
}

function closeMonitor() {
    const screen = document.getElementById("monitorScreen");
    screen.classList.remove("active");
    screen.addEventListener("transitionend", () => {
        screen.style.display = "none";
    }, { once: true });
}

function goBack() {
    location.href = "classroom.html";
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