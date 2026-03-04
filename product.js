/**
 * product.js – Logic for the individual product details page
 */

document.addEventListener('DOMContentLoaded', async () => {

    const WA_NUMBER = '919316780131';
    const IG_URL = 'https://www.instagram.com/h_crochetnook?igsh=MXV2OHg5OTFzdThwMA==';

    function waLink(itemName) {
        const msg = encodeURIComponent(`Hi Hinesha! I'm interested in buying: *${itemName}* from h_crochetnook. Could you help me? 🧶`);
        return `https://wa.me/${WA_NUMBER}?text=${msg}`;
    }

    window.handleIgBuy = (e, itemName) => {
        e.preventDefault();
        e.stopPropagation();
        const msg = `Hi Hinesha! I'm interested in buying: *${itemName}* from h_crochetnook. Could you help me? 🧶`;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(msg).then(() => {
                alert('Order message copied to clipboard! Paste it into our Instagram chat.');
                window.open('https://ig.me/m/h_crochetnook', '_blank');
            }).catch(() => {
                window.open('https://ig.me/m/h_crochetnook', '_blank');
            });
        } else {
            window.open('https://ig.me/m/h_crochetnook', '_blank');
        }
    };

    // ─── UTILS ─────────────────────────────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    }

    // ─── LOAD PRODUCT ────────────────────────────────────────────────────────
    const productContainer = document.getElementById('productContainer');

    // Get ID from URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        productContainer.innerHTML = `
            <div class="product-error">
                <h2>Product Not Found</h2>
                <p>We couldn't find the product you're looking for.</p>
                <a href="index.html#shop" class="btn-primary" style="margin-top:1rem;">Back to Shop</a>
            </div>
        `;
        return;
    }

    const item = await DataService.getById(productId);

    if (!item) {
        productContainer.innerHTML = `
            <div class="product-error">
                <h2>Product Not Found</h2>
                <p>This item might have been removed.</p>
                <a href="index.html#shop" class="btn-primary" style="margin-top:1rem;">Back to Shop</a>
            </div>
        `;
        return;
    }

    document.title = `${item.name} – h_crochetnook`;

    // Ensure images array fallbacks
    const images = item.images && item.images.length > 0 ? item.images : [(item.image || 'images/hero.png')];
    const moreInfoHtml = item.moreInfo ? `<div class="product-page-more-info"><h3>Details & Care</h3><p>${item.moreInfo.replace(/\n/g, '<br>')}</p></div>` : '';

    let thumbnailsHtml = '';
    if (images.length > 1) {
        thumbnailsHtml = `
            <div class="product-gallery-thumbs" id="galleryThumbs">
                ${images.map((url, idx) => `
                    <div class="thumb-wrap ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
                        <img src="${url}" alt="Thumbnail ${idx + 1}" />
                    </div>
                `).join('')}
            </div>
        `;
    }

    productContainer.innerHTML = `
        <div class="product-page-layout">
            
            <div class="product-page-gallery">
                <div class="product-gallery-main">
                    ${item.badge ? `<span class="product-badge">${item.badge}</span>` : ''}
                    <img id="mainGalleryImg" src="${images[0]}" alt="${item.name}" />
                </div>
                ${thumbnailsHtml}
            </div>

            <div class="product-page-info">
                <div class="breadcrumbs">
                    <a href="index.html">Home</a> &nbsp;/&nbsp; <a href="index.html#shop">Shop</a> &nbsp;/&nbsp; <span>${item.category}</span>
                </div>
                <h1 class="product-page-title">${item.name}</h1>
                <p class="product-page-price">₹${item.price.toLocaleString('en-IN')}</p>
                
                <p class="product-page-desc">${item.description}</p>
                
                ${moreInfoHtml}

                <div class="product-page-actions">
                    <a href="${waLink(item.name)}" target="_blank" rel="noopener" class="buy-btn buy-wa buy-lg">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L0 24l6.335-1.504A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.126-1.444l-.368-.22-3.76.893.942-3.664-.24-.377A9.818 9.818 0 1 1 12 21.818z"/></svg>
                        Buy via WhatsApp
                    </a>
                    <a href="#" target="_blank" rel="noopener" class="buy-btn buy-ig buy-lg" style="margin-top: 0.75rem;" onclick="window.handleIgBuy(event, '${item.name.replace(/'/g, "\\'")}')">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        Order on Instagram
                    </a>
                </div>
                
                <div style="margin-top: 2rem; padding: 1rem; background: var(--clr-peach); border-radius: var(--radius-sm); border: 1px dashed var(--clr-rose);">
                    <p style="font-size: 0.85rem; color: var(--clr-brown); margin: 0;"><strong>🧶 Custom Orders:</strong> Love this but want a different color or size? Send me a message and we can customize it just for you!</p>
                </div>

            </div>
        </div>
    `;

    // Hook up thumbnails
    if (images.length > 1) {
        const mainImg = document.getElementById('mainGalleryImg');
        const thumbs = document.querySelectorAll('.thumb-wrap');

        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Update active state
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');

                // Change main image
                const idx = thumb.dataset.idx;
                mainImg.src = images[idx];
            });
        });
    }

});
