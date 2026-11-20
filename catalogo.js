const sections = [
  ['Lindos e Básicos', 7, 12.90],
  ['Para o dia a dia', 10, 14.90],
  ['Os queridinhos', 8, 15.90],
  ['Para o final de semana', 6, 16.90],
];
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const $ = id => document.getElementById(id);
const groups = $('groups');
const detail = $('detail');
const items = new Map();
const categories = $('categories');
categories.innerHTML = ['Todas', ...sections.map(([title]) => title)].map((title, index) =>
  `<button type="button" data-filter="${index - 1}" aria-pressed="${index === 1}" aria-controls="groups">${title}</button>`
).join('');
groups.innerHTML = sections.map(([title, count, price], group) => {
  const cards = Array.from({length: count}, (_, index) => {
    const id = `${group + 1}-${index + 1}`;
    const code = `PC-${group + 1}${String(index + 1).padStart(2, '0')}`;
    const src = `assets/peca-${id}.webp`;
    items.set(id, {title, code, src, price});
    return `<button class="card" type="button" data-id="${id}" aria-label="Ver brinco ${code}, ${currency.format(price)}"><img src="${src}" alt="Brinco ${code}" width="396" height="444" loading="lazy"><span class="card-meta"><span class="product-name">Brinco <small>${code}</small></span><span class="tag">${currency.format(price)}</span></span></button>`;
  }).join('');
  return `<section class="group" data-group="${group}"><h3>${title}</h3><div class="grid">${cards}</div></section>`;
}).join('');
function filterCategory(active) {
  for (const button of categories.children) {
    button.setAttribute('aria-pressed', Number(button.dataset.filter) === active);
  }
  for (const section of groups.children) {
    section.hidden = active !== -1 && Number(section.dataset.group) !== active;
  }
  const count = active === -1 ? items.size : sections[active][1];
  $('results').textContent = `${count} produtos`;
}
categories.addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (button) filterCategory(Number(button.dataset.filter));
});
filterCategory(0);
groups.addEventListener('click', event => {
  const item = items.get(event.target.closest('[data-id]')?.dataset.id);
  if (!item) return;
  $('photo').src = item.src;
  $('photo').alt = `Brinco ${item.code}`;
  $('name').textContent = `Brinco ${item.code}`;
  $('price').textContent = currency.format(item.price);
  $('code').textContent = `Código no catálogo: ${item.code}`;
  detail.showModal();
});

detail.querySelector('.close').addEventListener('click', () => detail.close());
const menu = $('menu');
const toggle = document.querySelector('.menu-toggle');
function setMenu(open) {
  menu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
toggle.addEventListener('click', () => {
  const open = !menu.classList.contains('open');
  setMenu(open);
  if (open) menu.querySelector('a').focus();
});
menu.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link || !menu.classList.contains('open')) return;
  setMenu(false);
  const section = document.querySelector(link.hash);
  section.setAttribute('tabindex', '-1');
  section.focus({preventScroll: true});
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('open')) {
    setMenu(false);
    toggle.focus();
  }
});
matchMedia('(max-width: 850px)').addEventListener('change', () => setMenu(false));
