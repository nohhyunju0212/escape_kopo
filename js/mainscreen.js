/* ── 씬 리사이즈 ── */
const scene = document.getElementById('scene');
const DW=1920, DH=1080;
function resize(){
  const s=Math.min(innerWidth/DW,innerHeight/DH);
  const ox=(innerWidth-DW*s)/2, oy=(innerHeight-DH*s)/2;
  scene.style.transform=`translate(${ox}px,${oy}px) scale(${s})`;
}
resize(); addEventListener('resize',resize);

/* ── 파티클 ── */
const pCon = document.getElementById('particles');
for(let i=0;i<22;i++){
  const p=document.createElement('div');
  p.className='particle';
  const x=920+Math.random()*960, y=200+Math.random()*700;
  const dur=6+Math.random()*10, delay=Math.random()*8;
  const dx=(Math.random()-.5)*100, size=1+Math.random()*2;
  p.style.cssText=`left:${x}px;top:${y}px;width:${size}px;height:${size}px;--dx:${dx}px;animation-duration:${dur}s;animation-delay:-${delay}s;`;
  pCon.appendChild(p);
}

/* ── 배경음악 ── */
const bgm=document.getElementById('bgm');
let muted=false;
addEventListener('click',()=>{
  if(bgm.paused&&!muted){ bgm.volume=0.35; bgm.play().catch(()=>{}); }
},{once:true});

function toggleMusic(){
  muted=!muted;
  const icon=document.getElementById('music-icon');
  const label=document.getElementById('music-label');
  const btn=document.getElementById('btn-music');
  if(muted){
    bgm.pause();
    icon.textContent='🔇'; label.textContent='음소거';
    btn.style.borderColor='rgba(255,255,255,0.2)';
    btn.style.color='rgba(255,255,255,0.3)';
  } else {
    bgm.volume=0.35; bgm.play().catch(()=>{});
    icon.textContent='🔊'; label.textContent='배경음악';
    btn.style.borderColor=''; btn.style.color='';
  }
}

/* ── 게임 시작 ── */
function startGame(){
  scene.style.transition='opacity 0.6s ease';
  scene.style.opacity='0';
  setTimeout(()=>{ window.location.href='classroom.html'; },600);
}