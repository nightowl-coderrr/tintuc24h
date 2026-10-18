// Header (navbar) + Footer dùng chung cho mọi trang
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderLayout() {
  const menu = Store.menu();
  const links = menu.filter(m => m.type !== 'home').map(m => {
    if (m.type === 'external') return `<li><a href="${esc(m.url)}" target="_blank" rel="noopener">${esc(m.title)}</a></li>`;
    const sub = m.children ? `<ul class="sub">${m.children.map(c => `<li><a href="index.html#/c/${c.id}">${esc(c.title)}</a></li>`).join('')}</ul>` : '';
    return `<li class="${m.children ? 'has-sub' : ''}"><a href="index.html#/c/${m.id}">${esc(m.title)}</a>${sub}</li>`;
  }).join('');
  document.getElementById('header').innerHTML = `
    <div class="container bar">
      <a class="logo" href="index.html#/">Tin Tức<span>24h</span></a>
      <button class="burger" aria-label="Menu" onclick="document.querySelector('.nav').classList.toggle('open')">☰</button>
      <ul class="nav">${links}<li><a href="crawler.html" class="crawl-link">Crawler</a></li></ul>
    </div>`;
  const cats = menu.filter(m => m.type === 'category' && m.id !== 'latest');
  document.getElementById('footer').innerHTML = `
    <div class="container fgrid">
      <div><h4>Tin Tức 24h</h4><p>Website tin tức đơn giản xây dựng bằng HTML, CSS, JavaScript thuần; dữ liệu lưu trong LocalStorage.</p></div>
      <div><h4>Liên kết nhanh</h4><ul><li><a href="index.html#/">Trang chủ</a></li><li><a href="index.html#/c/latest">Tin mới</a></li><li><a href="mailto:contact@tintuc24h.vn">Liên hệ</a></li><li><a href="crawler.html">Crawler</a></li></ul></div>
      <div><h4>Chuyên mục</h4><ul>${cats.map(c => `<li><a href="index.html#/c/${c.id}">${esc(c.title)}</a></li>`).join('')}</ul></div>
      <div><h4>Liên hệ</h4><p>Email: contact@tintuc24h.vn<br>Địa chỉ: 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</p>
        <div class="social"><a href="https://facebook.com" target="_blank" rel="noopener" title="Facebook">f</a><a href="https://youtube.com" target="_blank" rel="noopener" title="YouTube">▶</a><a href="https://tiktok.com" target="_blank" rel="noopener" title="TikTok">♪</a></div></div>
    </div>
    <div class="copy">© ${new Date().getFullYear()} Tin Tức 24h. Bài tập lớn cuối khóa – dữ liệu thu thập từ dantri.com.vn phục vụ học tập.</div>`;
}
