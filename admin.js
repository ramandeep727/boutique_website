// =============================================
// CLOUDINARY CONFIG — Fill in your details here
// =============================================
const CLOUDINARY_CLOUD_NAME = 'dvfzve7zz';
const CLOUDINARY_UPLOAD_PRESET = 'shabnam_products';
// =============================================

async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    // Note: folder param removed — unsigned presets may not allow it

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
    );

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message);
    }

    if (!data.secure_url) {
        throw new Error('No URL returned from Cloudinary. Check your upload preset is set to Unsigned.');
    }

    return data.secure_url;
}

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const loginOverlay = document.getElementById('loginOverlay');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('loginForm');
    const adminEmail = document.getElementById('adminEmail');
    const adminPassword = document.getElementById('adminPassword');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');

    const adminProductList = document.getElementById('adminProductList');
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const productForm = document.getElementById('productForm');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const closeModalIcon = document.getElementById('closeModalIcon');
    const modalTitle = document.getElementById('modalTitle');

    const navDashboard = document.getElementById('navDashboard');
    const viewDashboard = document.getElementById('viewDashboard');
    const statTotalProducts = document.getElementById('statTotalProducts');
    const statTotalOrders = document.getElementById('statTotalOrders');
    const statTotalRevenue = document.getElementById('statTotalRevenue');
    
    const navProducts = document.getElementById('navProducts');
    const navOrders = document.getElementById('navOrders');
    const viewProducts = document.getElementById('viewProducts');
    const viewOrders = document.getElementById('viewOrders');
    const adminOrderList = document.getElementById('adminOrderList');

    const productImageFile = document.getElementById('productImageFile');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');

    // Handle Image Preview (upload happens on form submit)
    productImageFile.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            // Show a local preview immediately for UX
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Auth state check - using Firebase auth now
    if (window.auth) {
        window.auth.onAuthStateChanged(user => {
            if (user) {
                showDashboard();
            } else {
                loginOverlay.classList.remove('hidden');
                adminDashboard.classList.add('hidden');
            }
        });
    }

    // Login Logic
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.classList.remove('visible');
        if (adminLoginBtn) {
            adminLoginBtn.innerHTML = 'Logging in...';
            adminLoginBtn.disabled = true;
        }

        try {
            await window.auth.signInWithEmailAndPassword(adminEmail.value, adminPassword.value);
            // showDashboard is called automatically by onAuthStateChanged
        } catch (error) {
            loginError.textContent = error.message;
            loginError.classList.add('visible');
        } finally {
            if (adminLoginBtn) {
                adminLoginBtn.innerHTML = 'Login <i class="ph ph-sign-in"></i>';
                adminLoginBtn.disabled = false;
            }
        }
    });

    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await window.auth.signOut();
        } catch (error) {
            console.error('Logout error', error);
        }
    });

    function showDashboard() {
        loginOverlay.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        if (navDashboard && navDashboard.classList.contains('active')) {
            renderDashboardStats();
        } else if (navProducts.classList.contains('active')) {
            renderAdminProducts();
        } else if (navOrders.classList.contains('active')) {
            renderAdminOrders();
        }
    }

    // Tab Switching
    if (navDashboard) {
        navDashboard.addEventListener('click', (e) => {
            e.preventDefault();
            navDashboard.classList.add('active');
            navProducts.classList.remove('active');
            navOrders.classList.remove('active');
            viewDashboard.style.display = 'block';
            viewProducts.style.display = 'none';
            viewOrders.style.display = 'none';
            renderDashboardStats();
        });
    }

    navProducts.addEventListener('click', (e) => {
        e.preventDefault();
        navProducts.classList.add('active');
        if (navDashboard) navDashboard.classList.remove('active');
        navOrders.classList.remove('active');
        viewProducts.style.display = 'block';
        if (viewDashboard) viewDashboard.style.display = 'none';
        viewOrders.style.display = 'none';
        renderAdminProducts();
    });

    navOrders.addEventListener('click', (e) => {
        e.preventDefault();
        navOrders.classList.add('active');
        if (navDashboard) navDashboard.classList.remove('active');
        navProducts.classList.remove('active');
        viewOrders.style.display = 'block';
        if (viewDashboard) viewDashboard.style.display = 'none';
        viewProducts.style.display = 'none';
        renderAdminOrders();
    });

    // Dashboard Stats Logic
    async function renderDashboardStats() {
        const products = window.db ? await getProductsFromFirebase() : getProducts();
        const orders = window.db ? await getOrdersFromFirebase() : getOrders();
        
        if (statTotalProducts) statTotalProducts.textContent = products.length;
        if (statTotalOrders) statTotalOrders.textContent = orders.length;
        
        let totalRevenue = 0;
        orders.forEach(order => {
            const num = parseFloat((order.total || '').toString().replace(/[^0-9.-]+/g, ""));
            if (!isNaN(num)) totalRevenue += num;
        });
        if (statTotalRevenue) statTotalRevenue.textContent = '$' + totalRevenue.toFixed(2);
    }

    // Product CRUD Logic
    function getProducts() {
        const productsStr = localStorage.getItem('shabnam_products');
        return productsStr ? JSON.parse(productsStr) : [];
    }

    function saveProducts(products) {
        localStorage.setItem('shabnam_products', JSON.stringify(products));
    }

    async function getProductsFromFirebase() {
        if (!window.db) return getProducts();
        try {
            const snapshot = await window.db.collection('products').get();
            let products = [];
            snapshot.forEach(doc => {
                products.push({ id: doc.id, ...doc.data() });
            });
            localStorage.setItem('shabnam_products', JSON.stringify(products));
            return products;
        } catch (e) {
            console.error(e);
            return getProducts();
        }
    }

    async function saveProductToFirebase(product) {
        if (!window.db) {
            const products = getProducts();
            const index = products.findIndex(p => p.id === product.id);
            if (index !== -1) products[index] = product;
            else products.push(product);
            saveProducts(products);
            return;
        }
        try {
            await window.db.collection('products').doc(product.id).set(product);
            console.log("Successfully saved to Firebase:", product.id);
        } catch(e) {
            console.error("Firebase save error:", e);
            alert("❌ Error saving to database: " + e.message);
        }
    }

    async function deleteProductFromFirebase(id) {
        if (!window.db) {
            let products = getProducts();
            products = products.filter(p => p.id !== id);
            saveProducts(products);
            return;
        }
        try {
            await window.db.collection('products').doc(id).delete();
        } catch(e) {
            console.error(e);
        }
    }

    async function renderAdminProducts() {
        const products = window.db ? await getProductsFromFirebase() : getProducts();
        adminProductList.innerHTML = '';

        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" class="table-img"></td>
                <td><strong>${product.name}</strong></td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td><i class="ph-fill ph-star" style="color:#C9A96E"></i> ${product.rating} (${product.ratingCount})</td>
                <td class="text-right">
                    <div class="action-btns">
                        <button class="action-btn btn-edit" onclick="editProduct('${product.id}')" title="Edit"><i class="ph ph-pencil-simple"></i></button>
                        <button class="action-btn btn-delete" onclick="deleteProduct('${product.id}')" title="Delete"><i class="ph ph-trash"></i></button>
                    </div>
                </td>
            `;
            adminProductList.appendChild(tr);
        });
    }

    // Open Modal for Add
    addProductBtn.addEventListener('click', () => {
        productForm.reset();
        document.getElementById('productId').value = '';
        document.getElementById('productImage').value = '';
        productImageFile.value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productSizes').value = 'S, M, L, Custom';
        imagePreviewContainer.style.display = 'none';
        imagePreview.src = '';
        modalTitle.textContent = 'Add Product';
        productModal.classList.remove('hidden');
    });

    // Close Modal
    function closeModal() {
        productModal.classList.add('hidden');
    }
    cancelModalBtn.addEventListener('click', closeModal);
    closeModalIcon.addEventListener('click', closeModal);

    // Save Form (Add or Edit)
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const saveBtn = productForm.querySelector('button[type="submit"]');
        const originalBtnText = saveBtn.innerHTML;
        saveBtn.disabled = true;

        const idField = document.getElementById('productId').value;
        let imageUrl = document.getElementById('productImage').value; // existing URL if editing

        // If a new file was selected, upload it to Cloudinary first
        const selectedFile = productImageFile.files[0];
        if (selectedFile) {
            try {
                console.log("Uploading new image to Cloudinary...", selectedFile.name);
                saveBtn.innerHTML = '<i class="ph ph-spinner"></i> Uploading image...';
                imageUrl = await uploadImageToCloudinary(selectedFile);
                console.log("Cloudinary upload success. URL:", imageUrl);
                document.getElementById('productImage').value = imageUrl;
            } catch (err) {
                console.error("Cloudinary error:", err);
                alert('❌ Image upload failed: ' + err.message + '\n\nPlease check your CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in admin.js');
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalBtnText;
                return;
            }
        } else {
            console.log("No new file selected. Keeping existing image URL:", imageUrl);
        }

        if (!imageUrl) {
            alert('❌ Please select an image for the product.');
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnText;
            return;
        }

        saveBtn.innerHTML = '<i class="ph ph-spinner"></i> Saving...';

        const newProduct = {
            id: idField ? idField : 'p_' + Date.now(),
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value,
            sizes: document.getElementById('productSizes').value,
            price: document.getElementById('productPrice').value,
            image: imageUrl,
            rating: parseFloat(document.getElementById('productRating').value),
            ratingCount: parseInt(document.getElementById('productRatingCount').value),
            badge: document.getElementById('productBadge').value,
            badgeClass: document.getElementById('productBadgeClass').value
        };

        await saveProductToFirebase(newProduct);
        await renderAdminProducts();
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnText;
        closeModal();
    });

    // Expose functions to global scope for onclick handlers
    window.editProduct = async function(id) {
        // Always fetch fresh data from Firebase to avoid stale localStorage
        const products = window.db ? await getProductsFromFirebase() : getProducts();
        const product = products.find(p => p.id === id);
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productSizes').value = product.sizes || 'S, M, L, Custom';
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productImage').value = product.image || '';
            productImageFile.value = ''; // Reset file input
            if (product.image) {
                imagePreview.src = product.image;
                imagePreviewContainer.style.display = 'block';
            } else {
                imagePreviewContainer.style.display = 'none';
                imagePreview.src = '';
            }
            document.getElementById('productRating').value = product.rating;
            document.getElementById('productRatingCount').value = product.ratingCount;
            document.getElementById('productBadge').value = product.badge || '';
            document.getElementById('productBadgeClass').value = product.badgeClass || '';
            
            modalTitle.textContent = 'Edit Product';
            productModal.classList.remove('hidden');
        }
    };

    window.deleteProduct = async function(id) {
        if(confirm('Are you sure you want to delete this product?')) {
            await deleteProductFromFirebase(id);
            await renderAdminProducts();
        }
    };

    // Orders Logic
    function getOrders() {
        const str = localStorage.getItem('shabnam_orders');
        return str ? JSON.parse(str) : [];
    }

    function saveOrders(orders) {
        localStorage.setItem('shabnam_orders', JSON.stringify(orders));
    }

    async function getOrdersFromFirebase() {
        if (!window.db) return getOrders();
        try {
            const snapshot = await window.db.collection('orders').get();
            let orders = [];
            snapshot.forEach(doc => {
                orders.push({ id: doc.id, ...doc.data() });
            });
            localStorage.setItem('shabnam_orders', JSON.stringify(orders));
            return orders;
        } catch(e) {
            console.error(e);
            return getOrders();
        }
    }

    async function deleteOrderFromFirebase(id) {
        if (!window.db) {
            let orders = getOrders();
            orders = orders.filter(o => o.id !== id);
            saveOrders(orders);
            return;
        }
        try {
            await window.db.collection('orders').doc(id).delete();
        } catch(e) {
            console.error(e);
        }
    }

    async function updateOrderStatusInFirebase(id, newStatus) {
        if (!window.db) {
            let orders = getOrders();
            const index = orders.findIndex(o => o.id === id);
            if (index !== -1) {
                orders[index].status = newStatus;
                saveOrders(orders);
            }
            return;
        }
        try {
            await window.db.collection('orders').doc(id).update({ status: newStatus });
        } catch(e) {
            console.error(e);
        }
    }

    async function renderAdminOrders() {
        const orders = window.db ? await getOrdersFromFirebase() : getOrders();
        adminOrderList.innerHTML = '';

        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${order.id}</strong></td>
                <td>${order.date}</td>
                <td>${order.customer}<br><small style="color:var(--color-text-light)">${order.email}</small></td>
                <td>${order.total}</td>
                <td>
                    <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value)" style="padding: 0.25rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: white; font-size: 0.85rem;">
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td class="text-right">
                    <div class="action-btns">
                        <button class="action-btn btn-delete" onclick="deleteOrder('${order.id}')" title="Delete Order"><i class="ph ph-trash"></i></button>
                    </div>
                </td>
            `;
            adminOrderList.appendChild(tr);
        });
    }

    window.deleteOrder = async function(id) {
        if(confirm('Are you sure you want to delete this order?')) {
            await deleteOrderFromFirebase(id);
            await renderAdminOrders();
        }
    };

    window.updateOrderStatus = async function(id, newStatus) {
        await updateOrderStatusInFirebase(id, newStatus);
    };
});
