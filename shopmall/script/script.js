
const recommendedProducts = [
  {
    id: 'blouse-ivory',
    brand: 'MAISON LABEL',
    name: '실키 브이 블라우스',
    price: 49000,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    category: '의류',
    desc: '은은한 광택감과 부드러운 핏이 돋보이는 데일리 블라우스입니다. 출근룩부터 주말 룩까지 가볍게 매치하기 좋습니다.'
  },
  {
    id: 'denim-slim',
    brand: 'MOMENT',
    name: '슬림 스트레이트 데님',
    price: 58000,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
    category: '의류',
    desc: '다리가 길어 보이는 슬림 스트레이트 실루엣의 데님입니다. 어떤 상의와도 쉽게 어울리는 기본 아이템입니다.'
  },
  {
    id: 'bag-mini',
    brand: 'ATELIER',
    name: '미니 토트백',
    price: 71000,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    category: '악세서리',
    desc: '포멀하면서도 가벼운 무드의 미니 토트백입니다. 필수 소지품을 담기 좋은 실용적인 크기감이 매력입니다.'
  },
  {
    id: 'flat-ribbon',
    brand: 'ÉTÉ',
    name: '리본 플랫 슈즈',
    price: 46000,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
    category: '신발',
    desc: '발등을 슬림하게 잡아주는 리본 디테일 플랫 슈즈입니다. 데일리 룩에 사랑스러운 포인트를 더해줍니다.'
  }
];

const bestProducts = [
  {
    id: 'jacket-crop',
    brand: 'MAISON LABEL',
    name: '테일러드 크롭 자켓',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&q=80',
    category: '아우터',
    desc: '구조적인 어깨선과 크롭 기장이 세련된 비율을 만들어주는 자켓입니다.'
  },
  {
    id: 'dress-floral',
    brand: 'NOUVEAU',
    name: '플로럴 쉬폰 원피스',
    price: 76000,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    category: '원피스',
    desc: '흐르는 듯한 쉬폰 소재와 잔잔한 플로럴 패턴이 돋보이는 원피스입니다.'
  },
  {
    id: 'cardigan-daily',
    brand: 'MOMENT',
    name: '데일리 니트 가디건',
    price: 52000,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    category: '아우터',
    desc: '가볍게 걸치기 좋은 두께감과 내추럴한 핏의 데일리 가디건입니다.'
  },
  {
    id: 'earring-gold',
    brand: 'LUNE',
    name: '골드 포인트 이어링',
    price: 29000,
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80',
    category: '악세서리',
    desc: '은은한 광택이 얼굴을 환하게 살려주는 포인트 이어링입니다.'
  }
];

const categoryProducts = [
  {
    id: 'blouse-soft',
    brand: 'MAISON LABEL',
    name: '소프트 셔링 블라우스',
    price: 54000,
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80',
    category: '의류',
    desc: '가볍게 잡힌 셔링과 유연한 소재감이 여성스러운 분위기를 연출해주는 블라우스입니다.'
  },
  {
    id: 'trench-light',
    brand: 'ATELIER',
    name: '라이트 트렌치 자켓',
    price: 102000,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    category: '아우터',
    desc: '간절기 시즌에 활용도 높은 라이트한 트렌치 무드의 자켓입니다.'
  },
  {
    id: 'dress-satin',
    brand: 'NOUVEAU',
    name: '새틴 슬립 원피스',
    price: 81000,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    category: '원피스',
    desc: '은은한 새틴 텍스처가 고급스러운 분위기를 만드는 슬립 원피스입니다.'
  },
  {
    id: 'necklace-pearl',
    brand: 'LUNE',
    name: '진주 레이어드 목걸이',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80',
    category: '악세서리',
    desc: '레이어드 스타일링에 포인트를 주기 좋은 클래식 무드의 진주 목걸이입니다.'
  },
  {
    id: 'shoes-maryjane',
    brand: 'ÉTÉ',
    name: '스퀘어 메리제인 슈즈',
    price: 63000,
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80',
    category: '신발',
    desc: '스퀘어 토 라인으로 한층 모던한 감각을 더한 메리제인 슈즈입니다.'
  },
  {
    id: 'pants-cream',
    brand: 'MOMENT',
    name: '크림 와이드 팬츠',
    price: 67000,
    image: 'https://images.unsplash.com/photo-1506629905607-d405b7a89f34?auto=format&fit=crop&w=900&q=80',
    category: '의류',
    desc: '편안한 착용감과 깔끔한 실루엣을 동시에 잡은 와이드 팬츠입니다.'
  }
];

