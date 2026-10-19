// Luxe Vault - Core Application Engine (Spanish Only / Precios en COP / Cuentas de Cliente)

class LuxeApp {
  constructor() {
    this.currentTab = 'products';
    this.currentCategory = 'all';
    this.currentStyle = 'minimalist';
    this.currentAdminSubtab = 'products';
    this.isAdminLoggedIn = false;
    this.cart = [];
    this.favorites = new Set();
    this.selectedRating = 5;
    this.leafletMap = null;
    
    this.init();
  }

  init() {
    this.loadStateFromLocalStorage();
    this.renderAll();
    this.initCountdown();
    this.initMap();
  }

  // --- LOCAL STORAGE PERSISTENCE ---
  saveStateToLocalStorage() {
    try {
      localStorage.setItem('LUXE_VAULT_STATE', JSON.stringify(LUXE_DATA));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  loadStateFromLocalStorage() {
    const saved = localStorage.getItem('LUXE_VAULT_STATE');
    if (saved) {
      try {
        LUXE_DATA = JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved state", e);
      }
    }
  }

  // --- TAB NAVIGATION ---
  switchTab(tabPath) {
    this.currentTab = tabPath;

    // Hide all tabs & show active tab
    document.querySelectorAll('.tab-view').forEach(view => view.classList.add('hidden'));
    const activeView = document.getElementById(`view-${tabPath}`);
    if (activeView) activeView.classList.remove('hidden');

    // Update Bottom Nav Styling
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const path = btn.getAttribute('data-path');
      if (path === tabPath) {
        btn.classList.add('text-primary', 'font-bold');
        btn.classList.remove('text-on-surface-variant');
      } else {
        btn.classList.remove('text-primary', 'font-bold');
        btn.classList.add('text-on-surface-variant');
      }
    });

    this.updateHeaderTitle();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh map if complaints tab is selected
    if (tabPath === 'complaints' && this.leafletMap) {
      setTimeout(() => this.leafletMap.invalidateSize(), 200);
    }
  }

  updateHeaderTitle() {
    const titles = {
      products: "Productos",
      promotions: "Promociones",
      recommendations: "Para Ti",
      reviews: "Reseñas",
      complaints: "Quejas y Ayuda",
      admin: "Panel Admin"
    };
    const headerTitle = document.getElementById('header-tab-title');
    if (headerTitle && titles[this.currentTab]) {
      headerTitle.innerText = titles[this.currentTab];
    }
  }

  // --- RENDERERS ---
  renderAll() {
    this.renderProducts();
    this.renderPromotions();
    this.renderRecommendations();
    this.renderReviews();
    this.renderCart();
    this.renderAdminPanel();
    this.updateUserProfileButton();
    this.updateBoutiqueDisplaySettings();
  }

  // --- PRODUCTS TAB LOGIC ---
  renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const query = (document.getElementById('product-search-input')?.value || '').toLowerCase().trim();

    let filtered = LUXE_DATA.products.filter(p => {
      const matchCat = this.currentCategory === 'all' || p.category === this.currentCategory;
      const name = p.name || p.nameES || "";
      const desc = p.description || p.descriptionES || "";
      const matchSearch = !query || name.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });

