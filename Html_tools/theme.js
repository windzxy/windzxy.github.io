const root=document.documentElement;
const button=document.querySelector(".theme-toggle");
const saved=localStorage.getItem("windzxy-theme");
function paint(){if(button)button.textContent=root.dataset.theme==="dark"?"☀︎":"☾";}
if(saved)root.dataset.theme=saved;
paint();
button?.addEventListener("click",()=>{const next=root.dataset.theme==="dark"?"light":"dark";root.dataset.theme=next;localStorage.setItem("windzxy-theme",next);paint();});
