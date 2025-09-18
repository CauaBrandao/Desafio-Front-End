
const PASSWORD = 'livraria123'; // altere se quiser no arquivo (simples proteção no front-end)

function requirePassword() {
  const ok = sessionStorage.getItem('admin_ok');
  if (ok === '1') return true;
  const pass = prompt('Senha administrativa:');
  if (pass === PASSWORD) { sessionStorage.setItem('admin_ok','1'); return true; }
  alert('Senha incorreta. Você será redirecionado.');
  window.location.href = 'index.html';
  return false;
}

if (!requirePassword()) throw new Error('Acesso negado');

const form = document.getElementById('formLivro');
const lista = document.getElementById('listaLivros');
const limparFormBtn = document.getElementById('limpar-form');

let livros = JSON.parse(localStorage.getItem('livros')) || [];

function saveLocal(){ localStorage.setItem('livros', JSON.stringify(livros)); window.dispatchEvent(new Event('storage')); }

function createCard(l, idx){
  const card = document.createElement('article');
  card.className = 'book-card' + (l.promocao ? ' promo' : '');
  card.innerHTML = `
    <img src="${l.imagem}" alt="${l.titulo}">
    <div class="card-body">
      <div>
        <h3 class="book-title">${l.titulo}</h3>
        <p class="book-meta">Autor: ${l.autor}</p>
      </div>
      <div>
        <div class="book-price">R$ ${Number(l.preco).toFixed(2)}</div>
        <div style="margin-top:8px">
          <button class="btn editar" data-idx="${idx}">Editar</button>
          <button class="btn secondary remover" data-idx="${idx}">Remover</button>
        </div>
      </div>
    </div>
  `;
  return card;
}

function renderLista(){
  lista.innerHTML='';
  if (!livros.length) { lista.innerHTML = '<p class="empty">Nenhum livro cadastrado.</p>'; return; }
  livros.forEach((l, i)=> lista.appendChild(createCard(l,i)) );
}

form.addEventListener('submit', e=>{
  e.preventDefault();
  const idVal = document.getElementById('idLivro').value;
  const titulo = document.getElementById('titulo').value.trim();
  const autor = document.getElementById('autor').value.trim();
  const preco = parseFloat(document.getElementById('preco').value);
  const imagem = document.getElementById('imagem').value.trim();
  const promocao = document.getElementById('promocao').checked;

  if (!titulo || !autor || !imagem || Number.isNaN(preco)) { alert('Preencha todos os campos corretamente.'); return; }

  const obj = { titulo, autor, preco, imagem, promocao };

  if (idVal) {
    const idx = parseInt(idVal,10);
    livros[idx] = obj;
  } else {
    livros.push(obj);
  }
  saveLocal();
  form.reset();
  document.getElementById('idLivro').value='';
  renderLista();
});

lista.addEventListener('click', e=>{
  const idx = e.target.getAttribute('data-idx');
  if (!idx) return;
  if (e.target.classList.contains('remover')){
    if (!confirm('Remover este livro?')) return;
    livros.splice(parseInt(idx,10),1);
    saveLocal();
    renderLista();
    return;
  }
  if (e.target.classList.contains('editar')){
    const l = livros[parseInt(idx,10)];
    document.getElementById('idLivro').value = idx;
    document.getElementById('titulo').value = l.titulo;
    document.getElementById('autor').value = l.autor;
    document.getElementById('preco').value = l.preco;
    document.getElementById('imagem').value = l.imagem;
    document.getElementById('promocao').checked = !!l.promocao;
  }
});

limparFormBtn.addEventListener('click', ()=>{ form.reset(); document.getElementById('idLivro').value=''; });

renderLista();