    const counterLabel = document.getElementById('product-count-label');
    if (counterLabel) {
      counterLabel.innerText = `0${filtered.length} / 0${LUXE_DATA.products.length}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-5xl opacity-40 mb-2">search_off</span>
          <p class="font-headline-md text-lg">No se encontraron piezas</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map((p, index) => {
      const name = p.name || p.nameES;
      const isFav = this.favorites.has(p.id);

      return `
        <div class="flex flex-col gap-stack-sm group cursor-pointer luxury-card ${index % 2 === 1 ? 'translate-y-4 md:translate-y-0' : ''}" onclick="app.openProductModal('${p.id}')">
          <div class="aspect-[0.86] bg-surface-container-low overflow-hidden relative rounded">
            <img alt="${p.alt || name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${p.image}"/>
            <button onclick="event.stopPropagation(); app.toggleFavorite('${p.id}')" class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full text-on-surface-variant transition-all hover:scale-110">
              <span class="material-symbols-outlined text-[20px] ${isFav ? 'text-primary' : ''}" style="font-variation-settings: 'FILL' ${isFav ? 1 : 0};">${isFav ? 'favorite' : 'favorite'}</span>
            </button>
          </div>
          <div class="flex flex-col items-center text-center mt-2">
            <span class="font-body-md text-body-md text-on-surface font-medium">${name}</span>
            <span class="font-label-sm text-label-sm text-primary font-semibold mt-1">${formatCOP(p.price)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  setCategory(cat) {
    this.currentCategory = cat;
    document.querySelectorAll('.cat-chip').forEach(btn => {
      if (btn.getAttribute('data-cat') === cat) {
        btn.classList.add('border-primary', 'text-primary');
        btn.classList.remove('border-transparent', 'text-on-surface-variant');
      } else {
        btn.classList.remove('border-primary', 'text-primary');
        btn.classList.add('border-transparent', 'text-on-surface-variant');
      }
    });
    this.renderProducts();
  }

  filterProducts() {
    const input = document.getElementById('product-search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    if (clearBtn) {
      clearBtn.classList.toggle('hidden', !input.value);
    }
    this.renderProducts();
  }

  clearSearch() {
    const input = document.getElementById('product-search-input');
    if (input) input.value = '';
    this.filterProducts();
  }

  toggleFavorite(id) {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
      this.showToast("Eliminado de Favoritos", "favorite");
    } else {
      this.favorites.add(id);
      this.showToast("Agregado a Favoritos", "favorite");
    }
    this.renderProducts();
  }

  // --- PROMOTIONS LOGIC ---
  renderPromotions() {
    const hero = LUXE_DATA.promotions.hero;
    document.getElementById('promo-hero-badge').innerText = hero.badge || hero.badgeES;
    document.getElementById('promo-hero-title').innerText = hero.title || hero.titleES;
    document.getElementById('promo-hero-desc').innerText = hero.desc || hero.descES;
    document.getElementById('promo-hero-price').innerText = formatCOP(hero.price);
    if (hero.originalPrice) {
      document.getElementById('promo-hero-orig').innerText = formatCOP(hero.originalPrice);
    }

    const grid = document.getElementById('promotions-grid');
    if (!grid) return;

    grid.innerHTML = LUXE_DATA.promotions.items.map(item => {
      const coll = item.collection || item.collectionES;
      const title = item.title || item.titleES;

      return `
        <div class="flex flex-col gap-4 luxury-card">
          <div class="aspect-square bg-surface-container overflow-hidden rounded">
            <img class="w-full h-full object-cover transition-transform duration-700 hover:scale-105" src="${item.image}" alt="${title}"/>
          </div>
          <div class="flex flex-col items-center text-center">
            <span class="font-label-sm text-label-sm text-primary uppercase tracking-tighter mb-1">${coll}</span>
            <h4 class="font-headline-md text-headline-md">${title}</h4>
            <div class="flex items-center gap-2 mt-2">
              <span class="text-primary font-body-lg text-body-lg font-semibold">${formatCOP(item.price)}</span>
              <span class="text-on-surface-variant/50 line-through text-body-md font-body-md">${formatCOP(item.originalPrice)}</span>
            </div>
            <button onclick="app.addToCart('${item.id}', '${title.replace(/'/g, "\\'")}', ${item.price}, '${item.image}')" class="mt-6 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-outline-variant pb-1 hover:text-primary hover:border-primary transition-colors">
              Agregar a Bolsa
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- RECOMMENDATIONS LOGIC ---
  renderRecommendations() {
    const mosaic = document.getElementById('recommendations-mosaic');
    if (!mosaic) return;

    const items = LUXE_DATA.recommendations.filter(r => r.style === this.currentStyle);

    mosaic.innerHTML = items.map((item) => {
      const title = item.title || item.titleES;
      const badge = item.badge || item.badgeES;

      if (item.featured) {
        return `
          <div class="col-span-2 relative group luxury-card cursor-pointer" onclick="app.addToCart('${item.id}', '${title.replace(/'/g, "\\'")}', ${item.price}, '${item.image}')">
            <div class="aspect-[4/5] md:aspect-[16/9] w-full overflow-hidden bg-surface-container rounded-lg">
              <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${item.image}" alt="${title}"/>
            </div>
            <div class="mt-stack-md text-center">
              ${badge ? `<p class="font-label-sm text-label-sm text-primary uppercase tracking-widest">${badge}</p>` : ''}
              <h3 class="font-headline-md text-headline-md mt-1">${title}</h3>
              <p class="font-body-md text-body-md text-on-surface-variant mt-1">${formatCOP(item.price)}</p>
            </div>
          </div>
        `;
      }

      return `
        <div class="col-span-1 group luxury-card cursor-pointer" onclick="app.addToCart('${item.id}', '${title.replace(/'/g, "\\'")}', ${item.price}, '${item.image}')">
          <div class="aspect-square w-full overflow-hidden bg-surface-container rounded-lg">
            <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${item.image}" alt="${title}"/>
          </div>
          <div class="mt-stack-sm text-center">
            <h3 class="font-body-md text-body-md font-semibold text-on-surface">${title}</h3>
            <p class="font-label-sm text-label-sm text-on-surface-variant">${formatCOP(item.price)}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  setStyleFilter(style) {
    this.currentStyle = style;
    document.querySelectorAll('.style-chip').forEach(btn => {
      if (btn.getAttribute('data-style') === style) {
        btn.classList.add('bg-primary', 'text-on-primary');
        btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
      } else {
        btn.classList.remove('bg-primary', 'text-on-primary');
        btn.classList.add('bg-surface-container', 'text-on-surface-variant');
      }
    });
    this.renderRecommendations();
  }

  // --- REVIEWS LOGIC (With Image Support) ---
  renderReviews() {
    const list = document.getElementById('reviews-list');
    if (!list) return;

    list.innerHTML = LUXE_DATA.reviews.map(rev => {
      const quote = rev.quote || rev.quoteES;
      const purchase = rev.purchase || rev.purchaseES;

      return `
        <div class="flex flex-col luxury-card">
          <div class="flex items-center gap-stack-md mb-stack-md">
            <div class="w-14 h-14 rounded-full overflow-hidden bg-surface-container-highest border border-outline-variant/40">
              <img class="w-full h-full object-cover" src="${rev.avatar}" alt="${rev.name}"/>
            </div>
            <div>
              <h4 class="font-body-md text-body-md font-semibold text-on-surface">${rev.name}</h4>
              <div class="flex text-primary-container text-sm">
                ${Array(rev.rating).fill('<span class="material-symbols-outlined text-xs" style="font-variation-settings: \'FILL\' 1;">star</span>').join('')}
              </div>
            </div>
          </div>
          <p class="font-headline-md text-headline-md italic text-on-surface leading-tight mb-stack-sm">${quote}</p>
          ${rev.image ? `
            <div class="my-3 max-w-xs overflow-hidden rounded-lg shadow-sm border border-outline-variant/30">
              <img src="${rev.image}" alt="Foto de la pieza de ${rev.name}" class="w-full h-48 object-cover hover:scale-105 transition-transform"/>
            </div>
          ` : ''}
          <p class="font-body-md text-body-md text-on-surface-variant">Compra Verificada: <span class="underline">${purchase}</span></p>
        </div>
      `;
    }).join('');
  }

  openReviewModal() {
    document.getElementById('review-modal-backdrop').classList.remove('opacity-0', 'invisible');
  }

  closeReviewModal() {
    document.getElementById('review-modal-backdrop').classList.add('opacity-0', 'invisible');
  }

  setReviewRating(rating) {
    this.selectedRating = rating;
    const stars = document.querySelectorAll('#star-rating-select .star-select');
    stars.forEach((star, idx) => {
      if (idx < rating) {
        star.style.fontVariationSettings = "'FILL' 1";
      } else {
        star.style.fontVariationSettings = "'FILL' 0";
      }
    });
  }

  handleReviewSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('rev-name').value;
    const piece = document.getElementById('rev-piece').value;
    const comment = document.getElementById('rev-comment').value;
    const image = document.getElementById('rev-image')?.value || null;

    LUXE_DATA.reviews.unshift({
      id: `rev-${Date.now()}`,
      name: name,
      rating: this.selectedRating,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQM-eXVGx_IyuYviWu3lTHArwtjXPShm2rP055rm6yw81rxksg1qZXU7ZSE3grOonTpBlWhzLYoh91xmVNProRk2xHoDtzrhdFxlT7dekvbgGtjhsR2Lq8QKbjIXz6BnuzqVIOXbL4WP_G6CFLWIx9tV-gE9Zthxmvcu2JOBb7LDZ1SW4JNGx8_oS2m57qzC6pUNfcLU2TMbdVGqDmxpHq_xYfYwZruw21I1bEzZpKbP-k7hhb1CxO7r_n_m9kRAzgFIGZC3T2jPl-",
      quote: `"${comment}"`,
      purchase: piece,
      image: image && image.trim().length > 0 ? image.trim() : null
    });

    this.saveStateToLocalStorage();
    this.closeReviewModal();
    this.renderReviews();
    this.renderAdminPanel();
    this.showToast("Reseña publicada con éxito", 'grade');
    e.target.reset();
  }

  // --- PRODUCT QUICK VIEW MODAL ---
  openProductModal(id) {
    const product = LUXE_DATA.products.find(p => p.id === id);
    if (!product) return;

    const name = product.name || product.nameES;
    const desc = product.description || product.descriptionES;

    document.getElementById('modal-product-img').src = product.image;
    document.getElementById('modal-product-title').innerText = name;
    document.getElementById('modal-product-desc').innerText = desc;
    document.getElementById('modal-product-price').innerText = formatCOP(product.price);

    const addBtn = document.getElementById('modal-add-btn');
    addBtn.onclick = () => {
      this.addToCart(product.id, name, product.price, product.image);
      this.closeProductModal();
    };

    document.getElementById('product-modal-backdrop').classList.remove('opacity-0', 'invisible');
  }

  closeProductModal() {
    document.getElementById('product-modal-backdrop').classList.add('opacity-0', 'invisible');
  }

  // --- CART / SHOPPING BAG LOGIC ---
  addToCart(id, nameOverride, priceOverride, imageOverride) {
    let item = this.cart.find(i => i.id === id);
    if (item) {
      item.quantity += 1;
    } else {
      const prod = LUXE_DATA.products.find(p => p.id === id);
      const title = nameOverride || prod?.name || prod?.nameES || "Pieza de Alta Joyería";
      const price = priceOverride || prod?.price || 5000000;
      const img = imageOverride || prod?.image || "";

      this.cart.push({ id, title, price, image: img, quantity: 1 });
    }

    this.renderCart();
    this.showToast("Pieza agregada a la bolsa", 'shopping_bag');
    this.toggleCartDrawer(true);
  }

  updateCartQuantity(id, delta) {
    let item = this.cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.cart = this.cart.filter(i => i.id !== id);
    }

    this.renderCart();
  }

