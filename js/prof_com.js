const PASSWORD = "1111";

function moveNext(index) {
    const current = document.getElementById("p" + index);

    current.value = current.value.replace(/[^0-9]/g, "");

    if (current.value.length === 1 && index < 3) {
        document.getElementById("p" + (index + 1)).focus();
    }
}

function handleBackspace(event, index) {
    const current = document.getElementById("p" + index);

    if (event.key === "Backspace") {
        if (current.value === "" && index > 0) {
            const prev = document.getElementById("p" + (index - 1));
            prev.value = "";
            prev.focus();
            event.preventDefault();
        }
    }
}

function checkPassword() {
    const pw =
        document.getElementById("p0").value +
        document.getElementById("p1").value +
        document.getElementById("p2").value +
        document.getElementById("p3").value;

    const msg = document.getElementById("pw_msg");

    if (pw === PASSWORD) {
        msg.style.color = "#66ff99";
        msg.textContent = "비밀번호가 맞았습니다!";
    } else {
        msg.style.color = "#ff6666";
        msg.textContent = "비밀번호가 틀렸습니다.";

        document.getElementById("p0").value = "";
        document.getElementById("p1").value = "";
        document.getElementById("p2").value = "";
        document.getElementById("p3").value = "";
        document.getElementById("p0").focus();
    }
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        checkPassword();
    }
});
function goBack() {
    location.href = "classroom.html";
}