/**
 * admin.js – StitchCraft Admin Panel Logic
 * Default credentials: admin / admin123
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─── CREDENTIALS (change as desired) ────────────────────────────────────
    const ADMIN_USER = 'admin';
    const ADMIN_PASS = 'admin123';

    // ─── LOGIN ────────────────────────────────────────────────────────────────
    const loginScreen = document.getElementById('loginScreen');
    const adminApp = document.getElementById('adminApp');
    const loginError = document.getElementById('loginError');

    // Check if already logged in
    if (sessionStorage.getItem('sc_admin_auth') === '1') {
        loginScreen.style.display = 'none';
        adminApp.style.display = 'flex';
        init();
    }

    document.getElementById('loginBtn').addEventListener('click', doLogin);
    document.getElementById('loginPass').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doLogin();
    });

    function doLogin() {
        const user = document.getElementById('loginUser').value.trim();
        const pass = document.getElementById('loginPass').value;
        if (user === ADMIN_USER && pass === ADMIN_PASS) {
            sessionStorage.setItem('sc_admin_auth', '1');
            loginScreen.style.display = 'none';
            adminApp.style.display = 'flex';
            init();
        } else {
            loginError.textContent = '❌ Incorrect username or password.';
        }
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('sc_admin_auth');
        adminApp.style.display = 'none';
        loginScreen.style.display = 'flex';
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPass').value = '';
        loginError.textContent = '';
    });

    // ─── SECTION NAVIGATION ──────────────────────────────────────────────────
    const sectionTitle = document.getElementById('sectionTitle');
    const dashboardSection = document.getElementById('dashboardSection');
    const itemsSection = document.getElementById('itemsSection');

    document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const sec = link.dataset.section;
            if (sec === 'dashboard') {
                sectionTitle.textContent = 'Dashboard';
                dashboardSection.style.display = '';
                itemsSection.style.display = 'none';
                renderDashboard();
            } else if (sec === 'items') {
                sectionTitle.textContent = 'Manage Items';
                dashboardSection.style.display = 'none';
                itemsSection.style.display = '';
                renderItemsList();
            }
        });
    });

    // ─── TOAST ────────────────────────────────────────────────────────────────
    const toastEl = document.getElementById('toast');
    let toastTimer;
    function showToast(msg, type = 'success') {
        toastEl.textContent = msg;
        toastEl.className = `toast ${type} show`;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
    }

    // ─── DASHBOARD ────────────────────────────────────────────────────────────
    async function renderDashboard() {
        const items = await DataService.getAll();
        const cats = DataService.getCategories();
        const feat = DataService.getFeatured();

        // Stats
        const statsEl = document.getElementById('adminStats');
        statsEl.innerHTML = `
      <div class="admin-stat-card">
        <p class="stat-label">Total Items</p>
        <p class="stat-value">${items.length}</p>
      </div>
      <div class="admin-stat-card" style="border-left-color:#e9a85c;">
        <p class="stat-label">Categories</p>
        <p class="stat-value">${cats.length}</p>
      </div>
      <div class="admin-stat-card" style="border-left-color:#6ab87a;">
        <p class="stat-label">Featured Items</p>
        <p class="stat-value">${feat.length}</p>
      </div>
    `;

        // Recent items
        const recentEl = document.getElementById('recentItems');
        const recent = [...items].reverse().slice(0, 5);
        if (!recent.length) {
            recentEl.innerHTML = '<p class="no-items">No items yet. Go to Manage Items to add some!</p>';
            return;
        }
        recentEl.innerHTML = recent.map(item => `
      <div class="item-row">
        <img src="${item.images && item.images.length > 0 ? item.images[0] : (item.image || 'images/hero.png')}" alt="${item.name}" class="item-row-img" onerror="this.src='images/hero.png'" />
        <div class="item-row-info">
          <p class="item-row-name">${item.name}</p>
          <p class="item-row-meta">${item.category} · ₹${item.price.toLocaleString('en-IN')} ${item.featured ? '· ⭐ Featured' : ''}</p>
        </div>
        <div class="item-row-actions">
          <button class="btn-edit" data-id="${item.id}">Edit</button>
        </div>
      </div>
    `).join('');

        // Attach event listeners for recent items edit buttons
        recentEl.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                adminEditItem(e.target.dataset.id);
            });
        });
    }

    // Function for dashboard edit button
    function adminEditItem(id) {
        // Switch to items section
        document.querySelector('[data-section="items"]').click();
        setTimeout(() => startEdit(id), 100);
    };

    // ─── ITEMS LIST ───────────────────────────────────────────────────────────
    async function renderItemsList(query = '') {
        const listEl = document.getElementById('itemsList');
        const countBadge = document.getElementById('itemCountBadge');
        let items = await DataService.getAll();

        if (query.trim()) {
            const q = query.toLowerCase();
            items = items.filter(i =>
                i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
            );
        }

        countBadge.textContent = `(${items.length})`;

        if (!items.length) {
            listEl.innerHTML = '<p class="no-items">No items found.</p>';
            return;
        }

        listEl.innerHTML = items.map(item => `
      <div class="item-row" id="row_${item.id}">
        <img src="${item.images && item.images.length > 0 ? item.images[0] : (item.image || 'images/hero.png')}" alt="${item.name}" class="item-row-img" onerror="this.src='images/hero.png'" />
        <div class="item-row-info">
          <p class="item-row-name">${item.name}</p>
          <p class="item-row-meta">${item.category} · ₹${item.price.toLocaleString('en-IN')} ${item.featured ? '· ⭐' : ''} ${item.badge ? `· 🏷️ ${item.badge}` : ''}</p>
        </div>
        <div class="item-row-actions">
          <button class="btn-edit list-edit-btn" data-id="${item.id}">✏️ Edit</button>
          <button class="btn-delete list-delete-btn" data-id="${item.id}" data-name="${item.name.replace(/"/g, '&quot;')}">🗑️</button>
        </div>
      </div>
    `).join('');

        // Attach event listeners for list buttons
        listEl.querySelectorAll('.list-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                startEdit(e.target.dataset.id);
            });
        });

        listEl.querySelectorAll('.list-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                // If the user clicked the emoji inside the button, we need the button's dataset
                const targetBtn = e.target.closest('.list-delete-btn') || e.target;
                handleDeleteUI(targetBtn.dataset.id, targetBtn.dataset.name);
            });
        });
    }

    // Live search
    document.getElementById('searchBar').addEventListener('input', (e) => {
        renderItemsList(e.target.value);
    });

    // ─── FORM LOGIC ───────────────────────────────────────────────────────────
    const formTitle = document.getElementById('formTitle');
    const itemName = document.getElementById('itemName');
    const itemCat = document.getElementById('itemCategory');
    const itemPrice = document.getElementById('itemPrice');
    const itemBadge = document.getElementById('itemBadge');
    const itemMoreInfo = document.getElementById('itemMoreInfo');
    const itemImages = document.getElementById('itemImages');
    const itemImageFiles = document.getElementById('itemImageFiles');
    const itemFeat = document.getElementById('itemFeatured');
    const editId = document.getElementById('editId');
    const imgPreviewContainer = document.getElementById('imgPreviewContainer');

    function updatePreview() {
        let urls = itemImages.value.split('\n').map(u => u.trim()).filter(u => u);
        imgPreviewContainer.innerHTML = '';
        if (urls.length > 0) {
            urls.forEach((url, i) => {
                const wrap = document.createElement('div');
                wrap.style.position = 'relative';
                wrap.style.display = 'inline-block';
                wrap.style.margin = '2px';

                const img = document.createElement('img');
                img.src = url;
                img.className = 'img-preview show';
                img.style.width = '60px';
                img.style.height = '60px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = 'var(--radius-sm)';

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.innerHTML = '✕';
                btn.style.position = 'absolute';
                btn.style.top = '-6px';
                btn.style.right = '-6px';
                btn.style.background = 'var(--clr-rose)';
                btn.style.color = '#fff';
                btn.style.border = 'none';
                btn.style.borderRadius = '50%';
                btn.style.width = '18px';
                btn.style.height = '18px';
                btn.style.fontSize = '10px';
                btn.style.cursor = 'pointer';
                btn.style.display = 'flex';
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';

                btn.onclick = (e) => {
                    e.preventDefault();
                    urls.splice(i, 1);
                    itemImages.value = urls.join('\n');
                    updatePreview();
                };

                wrap.appendChild(img);
                wrap.appendChild(btn);
                imgPreviewContainer.appendChild(wrap);
            });
        }
    }

    // Live image preview from URLs
    itemImages.addEventListener('input', updatePreview);

    // Handle local file uploads
    if (itemImageFiles) {
        itemImageFiles.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            showToast('⏳ Compressing images...', 'success');

            for (const file of files) {
                try {
                    const base64 = await compressImage(file);
                    // Append to textarea
                    const currentVal = itemImages.value.trim();
                    itemImages.value = currentVal ? currentVal + '\n' + base64 : base64;
                } catch (err) {
                    console.error('Failed to compress image:', err);
                }
            }
            // Clear file input so the same files can be selected again if needed
            itemImageFiles.value = '';

            updatePreview();
            showToast('✅ Images added to URLs list!');
        });
    }

    // Compress image using Canvas to save localStorage space
    function compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = event => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Max width 800px
                    const MAX_WIDTH = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress as JPEG 70% quality
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.onerror = error => reject(error);
            };
            reader.onerror = error => reject(error);
        });
    }

    function resetForm() {
        formTitle.textContent = 'Add New Item';
        itemName.value = '';
        itemCat.value = '';
        itemPrice.value = '';
        itemBadge.value = '';
        itemDesc.value = '';
        itemMoreInfo.value = '';
        itemImages.value = '';
        if (itemImageFiles) itemImageFiles.value = '';
        itemFeat.checked = false;
        editId.value = '';
        imgPreviewContainer.innerHTML = '';
        document.getElementById('saveBtn').textContent = '💾 Save Item';
    }

    document.getElementById('resetBtn').addEventListener('click', resetForm);

    document.getElementById('saveBtn').addEventListener('click', async () => {
        const name = itemName.value.trim();
        const cat = itemCat.value;
        const price = parseFloat(itemPrice.value);
        const desc = itemDesc.value.trim();
        const moreInfo = itemMoreInfo.value.trim();

        let imagesArray = itemImages.value.split('\n').map(u => u.trim()).filter(u => u);
        if (imagesArray.length === 0) {
            imagesArray = ['images/hero.png'];
        }

        if (!name || !cat || isNaN(price) || !desc) {
            showToast('⚠️ Please fill in all required fields.', 'error');
            return;
        }

        const data = {
            name, category: cat, price,
            description: desc,
            moreInfo: moreInfo,
            images: imagesArray,
            badge: itemBadge.value.trim(),
            featured: itemFeat.checked
        };

        if (editId.value) {
            await DataService.updateItem(editId.value, data);
            showToast('✅ Item updated successfully!');
        } else {
            await DataService.addItem(data);
            showToast('✅ Item added successfully!');
        }

        resetForm();
        renderItemsList();
        renderDashboard();
    });

    async function startEdit(id) {
        const item = await DataService.getById(id);
        if (!item) return;

        formTitle.textContent = 'Edit Item';
        itemName.value = item.name;
        itemCat.value = item.category;
        itemPrice.value = item.price;
        itemBadge.value = item.badge || '';
        itemDesc.value = item.description || '';
        itemMoreInfo.value = item.moreInfo || '';

        const imgs = item.images || (item.image ? [item.image] : []);
        itemImages.value = imgs.join('\n');

        itemFeat.checked = item.featured;
        editId.value = item.id;
        document.getElementById('saveBtn').textContent = '💾 Update Item';

        // Utilize the updated image preview function that includes remove buttons
        updatePreview();

        // Scroll to form
        document.querySelector('.admin-form-card').scrollIntoView({ behavior: 'smooth' });
    }

    // Use internal function for delete
    async function handleDeleteUI(id, name) {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        await DataService.deleteItem(id);
        renderItemsList(document.getElementById('searchBar').value);
        renderDashboard();
        showToast(`🗑️ "${name}" deleted.`);
        if (editId.value === id) resetForm();
    }

    // ─── INIT ────────────────────────────────────────────────────────────────
    function init() {
        renderDashboard();
        renderItemsList();
    }

});