  toggleCartDrawer(show) {
    const backdrop = document.getElementById('cart-drawer-backdrop');
    const drawer = document.getElementById('cart-drawer');

    if (show) {
      backdrop.classList.remove('opacity-0', 'invisible');
      drawer.classList.remove('translate-x-full');
    } else {
      backdrop.classList.add('opacity-0', 'invisible');
      drawer.classList.add('translate-x-full');
    }
  }

  renderCart() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-badge');
    const subtotalEl = document.getElementById('cart-subtotal');

    const totalCount = this.cart.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = this.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    if (badge) {
      badge.innerText = totalCount;
      badge.classList.toggle('hidden', totalCount === 0);
    }

    if (subtotalEl) {
      subtotalEl.innerText = formatCOP(subtotal);
    }

    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center text-center text-on-surface-variant py-12">
          <span class="material-symbols-outlined text-6xl text-outline-variant mb-4">shopping_bag</span>
          <p class="font-headline-md text-lg">Su bolsa de compras está vacía.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.cart.map(item => `
      <div class="flex items-center gap-4 border-b border-outline-variant/20 pb-4">
        <img class="w-16 h-16 object-cover rounded bg-surface-container" src="${item.image}" alt="${item.title}"/>
        <div class="flex-grow">
          <h4 class="font-body-md font-semibold text-on-surface text-sm">${item.title}</h4>
          <span class="text-primary font-label-sm font-semibold text-xs">${formatCOP(item.price)}</span>
          <div class="flex items-center gap-2 mt-2">
            <button onclick="app.updateCartQuantity('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center border border-outline-variant rounded text-xs">-</button>
            <span class="text-xs font-semibold px-2">${item.quantity}</span>
            <button onclick="app.updateCartQuantity('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center border border-outline-variant rounded text-xs">+</button>
          </div>
        </div>
        <button onclick="app.updateCartQuantity('${item.id}', -${item.quantity})" class="text-outline-variant hover:text-error">
          <span class="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
    `).join('');
  }

  checkout() {
    if (this.cart.length === 0) return;
    this.openCheckoutModal();
  }

  openCheckoutModal() {
    const total = this.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const summaryEl = document.getElementById('checkout-items-summary');
    if (summaryEl) {
      summaryEl.innerHTML = this.cart.map(item => `
        <div class="flex justify-between text-xs py-1 border-b border-outline-variant/10 last:border-0">
          <span class="text-on-surface font-medium">${item.title} <span class="text-on-surface-variant font-normal">x${item.quantity}</span></span>
          <span class="text-primary font-semibold">${formatCOP(item.price * item.quantity)}</span>
        </div>
      `).join('');
    }
    const totalDisplay = document.getElementById('checkout-total-display');
    if (totalDisplay) totalDisplay.innerText = formatCOP(total);

    // Auto-fill form if customer is logged in
    const u = LUXE_DATA.currentUser;
    if (u) {
      if (document.getElementById('checkout-name')) document.getElementById('checkout-name').value = u.name;
      if (document.getElementById('checkout-email')) document.getElementById('checkout-email').value = u.email;
      if (document.getElementById('checkout-phone')) document.getElementById('checkout-phone').value = u.phone || '';
      if (document.getElementById('checkout-address')) document.getElementById('checkout-address').value = u.address || '';
    } else {
      ['checkout-name','checkout-email','checkout-phone','checkout-address'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    }

    document.getElementById('checkout-modal-backdrop').classList.remove('opacity-0', 'invisible');
  }

  closeCheckoutModal() {
    document.getElementById('checkout-modal-backdrop').classList.add('opacity-0', 'invisible');
  }

  handleCheckoutSubmit(e) {
    e.preventDefault();
    const name    = document.getElementById('checkout-name').value;
    const email   = document.getElementById('checkout-email').value;
    const phone   = document.getElementById('checkout-phone').value;
    const address = document.getElementById('checkout-address').value;
    const total   = this.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      date: formattedDate,
      name,
      email,
      phone,
      address,
      items: this.cart.map(i => ({ title: i.title, price: i.price, quantity: i.quantity })),
      total,
      status: 'Pendiente',
      notificationSent: false
    };

    if (!LUXE_DATA.orders) LUXE_DATA.orders = [];
    LUXE_DATA.orders.unshift(newOrder);
    this.saveStateToLocalStorage();

    // Clear cart & close modals
    this.closeCheckoutModal();
    this.toggleCartDrawer(false);
    this.cart = [];
    this.renderCart();
    this.renderAdminPanel();

    // Show simulated confirmation email sent to customer
    this.showEmailNotificationModal(newOrder, 'confirmacion');
    this.showToast("¡Pedido registrado exitosamente!", 'check_circle');
  }

  // --- CUSTOMER ACCOUNTS LOGIC ---
  openUserAccountModal() {
    this.renderUserAccountModal();
    document.getElementById('user-account-modal-backdrop').classList.remove('opacity-0', 'invisible');
  }

  closeUserAccountModal() {
    document.getElementById('user-account-modal-backdrop').classList.add('opacity-0', 'invisible');
  }

  renderUserAccountModal() {
    const loggedInView = document.getElementById('user-logged-in-view');
    const loginView = document.getElementById('user-login-view');
    const registerView = document.getElementById('user-register-view');

    if (LUXE_DATA.currentUser) {
      const u = LUXE_DATA.currentUser;
      loggedInView.classList.remove('hidden');
      loginView.classList.add('hidden');
      registerView.classList.add('hidden');

      document.getElementById('user-avatar-initial').innerText = u.name.charAt(0).toUpperCase();
      document.getElementById('user-profile-name').innerText = u.name;
      document.getElementById('user-profile-email').innerText = u.email;

      // Customer's order history
      const userOrders = (LUXE_DATA.orders || []).filter(o => o.email.toLowerCase() === u.email.toLowerCase());
      const historyContainer = document.getElementById('user-orders-history');
      if (userOrders.length === 0) {
        historyContainer.innerHTML = `<p class="text-xs text-on-surface-variant py-4 text-center">Aún no has realizado pedidos.</p>`;
      } else {
        historyContainer.innerHTML = userOrders.map(o => `
          <div class="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20 flex flex-col gap-1 text-xs">
            <div class="flex justify-between font-semibold">
              <span>Pedido #${o.id}</span>
              <span class="text-primary">${o.status}</span>
            </div>
            <p class="text-on-surface-variant text-[11px]">${o.date} • Total: ${formatCOP(o.total)}</p>
            <div class="text-on-surface opacity-80">${o.items.map(i => `${i.title} (x${i.quantity})`).join(', ')}</div>
          </div>
        `).join('');
      }
    } else {
      loggedInView.classList.add('hidden');
      loginView.classList.remove('hidden');
      registerView.classList.add('hidden');
    }
  }

  showRegisterForm() {
    document.getElementById('user-login-view').classList.add('hidden');
    document.getElementById('user-register-view').classList.remove('hidden');
  }

  showLoginForm() {
    document.getElementById('user-register-view').classList.add('hidden');
    document.getElementById('user-login-view').classList.remove('hidden');
  }

  handleUserLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('user-login-email').value.trim().toLowerCase();
    const pass = document.getElementById('user-login-password').value;

    const u = LUXE_DATA.users.find(user => user.email.toLowerCase() === email && user.password === pass);
    if (u) {
      LUXE_DATA.currentUser = u;
      this.saveStateToLocalStorage();
      this.updateUserProfileButton();
      this.renderUserAccountModal();
      this.showToast(`¡Bienvenida(o), ${u.name.split(' ')[0]}!`, 'person');
    } else {
      alert("Correo o contraseña incorrectos. (Prueba: maria.gomez@email.com / user123)");
    }
  }

  handleUserRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const phone = document.getElementById('reg-phone').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const password = document.getElementById('reg-password').value;

    if (LUXE_DATA.users.some(u => u.email.toLowerCase() === email)) {
      alert("Ya existe una cuenta con este correo electrónico.");
      return;
    }

    const newUser = { id: `usr-${Date.now()}`, name, email, phone, address, password };
    LUXE_DATA.users.push(newUser);
    LUXE_DATA.currentUser = newUser;
    this.saveStateToLocalStorage();

    this.updateUserProfileButton();
    this.renderUserAccountModal();
    this.showToast(`¡Cuenta creada con éxito! Bienvenido(a) ${name}`, 'check_circle');
  }

  logoutUser() {
    LUXE_DATA.currentUser = null;
    this.saveStateToLocalStorage();
    this.updateUserProfileButton();
    this.renderUserAccountModal();
    this.showToast("Sesión cerrada", "logout");
  }

  updateUserProfileButton() {
    const btnLabel = document.getElementById('user-account-label');
    if (!btnLabel) return;
    if (LUXE_DATA.currentUser) {
      btnLabel.innerText = LUXE_DATA.currentUser.name.split(' ')[0];
    } else {
      btnLabel.innerText = "Mi Cuenta";
    }
  }

  // --- EMAIL NOTIFICATION MODAL ---
  showEmailNotificationModal(order, type = 'confirmacion') {
    const toEl = document.getElementById('email-preview-to');
    const subjEl = document.getElementById('email-preview-subject');
    const bodyEl = document.getElementById('email-preview-body');

    if (toEl) toEl.innerText = `${order.name} <${order.email}>`;

    const statusSubject = {
      'confirmacion': `Confirmación de Pedido #${order.id} - Atelier Luxe Vault`,
      'Confirmado': `¡Su pedido #${order.id} ha sido Confirmado! - Atelier Luxe Vault`,
      'Entregado': `Su pedido #${order.id} ha sido Entregado - Atelier Luxe Vault`,
      'Cancelado': `Actualización de Estado de Pedido #${order.id} - Atelier Luxe Vault`
    }[type] || `Notificación de Pedido #${order.id} - Atelier Luxe Vault`;

    if (subjEl) subjEl.innerText = statusSubject;

    const itemsSummaryHtml = order.items.map(i => `• ${i.title} (x${i.quantity}) - ${formatCOP(i.price * i.quantity)}`).join('<br/>');

    if (bodyEl) {
      bodyEl.innerHTML = `
        <p>Estimado(a) <strong>${order.name}</strong>,</p>
        <p>Nos complace informarle que el estado de su solicitud de alta joyería <strong>#${order.id}</strong> es: <span class="text-primary font-bold uppercase">${order.status}</span>.</p>
        <div class="bg-surface p-3 rounded border border-outline-variant/20 my-2">
          <p class="font-semibold text-on-surface">Resumen de la Orden:</p>
          <p class="mt-1">${itemsSummaryHtml}</p>
          <p class="mt-2 font-bold text-primary">Total: ${formatCOP(order.total)}</p>
        </div>
        <p><strong>Dirección de entrega:</strong> ${order.address}</p>
        <p>Agradecemos su confianza en Atelier Luxe Vault. Si requiere asistencia personalizada, contáctenos al ${LUXE_DATA.settings.phone}.</p>
      `;
    }

    document.getElementById('email-modal-backdrop').classList.remove('opacity-0', 'invisible');
  }

  closeEmailModal() {
    document.getElementById('email-modal-backdrop').classList.add('opacity-0', 'invisible');
  }

  // --- COUNTDOWN TIMER ---
  initCountdown() {
    let h = 8, m = 42, s = 15;
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    if (!hEl || !mEl || !sEl) return;

    setInterval(() => {
      s--;
      if (s < 0) { s = 59; m--; }
      if (m < 0) { m = 59; h--; }
      if (h < 0) { h = 0; m = 0; s = 0; }

      hEl.textContent = h.toString().padStart(2, '0');
      mEl.textContent = m.toString().padStart(2, '0');
      sEl.textContent = s.toString().padStart(2, '0');
    }, 1000);
  }

  // --- MAP INIT (Florencia, Caquetá) ---
  initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || typeof L === 'undefined') return;

    const lat = 1.6144;
    const lng = -75.6062;

    this.leafletMap = L.map('map', {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(this.leafletMap);

    const goldIcon = L.divIcon({
      className: 'custom-gold-marker',
      html: `<div style="background: #735c00; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #ffe088; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    L.marker([lat, lng], { icon: goldIcon })
      .addTo(this.leafletMap)
      .bindPopup('<b>Luxe Vault Boutique</b><br>Calle de la Alhaja, Centro Histórico<br>Florencia, Caquetá')
      .openPopup();
  }

  // --- FORM HANDLERS ---
  handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

    LUXE_DATA.complaints.unshift({
      id: `msg-${Date.now()}`,
      date: formattedDate,
      name: name,
      subject: subject,
      message: message,
      status: "Pendiente"
    });

    this.saveStateToLocalStorage();
    this.renderAdminPanel();

    const btn = document.getElementById('contact-submit-btn');
    const originalText = btn.innerHTML;
    btn.innerText = 'Entregado...';
    btn.classList.add('bg-on-primary-fixed-variant');

    setTimeout(() => {
      btn.innerText = 'Gracias';
      e.target.reset();
      this.showToast('Mensaje enviado a Conserjería', 'mail');

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-on-primary-fixed-variant');
      }, 2000);
    }, 1000);
  }

  handleNewsletterSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('newsletter-email');
    if (input) input.value = '';
    this.showToast('Suscripción confirmada', 'mark_email_read');
  }

  // --- BOUTIQUE DISPLAY SETTINGS ---
  updateBoutiqueDisplaySettings() {
    const s = LUXE_DATA.settings;
    if (!s) return;

    const phoneEl = document.getElementById('display-phone');
    if (phoneEl) {
      phoneEl.innerText = s.phone;
      phoneEl.href = `tel:${s.phone.replace(/\s+/g, '')}`;
    }

    const emailEl = document.getElementById('display-email');
    if (emailEl) {
      emailEl.innerText = s.email;
      emailEl.href = `mailto:${s.email}`;
    }

    const addrEl = document.getElementById('display-address');
    if (addrEl) {
      addrEl.innerText = s.address;
    }

    const hMF = document.getElementById('display-hours-mf');
    if (hMF) hMF.innerText = s.hoursMonFri;

    const hSS = document.getElementById('display-hours-ss');
    if (hSS) hSS.innerText = s.hoursSatSun;
  }

  // =========================================================================
  // --- ADMIN PORTAL & CMS LOGIC ---
  // =========================================================================

  handleAdminPortalClick() {
    if (this.isAdminLoggedIn) {
      this.switchTab('admin');
    } else {
      this.openAdminLoginModal();
    }
  }

  openAdminLoginModal() {
    document.getElementById('admin-login-modal-backdrop').classList.remove('opacity-0', 'invisible');
  }

  closeAdminLoginModal() {
    document.getElementById('admin-login-modal-backdrop').classList.add('opacity-0', 'invisible');
  }

  handleAdminLoginSubmit(e) {
    e.preventDefault();
    const user = document.getElementById('admin-username').value;
    const pass = document.getElementById('admin-password').value;

    if (user === LUXE_DATA.admin.username && pass === LUXE_DATA.admin.password) {
      this.loginAdminSuccess();
    } else {
      alert("Credenciales incorrectas. (Intente usuario: admin / contraseña: admin123)");
    }
  }

  quickDemoLogin() {
    this.loginAdminSuccess();
  }

  loginAdminSuccess() {
    this.isAdminLoggedIn = true;
    this.closeAdminLoginModal();
    document.getElementById('admin-trigger-btn').classList.remove('text-outline/40');
    document.getElementById('admin-trigger-btn').classList.add('text-primary');
    this.switchTab('admin');
    this.showToast("Modo Administración Activado", "shield_person");
  }

  logoutAdmin() {
    this.isAdminLoggedIn = false;
    document.getElementById('admin-trigger-btn').classList.add('text-outline/40');
    document.getElementById('admin-trigger-btn').classList.remove('text-primary');
    this.switchTab('products');
    this.showToast("Sesión de Administración Finalizada", "logout");
  }

  switchAdminSubtab(subtab) {
    this.currentAdminSubtab = subtab;
    document.querySelectorAll('.admin-subpanel').forEach(panel => panel.classList.add('hidden'));

    const targetPanel = document.getElementById(`admin-panel-${subtab}`);
    if (targetPanel) targetPanel.classList.remove('hidden');

    const buttons = ['products', 'orders', 'complaints', 'reviews', 'settings'];
    buttons.forEach(b => {
      const btn = document.getElementById(`admin-subtab-${b}`);
      if (!btn) return;
      if (b === subtab) {
        btn.classList.add('bg-primary', 'text-on-primary', 'font-semibold');
        btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
      } else {
        btn.classList.remove('bg-primary', 'text-on-primary', 'font-semibold');
        btn.classList.add('bg-surface-container', 'text-on-surface-variant');
      }
    });
  }

  renderAdminPanel() {
    this.renderAdminProductsTable();
    this.renderAdminOrders();
    this.renderAdminComplaintsInbox();
    this.renderAdminReviews();
    this.renderAdminSettingsForm();
  }

  // 1. Admin Products Table
  renderAdminProductsTable() {
    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;

    tbody.innerHTML = LUXE_DATA.products.map(p => `
      <tr class="border-b border-outline-variant/20 hover:bg-surface-container-high/40 transition-colors">
        <td class="p-3">
          <img class="w-12 h-12 object-cover rounded bg-surface-container" src="${p.image}" alt="${p.name || p.nameES}"/>
        </td>
        <td class="p-3 font-semibold text-on-surface">
          ${p.name || p.nameES}
        </td>
        <td class="p-3 text-xs uppercase text-primary font-semibold">${p.category}</td>
        <td class="p-3 font-semibold">${formatCOP(p.price)}</td>
        <td class="p-3 text-right space-x-2">
          <button onclick="app.openEditProductModal('${p.id}')" class="text-primary hover:underline text-xs font-label-sm uppercase">Editar</button>
          <button onclick="app.deleteProduct('${p.id}')" class="text-error hover:underline text-xs font-label-sm uppercase">Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  openEditProductModal(id = null) {
    const titleEl = document.getElementById('product-edit-modal-title');

    if (id) {
      const p = LUXE_DATA.products.find(item => item.id === id);
      if (!p) return;

      titleEl.innerText = "Editar Producto";
      document.getElementById('edit-prod-id').value = p.id;
      document.getElementById('edit-prod-name').value = p.name || p.nameES;
      document.getElementById('edit-prod-category').value = p.category;
      document.getElementById('edit-prod-price').value = p.price;
      document.getElementById('edit-prod-image').value = p.image;
      document.getElementById('edit-prod-desc').value = p.description || p.descriptionES;
    } else {
      titleEl.innerText = "Agregar Nuevo Producto";
      document.getElementById('edit-prod-id').value = '';
      document.getElementById('edit-prod-name').value = '';
      document.getElementById('edit-prod-category').value = 'rings';
      document.getElementById('edit-prod-price').value = '5000000';
      document.getElementById('edit-prod-image').value = 'https://lh3.googleusercontent.com/aida-public/AB6AXuASi_E2EAR_BQQuvZJwc3b153KYwZMh5jnzcjdULh8kq9deC7hSAUSv8TU_jMZK-ubztnwTXlma3CwXA3JwYko_fsCp6JZrUG515z8OlckeSTi9Hz0edT5weR7QjD5YOP6pmfm6sFCti7IHDKy8DKCIT6lWXyDApCT57aLXEojVSEJtLhtr_-8T2jzMAp2kg6x9VZUE1ycmwMmlRXUvB4nPlB4jgbyB_Xkp1AqOPM5Qil-9F8t7DQU5TqiLXazedQeIwPRpQAXMfTSw';
      document.getElementById('edit-prod-desc').value = 'Pieza de alta joyería de diseño exclusivo.';
    }

    document.getElementById('product-edit-modal-backdrop').classList.remove('opacity-0', 'invisible');
  }

  closeProductEditModal() {
    document.getElementById('product-edit-modal-backdrop').classList.add('opacity-0', 'invisible');
  }

  handleSaveProductSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('edit-prod-id').value;
    const name = document.getElementById('edit-prod-name').value;
    const category = document.getElementById('edit-prod-category').value;
    const price = parseFloat(document.getElementById('edit-prod-price').value);
    const image = document.getElementById('edit-prod-image').value;
    const desc = document.getElementById('edit-prod-desc').value;

    if (id) {
      let prod = LUXE_DATA.products.find(p => p.id === id);
      if (prod) {
        prod.name = name;
        prod.category = category;
        prod.price = price;
        prod.image = image;
        prod.description = desc;
      }
    } else {
      LUXE_DATA.products.unshift({
        id: `prod-${Date.now()}`,
        name,
        category,
        price,
        originalPrice: null,
        featured: false,
        image,
        description: desc
      });
    }

    this.saveStateToLocalStorage();
    this.closeProductEditModal();
    this.renderAll();
    this.showToast(id ? "Producto actualizado" : "Nuevo producto guardado", "inventory");
  }

  deleteProduct(id) {
    if (!confirm("¿Está seguro de que desea eliminar este producto del catálogo?")) return;
    LUXE_DATA.products = LUXE_DATA.products.filter(p => p.id !== id);
    this.saveStateToLocalStorage();
    this.renderAll();
    this.showToast("Producto eliminado", "delete");
  }

  // 2. Admin Orders Panel
  renderAdminOrders(filterStatus = 'all') {
    const orders = LUXE_DATA.orders || [];
    const list = document.getElementById('admin-orders-list');
    const badge = document.getElementById('admin-orders-badge');
    const statTotal = document.getElementById('stat-total-orders');
    const statPending = document.getElementById('stat-pending-orders');
    const statRevenue = document.getElementById('stat-revenue');

    const pending = orders.filter(o => o.status === 'Pendiente').length;
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    if (statTotal) statTotal.innerText = orders.length;
    if (statPending) statPending.innerText = pending;
    if (statRevenue) statRevenue.innerText = formatCOP(revenue);
    if (badge) badge.innerText = orders.length;

    if (!list) return;

    const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

    if (filtered.length === 0) {
      list.innerHTML = `<div class="p-10 text-center text-on-surface-variant">
        <span class="material-symbols-outlined text-4xl opacity-30 mb-2 block">inventory_2</span>
        <p class="text-sm">No hay pedidos en esta categoría.</p>
      </div>`;
      return;
    }

    list.innerHTML = filtered.map(order => {
      const statusColor = {
        'Pendiente': 'bg-amber-100 text-amber-800 border-amber-200',
        'Confirmado': 'bg-blue-100 text-blue-800 border-blue-200',
        'Entregado': 'bg-green-100 text-green-800 border-green-200',
        'Cancelado': 'bg-red-100 text-red-800 border-red-200'
      }[order.status] || 'bg-surface-container text-on-surface-variant';

      const itemsList = order.items.map(it =>
        `<span class="inline-block bg-surface-container px-2 py-0.5 rounded text-[10px] text-on-surface-variant mr-1 mb-1">${it.title} x${it.quantity}</span>`
      ).join('');

      return `
        <div class="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
          <!-- Order Header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20 bg-surface-container/60">
            <div class="flex items-center gap-2">
              <span class="font-label-sm text-[10px] text-on-surface-variant uppercase">#${order.id}</span>
              <span class="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span class="font-label-sm text-[10px] text-on-surface-variant">${order.date}</span>
            </div>
            <span class="px-2.5 py-0.5 text-[10px] font-semibold font-label-sm uppercase rounded-full border ${statusColor}">${order.status}</span>
          </div>

          <!-- Customer Info -->
          <div class="grid grid-cols-2 gap-x-6 gap-y-2 px-4 py-3 border-b border-outline-variant/10">
            <div>
              <p class="font-label-sm text-[9px] text-on-surface-variant uppercase">Cliente</p>
              <p class="font-semibold text-sm text-on-surface">${order.name}</p>
            </div>
            <div>
              <p class="font-label-sm text-[9px] text-on-surface-variant uppercase">Teléfono</p>
              <a href="tel:${order.phone}" class="text-sm text-primary hover:underline">${order.phone}</a>
            </div>
            <div>
              <p class="font-label-sm text-[9px] text-on-surface-variant uppercase">Correo</p>
              <a href="mailto:${order.email}" class="text-sm text-primary hover:underline truncate block">${order.email}</a>
            </div>
            <div>
              <p class="font-label-sm text-[9px] text-on-surface-variant uppercase">Dirección</p>
              <p class="text-sm text-on-surface">${order.address}</p>
            </div>
          </div>

          <!-- Items & Total -->
          <div class="px-4 py-3 flex items-center justify-between gap-4">
            <div class="flex-grow">
              <p class="font-label-sm text-[9px] text-on-surface-variant uppercase mb-1">Productos solicitados</p>
              <div>${itemsList}</div>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="font-label-sm text-[9px] text-on-surface-variant uppercase">Total</p>
              <p class="font-headline-md text-lg text-primary font-bold">${formatCOP(order.total)}</p>
            </div>
          </div>

          <!-- Action Bar -->
          <div class="px-4 py-2.5 bg-surface-container/50 flex items-center justify-between gap-3 border-t border-outline-variant/20">
            <button onclick="app.sendOrderEmailNotification('${order.id}')" class="flex items-center gap-1 text-[10px] font-label-sm uppercase text-primary border border-primary/30 px-2.5 py-1 rounded hover:bg-primary-fixed/40 transition-colors">
              <span class="material-symbols-outlined text-[14px]">mail</span>
              Enviar Notificación por Correo
            </button>
            <div class="flex items-center gap-2">
              <select onchange="app.updateOrderStatus('${order.id}', this.value)" class="text-[10px] font-label-sm uppercase bg-transparent border border-outline-variant/50 rounded px-2 py-1 text-on-surface focus:outline-none cursor-pointer">
                <option value="Pendiente" ${order.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                <option value="Confirmado" ${order.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                <option value="Entregado" ${order.status === 'Entregado' ? 'selected' : ''}>Entregado</option>
                <option value="Cancelado" ${order.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
              </select>
              <button onclick="app.deleteOrder('${order.id}')" class="text-[10px] font-label-sm uppercase text-error border border-error/30 px-2 py-1 rounded hover:bg-error/10">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  sendOrderEmailNotification(orderId) {
    const order = (LUXE_DATA.orders || []).find(o => o.id === orderId);
    if (!order) return;
    order.notificationSent = true;
    this.saveStateToLocalStorage();
    this.showEmailNotificationModal(order, order.status);
  }

  filterOrders(status) {
    document.querySelectorAll('.order-filter-btn').forEach(btn => {
      if (btn.getAttribute('data-filter') === status) {
        btn.classList.add('bg-primary', 'text-on-primary');
        btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
      } else {
        btn.classList.remove('bg-primary', 'text-on-primary');
        btn.classList.add('bg-surface-container', 'text-on-surface-variant');
      }
    });
    this.renderAdminOrders(status);
  }

  updateOrderStatus(id, newStatus) {
    const order = (LUXE_DATA.orders || []).find(o => o.id === id);
    if (!order) return;
    order.status = newStatus;
    order.notificationSent = true;
    this.saveStateToLocalStorage();
    this.renderAdminOrders();
    // Show email preview notification sent to client automatically
    this.showEmailNotificationModal(order, newStatus);
    this.showToast(`Estado cambiado a: ${newStatus}`, 'package_2');
  }

  deleteOrder(id) {
    if (!confirm('¿Eliminar este pedido del registro?')) return;
    LUXE_DATA.orders = (LUXE_DATA.orders || []).filter(o => o.id !== id);
    this.saveStateToLocalStorage();
    this.renderAdminOrders();
    this.showToast('Pedido eliminado', 'delete');
  }

  // 3. Admin Complaints Inbox
  renderAdminComplaintsInbox() {
    const list = document.getElementById('admin-complaints-list');
    const count = document.getElementById('admin-inbox-count');
    if (!list) return;

    if (count) count.innerText = `${LUXE_DATA.complaints.length} Mensaje(s)`;

    if (LUXE_DATA.complaints.length === 0) {
      list.innerHTML = `<div class="p-8 text-center text-on-surface-variant">Buzón de entrada vacío.</div>`;
      return;
    }

    list.innerHTML = LUXE_DATA.complaints.map(msg => `
      <div class="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 text-[10px] font-label-sm uppercase rounded ${msg.status === 'Resuelto' ? 'bg-green-100 text-green-800' : 'bg-primary-fixed text-primary'}">${msg.status}</span>
            <h4 class="font-body-md font-semibold text-on-surface">${msg.name}</h4>
          </div>
          <span class="text-xs text-on-surface-variant opacity-70">${msg.date}</span>
        </div>
        <p class="text-xs text-primary font-semibold">Asunto: ${msg.subject}</p>
        <p class="text-sm text-on-surface-variant leading-relaxed bg-surface/60 p-3 rounded border border-outline-variant/20">${msg.message}</p>
        <div class="flex items-center justify-end gap-3 mt-2">
          <button onclick="app.toggleComplaintStatus('${msg.id}')" class="text-xs font-label-sm uppercase text-primary underline">
            Marcar como ${msg.status === 'Resuelto' ? 'Pendiente' : 'Resuelto'}
          </button>
          <button onclick="app.deleteComplaint('${msg.id}')" class="text-xs font-label-sm uppercase text-error underline">
            Eliminar
          </button>
        </div>
      </div>
    `).join('');
  }

  toggleComplaintStatus(id) {
    let msg = LUXE_DATA.complaints.find(m => m.id === id);
    if (!msg) return;
    msg.status = msg.status === 'Resuelto' ? 'Pendiente' : 'Resuelto';
    this.saveStateToLocalStorage();
    this.renderAdminComplaintsInbox();
  }

  deleteComplaint(id) {
    LUXE_DATA.complaints = LUXE_DATA.complaints.filter(m => m.id !== id);
    this.saveStateToLocalStorage();
    this.renderAdminComplaintsInbox();
    this.showToast("Mensaje eliminado", "delete");
  }

  // 4. Admin Reviews Moderation
  renderAdminReviews() {
    const list = document.getElementById('admin-reviews-list');
    if (!list) return;

    list.innerHTML = LUXE_DATA.reviews.map(rev => `
      <div class="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <img class="w-10 h-10 rounded-full object-cover" src="${rev.avatar}" alt="${rev.name}"/>
          <div>
            <h5 class="font-semibold text-sm text-on-surface">${rev.name} (${rev.purchase})</h5>
            <p class="text-xs italic text-on-surface-variant">${rev.quote}</p>
          </div>
        </div>
        <button onclick="app.deleteReview('${rev.id}')" class="text-xs font-label-sm uppercase text-error border border-error/30 px-3 py-1 rounded hover:bg-error/10">
          Eliminar
        </button>
      </div>
    `).join('');
  }

  deleteReview(id) {
    LUXE_DATA.reviews = LUXE_DATA.reviews.filter(r => r.id !== id);
    this.saveStateToLocalStorage();
    this.renderReviews();
    this.renderAdminReviews();
    this.showToast("Reseña eliminada", "delete");
  }

  // 5. Admin Settings
  renderAdminSettingsForm() {
    const s = LUXE_DATA.settings;
    if (!s) return;
    document.getElementById('set-phone').value = s.phone;
    document.getElementById('set-email').value = s.email;
    document.getElementById('set-address').value = s.address;
    document.getElementById('set-hours-mf').value = s.hoursMonFri;
    document.getElementById('set-hours-ss').value = s.hoursSatSun;
  }

  handleSaveSettings(e) {
    e.preventDefault();
    LUXE_DATA.settings = {
      phone: document.getElementById('set-phone').value,
      email: document.getElementById('set-email').value,
      address: document.getElementById('set-address').value,
      hoursMonFri: document.getElementById('set-hours-mf').value,
      hoursSatSun: document.getElementById('set-hours-ss').value
    };

    this.saveStateToLocalStorage();
    this.updateBoutiqueDisplaySettings();
    this.showToast("Información de boutique actualizada", "store");
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, iconName = 'check_circle') {
    const toast = document.getElementById('toast-banner');
    const msg = document.getElementById('toast-message');
    const icon = document.getElementById('toast-icon');

    if (!toast) return;

    if (msg) msg.innerText = message;
    if (icon) icon.innerText = iconName;

    toast.classList.remove('opacity-0', 'invisible');
    toast.classList.add('toast-notice');

    setTimeout(() => {
      toast.classList.add('opacity-0', 'invisible');
      toast.classList.remove('toast-notice');
    }, 3000);
  }
}

// Initialize Application once DOM Content is Loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new LuxeApp();
});
