// Lớp lưu trữ dữ liệu bằng LocalStorage (tự chuyển sang bộ nhớ tạm nếu trình duyệt chặn LocalStorage)
const LS = (() => {
  try { localStorage.setItem('_t', '1'); localStorage.removeItem('_t'); return localStorage; }
  catch (e) { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; }
})();
const Store = {
  K_MENU: 'news_menu', K_POSTS: 'news_posts',
  init() {
    if (!LS.getItem(this.K_MENU)) LS.setItem(this.K_MENU, JSON.stringify(MENU_DATA));
    if (!LS.getItem(this.K_POSTS)) LS.setItem(this.K_POSTS, JSON.stringify(seedPosts()));
  },
  menu() { return JSON.parse(LS.getItem(this.K_MENU)).menu; },
  posts() { return JSON.parse(LS.getItem(this.K_POSTS)); },
  addPost(p) {
    const list = this.posts().filter(x => x.id !== p.id);
    list.push(p);
    LS.setItem(this.K_POSTS, JSON.stringify(list));
  },
  reset() { LS.removeItem(this.K_MENU); LS.removeItem(this.K_POSTS); this.init(); }
};

const pad = n => String(n).padStart(2, '0');
const fmtDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

function svgImg(seed) {
  const h = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h},60%,45%)'/><stop offset='1' stop-color='hsl(${(h + 60) % 360},60%,65%)'/></linearGradient></defs><rect width='800' height='500' fill='url(#g)'/></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Dữ liệu mẫu ban đầu: 10 bài / chuyên mục (nội dung giữ chỗ). Dùng trang Crawler để thêm bài thật.
function seedPosts() {
  const patterns = [
    'Điểm tin {c} nổi bật trong ngày', 'Chuyên gia nhận định xu hướng mới của lĩnh vực {c}',
    'Những con số đáng chú ý trong tuần ở mảng {c}', 'Câu chuyện đằng sau sự kiện {c} gây chú ý',
    'Phóng sự: Một ngày với những người làm {c}', 'Điều gì đang thay đổi ở {c} năm nay?',
    'Góc nhìn khác về vấn đề {c} được quan tâm', 'Tổng hợp thông tin {c} cần biết hôm nay',
    'Cập nhật mới nhất về chủ đề {c}', 'Hỏi - đáp nhanh quanh chuyện {c}'
  ];
  const leaves = [];
  MENU_DATA.menu.forEach(m => {
    if (m.type !== 'category' || m.id === 'latest') return;
    if (m.children) m.children.forEach(c => leaves.push(c)); else leaves.push(m);
  });
  const now = Date.now(), out = [];
  leaves.forEach((c, ci) => {
    patterns.forEach((p, i) => {
      const id = `sample-${c.id}-${i + 1}`;
      const title = p.replace('{c}', c.title.toLowerCase());
      const excerpt = `Tóm tắt ngắn cho bài viết mẫu thứ ${i + 1} thuộc chuyên mục ${c.title}.`;
      out.push({
        id, title, slug: id, excerpt,
        content: `${excerpt}\n\nĐây là nội dung mẫu để minh hoạ giao diện trang chi tiết. Hãy dùng trang Crawler để thu thập bài viết thật từ dantri.com.vn.\n\nĐoạn thứ ba của nội dung mẫu, giúp kiểm tra việc xuống dòng và bố cục đọc bài.`,
        author: 'Ban biên tập', category: c.title,
        publishedAt: fmtDate(new Date(now - (i * 5 + ci) * 3600e3)),
        source: 'dantri.com.vn', url: `https://dantri.com.vn/${c.id}.htm`, image: `https://picsum.photos/seed/${id}/800/500`
      });
    });
  });
  return out;
}
