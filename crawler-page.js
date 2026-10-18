Store.init(); renderLayout();
const $ = id => document.getElementById(id);

function show(post) {
  $('result').textContent = JSON.stringify(post, null, 2);
  Store.addPost(post); // lưu vào LocalStorage
  $('status').className = 'ok';
  $('status').innerHTML = `Đã lưu vào LocalStorage. <a href="index.html#/p/${encodeURIComponent(post.id)}">Xem bài viết</a>`;
  renderSaved();
}
function renderSaved() {
  const list = Store.posts().filter(p => p.id.startsWith('dtri-')).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  $('saved').innerHTML = list.length ? list.map(p => `<li><a href="index.html#/p/${encodeURIComponent(p.id)}">${esc(p.title)}</a> <small>(${esc(p.category)} · ${esc(p.publishedAt)})</small></li>`).join('') : '<li>Chưa có bài nào được crawl.</li>';
}
$('go').onclick = async () => {
  const url = $('url').value.trim();
  $('status').className = ''; $('status').textContent = 'Đang tải…';
  try { show(await crawlArticle(url)); }
  catch (e) { $('status').className = 'err'; $('status').textContent = e.message; }
};
$('parse').onclick = () => {
  try { show(parseArticle($('html').value, $('url').value.trim() || 'https://dantri.com.vn/')); }
  catch (e) { $('status').className = 'err'; $('status').textContent = 'Lỗi phân tích: ' + e.message; }
};
$('reset').onclick = () => { if (confirm('Xoá toàn bộ dữ liệu và nạp lại dữ liệu mẫu?')) { Store.reset(); renderSaved(); $('result').textContent = ''; } };
renderSaved();
