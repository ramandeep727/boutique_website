document.addEventListener('DOMContentLoaded', () => {
    const checkoutContent = document.getElementById('checkoutContent');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const successMessage = document.getElementById('successMessage');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const totalAmount = document.getElementById('totalAmount');
    const checkoutForm = document.getElementById('checkoutForm');

    let cart = JSON.parse(localStorage.getItem('shabnam_cart')) || [];
    let isCustomPricing = false;
    let numericTotal = 0;

    let loggedInUser = null;
    if (window.auth) {
        window.auth.onAuthStateChanged(user => {
            if (user) {
                loggedInUser = user;
                const emailInput = document.getElementById('email');
                if (emailInput && !emailInput.value) {
                    emailInput.value = user.email;
                }
            }
        });
    }

    function renderCart() {
        if (cart.length === 0) {
            checkoutContent.classList.add('hidden');
            emptyCartMessage.classList.remove('hidden');
            return;
        }

        checkoutContent.classList.remove('hidden');
        emptyCartMessage.classList.add('hidden');
        cartItemsContainer.innerHTML = '';
        numericTotal = 0;
        isCustomPricing = false;

        cart.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            
            // Try to extract price
            let priceText = item.price.toLowerCase();
            let priceVal = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            if (isNaN(priceVal) || priceText.includes('custom')) {
                isCustomPricing = true;
            } else {
                numericTotal += priceVal;
            }

            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-cat">${item.category}</p>
                    <p class="cart-item-price">${item.price}</p>
                </div>
                <button type="button" class="remove-item-btn" onclick="removeFromCart(${index})" aria-label="Remove item">
                    <i class="ph ph-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        if (isCustomPricing) {
            subtotalAmount.textContent = 'Custom';
            totalAmount.textContent = 'Custom (To be quoted)';
        } else {
            subtotalAmount.textContent = `₹${numericTotal.toFixed(2)}`;
            totalAmount.textContent = `₹${numericTotal.toFixed(2)}`;
        }
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('shabnam_cart', JSON.stringify(cart));
        renderCart();
    };

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        const orderDate = new Date().toLocaleDateString();
        const orderTotal = isCustomPricing ? 'Custom Pricing' : `₹${numericTotal.toFixed(2)}`;

        const order = {
            id: orderId,
            date: orderDate,
            customer: fullName,
            email: email,
            phone: phone,
            address: address,
            items: cart,
            total: orderTotal,
            status: 'Pending'
        };

        if (window.db) {
            try {
                await window.db.collection('orders').doc(order.id).set(order);
            } catch(error) {
                console.error("Failed to save order to Firebase:", error);
            }
        }

        let orders = JSON.parse(localStorage.getItem('shabnam_orders')) || [];
        orders.unshift(order); // Add to beginning
        localStorage.setItem('shabnam_orders', JSON.stringify(orders));

        // Clear cart
        localStorage.setItem('shabnam_cart', JSON.stringify([]));
        
        // Show success
        checkoutContent.classList.add('hidden');
        successMessage.classList.remove('hidden');
    });

    renderCart();
});
