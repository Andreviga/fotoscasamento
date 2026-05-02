export default function ListaPresentesPage() {
  const css = `
:root{
  --bg:#f7f6f2;--card:#ffffff;--border:#e8e3d7;--text:#223;--muted:#6f8475;
  --green:#0f4f3d;--gold:#c9b37e;--beige:#e2d7c6;--shadow:0 6px 18px rgba(0,0,0,0.04);
}
*{box-sizing:border-box}
body{font-family:"Montserrat",system-ui,-apple-system,Segoe UI,Roboto,Arial;background:var(--bg);margin:0;color:var(--text);line-height:1.5}
.wrap{max-width:1100px;margin:0 auto;padding:28px}
h1,h2,h3{font-family:"Playfair Display","Cormorant Garamond",serif;margin:0 0 8px;font-weight:600}
h1{font-size:36px;text-align:center;letter-spacing:.3px}
h2{font-size:28px}h3{font-size:20px}p{margin:0 0 12px}
.muted{color:var(--muted)}.center{text-align:center}
.divider{height:1px;background:var(--gold);opacity:.6;margin:14px 0 18px}
.grid{display:grid;grid-template-columns:1.6fr .9fr;gap:20px}
@media(max-width:900px){.grid{grid-template-columns:1fr}}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow)}
.row{display:flex;gap:10px;align-items:center;justify-content:space-between}
button{border:0;border-radius:12px;padding:10px 14px;cursor:pointer;font-weight:600}
.btn{background:var(--green);color:#fff}.btn2{background:var(--gold);color:#1c1c1c}
.btn:disabled{opacity:.45;cursor:not-allowed}
.hr{height:1px;background:#eee;margin:12px 0}
input[type=number],input[type=text]{padding:10px;border-radius:10px;border:1px solid #d9d2c2;width:100%;background:#fff}
.small{font-size:13px}.cart{position:sticky;top:12px}
.line{display:flex;justify-content:space-between;gap:10px;margin:8px 0}
.hero{padding:8px 0 6px}.hero .date{font-size:14px;letter-spacing:.8px;text-transform:uppercase;color:var(--muted)}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center;padding:16px}
.modal .box{background:#fff;max-width:560px;width:100%;border-radius:16px;padding:18px;border:1px solid var(--border);box-shadow:var(--shadow)}
.qrwrap{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start}
.qr{background:#fff;padding:10px;border:1px solid #eee;border-radius:12px}
textarea{width:100%;min-height:92px;border-radius:12px;border:1px solid #ddd;padding:10px}
`;

  const js = `
let gifts=[];
const cart=new Map();
const fmt=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function calcTotal(){let t=0;for(const[id,qty]of cart.entries()){const g=gifts.find(x=>x.id===id);t+=Number(g.price)*qty;}return Number(t.toFixed(2));}
function renderList(){
  const el=document.getElementById("list");el.innerHTML="";
  gifts.forEach(g=>{
    const d=document.createElement("div");d.className="card";
    d.innerHTML=\`<div class="row"><div><b>\${g.title}</b><br/><span class="muted">\${fmt(Number(g.price))}</span></div></div>
    <div class="row" style="margin-top:10px"><input type="number" min="0" value="\${cart.get(g.id)||0}" data-id="\${g.id}"/><button class="btn" data-save="\${g.id}">Adicionar</button></div>\`;
    el.appendChild(d);
  });
  el.querySelectorAll("button[data-save]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const id=btn.getAttribute("data-save");
      const input=document.querySelector(\`input[data-id="\${id}"]\`);
      const qty=Math.max(0,parseInt(input.value||"0",10));
      if(qty>0)cart.set(id,qty);else cart.delete(id);
      renderCart();
    });
  });
}
function renderCart(){
  const lines=document.getElementById("cartLines");lines.innerHTML="";
  for(const[id,qty]of cart.entries()){
    const g=gifts.find(x=>x.id===id);
    const div=document.createElement("div");div.className="line";
    div.innerHTML=\`<span>\${qty}× \${g.title}</span><span>\${fmt(Number(g.price)*qty)}</span>\`;
    lines.appendChild(div);
  }
  const total=calcTotal();
  document.getElementById("total").innerHTML=\`<b>\${fmt(total)}</b>\`;
  document.getElementById("checkoutBtn").disabled=total<=0;
}
const modal=document.getElementById("modal");
document.getElementById("checkoutBtn").onclick=()=>{
  document.getElementById("total2").textContent=fmt(calcTotal());
  document.getElementById("pixArea").style.display="none";
  document.getElementById("cardArea").style.display="none";
  modal.style.display="flex";
};
document.getElementById("close").onclick=()=>modal.style.display="none";
document.getElementById("pixBtn").onclick=async()=>{
  document.getElementById("pixArea").style.display="block";
  document.getElementById("cardArea").style.display="none";
  const items=Array.from(cart.entries()).map(([id,quantity])=>({id,quantity}));
  const res=await fetch("/api/lista-presentes/create-pix",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items})});
  const data=await res.json();
  if(!data?.emv)return alert(data?.error||"Não foi possível gerar o Pix agora.");
  document.getElementById("pixCopy").value=data.emv;
  const qrel=document.getElementById("qrcode");qrel.innerHTML="";
  if(data.qrDataUrl){const img=document.createElement("img");img.src=data.qrDataUrl;img.width=210;img.height=210;qrel.appendChild(img);}
  else new QRCode(qrel,{text:data.emv,width:210,height:210});
};
document.getElementById("copyBtn").onclick=async()=>{
  await navigator.clipboard.writeText(document.getElementById("pixCopy").value);
  alert("Copiado!");
};
document.getElementById("cardBtn").onclick=()=>{
  document.getElementById("cardArea").style.display="block";
  document.getElementById("pixArea").style.display="none";
};
document.getElementById("goPay").onclick=async()=>{
  const items=Array.from(cart.entries()).map(([id,quantity])=>({id,quantity}));
  const res=await fetch("/api/lista-presentes/create-checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items})});
  const data=await res.json();
  if(!data?.url)return alert(data?.error||"Não foi possível gerar o link de pagamento.");
  window.open(data.url,"_blank");
};
(async function init(){
  gifts=await(await fetch("/api/lista-presentes/gifts")).json();
  renderList();renderCart();
})();
`;

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Presentes — André &amp; Nathália</title>
<style>${css}</style>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet"/>
</head>
<body>
<div class="wrap">
  <header class="hero">
    <h1>André &amp; Nathália</h1>
    <p class="center date">03 de maio de 2026</p>
    <div class="divider"></div>
  </header>
  <h2 class="center">Presentes</h2>
  <p class="muted center">Escolha um ou mais presentes. No final, pague via <b>Pix</b> (QR gerado na hora) ou <b>cartão</b> (link seguro).</p>
  <div class="grid">
    <div><div id="list" class="cards"></div></div>
    <div class="card cart">
      <h3>Seu carrinho</h3>
      <div id="cartLines" class="small muted"></div>
      <div class="hr"></div>
      <div class="row"><div><b>Total</b></div><div id="total"><b>R$ 0,00</b></div></div>
      <div class="hr"></div>
      <button class="btn" id="checkoutBtn" disabled style="width:100%">Finalizar</button>
      <p class="muted small" style="margin-top:10px">Pix cai direto. Cartão redireciona para pagamento seguro.</p>
    </div>
  </div>
</div>
<div class="modal" id="modal">
  <div class="box">
    <div class="row">
      <h3 style="margin:0">Finalizar pagamento</h3>
      <button id="close" style="background:#eee">Fechar</button>
    </div>
    <p class="muted">Total: <b id="total2"></b></p>
    <div class="row" style="gap:12px;flex-wrap:wrap">
      <button class="btn" id="pixBtn">Pagar no Pix</button>
      <button class="btn2" id="cardBtn">Pagar no Cartão</button>
    </div>
    <div id="pixArea" style="display:none;margin-top:14px">
      <div class="qrwrap">
        <div class="qr"><div id="qrcode"></div></div>
        <div style="flex:1;min-width:240px">
          <b>Copia e cola</b>
          <textarea id="pixCopy" readonly></textarea>
          <button class="btn" id="copyBtn" style="margin-top:8px">Copiar</button>
          <p class="muted small" style="margin-top:8px">Se desejar, envie o comprovante para confirmarmos o(s) presente(s).</p>
        </div>
      </div>
    </div>
    <div id="cardArea" style="display:none;margin-top:14px">
      <p class="muted">Você será redirecionado para um link seguro para pagar no cartão.</p>
      <button class="btn2" id="goPay">Gerar link e pagar</button>
    </div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
<script>${js}</script>
</body>
</html>`;

  return (
    <iframe
      srcDoc={html}
      style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
      title="Lista de Presentes"
    />
  );
}
