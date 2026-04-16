let gifts = [];

function rowTemplate(g){
  return `
    <div class="card" style="margin:10px 0">
      <div class="row">
        <div style="flex:1">
          <label class="small muted">ID</label>
          <input type="text" data-k="id" value="${g.id || ""}" placeholder="ex: g10" />
        </div>
        <div style="flex:2">
          <label class="small muted">Título</label>
          <input type="text" data-k="title" value="${g.title || ""}" placeholder="Nome do presente" />
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <div style="flex:1">
          <label class="small muted">Preço (R$)</label>
          <input type="text" data-k="price" value="${g.price ?? 0}" placeholder="ex: 150" />
        </div>
        <div style="flex:1">
          <label class="small muted">Ativo</label>
          <input type="text" data-k="active" value="${g.active ? "true" : "false"}" />
          <div class="small muted">Use "true" ou "false".</div>
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button style="background:#eee" data-del>Remover</button>
      </div>
    </div>
  `;
}

function render(){
  const table = document.getElementById("table");
  table.innerHTML = gifts.map(rowTemplate).join("");

  table.querySelectorAll("[data-del]").forEach((btn, idx)=>{
    btn.onclick = ()=>{
      gifts.splice(idx, 1);
      render();
    };
  });
}

async function api(path, method, body){
  const pass = document.getElementById("pass").value;
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type":"application/json",
      "x-admin-pass": pass
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return await res.json();
}

document.getElementById("load").onclick = async ()=>{
  const data = await api("/api/admin/gifts", "GET");
  if(data?.error) return alert(data.error);
  gifts = data;
  render();
};

document.getElementById("add").onclick = ()=>{
  gifts.push({ id:"", title:"", price:0, active:true });
  render();
};

document.getElementById("save").onclick = async ()=>{
  // coletar valores da tela
  const cards = document.querySelectorAll("#table .card");
  const updated = [];
  cards.forEach(card=>{
    const inputs = card.querySelectorAll("input[data-k]");
    const obj = {};
    inputs.forEach(i=>{
      obj[i.getAttribute("data-k")] = i.value;
    });
    obj.price = Number(String(obj.price).replace(",", "."));
    obj.active = String(obj.active).toLowerCase() === "true";
    updated.push(obj);
  });

  const out = await api("/api/admin/gifts", "POST", updated);
  if(out?.error) return alert(out.error);
  alert("Salvo!");
};
