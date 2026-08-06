(() => {
  'use strict';

  const D = window.MAYDAYLAND_ARCHIVE;
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const palettes = [
    ['#ff7a8b','#6d2848','#ff9db0'],
    ['#45c7e8','#1f4e73','#55d7ff'],
    ['#ffbb4d','#6e3e18','#ffd069'],
    ['#7f9bff','#253a77','#9aafff'],
    ['#74d6a1','#1e5b48','#82e9b1'],
    ['#d890ff','#59306d','#e4adff']
  ];

  function productId(book) {
    return String(book?.url || '').match(/products\/([A-Z0-9]+)/i)?.[1] || '';
  }

  function coverUrl(book) {
    const id = productId(book);
    if (!/^\d{10}$/.test(id)) return '';
    return `https://www.books.com.tw/img/${id.slice(0,3)}/${id.slice(3,6)}/${id.slice(6,8)}/${id}.jpg`;
  }

  function renderBooks() {
    const body = $('archiveBody');
    if (!body || !Array.isArray(D?.books)) return;
    body.className = 'archive-grid books-grid';
    body.innerHTML = D.books.map((book, index) => {
      const [a,b,accent] = palettes[index % palettes.length];
      return `<article class="book-card" style="--book-a:${a};--book-b:${b};--book-accent:${accent}">
        <div class="book-cover">
          <img src="${coverUrl(book)}" alt="${esc(book.title)} 封面" referrerpolicy="no-referrer" loading="lazy" decoding="async">
          <span class="book-fallback"><b>${esc(book.title)}</b><em>${esc(book.year)}</em></span>
        </div>
        <div class="book-copy">
          <small>${esc(book.year)} · ${esc(book.publisher)}</small>
          <h3>${esc(book.title)}</h3>
          <p class="book-byline">${esc(book.author)}</p>
          <p class="book-note">${esc(book.note)}</p>
          <div class="book-actions"><a href="${esc(book.url)}" target="_blank" rel="noopener">查看出版资料</a></div>
          <span class="book-source"><i></i>封面及出版资料：博客来商品页</span>
        </div>
      </article>`;
    }).join('');

    body.querySelectorAll('.book-cover img').forEach(img => {
      img.addEventListener('error', () => img.closest('.book-cover')?.classList.add('cover-failed'), {once:true});
      if (img.complete && img.naturalWidth === 0) img.closest('.book-cover')?.classList.add('cover-failed');
    });
  }

  function init() {
    document.querySelectorAll('[data-view="books"]').forEach(button => {
      button.addEventListener('click', () => requestAnimationFrame(renderBooks));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