const seedCartProducts = [
  {
    id: 'blouse-ivory',
    brand: 'MAISON LABEL',
    name: '실키 브이 블라우스',
    option: '아이보리 / Free',
    price: 49000,
    qty: 1,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'denim-slim',
    brand: 'MOMENT',
    name: '슬림 스트레이트 데님',
    option: '중청 / M',
    price: 58000,
    qty: 2,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80'
  }
];

const allProducts = [...recommendedProducts, ...bestProducts, ...categoryProducts].filter(
  (item, index, arr) => index === arr.findIndex((v) => v.id === item.id)
);

const STORAGE_KEY = 'maison_cart_items';

const productImagesMap = {
  'blouse-ivory': [
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80'
  ],
  'denim-slim': [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506629905607-d405b7a89f34?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80'
  ],
  'bag-mini': [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'
  ],
  'flat-ribbon': [
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80'
  ],
  'jacket-crop': [
    'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80'
  ],
  'dress-floral': [
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80'
  ],
  'cardigan-daily': [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80'
  ],
  'earring-gold': [
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&w=1200&q=80'
  ],
  'blouse-soft': [
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80'
  ],
  'trench-light': [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80'
  ],
  'dress-satin': [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80'
  ],
  'necklace-pearl': [
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&w=1200&q=80'
  ],
  'shoes-maryjane': [
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'
  ],
  'pants-cream': [
    'https://images.unsplash.com/photo-1506629905607-d405b7a89f34?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80'
  ]
};

const sizeMap = {
  '신발': ['230', '235', '240', '245'],
  '악세서리': ['ONE SIZE'],
  '원피스': ['S', 'M'],
  '아우터': ['S', 'M', 'L'],
  '의류': ['Free', 'S', 'M']
};

function formatPrice(value) {
  return `₩${value.toLocaleString('ko-KR')}`;
}

function detailHref(item) {
  return `detail.html?id=${encodeURIComponent(item.id)}`;
}

function getCategoryHash(category) {
  return {
    '의류': 'clothing',
    '아우터': 'outer',
    '원피스': 'dress',
    '악세서리': 'acc',
    '신발': 'shoes'
  }[category] || 'all';
}

function getImagesForProduct(item) {
  return productImagesMap[item.id] || [item.image, item.image, item.image];
}

function defaultOptionForItem(item) {
  const sizes = sizeMap[item.category] || ['Free'];
  return `${item.category === '신발' ? '블랙' : '기본'} / ${sizes[0]}`;
}

function getCartItems() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(stored)) return stored;
  } catch (error) {
    console.warn('cart parse error', error);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCartProducts));
  return [...seedCartProducts];
}

function saveCartItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getCartCount(items = getCartItems()) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

function updateBadges() {
  const items = getCartItems();
  document.querySelectorAll('.badge').forEach((badge) => {
    badge.textContent = String(getCartCount(items));
  });
}

function addToCart(productId, selectedSize) {
  const item = allProducts.find((product) => product.id === productId);
  if (!item) return;

  const option = `${item.category === '신발' ? '블랙' : '기본'} / ${selectedSize}`;
  const items = getCartItems();
  const existing = items.find((cartItem) => cartItem.id === item.id && cartItem.option === option);

  if (existing) {
    existing.qty += 1;
  } else {
    items.push({
      id: item.id,
      brand: item.brand,
      name: item.name,
      option,
      price: item.price,
      qty: 1,
      image: item.image
    });
  }

  saveCartItems(items);
  updateBadges();
  showToast('장바구니에 담았어요.');
}

function updateCartQty(id, option, diff) {
  const items = getCartItems();
  const target = items.find((item) => item.id === id && item.option === option);
  if (!target) return;
  target.qty += diff;
  const nextItems = items.filter((item) => item.qty > 0);
  saveCartItems(nextItems);
  renderCartPage();
}

function productCard(item) {
  return `
    <article class="product-card">
      <a class="product-thumb thumb-link" href="${detailHref(item)}">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
      </a>
      <div class="product-info">
        <p class="product-brand">${item.brand}</p>
        <h3 class="product-name"><a href="${detailHref(item)}">${item.name}</a></h3>
        <p class="product-price">${formatPrice(item.price)}</p>
      </div>
    </article>
  `;
}

