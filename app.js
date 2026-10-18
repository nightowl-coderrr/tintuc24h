// Router (hash) + hiển thị: trang chủ/chuyên mục, chi tiết bài viết
Store.init(); renderLayout();
const view = document.getElementById('view');
const byDateDesc = (a, b) => (b.publishedAt||'').localeCompare(a.publishedAt||'');
const img = p => p.image || svgImg(p.id);

function findCat(id) {
  for (const m of Store.menu()) {
    if (m.id === id) return { node: m, titles: [m.title, ...(m.children || []).map(c => c.title)] };
    const c = (m.children || []).find(c => c.id === id);
    if (c) return { node: c, titles: [c.title], parent: m };
  }
}
function findCatByTitle(t) {
  return Store.menu().flatMap(m => [m, ...(m.children || [])]).find(x => x.title.toLowerCase() === t.toLowerCase());
}

function card(p, cls = '') {
  return `<a class="card ${cls}" href="#/p/${encodeURIComponent(p.id)}">
    <img src="${esc(img(p))}" alt="${esc(p.id)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=svgImg(this.alt||'x')">
    <div class="ct"><h3>${esc(p.title)}</h3>${cls === 'row' || cls === 'big' ? `<p>${esc(p.excerpt)}</p>` : ''}</div></a>`;
}

function renderCategory(id) {
  const cat = id === 'latest' ? { node: { title: 'Mới nhất' }, titles: null } : findCat(id);
  if (!cat) return (view.innerHTML = '<p class="empty">Không tìm thấy chuyên mục.</p>');
  let posts = Store.posts();
  if (cat.titles) posts = posts.filter(p => cat.titles.some(t => t.toLowerCase() === (p.category||'').toLowerCase()));
  posts.sort(byDateDesc); // mới -> cũ
  const subs = cat.node.children ? `<div class="subnav">${cat.node.children.map(c => `<a href="#/c/${c.id}">${esc(c.title)}</a>`).join('')}</div>` : '';
  const head = `<h1 class="cat-title">${esc(cat.node.title)}</h1>${subs}`;
  if (!posts.length) return (view.innerHTML = head + '<p class="empty">Chưa có bài viết. Hãy thu thập ở trang Crawler.</p>');
  const [f, ...rest] = posts, side = rest.slice(0, 2), list = rest.slice(2);
  view.innerHTML = head + `
    <section class="top">${card(f, 'big')}<div class="side">${side.map(p => card(p, 'small')).join('')}</div></section>
    <section class="list">${list.map(p => card(p, 'row')).join('')}</section>`;
}

function renderPost(id) {
  const p = Store.posts().find(x => x.id === id);
  if (!p) return (view.innerHTML = '<p class="empty">Không tìm thấy bài viết.</p>');
  const c = findCatByTitle(p.category);
  view.innerHTML = `<article class="post">
    <div class="crumb"><a href="#/">Trang chủ</a> › ${c ? `<a href="#/c/${c.id}">${esc(p.category)}</a>` : esc(p.category)}</div>
    <h1>${esc(p.title)}</h1>
    <div class="meta"><span>✍ ${esc(p.author)}</span><span>🕒 ${esc(p.publishedAt)}</span><span>📂 ${esc(p.category)}</span></div>
    <p class="sapo">${esc(p.excerpt)}</p>
    <img class="hero" src="${esc(img(p))}" alt="${esc(p.id)}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=svgImg(this.alt)">
    <div class="body">${p.content.split(/\n+/).map(t => `<p>${esc(t)}</p>`).join('')}</div>
    <p class="src">Nguồn: ${esc(p.source)} · <a href="${esc(p.url)}" target="_blank" rel="noopener">Bài gốc</a></p></article>`;
}

function route() {
  const [, kind, arg] = location.hash.split('/');
  window.scrollTo(0, 0);
  document.querySelector('.nav')?.classList.remove('open');
  if (kind === 'p') renderPost(decodeURIComponent(arg));
  else if (kind === 'c') renderCategory(arg);
  else renderCategory('latest'); // trang chủ = bài mới nhất
}
window.addEventListener('hashchange', route);
route();
