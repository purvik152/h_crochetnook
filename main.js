/**
 * main.js – h_crochetnook user-facing website logic
 */

// ─── CONTACT CONSTANTS ──────────────────────────────────────────────────────
const WA_NUMBER = '919316780131'; // WhatsApp number (91 = India code)

function waLink(itemName) {
    const msg = encodeURIComponent(`Hi Hinesha! I'm interested in buying: *${itemName}* from h_crochetnook. Could you help me? 🧶`);
    return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

window.handleIgBuy = (e, itemName) => {
    e.preventDefault();
    e.stopPropagation();
    const msg = `Hi Hinesha! I'm interested in buying: *${itemName}* from h_crochetnook. Could you help me? 🧶`;

    // Copy to clipboard and redirect to Instagram DM
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(msg).then(() => {
            alert('Order message copied to clipboard! Paste it into our Instagram chat.');
            window.open('https://ig.me/m/h_crochetnook', '_blank');
        }).catch(() => {
            window.open('https://ig.me/m/h_crochetnook', '_blank');
        });
    } else {
        // Fallback
        window.open('https://ig.me/m/h_crochetnook', '_blank');
    }
};

document.addEventListener('DOMContentLoaded', async () => {

    // Await initial fetch of items from MongoDB before building UI
    await DataService.getAll();

    // ─── ADD STICKERS ────────────────────────────────────────────────────────
    function addStickers() {
        const stickers = [
            // Yarn ball
            `<svg viewBox="0 0 24 24" fill="var(--clr-rose)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v4.93zm2 0V15l-4-4v-1l6 6v4.93c.33.05.66.07 1 .07s.67-.02 1-.07zm3.79-1.72l-4.5-4.5V11l6-6c1.11 1.61 1.71 3.51 1.71 5.5 0 3.53-2.39 6.53-5.71 7.71zM11 6.83L6.83 11 4.29 8.46c1.61-2.42 4.41-4 7.71-4V6.83z"/></svg>`,
            // Heart
            `<svg viewBox="0 0 24 24" fill="var(--clr-blush)"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
            // Star
            `<svg viewBox="0 0 24 24" fill="var(--clr-peach)"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
        ];

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.inset = '0';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '1';
        container.style.overflow = 'hidden';
        document.body.appendChild(container);

        // Add 5 random stickers
        for (let i = 0; i < 6; i++) {
            const el = document.createElement('div');
            el.className = 'crochet-sticker';
            el.innerHTML = stickers[i % stickers.length];
            // Random styling
            el.style.width = (40 + Math.random() * 40) + 'px';
            el.style.height = el.style.width;
            el.style.top = (10 + Math.random() * 80) + 'vh';
            el.style.left = (Math.random() > 0.5 ? (5 + Math.random() * 10) : (80 + Math.random() * 10)) + 'vw';
            el.style.animationDelay = (Math.random() * 5) + 's';
            el.style.opacity = '0.4';
            container.appendChild(el);
        }
    }
    addStickers();

    // ─── NAV SCROLL EFFECT ─────────────────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ─── HAMBURGER ─────────────────────────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));

    // ─── HERO SLIDES ──────────────────────────────────────────────────────────
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.getElementById('heroDots');
    let heroIdx = 0, heroTimer;

    heroSlides.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'hero-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => goHero(i));
        heroDots.appendChild(d);
    });

    function goHero(n) {
        heroSlides[heroIdx].classList.remove('active');
        document.querySelectorAll('.hero-dot')[heroIdx].classList.remove('active');
        heroIdx = (n + heroSlides.length) % heroSlides.length;
        heroSlides[heroIdx].classList.add('active');
        document.querySelectorAll('.hero-dot')[heroIdx].classList.add('active');
        clearInterval(heroTimer);
        heroTimer = setInterval(() => goHero(heroIdx + 1), 5000);
    }

    document.getElementById('heroPrev').addEventListener('click', () => goHero(heroIdx - 1));
    document.getElementById('heroNext').addEventListener('click', () => goHero(heroIdx + 1));
    heroTimer = setInterval(() => goHero(heroIdx + 1), 5000);

    // ─── ANIMATED STATS ───────────────────────────────────────────────────────
    const statNums = document.querySelectorAll('.stat-num');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                let count = 0;
                const step = Math.ceil(target / 60);
                const interval = setInterval(() => {
                    count = Math.min(count + step, target);
                    el.textContent = count;
                    if (count >= target) clearInterval(interval);
                }, 25);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statNums.forEach(el => observer.observe(el));

    // ─── FEATURED CAROUSEL ─────────────────────────────────────────────────────
    function buildFeaturedCarousel() {
        const track = document.getElementById('featTrack');
        const dotsEl = document.getElementById('featDots');
        track.innerHTML = '';
        dotsEl.innerHTML = '';

        const featured = DataService.getFeatured();
        if (!featured.length) return;

        featured.forEach((item, i) => {
            const card = document.createElement('div');
            card.className = 'carousel-card';
            card.innerHTML = `
        <img class="carousel-card-img" src="${item.images && item.images.length > 0 ? item.images[0] : (item.image || 'images/hero.png')}" alt="${item.name}" loading="lazy" />
        <div class="carousel-card-body">
          <p class="carousel-card-cat">${item.category}</p>
          <h3 class="carousel-card-name">${item.name}</h3>
          <p class="carousel-card-price">₹${item.price.toLocaleString('en-IN')}</p>
          <div class="buy-btns">
            <a class="buy-btn buy-wa" href="${waLink(item.name)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L0 24l6.335-1.504A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.126-1.444l-.368-.22-3.76.893.942-3.664-.24-.377A9.818 9.818 0 1 1 12 21.818z"/></svg>
              WhatsApp
            </a>
            <a class="buy-btn buy-ig" href="#" onclick="handleIgBuy(event, '${item.name.replace(/'/g, "\\'")}')">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Instagram
            </a>
          </div>
        </div>
      `;
            card.addEventListener('click', () => { window.location.href = `product.html?id=${item.id}`; });
            track.appendChild(card);

            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goFeat(i));
            dotsEl.appendChild(dot);
        });

        let featIdx = 0;
        const cardW = 280 + 24; // card width + gap
        let autoFeat = setInterval(() => goFeat(featIdx + 1), 3500);

        function goFeat(n) {
            const total = featured.length;
            featIdx = (n + total) % total;
            const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
            const offset = Math.min(featIdx * cardW, maxScroll);
            track.style.transform = `translateX(-${offset}px)`;
            document.querySelectorAll('#featDots .carousel-dot').forEach((d, i) => {
                d.classList.toggle('active', i === featIdx);
            });
            clearInterval(autoFeat);
            autoFeat = setInterval(() => goFeat(featIdx + 1), 3500);
        }

        document.getElementById('featPrev').addEventListener('click', () => goFeat(featIdx - 1));
        document.getElementById('featNext').addEventListener('click', () => goFeat(featIdx + 1));
    }

    // ─── CATEGORIES ────────────────────────────────────────────────────────────
    const CAT_ICONS = {
        'Bags': '👜', 'Home Decor': '🏡', 'Toys': '🧸',
        'Accessories': '🎩', 'Clothing': '👗', 'Keychain': '🔑', 'Bouquet': '💐', 'Other': '✨'
    };

    function buildCategories() {
        const catGrid = document.getElementById('catGrid');
        catGrid.innerHTML = '';
        const cats = DataService.getCategories();
        const all = DataService.getItems();
        cats.forEach(cat => {
            const count = all.filter(i => i.category === cat).length;
            const card = document.createElement('div');
            card.className = 'cat-card';
            card.innerHTML = `
        <span class="cat-icon">${CAT_ICONS[cat] || '🧶'}</span>
        <p class="cat-name">${cat}</p>
        <p class="cat-count">${count} item${count !== 1 ? 's' : ''}</p>
      `;
            card.addEventListener('click', () => {
                filterProducts(cat);
                document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
            });
            catGrid.appendChild(card);
        });
    }

    // ─── PRODUCT GRID ──────────────────────────────────────────────────────────
    let activeFilter = 'All';

    function buildFilterBar() {
        const bar = document.querySelector('.filter-bar');
        // Remove old dynamic buttons
        bar.querySelectorAll('.filter-btn:not(#filterAll)').forEach(b => b.remove());

        DataService.getCategories().forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.cat = cat;
            btn.textContent = cat;
            btn.addEventListener('click', () => filterProducts(cat));
            bar.appendChild(btn);
        });

        document.getElementById('filterAll').addEventListener('click', () => filterProducts('All'));
    }

    function filterProducts(cat) {
        activeFilter = cat;
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.cat === cat);
        });
        renderProducts();
    }

    function renderProducts() {
        const grid = document.getElementById('productGrid');
        const empty = document.getElementById('emptyState');
        grid.innerHTML = '';

        let items = DataService.getItems();
        if (activeFilter !== 'All') {
            items = items.filter(i => i.category === activeFilter);
        }

        if (!items.length) {
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
        <div class="product-img-wrap">
          <img class="product-img" src="${item.images && item.images.length > 0 ? item.images[0] : (item.image || 'images/hero.png')}" alt="${item.name}" loading="lazy" />
          ${item.badge ? `<span class="product-badge">${item.badge}</span>` : ''}
        </div>
        <div class="product-body">
          <p class="product-cat">${item.category}</p>
          <h3 class="product-name">${item.name}</h3>
          <p class="product-price">₹${item.price.toLocaleString('en-IN')}</p>
          <p class="product-desc">${item.description}</p>
          <div class="buy-btns">
            <a class="buy-btn buy-wa" href="${waLink(item.name)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L0 24l6.335-1.504A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.126-1.444l-.368-.22-3.76.893.942-3.664-.24-.377A9.818 9.818 0 1 1 12 21.818z"/></svg>
              WhatsApp
            </a>
            <a class="buy-btn buy-ig" href="#" onclick="handleIgBuy(event, '${item.name.replace(/'/g, "\\'")}')">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Instagram
            </a>
          </div>
        </div>
      `;
            card.addEventListener('click', () => { window.location.href = `product.html?id=${item.id}`; });
            grid.appendChild(card);
        });
    }


    // ─── TESTIMONIALS ──────────────────────────────────────────────────────────
    const testiTrack = document.getElementById('testiTrack');
    let testiIdx = 0;
    const testiCards = testiTrack.querySelectorAll('.testi-card');
    let testiTimer = setInterval(nextTesti, 4000);

    function goTesti(n) {
        testiIdx = (n + testiCards.length) % testiCards.length;
        testiTrack.style.transform = `translateX(-${testiIdx * 100}%)`;
        clearInterval(testiTimer);
        testiTimer = setInterval(nextTesti, 4000);
    }
    function nextTesti() { goTesti(testiIdx + 1); }

    document.getElementById('testiPrev').addEventListener('click', () => goTesti(testiIdx - 1));
    document.getElementById('testiNext').addEventListener('click', () => goTesti(testiIdx + 1));

    // ─── INIT ──────────────────────────────────────────────────────────────────
    buildFeaturedCarousel();
    buildCategories();
    buildFilterBar();
    renderProducts();

    // Re-render when tab refocuses (so admin changes are reflected)
    window.addEventListener('focus', async () => {
        await DataService.getAll();
        buildFeaturedCarousel();
        buildCategories();
        buildFilterBar();
        renderProducts();
    });

});