function productRow(item) {
  return `
    <article class="product-row">
      <a class="product-thumb row-thumb thumb-link" href="${detailHref(item)}">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
      </a>
      <div class="product-meta">
        <p class="product-brand">${item.brand}</p>
        <p class="product-name"><a href="${detailHref(item)}">${item.name}</a></p>
        <p class="small">카테고리 · ${item.category}</p>
        <p class="product-price">${formatPrice(item.price)}</p>
      </div>
    </article>
  `;
}

function cartRow(item) {
  return `
    <article class="cart-item">
      <a class="product-thumb cart-thumb thumb-link" href="${detailHref(item)}">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
      </a>
      <div class="cart-meta">
        <p class="product-brand">${item.brand}</p>
        <h3 class="cart-title"><a href="${detailHref(item)}">${item.name}</a></h3>
        <p class="small">옵션: ${item.option}</p>
        <p class="product-price">${formatPrice(item.price)}</p>
        <div class="qty-box">
          <button type="button" data-action="decrease" data-id="${item.id}" data-option="${item.option}" aria-label="수량 감소">−</button>
          <strong>${item.qty}</strong>
          <button type="button" data-action="increase" data-id="${item.id}" data-option="${item.option}" aria-label="수량 증가">+</button>
        </div>
      </div>
    </article>
  `;
}

function renderSummary(items = getCartItems()) {
  const productAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = productAmount > 0 ? 3000 : 0;
  const total = productAmount + shipping;

  const productAmountEl = document.getElementById('productAmount');
  const shippingEl = document.getElementById('shippingAmount');
  const totalAmountEl = document.getElementById('totalAmount');
  if (productAmountEl) productAmountEl.textContent = formatPrice(productAmount);
  if (shippingEl) shippingEl.textContent = formatPrice(shipping);
  if (totalAmountEl) totalAmountEl.textContent = formatPrice(total);
  updateBadges();
}

