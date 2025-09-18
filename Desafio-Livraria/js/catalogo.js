
const catalogo = document.getElementById('catalogo');
const busca = document.getElementById('busca');
const ordenar = document.getElementById('ordenar');
const limparBtn = document.getElementById('limpar');

let livros = JSON.parse(localStorage.getItem('livros')) || [];

function createCard(l) {
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
      </div>
    </div>
  `;
  return card;
}

function renderCatalogo(list = livros) {
  catalogo.innerHTML = '';
  if (!list || list.length === 0) {
    catalogo.innerHTML = '<p class="empty">Nenhum livro cadastrado. Acesse a área administrativa para adicionar livros.</p>';
    return;
  }
  list.forEach(l => catalogo.appendChild(createCard(l)));
}

function filtrar() {
  const termo = (busca?.value || '').toLowerCase();
  let result = livros.filter(l => l.titulo.toLowerCase().includes(termo) || l.autor.toLowerCase().includes(termo));
  if (ordenar?.value === 'precoCrescente') result.sort((a,b)=>a.preco-b.preco);
  if (ordenar?.value === 'precoDecrescente') result.sort((a,b)=>b.preco-a.preco);
  renderCatalogo(result);
}

busca?.addEventListener('input', filtrar);
ordenar?.addEventListener('change', filtrar);
limparBtn?.addEventListener('click', ()=>{ if (busca) busca.value=''; if (ordenar) ordenar.value=''; renderCatalogo(); });

window.addEventListener('storage', ()=>{ livros = JSON.parse(localStorage.getItem('livros')) || []; renderCatalogo(); });

renderCatalogo();
