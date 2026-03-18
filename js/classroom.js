const MONITOR_DATA = {

    wb3: { img: '../images/whatnum.png', title: '칠판', desc: '적혀있다.' },
    wb4: { img: '../images/birth.png', title: '앐수없는 종이', desc: '누군가의 생일이 적혀있다.' }
};

function openMonitor(id) {
    const data = MONITOR_DATA[id];
    if (!data) return;

    document.getElementById('monitorImg').src = data.img;
    document.getElementById('monitorImg').alt = data.title;
    document.getElementById('monitorTitle').textContent = data.title;
    document.getElementById('monitorDesc').textContent = data.desc;

    const screen = document.getElementById('monitorScreen');
    screen.style.display = 'flex';
    requestAnimationFrame(() => screen.classList.add('active'));
}

function monitor1() { location.href="prof_com.html"  }
function monitor2() { location.href="my_com.html" }
function monitor3() { openMonitor('wb3'); }
function monitor4() { openMonitor('wb4'); }

function closeMonitor() {
    const screen = document.getElementById('monitorScreen');
    screen.classList.remove('active');
    screen.addEventListener('transitionend', () => {
        screen.style.display = 'none';
    }, { once: true });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMonitor();
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('monitorScreen').addEventListener('click', (e) => {
    if (e.target === document.getElementById('monitorScreen')) closeMonitor();
    });
});

/* ── 인벤토리 슬롯 20개 생성 ── */
const grid = document.getElementById('inv-grid');
for(let i=0;i<20;i++){
  const d=document.createElement('div');
  d.className='inv-slot';
  d.id='s'+i;
  grid.appendChild(d);
}

/* ── 아이템 데이터 ── */
const ITEMS = {
  plant:{
    t:'e', icon:'🪨', inv:'🪨',
    name:'교수님의 애완돌',
    desc:'매끄럽고 동그란 돌멩이.\n교수님이 화분 옆에 소중히 올려두었다.\n뒷면에 작게 "행운을 빌어" 라고 새겨져 있다.'
  },
  keyboard:{
    t:'e', icon:'📝', inv:'📝',
    name:'숫자가 적힌 쪽지',
    desc:'키보드 키 사이에 끼워진 작은 메모지.\n\n「  0  」\n\n이 숫자가 비밀번호의 단서일까…'
  },
  necklace:{
    t:'i', icon:'images/pro2.jpg', inv:'images/pro2.jpg',
    name:'교수증',
    desc:'의자 등받이에 걸린 목걸이.\n안에 교수증이 들어있다.\n정원치 교수님의 얼굴과 이름이 적혀있다.'
  }
};

const PW='0162';
let cur=null, col=[];

/* ── 아이템 팝업 열기 ── */
function showPopup(id, viewOnly){
  const d=ITEMS[id];
  document.getElementById('p-icon').innerHTML = d.t==='i'?`<img src="${d.icon}" alt="${d.name}">`:d.icon;
  document.getElementById('p-title').textContent=d.name;
  document.getElementById('p-desc').textContent=d.desc;
  const popup=document.getElementById('popup');
  if(viewOnly){
    popup.classList.add('view-mode');
  } else {
    popup.classList.remove('view-mode');
    cur=id;
  }
  popup.classList.add('show');
}

function openItem(id){
  if(col.includes(id)){
    // 이미 획득 → 설명만 보기
    showPopup(id, true);
    return;
  }
  showPopup(id, false);
}

function closePopup(){
  document.getElementById('popup').classList.remove('show','view-mode');
  cur=null;
}

function takeItem(){
  if(!cur) return;
  const d=ITEMS[cur], idx=col.length;
  col.push(cur);
  document.querySelectorAll('.hotspot').forEach(el=>{
    if(el.getAttribute('onclick')?.includes(cur)) el.classList.add('taken');
  });
  const slotId=cur; // 슬롯에 id 저장용
  const s=document.getElementById('s'+idx);
  if(s){
    s.innerHTML=d.t==='i'?`<img src="${d.inv}" alt="${d.name}" title="${d.name}">`:d.inv;
    s.title=d.name;
    s.dataset.itemId=cur;
    s.classList.add('filled');
    s.onclick=()=>openItem(s.dataset.itemId); // 클릭 시 설명 재표시
  }
  closePopup();
}

/* ── MAP ── */
function toggleMap(){ document.getElementById('map-panel').classList.toggle('open'); }
document.addEventListener('click',e=>{
  if(!document.getElementById('hud-topright').contains(e.target))
    document.getElementById('map-panel').classList.remove('open');
});
let tt;
function goRoom(r){
  document.getElementById('map-panel').classList.remove('open');
  const t=document.getElementById('toast');
  t.textContent=`📍 ${r} 으로 이동합니다…`;
  t.classList.add('show');
  clearTimeout(tt);
  tt=setTimeout(()=>t.classList.remove('show'),2300);
}

/* ── 탈출 팝업 ── */
function openEsc(){
  [0,1,2,3].forEach(i=>document.getElementById('p'+i).value='');
  document.getElementById('pw-msg').textContent='';
  document.getElementById('popup-esc').classList.add('show');
  setTimeout(()=>document.getElementById('p0').focus(),60);
}
function closeEsc(){ document.getElementById('popup-esc').classList.remove('show'); }

function pi(i){
  if(document.getElementById('p'+i).value.length===1 && i<3)
    document.getElementById('p'+(i+1)).focus();
}
function pk(e,i){
  if(e.key==='Backspace' && !document.getElementById('p'+i).value && i>0)
    document.getElementById('p'+(i-1)).focus();
  if(e.key==='Enter') tryEscape();
}
function tryEscape(){
  const pw=[0,1,2,3].map(i=>document.getElementById('p'+i).value).join('');
  if(pw.length<4){ document.getElementById('pw-msg').textContent='4자리를 모두 입력해주세요.'; return; }
  if(pw===PW){
    closeEsc();
    document.getElementById('popup-success').classList.add('show');
  } else {
    document.getElementById('pw-msg').textContent='🔒 비밀번호가 틀린 것 같다…';
    [0,1,2,3].forEach(i=>document.getElementById('p'+i).value='');
    document.getElementById('p0').focus();
  }
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ closePopup(); closeEsc(); }
});


/* prof_com */
const PASSWORD = "1111";

function moveNext(index) {
    const current = document.getElementById("p" + index);
    if (current.value.length === 1 && index < 3) {
        document.getElementById("p" + (index + 1)).focus();
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