function renderCategoryProducts(filter = 'all') {
  const categoryWrap = document.getElementById('categoryProducts');
  const titleEl = document.getElementById('categoryTitle');
  if (!categoryWrap) return;

  const filtered = filter === 'all' ? categoryProducts : categoryProducts.filter((item) => item.category === filter);
  categoryWrap.innerHTML = filtered.map(productRow).join('');
  if (titleEl) titleEl.textContent = filter === 'all' ? '전체 상품' : `${filter} 상품`;

  document.querySelectorAll('#categoryTabs .filter-chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.filter === filter);
  });

  const activeChip = document.querySelector(`#categoryTabs .filter-chip[data-filter="${filter}"]`);
  if (activeChip) {
    activeChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

function setupCategoryTabs() {
  const tabsWrap = document.getElementById('categoryTabs');
  if (!tabsWrap) return;

  const hashMap = {
    '#clothing': '의류',
    '#outer': '아우터',
    '#dress': '원피스',
    '#acc': '악세서리',
    '#shoes': '신발',
    '#all': 'all'
  };

  const initial = hashMap[window.location.hash] || 'all';
  renderCategoryProducts(initial);

  tabsWrap.addEventListener('click', (event) => {
    const button = event.target.closest('.filter-chip');
    if (!button) return;
    const filter = button.dataset.filter || 'all';
    const hash = Object.keys(hashMap).find((key) => hashMap[key] === filter) || '#all';
    history.replaceState(null, '', hash);
    renderCategoryProducts(filter);
  });

  window.addEventListener('hashchange', () => {
    renderCategoryProducts(hashMap[window.location.hash] || 'all');
  });
}

function renderDetailPage() {
  const detailWrap = document.getElementById('detailPage');
  if (!detailWrap) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const item = allProducts.find((product) => product.id === id) || allProducts[0];
  const images = getImagesForProduct(item);
  const sizes = sizeMap[item.category] || ['Free'];

  detailWrap.innerHTML = `
    <section class="detail-slider">
      <button class="slider-arrow prev" type="button" aria-label="이전 이미지">‹</button>
      <img class="detail-main-image" id="detailMainImage" src="${images[0]}" alt="${item.name}" loading="lazy" />
      <button class="slider-arrow next" type="button" aria-label="다음 이미지">›</button>
      <div class="detail-dots" id="detailDots">${images.map((_, idx) => `<span class="detail-dot ${idx === 0 ? 'active' : ''}"></span>`).join('')}</div>
    </section>
    <div class="detail-thumbs" id="detailThumbs">
      ${images.map((src, idx) => `
        <button class="detail-thumb-btn ${idx === 0 ? 'active' : ''}" type="button" data-index="${idx}" aria-label="상세 이미지 ${idx + 1}">
          <img src="${src}" alt="${item.name} 썸네일 ${idx + 1}" loading="lazy" />
        </button>
      `).join('')}
    </div>
    <section class="detail-body">
      <p class="product-brand">${item.brand}</p>
      <span class="detail-category">${item.category}</span>
      <h2 class="detail-title">${item.name}</h2>
      <p class="detail-price">${formatPrice(item.price)}</p>
      <p class="detail-desc">${item.desc}</p>

      <div class="detail-option-block">
        <p class="detail-option-title">사이즈 선택</p>
        <div class="size-options" id="sizeOptions">
          ${sizes.map((size, idx) => `<button class="size-btn ${idx === 0 ? 'active' : ''}" type="button" data-size="${size}">${size}</button>`).join('')}
        </div>
        <p class="detail-actions-note">선택 사이즈로 장바구니에 바로 담을 수 있어요.</p>
      </div>

      <div class="detail-info-list">
        <div class="detail-info-row"><span>배송 안내</span><strong>2~3일 내 출고</strong></div>
        <div class="detail-info-row"><span>사이즈</span><strong>${sizes.join(' / ')}</strong></div>
        <div class="detail-info-row"><span>혜택</span><strong>신규회원 5% 할인</strong></div>
      </div>
    </section>
  `;

  let currentIndex = 0;
  const mainImage = document.getElementById('detailMainImage');
  const dots = Array.from(document.querySelectorAll('.detail-dot'));
  const thumbs = Array.from(document.querySelectorAll('.detail-thumb-btn'));
  const sizeButtons = Array.from(document.querySelectorAll('.size-btn'));
  const addCartButton = document.getElementById('addToCartButton');

  function syncSlider(index) {
    currentIndex = (index + images.length) % images.length;
    if (mainImage) mainImage.src = images[currentIndex];
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentIndex));
    thumbs.forEach((thumb, idx) => thumb.classList.toggle('active', idx === currentIndex));
  }

  document.querySelector('.slider-arrow.prev')?.addEventListener('click', () => syncSlider(currentIndex - 1));
  document.querySelector('.slider-arrow.next')?.addEventListener('click', () => syncSlider(currentIndex + 1));
  document.getElementById('detailThumbs')?.addEventListener('click', (event) => {
    const button = event.target.closest('.detail-thumb-btn');
    if (!button) return;
    syncSlider(Number(button.dataset.index || 0));
  });

  let selectedSize = sizes[0];
  document.getElementById('sizeOptions')?.addEventListener('click', (event) => {
    const button = event.target.closest('.size-btn');
    if (!button) return;
    selectedSize = button.dataset.size || sizes[0];
    sizeButtons.forEach((sizeBtn) => sizeBtn.classList.toggle('active', sizeBtn === button));
  });

  const backBtn = document.querySelector('.detail-bottom-bar .ghost-btn');
  if (backBtn) backBtn.href = `category.html#${getCategoryHash(item.category)}`;

  if (addCartButton) {
    addCartButton.addEventListener('click', () => {
      addToCart(item.id, selectedSize);
      window.location.href = 'cart.html';
    });
  }
}

function renderCartPage() {
  const cartWrap = document.getElementById('cartItems');
  if (!cartWrap) return;

  const items = getCartItems();
  if (!items.length) {
    cartWrap.innerHTML = '<div class="empty-cart">장바구니가 비어 있어요.<br />마음에 드는 상품을 담아보세요.</div>';
    renderSummary(items);
    return;
  }

  cartWrap.innerHTML = items.map(cartRow).join('');
  renderSummary(items);
}

function setupCartInteractions() {
  const cartWrap = document.getElementById('cartItems');
  if (!cartWrap) return;
  cartWrap.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    const id = button.dataset.id;
    const option = button.dataset.option;
    if (action === 'increase') updateCartQty(id, option, 1);
    if (action === 'decrease') updateCartQty(id, option, -1);
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 1600);
}

const recommendedWrap = document.getElementById('recommendedProducts');
if (recommendedWrap) recommendedWrap.innerHTML = recommendedProducts.map(productCard).join('');

const bestWrap = document.getElementById('bestProducts');
if (bestWrap) bestWrap.innerHTML = bestProducts.map(productCard).join('');

setupCategoryTabs();
renderDetailPage();
renderCartPage();
setupCartInteractions();
updateBadges();
