let gifts = [];
const cart = new Map();

const fmt = v => v.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });


function calcTotal(){
  let total = 0;
  for (const [id, qty] of cart.entries()){
    const g = gifts.find(x=>x.id===id);
    total += Number(g.price) * qty;
  }
  return Number(total.toFixed(2));
}

function renderList(){
  const el = document.getElementById("list");
  el.innerHTML = "";
  gifts.forEach(g=>{
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = `
      <div class="row">
        <div>
          <b>${g.title}</b><br/>
          <span class="muted">${fmt(Number(g.price))}</span>
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <input type="number" min="0" value="${cart.get(g.id)||0}" data-id="${g.id}" />
        <button class="btn" data-save="${g.id}">Adicionar</button>
      </div>
    `;
    el.appendChild(d);
  });

  el.querySelectorAll("button[data-save]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-save");
      const input = document.querySelector(`input[data-id="${id}"]`);
      const qty = Math.max(0, parseInt(input.value||"0", 10));
      if(qty>0) cart.set(id, qty); else cart.delete(id);
      renderCart();
    });
  });
}

function renderCart(){
  const lines = document.getElementById("cartLines");
  lines.innerHTML = "";
  for (const [id, qty] of cart.entries()){
    const g = gifts.find(x=>x.id===id);
    const div = document.createElement("div");
    div.className = "line";
    div.innerHTML = `<span>${qty}× ${g.title}</span><span>${fmt(Number(g.price)*qty)}</span>`;
    lines.appendChild(div);
  }
  const total = calcTotal();
  document.getElementById("total").innerHTML = `<b>${fmt(total)}</b>`;
  document.getElementById("checkoutBtn").disabled = total <= 0;
}

// Modal
const modal = document.getElementById("modal");
document.getElementById("checkoutBtn").onclick = ()=>{
  document.getElementById("total2").textContent = fmt(calcTotal());
  document.getElementById("pixArea").style.display = "none";
  document.getElementById("cardArea").style.display = "none";
  modal.style.display = "flex";
};
document.getElementById("close").onclick = ()=> modal.style.display = "none";

// Pix
document.getElementById("pixBtn").onclick = async ()=>{
  document.getElementById("pixArea").style.display = "block";
  document.getElementById("cardArea").style.display = "none";

  const items = Array.from(cart.entries()).map(([id, quantity])=>({ id, quantity }));
  const res = await fetch("/api/create-pix", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ items })
  });
  const data = await res.json();
  if(!data?.emv) return alert("Não foi possível gerar o Pix agora.");

  document.getElementById("pixCopy").value = data.emv;

  const qrel = document.getElementById("qrcode");
  qrel.innerHTML = "";
  // eslint-disable-next-line no-undef
  new QRCode(qrel, { text: data.emv, width: 210, height: 210 });
};

document.getElementById("copyBtn").onclick = async ()=>{
  await navigator.clipboard.writeText(document.getElementById("pixCopy").value);
  alert("Copiado!");
};

// Cartão (Asaas)
document.getElementById("cardBtn").onclick = ()=>{
  document.getElementById("cardArea").style.display = "block";
  document.getElementById("pixArea").style.display = "none";
};

document.getElementById("goPay").onclick = async ()=>{
  const items = Array.from(cart.entries()).map(([id, quantity])=>({ id, quantity }));
  const res = await fetch("/api/create-checkout", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ items })
  });
  const data = await res.json();
  if(!data?.url) return alert("Não foi possível gerar o link de pagamento.");
  window.location.href = data.url;
};

// Init
(async function init(){
  gifts = await (await fetch("/api/gifts")).json();
  renderList();
  renderCart();
})();
