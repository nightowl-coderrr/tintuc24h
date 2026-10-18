// ===== Hàm crawler: nhận URL bài viết -> trả về object JSON chuẩn hoá =====
// Trình duyệt bị chặn CORS nên thử lần lượt các proxy công khai.
const PROXIES = [
  u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  u => u
];

async function fetchHtml(url) {
  for (const p of PROXIES) {
    try {
      const r = await fetch(p(url));
      if (r.ok) { const t = await r.text(); if (t.length > 500) return t; }
    } catch (e) { /* thử proxy tiếp theo */ }
  }
  throw new Error('Không tải được trang (lỗi CORS/mạng). Hãy dùng ô "Dán mã HTML" bên dưới.');
}

function parseArticle(html, url) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const clean = s => (s || '').replace(/\s+/g, ' ').trim();
  const text = (sel, i = 0) => clean(doc.querySelectorAll(sel)[i]?.textContent);
  const meta = n => (doc.querySelector(`meta[property="${n}"],meta[name="${n}"]`)?.content || '').trim();
  const R = '#articleContent ';
  const u = new URL(url);
  const segs = u.pathname.split('/').filter(Boolean);
  const last = (segs.pop() || '').replace(/\.htm$/, ''); // segs còn lại = các thư mục
  const m = last.match(/^(.*?)-?(\d{10,})$/);
  const slug = m ? m[1] : last, code = m ? m[2] : String(Date.now());

  // title / sapo / content / author / time / category theo hướng dẫn của đề
  const title = text(R + '[data-slot="title"]') || text('h1') || meta('og:title');
  const excerpt = text(R + '[data-slot="sapo"]') || meta('og:description');
  const box = doc.querySelector(R + '[data-slot="content"]') || doc.querySelector('article');
  const paras = box ? [...box.querySelectorAll('p')].map(p => clean(p.textContent)).filter(Boolean) : [];
  const content = paras.join('\n\n') || clean(box?.textContent) || excerpt; // lưu dạng text thuần, an toàn khi hiển thị
  const authors = doc.querySelectorAll(R + '[rel="author"]');
  const author = clean((authors[1] || authors[0])?.textContent) || meta('author') || 'Dân trí';

  const menu = Store.menu();
  const node = menu.find(x => x.id === segs[0]) || menu.flatMap(x => x.children || []).find(x => x.id === segs[0]);
  const category = node ? node.title : meta('article:section') || segs[0] || 'Khác';

  let publishedAt = '';
  const tm = text('time').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\D+(\d{1,2}):(\d{2})/); // dd/mm/yyyy - hh:mm
  const iso = doc.querySelector('time[datetime]')?.getAttribute('datetime') || meta('article:published_time');
  if (tm) publishedAt = `${tm[3]}-${pad(tm[2])}-${pad(tm[1])} ${pad(tm[4])}:${tm[5]}`;
  else if (iso && !isNaN(new Date(iso))) publishedAt = fmtDate(new Date(iso));
  else if (/^\d{12}/.test(code)) publishedAt = `${code.slice(0, 4)}-${code.slice(4, 6)}-${code.slice(6, 8)} ${code.slice(8, 10)}:${code.slice(10, 12)}`;

  const image = meta('og:image') || box?.querySelector('img')?.getAttribute('src') || '';
  return { id: 'dtri-' + code, title, slug, excerpt, content, author, category, publishedAt,
    source: u.hostname.replace(/^www\./, ''), url, image };
}

async function crawlArticle(url) {
  new URL(url); // ném lỗi nếu URL sai
  return parseArticle(await fetchHtml(url), url);
}
