# Tin Tức 24h – Bài tập lớn cuối khóa
HTML/CSS/JS thuần + LocalStorage. Mở `index.html` bằng trình duyệt (hoặc `npx serve .` / Live Server).
- `index.html` – trang tin (hash route: `#/c/<chuyên-mục>`, `#/p/<id-bài>`)
- `crawler.html` – trang Crawler, lưu bài vào LocalStorage
- `js/crawler.js` – hàm `crawlArticle(url)` trả về object JSON chuẩn hoá
- `data/menu.json` – cây chuyên mục (nạp vào LocalStorage lần đầu qua `js/data.js`)
