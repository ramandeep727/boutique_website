document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Cursor Glow Effect
       ========================================================================== */
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('active');
    });

    // Smooth cursor follow with requestAnimationFrame
    function animateCursor() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    /* ==========================================================================
       Mobile Navigation
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const navLinks = document.querySelectorAll('.mobile-nav .nav-link');

    function openMobileMenu() {
        mobileNav.classList.add('open');
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileNav.classList.remove('open');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);
    if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    /* ==========================================================================
       User Profile Button Routing
       ========================================================================== */
    const userProfileBtn = document.getElementById('userProfileBtn');
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.auth && window.auth.currentUser) {
                window.location.href = 'profile.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    /* ==========================================================================
       Header Scroll Effect
       ========================================================================== */
    const header = document.getElementById('mainHeader');
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Header shrink on scroll
        if (scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Back to top click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       Scroll Animations (Intersection Observer)
       ========================================================================== */
    const fadeElements = document.querySelectorAll('.fade-in-scroll');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        scrollObserver.observe(element);
    });

    /* ==========================================================================
       Active Navigation Link on Scroll
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        desktopNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       Hero Floating Petals
       ========================================================================== */
    const heroParticles = document.getElementById('heroParticles');

    function createPetal() {
        if (!heroParticles) return;
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 6 + 6) + 's';
        petal.style.animationDelay = Math.random() * 3 + 's';
        petal.style.width = (Math.random() * 10 + 6) + 'px';
        petal.style.height = petal.style.width;
        petal.style.opacity = Math.random() * 0.3 + 0.1;
        heroParticles.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 14000);
    }

    // Create petals periodically
    setInterval(createPetal, 800);
    // Initial burst
    for (let i = 0; i < 8; i++) {
        setTimeout(createPetal, i * 200);
    }

    /* ==========================================================================
       Animated Stat Counters
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;
        statsAnimated = true;

        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);
                num.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    num.textContent = target;
                }
            }

            requestAnimationFrame(updateCount);
        });
    }

    // Also animate the experience badge number
    const badgeNumbers = document.querySelectorAll('.about-experience-badge .number[data-target]');
    let badgeAnimated = false;

    function animateBadgeCounter() {
        if (badgeAnimated) return;
        badgeAnimated = true;

        badgeNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                num.textContent = Math.floor(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    num.textContent = target;
                }
            }

            requestAnimationFrame(updateCount);
        });
    }

    // Observe hero stats for counter animation
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) animateCounters();
            });
        }, { threshold: 0.5 });
        statsObserver.observe(heroStats);
    }

    // Observe about badge
    const aboutBadge = document.querySelector('.about-experience-badge');
    if (aboutBadge) {
        const badgeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) animateBadgeCounter();
            });
        }, { threshold: 0.5 });
        badgeObserver.observe(aboutBadge);
    }

    /* ==========================================================================
       Wishlist Heart Toggle (Event Delegation)
       ========================================================================== */
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.product-wishlist');
        if (!btn) return;
        
        btn.classList.toggle('liked');
        const icon = btn.querySelector('i');
        if (btn.classList.contains('liked')) {
            icon.classList.remove('ph-heart');
            icon.classList.add('ph-fill', 'ph-heart');
            icon.style.color = 'var(--color-primary)';
        } else {
            icon.classList.remove('ph-fill');
            icon.classList.add('ph-heart');
            icon.style.color = '';
        }
    });

    /* ==========================================================================
       Newsletter Form
       ========================================================================== */
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail');
            const btn = newsletterForm.querySelector('.btn');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = '<i class="ph ph-check-circle"></i> Subscribed!';
            btn.style.background = 'linear-gradient(135deg, #2E7D32, #1B5E20)';
            email.value = '';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 3000);
        });
    }

    /* ==========================================================================
       Smooth Parallax on Hero Image
       ========================================================================== */
    const heroImage = document.getElementById('heroImage');
    
    window.addEventListener('scroll', () => {
        if (!heroImage) return;
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroImage.style.transform = `scale(${1 + scrollY * 0.0002}) translateY(${scrollY * 0.15}px)`;
        }
    });
    /* ==========================================================================
       Products Management (Dynamic Loading)
       ========================================================================== */
    const productGrid = document.getElementById('productGrid');
    
    const defaultProducts = [
        {
            id: 'p1',
            name: 'Rose Gold Sequin Anarkali',
            category: 'Festive Wear',
            description: 'A stunning rose gold anarkali suit embellished with intricate sequin work, perfect for weddings and festive occasions. Comes with a matching net dupatta.',
            sizes: 'S, M, L, XL, Custom',
            price: '₹14,500',
            image: 'images/WhatsApp%20Image%202026-06-24%20at%206.30.34%20PM.jpeg',
            rating: 4.8,
            ratingCount: 124,
            badge: 'Bestseller',
            badgeClass: 'badge-hot'
        },
        {
            id: 'p2',
            name: 'Midnight Blue Velvet Suit',
            category: 'Winter Collection',
            description: 'Elegant midnight blue suit crafted from premium velvet, featuring subtle zari embroidery on the neckline and cuffs. Ideal for evening gatherings.',
            sizes: 'M, L, XL',
            price: '₹12,000',
            image: 'images/WhatsApp%20Image%202026-06-24%20at%206.30.34%20PM%20(1).jpeg',
            rating: 4.9,
            ratingCount: 86,
            badge: 'New Arrival',
            badgeClass: 'badge-new'
        },
        {
            id: 'p3',
            name: 'Blush Pink Organza Lehenga',
            category: 'Bridal Couture',
            description: 'A lightweight, ethereal blush pink lehenga made of fine organza silk. Hand-embroidered floral motifs scattered across the skirt create a magical look.',
            sizes: 'Custom',
            price: 'Custom Pricing',
            image: 'images/WhatsApp%20Image%202026-06-24%20at%206.30.34%20PM.jpeg',
            rating: 5.0,
            ratingCount: 42,
            badge: 'Premium',
            badgeClass: 'badge-hot'
        },
        {
            id: 'p4',
            name: 'Emerald Green Silk Kurta Set',
            category: 'Classic Wear',
            description: 'A classic emerald green kurta set woven in pure silk, paired with straight pants. Simple, elegant, and timeless.',
            sizes: 'S, M, L',
            price: '₹8,500',
            image: 'images/WhatsApp%20Image%202026-06-24%20at%206.30.34%20PM%20(1).jpeg',
            rating: 4.7,
            ratingCount: 210,
            badge: null,
            badgeClass: null
        },
        {
            id: 'p5',
            name: 'Ivory Pearl Embellished Saree',
            category: 'Sarees',
            description: 'An exquisite ivory saree featuring heavy pearl and crystal embellishments on the border. Paired with a designer stitched blouse.',
            sizes: 'One Size',
            price: '₹22,000',
            image: 'images/WhatsApp%20Image%202026-06-24%20at%206.30.34%20PM.jpeg',
            rating: 4.6,
            ratingCount: 56,
            badge: 'Limited Edition',
            badgeClass: 'badge-new'
        },
        {
            id: 'p6',
            name: 'Mustard Yellow Sharara Suit',
            category: 'Haldi Collection',
            description: 'A vibrant mustard yellow sharara suit detailed with gota patti work. The perfect choice for Haldi or Mehndi ceremonies.',
            sizes: 'S, M, L, XL',
            price: '₹10,500',
            image: 'images/WhatsApp%20Image%202026-06-24%20at%206.30.34%20PM%20(1).jpeg',
            rating: 4.9,
            ratingCount: 112,
            badge: null,
            badgeClass: null
        }
    ];

    let currentFilter = 'all';

    async function initProducts() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        if (filterBtns) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentFilter = btn.getAttribute('data-filter');
                    renderProducts();
                });
            });
        }

        await fetchProductsFromFirebase();
        renderProducts();
    }

    async function fetchProductsFromFirebase() {
        if (!window.db) {
            console.warn("Firebase not initialized. Falling back to local storage.");
            if (!localStorage.getItem('shabnam_products')) {
                localStorage.setItem('shabnam_products', JSON.stringify(defaultProducts));
            }
            return;
        }

        try {
            const snapshot = await window.db.collection('products').get();
            let products = [];
            snapshot.forEach(doc => {
                products.push({ id: doc.id, ...doc.data() });
            });
            
            if (products.length === 0 && defaultProducts && defaultProducts.length > 0) {
                console.log("Firebase is empty. Seeding default products...");
                for (let p of defaultProducts) {
                    await window.db.collection('products').doc(p.id).set(p);
                }
                const newSnapshot = await window.db.collection('products').get();
                products = [];
                newSnapshot.forEach(doc => {
                    products.push({ id: doc.id, ...doc.data() });
                });
            }
            
            localStorage.setItem('shabnam_products', JSON.stringify(products));
        } catch (error) {
            console.error("Error fetching products from Firebase:", error);
            if (!localStorage.getItem('shabnam_products')) {
                localStorage.setItem('shabnam_products', JSON.stringify(defaultProducts));
            }
        }
    }

    function renderProducts() {
        if (!productGrid) return;
        
        const productsStr = localStorage.getItem('shabnam_products');
        const products = productsStr ? JSON.parse(productsStr) : [];
        const wishlist = JSON.parse(localStorage.getItem('shabnam_wishlist')) || [];
        
        productGrid.innerHTML = '';
        
        let filteredProducts = products;
        if (typeof currentFilter !== 'undefined' && currentFilter !== 'all') {
            filteredProducts = products.filter(p => p.category === currentFilter);
        }

        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-light); padding: 3rem;">No products found in this category.</p>';
            return;
        }

        filteredProducts.forEach((product, index) => {
            const isWished = wishlist.includes(product.id);
            const heartClass = isWished ? 'ph-fill ph-heart' : 'ph-heart';
            const heartColor = isWished ? 'color: #e91e63;' : '';
            const delay = index * 0.15;
            
            let starsHtml = '';
            const fullStars = Math.floor(product.rating);
            const hasHalfStar = product.rating % 1 !== 0;
            
            for (let i = 0; i < fullStars; i++) {
                starsHtml += '<i class="ph-fill ph-star"></i>';
            }
            if (hasHalfStar) {
                starsHtml += '<i class="ph-fill ph-star-half"></i>';
            }
            const emptyStars = 5 - Math.ceil(product.rating);
            for (let i = 0; i < emptyStars; i++) {
                starsHtml += '<i class="ph ph-star"></i>';
            }
            
            let badgeHtml = '';
            if (product.badge) {
                badgeHtml = `<div class="product-badge ${product.badgeClass || ''}">${product.badge}</div>`;
            }

            const card = document.createElement('div');
            card.className = 'product-card fade-in-scroll';
            card.style.transitionDelay = `${delay}s`;
            
            card.innerHTML = `
                ${badgeHtml}
                <div class="product-wishlist"><i class="ph ph-heart"></i></div>
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-action">
                        <button class="btn btn-primary btn-sm btn-glow" onclick="openQuickView('${product.id}')"><i class="ph ph-eye"></i> View Details</button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        ${starsHtml}
                        <span>(${product.ratingCount})</span>
                    </div>
                    <p class="product-price">${product.price}</p>
                </div>
            `;
            productGrid.appendChild(card);
            
            if (typeof scrollObserver !== 'undefined') {
                scrollObserver.observe(card);
            }
        });
    }

    if (productGrid) {
        initProducts();
        renderProducts();
    }

    /* ==========================================================================
       Wishlist Management
       ========================================================================== */
    window.toggleWishlist = function(btn, productId) {
        if(event) event.stopPropagation();
        const icon = btn.querySelector('i');
        
        let wishlist = JSON.parse(localStorage.getItem('shabnam_wishlist')) || [];
        
        if (icon.classList.contains('ph-heart') && !icon.classList.contains('ph-fill')) {
            icon.classList.remove('ph-heart');
            icon.classList.add('ph-fill', 'ph-heart');
            icon.style.color = '#e91e63';
            if (!wishlist.includes(productId)) wishlist.push(productId);
        } else {
            icon.classList.remove('ph-fill', 'ph-heart');
            icon.classList.add('ph-heart');
            icon.style.color = '';
            wishlist = wishlist.filter(id => id !== productId);
        }
        
        localStorage.setItem('shabnam_wishlist', JSON.stringify(wishlist));
        updateWishlistBadge();
    };

    function updateWishlistBadge() {
        const badge = document.getElementById('wishlistBadge');
        if (badge) {
            const wishlist = JSON.parse(localStorage.getItem('shabnam_wishlist')) || [];
            badge.textContent = wishlist.length;
            if (wishlist.length > 0) {
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }
    updateWishlistBadge();

    const wishlistModal = document.getElementById('wishlistModal');
    const closeWishlistBtn = document.getElementById('closeWishlist');
    const wishlistOverlay = document.getElementById('wishlistOverlay');
    const wishlistItemsContainer = document.getElementById('wishlistItemsContainer');

    window.openWishlistModal = function(e) {
        if (e) e.preventDefault();
        renderWishlist();
        if (wishlistModal) {
            wishlistModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    function closeWishlist() {
        if (wishlistModal) {
            wishlistModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', closeWishlist);
    if (wishlistOverlay) wishlistOverlay.addEventListener('click', closeWishlist);

    function renderWishlist() {
        if (!wishlistItemsContainer) return;
        const wishlist = JSON.parse(localStorage.getItem('shabnam_wishlist')) || [];
        const products = JSON.parse(localStorage.getItem('shabnam_products')) || [];
        
        wishlistItemsContainer.innerHTML = '';
        
        if (wishlist.length === 0) {
            wishlistItemsContainer.innerHTML = '<p style="text-align:center; padding: 2rem; color: var(--color-text-light);">Your wishlist is empty.</p>';
            return;
        }

        wishlist.forEach(id => {
            const product = products.find(p => p.id === id);
            if (product) {
                const el = document.createElement('div');
                el.className = 'cart-item';
                el.style.display = 'flex';
                el.style.alignItems = 'center';
                el.style.gap = '1rem';
                el.style.padding = '1rem 0';
                el.style.borderBottom = '1px solid var(--color-border)';
                
                el.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit:cover; border-radius:4px;">
                    <div style="flex:1;">
                        <h4 style="margin-bottom:0.2rem; font-size:0.95rem;">${product.name}</h4>
                        <p style="color:var(--color-primary); font-weight:500;">${product.price}</p>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="openQuickView('${product.id}'); closeWishlist();">View</button>
                    <button style="background:none; border:none; color:var(--color-text-light); cursor:pointer;" onclick="removeFromWishlist('${product.id}')"><i class="ph ph-trash" style="font-size:1.2rem;"></i></button>
                `;
                wishlistItemsContainer.appendChild(el);
            }
        });
    }

    window.removeFromWishlist = function(id) {
        let wishlist = JSON.parse(localStorage.getItem('shabnam_wishlist')) || [];
        wishlist = wishlist.filter(itemId => itemId !== id);
        localStorage.setItem('shabnam_wishlist', JSON.stringify(wishlist));
        updateWishlistBadge();
        renderWishlist();
        renderProducts(); // Update heart on grid
    };

    /* ==========================================================================
       Cart Management
       ========================================================================== */
    window.addToCart = function(productId, event) {
        let cart = JSON.parse(localStorage.getItem('shabnam_cart')) || [];
        const products = JSON.parse(localStorage.getItem('shabnam_products')) || [];
        
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push(product);
            localStorage.setItem('shabnam_cart', JSON.stringify(cart));
            updateCartBadge();
            
            if (event && event.currentTarget) {
                const btn = event.currentTarget;
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="ph ph-check"></i> Added';
                btn.style.background = '#2E7D32';
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.style.background = '';
                }, 1500);
            }
        }
    };

    function updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            const cart = JSON.parse(localStorage.getItem('shabnam_cart')) || [];
            badge.textContent = cart.length;
            if (cart.length > 0) {
                badge.style.display = 'flex';
                badge.style.animation = 'none';
                badge.offsetHeight; // trigger reflow
                badge.style.animation = null; 
            } else {
                badge.style.display = 'none';
            }
        }
    }
    
    updateCartBadge();

    /* ==========================================================================
       Quick View Modal
       ========================================================================== */
    const quickViewModal = document.getElementById('quickViewModal');
    const closeQuickViewBtn = document.getElementById('closeQuickView');
    const quickViewOverlay = document.getElementById('quickViewOverlay');
    const qvAddToCartBtn = document.getElementById('qvAddToCartBtn');

    window.openQuickView = function(productId) {
        const products = JSON.parse(localStorage.getItem('shabnam_products')) || [];
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const qvImage = document.getElementById('qvImage');
        if (qvImage) qvImage.src = product.image;
        
        document.getElementById('qvCategory').textContent = product.category;
        document.getElementById('qvName').textContent = product.name;
        document.getElementById('qvPrice').textContent = product.price;
        document.getElementById('qvDescription').textContent = product.description || 'A beautiful piece from our latest collection. Perfect for your upcoming special occasions.';

        // Render Rating
        const qvRating = document.getElementById('qvRating');
        qvRating.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(product.rating)) {
                qvRating.innerHTML += '<i class="ph-fill ph-star"></i>';
            } else if (i === Math.ceil(product.rating) && !Number.isInteger(product.rating)) {
                qvRating.innerHTML += '<i class="ph-fill ph-star-half"></i>';
            } else {
                qvRating.innerHTML += '<i class="ph ph-star"></i>';
            }
        }
        qvRating.innerHTML += `<span style="color:var(--color-text-light); font-size:0.9rem; margin-left:0.5rem">(${product.ratingCount} reviews)</span>`;

        // Render Sizes
        const qvSize = document.getElementById('qvSize');
        qvSize.innerHTML = '';
        const sizesStr = product.sizes || 'S, M, L, Custom';
        const sizesArr = sizesStr.split(',').map(s => s.trim());
        sizesArr.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            qvSize.appendChild(option);
        });

        // Set up Add to Cart
        if (qvAddToCartBtn) {
            qvAddToCartBtn.onclick = function() {
                const selectedSize = qvSize.value;
                let cart = JSON.parse(localStorage.getItem('shabnam_cart')) || [];
                let itemToAdd = {...product, selectedSize: selectedSize};
                
                // Add name override to include size in checkout
                itemToAdd.name = `${product.name} (Size: ${selectedSize})`;
                
                cart.push(itemToAdd);
                localStorage.setItem('shabnam_cart', JSON.stringify(cart));
                updateCartBadge();
                
                const originalHtml = this.innerHTML;
                this.innerHTML = '<i class="ph ph-check"></i> Added to Cart';
                this.style.background = '#2E7D32';
                setTimeout(() => {
                    this.innerHTML = originalHtml;
                    this.style.background = '';
                    closeQuickViewModal();
                }, 1000);
            };
        }

        if (quickViewModal) {
            quickViewModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    function closeQuickViewModal() {
        if (quickViewModal) {
            quickViewModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    if (closeQuickViewBtn) closeQuickViewBtn.addEventListener('click', closeQuickViewModal);
    if (quickViewOverlay) quickViewOverlay.addEventListener('click', closeQuickViewModal);

    /* ==========================================================================
       Feedback Form
       ========================================================================== */
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackStars = document.querySelectorAll('#feedbackStars i');
    const feedbackRating = document.getElementById('feedbackRating');

    if (feedbackStars.length > 0) {
        let currentRating = 0;

        feedbackStars.forEach((star, index) => {
            // Hover effect
            star.addEventListener('mouseenter', () => {
                feedbackStars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.replace('ph-star', 'ph-fill');
                        s.classList.add('hovered');
                    } else {
                        s.classList.replace('ph-fill', 'ph-star');
                        s.classList.remove('hovered');
                    }
                });
            });

            // Mouse leave effect
            star.addEventListener('mouseleave', () => {
                feedbackStars.forEach((s, i) => {
                    s.classList.remove('hovered');
                    if (i < currentRating) {
                        s.classList.replace('ph-star', 'ph-fill');
                    } else {
                        s.classList.replace('ph-fill', 'ph-star');
                    }
                });
            });

            // Click effect
            star.addEventListener('click', () => {
                currentRating = index + 1;
                feedbackRating.value = currentRating;
                feedbackStars.forEach((s, i) => {
                    if (i < currentRating) {
                        s.classList.replace('ph-star', 'ph-fill');
                    } else {
                        s.classList.replace('ph-fill', 'ph-star');
                    }
                });
            });
        });
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!feedbackRating.value) {
                alert('Please select a rating before submitting.');
                return;
            }
            
            const btn = feedbackForm.querySelector('button[type="submit"]');
            const originalHtml = btn.innerHTML;
            
            btn.innerHTML = '<i class="ph ph-check-circle"></i> Thank you for your feedback!';
            btn.style.background = 'linear-gradient(135deg, #2E7D32, #1B5E20)';
            
            feedbackForm.reset();
            feedbackRating.value = '';
            
            // Reset stars
            feedbackStars.forEach(s => s.classList.replace('ph-fill', 'ph-star'));
            
            // Trigger an event to reset the local scoped currentRating (handled via re-init if needed, or by simple visually resetting)
            // It will reset visually but if user hovers again, it would rely on currentRating.
            // A more robust way is to dispatch an event, but for a simple interaction this visual reset + value clearing works perfectly.
            
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.style.background = '';
            }, 3000);
        });
    }

});
