// API base URL - change this to point to your backend server
const API_BASE_URL = 'http://localhost:9999';

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    const isLoginPage = window.location.pathname.includes('/login.html');
    
    if (!isLoginPage) {
        // Only check auth if we're not on the login page
        checkAuth();
    }
    
    // Add event listeners for admin forms
    setupFormHandlers();
    setupContentActions();
});

/**
 * Check if user is authenticated
 */
function checkAuth() {
    // Check if user is logged in by calling the auth API
    fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            // If not logged in, redirect to login page
            window.location.href = '/admin/login.html';
            throw new Error('Not authenticated');
        }
        return response.json();
    })
    .then(data => {
        // Update UI with user info
        const userInfo = document.querySelector('.user-info span');
        if (userInfo) {
            userInfo.textContent = data.data.name || 'Admin User';
        }
        console.log('Authentication successful:', data);
        
        // Load page content if needed
        const currentPath = window.location.pathname;
        loadPageContent(currentPath);
    })
    .catch(error => {
        console.error('Auth check failed:', error);
    });
}

/**
 * Set up form submission handlers
 */
function setupFormHandlers() {
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');
            
            fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Login successful:', data);
                    window.location.href = '/admin/';
                } else {
                    errorMessage.textContent = data.message || 'Invalid credentials';
                    errorMessage.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                errorMessage.textContent = 'An error occurred. Please try again.';
                errorMessage.style.display = 'block';
            });
        });
    }

    // Handle logout button
    const logoutLink = document.querySelector('.logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'GET',
                credentials: 'include'
            })
            .then(() => {
                window.location.href = '/admin/login.html';
            })
            .catch(error => {
                console.error('Logout failed:', error);
            });
        });
    }
    
    // Handle admin forms
    document.querySelectorAll('form.api-form').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(form);
            const url = form.getAttribute('action');
            const method = form.getAttribute('method') || 'POST';
            const formId = form.getAttribute('id');
            
            fetch(url, {
                method: method,
                body: formData,
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('Operation completed successfully!', 'success');
                    
                    // Reset form if it's a create operation
                    if (method === 'POST') {
                        form.reset();
                        // Reset image preview if exists
                        const preview = form.querySelector('.image-preview img');
                        if (preview) {
                            preview.style.display = 'none';
                        }
                    }
                    
                    // Reload related content
                    reloadContent(formId);
                } else {
                    showAlert('Error: ' + data.message, 'danger');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('An error occurred. Please try again later.', 'danger');
            });
        });
    });
}

/**
 * Set up content action handlers (edit, delete, etc.)
 */
function setupContentActions() {
    // For all delete buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
            e.preventDefault();
            const btn = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
            const id = btn.getAttribute('data-id');
            const endpoint = btn.getAttribute('data-endpoint');
            
            if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                deleteItem(endpoint, id);
            }
        }
    });
    
    // For all edit buttons - open modal with form
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
            e.preventDefault();
            const btn = e.target.classList.contains('edit-btn') ? e.target : e.target.closest('.edit-btn');
            const id = btn.getAttribute('data-id');
            const endpoint = btn.getAttribute('data-endpoint');
            const modalId = btn.getAttribute('data-modal');
            
            // Fetch item data and populate form
            fetchItemData(endpoint, id, modalId);
        }
    });
    
    // Handle modal close buttons
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            closeModal(this.closest('.modal-overlay').id);
        });
    });
    
    // Handle image uploads preview
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', function(e) {
            const preview = this.closest('.form-group').querySelector('.image-preview img');
            if (!preview) return;
            
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    });
    
    // Handle tags input
    document.querySelectorAll('.tags-input').forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const value = this.value.trim();
                if (value) {
                    addTag(value, this.closest('.tags-input-container'));
                    this.value = '';
                }
            }
        });
    });
}

/**
 * Load page content based on the current path
 */
function loadPageContent(path) {
    if (path.includes('carousel.html')) {
        fetchCarouselItems();
    } else if (path.includes('blog-cards.html')) {
        fetchBlogCards();
    } else if (path.includes('hero-sections.html')) {
        fetchHeroSections();
    } else if (path.includes('tour-cards.html')) {
        fetchTourCards();
    } else if (path.includes('honeymoon-cards.html')) {
        fetchHoneymoonCards();
    } else if (path.includes('contact-submissions.html')) {
        fetchContactSubmissions();
    } else if (path.includes('flight-submissions.html')) {
        fetchFlightSubmissions();
    } else if (path.includes('visa-submissions.html')) {
        fetchVisaSubmissions();
    } else if (path.includes('honeymoon-submissions.html')) {
        fetchHoneymoonSubmissions();
    } else if (path.includes('forex-submissions.html')) {
        fetchForexSubmissions();
    } else if (path.includes('tour-submissions.html')) {
        fetchTourSubmissions();
    }
}

/**
 * Fetch carousel items from API
 */
function fetchCarouselItems() {
    const container = document.getElementById('carouselItems');
    if (!container) return;
    
    container.innerHTML = '<p>Loading carousel items...</p>';
    
    fetch(`${API_BASE_URL}/api/content/carousel`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            container.innerHTML = '';
            data.data.forEach(item => {
                container.appendChild(createCarouselItemCard(item));
            });
        } else {
            container.innerHTML = '<p>No carousel items found. Add your first item using the form.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching carousel items:', error);
        container.innerHTML = '<p>Error loading carousel items. Please try again later.</p>';
    });
}

/**
 * Fetch blog cards from API
 */
function fetchBlogCards() {
    const container = document.getElementById('blogCards');
    if (!container) return;
    
    container.innerHTML = '<p>Loading blog cards...</p>';
    
    fetch(`${API_BASE_URL}/api/content/blog`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            container.innerHTML = '';
            data.data.forEach(item => {
                container.appendChild(createBlogCardItem(item));
            });
        } else {
            container.innerHTML = '<p>No blog cards found. Add your first blog card using the form.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching blog cards:', error);
        container.innerHTML = '<p>Error loading blog cards. Please try again later.</p>';
    });
}

/**
 * Fetch hero sections from API
 */
function fetchHeroSections() {
    const container = document.getElementById('heroSections');
    if (!container) return;
    
    container.innerHTML = '<p>Loading hero sections...</p>';
    
    fetch(`${API_BASE_URL}/api/content/hero`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            container.innerHTML = '';
            data.data.forEach(item => {
                container.appendChild(createHeroSectionCard(item));
            });
        } else {
            container.innerHTML = '<p>No hero sections found. Create your first hero section using the form.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching hero sections:', error);
        container.innerHTML = '<p>Error loading hero sections. Please try again later.</p>';
    });
}

/**
 * Create HTML for a hero section card
 */
function createHeroSectionCard(item) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="content-card-img">
        <div class="content-card-body">
            <h3 class="content-card-title">${item.title}</h3>
            <p class="content-card-subtitle">${item.subtitle}</p>
            <p class="content-card-page"><strong>Page:</strong> ${item.page}</p>
            <div class="content-card-actions">
                <button class="btn btn-primary" onclick="loadHeroDetails('${item.page}')">
                    <i class="bx bx-edit"></i> Load & Edit
                </button>
            </div>
        </div>
    `;
    return card;
}

/**
 * Load hero section details into the form
 */
function loadHeroDetails(page) {
    // Set the page value in the dropdown
    const pageSelect = document.getElementById('page');
    if (pageSelect) {
        pageSelect.value = page;
    }
    
    // Trigger the load button click
    const loadHeroBtn = document.getElementById('loadHeroBtn');
    if (loadHeroBtn) {
        loadHeroBtn.click();
    }
    
    // Scroll to the form
    const form = document.getElementById('updateHeroSectionForm');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Fetch tour cards from API
 */
function fetchTourCards() {
    const container = document.getElementById('tourCards');
    if (!container) return;
    
    container.innerHTML = '<p>Loading tour cards...</p>';
    
    fetch(`${API_BASE_URL}/api/content/tour`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            container.innerHTML = '';
            data.data.forEach(item => {
                container.appendChild(createTourCardItem(item));
            });
        } else {
            container.innerHTML = '<p>No tour cards found. Add your first tour card using the form.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching tour cards:', error);
        container.innerHTML = '<p>Error loading tour cards. Please try again later.</p>';
    });
}

/**
 * Create HTML for a tour card item
 */
function createTourCardItem(item) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="content-card-img">
        <div class="content-card-body">
            <h3 class="content-card-title">${item.title}</h3>
            <p class="content-card-info"><i class='bx bx-time'></i> ${item.duration}</p>
            <p class="content-card-info"><i class='bx bx-map'></i> ${item.location}</p>
            <p class="content-card-info"><i class='bx bx-money'></i> ${item.price}</p>
            <p class="content-card-text">${truncateText(item.description, 100)}</p>
            <div class="tags">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="content-card-actions">
                <button class="btn btn-warning edit-btn" data-id="${item._id}" data-endpoint="${API_BASE_URL}/api/content/tour/${item._id}" data-modal="editTourCardModal">
                    <i class="bx bx-edit"></i> Edit
                </button>
                <button class="btn btn-danger delete-btn" data-id="${item._id}" data-endpoint="${API_BASE_URL}/api/content/tour/${item._id}">
                    <i class="bx bx-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    return card;
}

/**
 * Create HTML for a blog card item
 */
function createBlogCardItem(item) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="content-card-img">
        <div class="content-card-body">
            <h3 class="content-card-title">${item.title}</h3>
            <p class="content-card-subtitle">${item.subtitle}</p>
            <p class="content-card-text">${truncateText(item.content, 100)}</p>
            <div class="tags">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="content-card-actions">
                <button class="btn btn-warning edit-btn" data-id="${item._id}" data-endpoint="${API_BASE_URL}/api/content/blog/${item._id}" data-modal="editBlogCardModal">
                    <i class="bx bx-edit"></i> Edit
                </button>
                <button class="btn btn-danger delete-btn" data-id="${item._id}" data-endpoint="${API_BASE_URL}/api/content/blog/${item._id}">
                    <i class="bx bx-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    return card;
}

/**
 * Truncate text to a specified length
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Create HTML for a carousel item card
 */
function createCarouselItemCard(item) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="content-card-img">
        <div class="content-card-body">
            <h3 class="content-card-title">${item.title}</h3>
            <p class="content-card-text">${item.heading}</p>
            <p class="content-card-text">${item.subheading}</p>
            <div class="tags">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="content-card-actions">
                <button class="btn btn-warning edit-btn" data-id="${item._id}" data-endpoint="${API_BASE_URL}/api/content/carousel/${item._id}" data-modal="editCarouselModal">
                    <i class="bx bx-edit"></i> Edit
                </button>
                <button class="btn btn-danger delete-btn" data-id="${item._id}" data-endpoint="${API_BASE_URL}/api/content/carousel/${item._id}">
                    <i class="bx bx-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    return card;
}

/**
 * Delete an item from the API
 */
function deleteItem(endpoint, id) {
    fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Item deleted successfully!', 'success');
            // Reload content based on the endpoint
            if (endpoint.includes('carousel')) {
                fetchCarouselItems();
            } else if (endpoint.includes('blog')) {
                fetchBlogCards();
            } else if (endpoint.includes('hero')) {
                fetchHeroSections();
            } else if (endpoint.includes('tour')) {
                fetchTourCards();
            } else if (endpoint.includes('honeymoon')) {
                fetchHoneymoonCards();
            }
        } else {
            showAlert('Error: ' + data.message, 'danger');
        }
    })
    .catch(error => {
        console.error('Error deleting item:', error);
        showAlert('An error occurred. Please try again later.', 'danger');
    });
}

/**
 * Fetch item data for editing
 */
function fetchItemData(endpoint, id, modalId) {
    fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            populateEditForm(data.data, modalId);
            openModal(modalId);
        } else {
            showAlert('Error: ' + data.message, 'danger');
        }
    })
    .catch(error => {
        console.error('Error fetching item data:', error);
        showAlert('An error occurred. Please try again later.', 'danger');
    });
}

/**
 * Populate edit form with item data
 */
function populateEditForm(item, modalId) {
    const form = document.querySelector(`#${modalId} form`);
    if (!form) return;
    
    // Set item ID in hidden field
    const idField = form.querySelector('input[name="id"]');
    if (idField) idField.value = item._id;
    
    // Set item data in form fields
    Object.keys(item).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) {
            if (field.type === 'file') {
                // For file inputs, show current image in preview
                const preview = form.querySelector('.image-preview img');
                if (preview) {
                    preview.src = item[key];
                    preview.style.display = 'block';
                }
            } else if (key === 'tags' && Array.isArray(item[key])) {
                // For tags, create tag elements
                const tagsContainer = form.querySelector('.tags-input-container');
                if (tagsContainer) {
                    // Clear existing tags
                    const existingTags = tagsContainer.querySelectorAll('.tag');
                    existingTags.forEach(tag => tag.remove());
                    
                    // Add new tags
                    item[key].forEach(tag => {
                        addTag(tag, tagsContainer);
                    });
                }
            } else {
                field.value = item[key];
            }
        }
    });
}

/**
 * Add a tag to the tags container
 */
function addTag(text, container) {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `
        ${text}
        <span class="close">&times;</span>
    `;
    
    // Add click event to remove tag
    tag.querySelector('.close').addEventListener('click', function() {
        tag.remove();
        updateHiddenTagsField(container);
    });
    
    // Add tag to container before the input
    const input = container.querySelector('.tags-input');
    container.insertBefore(tag, input);
    
    // Update hidden field
    updateHiddenTagsField(container);
}

/**
 * Update hidden tags field with current tags
 */
function updateHiddenTagsField(container) {
    const hiddenField = container.querySelector('input[type="hidden"]');
    if (!hiddenField) return;
    
    const tags = Array.from(container.querySelectorAll('.tag'))
        .map(tag => tag.textContent.trim());
        
    hiddenField.value = tags.join(',');
}

/**
 * Open a modal
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * Close a modal
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Show an alert message
 */
function showAlert(message, type = 'info') {
    const alertContainer = document.querySelector('.alert-container');
    
    if (!alertContainer) {
        // Create alert container if it doesn't exist
        const container = document.createElement('div');
        container.className = 'alert-container';
        document.body.appendChild(container);
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    alertContainer.appendChild(alert);
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

/**
 * Reload content based on the form ID
 */
function reloadContent(formId) {
    if (formId.includes('carousel')) {
        fetchCarouselItems();
    } else if (formId.includes('blog')) {
        fetchBlogCards();
    } else if (formId.includes('hero')) {
        fetchHeroSections();
    } else if (formId.includes('tour')) {
        fetchTourCards();
    } else if (formId.includes('honeymoon')) {
        fetchHoneymoonCards();
    }
}

/* 
 * The following functions would be implemented similarly to fetchCarouselItems
 * fetchBlogCards, fetchHeroSections, fetchTourCards, fetchHoneymoonCards, etc.
 */

// Fetch form submissions
function fetchContactSubmissions() {
    const container = document.getElementById('contactSubmissions');
    if (!container) return;
    
    container.innerHTML = '<p>Loading submissions...</p>';
    
    fetch(`${API_BASE_URL}/api/forms/contact`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            renderSubmissionsTable(container, data.data, [
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'subject', label: 'Subject' },
                { key: 'message', label: 'Message' },
                { key: 'createdAt', label: 'Date', transform: date => new Date(date).toLocaleString() }
            ]);
        } else {
            container.innerHTML = '<p>No submissions found.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching submissions:', error);
        container.innerHTML = '<p>Error loading submissions. Please try again later.</p>';
    });
}

function fetchFlightSubmissions() {
    const container = document.getElementById('flightSubmissions');
    if (!container) return;
    
    container.innerHTML = '<p>Loading submissions...</p>';
    
    fetch(`${API_BASE_URL}/api/forms/flight`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            renderSubmissionsTable(container, data.data, [
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'tripType', label: 'Trip Type' },
                { key: 'from', label: 'From' },
                { key: 'to', label: 'To' },
                { key: 'departureDate', label: 'Departure', transform: date => new Date(date).toLocaleDateString() },
                { key: 'passengers', label: 'Passengers' },
                { key: 'createdAt', label: 'Date', transform: date => new Date(date).toLocaleString() }
            ]);
        } else {
            container.innerHTML = '<p>No submissions found.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching submissions:', error);
        container.innerHTML = '<p>Error loading submissions. Please try again later.</p>';
    });
}

function fetchVisaSubmissions() {
    const container = document.getElementById('visaSubmissions');
    if (!container) return;
    
    container.innerHTML = '<p>Loading submissions...</p>';
    
    fetch(`${API_BASE_URL}/api/forms/visa`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            renderSubmissionsTable(container, data.data, [
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'country', label: 'Country' },
                { key: 'visaType', label: 'Visa Type' },
                { key: 'travelDate', label: 'Travel Date', transform: date => new Date(date).toLocaleDateString() },
                { key: 'message', label: 'Message' },
                { key: 'createdAt', label: 'Date', transform: date => new Date(date).toLocaleString() }
            ]);
        } else {
            container.innerHTML = '<p>No submissions found.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching submissions:', error);
        container.innerHTML = '<p>Error loading submissions. Please try again later.</p>';
    });
}

function fetchHoneymoonSubmissions() {
    const container = document.getElementById('honeymoonSubmissions');
    if (!container) return;
    
    container.innerHTML = '<p>Loading submissions...</p>';
    
    fetch(`${API_BASE_URL}/api/forms/honeymoon`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            renderSubmissionsTable(container, data.data, [
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'destination', label: 'Destination' },
                { key: 'departureDate', label: 'Departure', transform: date => new Date(date).toLocaleDateString() },
                { key: 'returnDate', label: 'Return', transform: date => new Date(date).toLocaleDateString() },
                { key: 'budget', label: 'Budget' },
                { key: 'specialRequests', label: 'Special Requests' },
                { key: 'createdAt', label: 'Date', transform: date => new Date(date).toLocaleString() }
            ]);
        } else {
            container.innerHTML = '<p>No submissions found.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching submissions:', error);
        container.innerHTML = '<p>Error loading submissions. Please try again later.</p>';
    });
}

function fetchForexSubmissions() {
    const container = document.getElementById('forexSubmissions');
    if (!container) return;
    
    container.innerHTML = '<p>Loading submissions...</p>';
    
    fetch(`${API_BASE_URL}/api/forms/forex`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            renderSubmissionsTable(container, data.data, [
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'fromCurrency', label: 'From Currency' },
                { key: 'toCurrency', label: 'To Currency' },
                { key: 'amount', label: 'Amount' },
                { key: 'purpose', label: 'Purpose' },
                { key: 'message', label: 'Message' },
                { key: 'createdAt', label: 'Date', transform: date => new Date(date).toLocaleString() }
            ]);
        } else {
            container.innerHTML = '<p>No submissions found.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching submissions:', error);
        container.innerHTML = '<p>Error loading submissions. Please try again later.</p>';
    });
}

function fetchTourSubmissions() {
    const container = document.getElementById('tourSubmissions');
    if (!container) return;
    
    container.innerHTML = '<p>Loading submissions...</p>';
    
    fetch(`${API_BASE_URL}/api/forms/tour`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            renderSubmissionsTable(container, data.data, [
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'destination', label: 'Destination' },
                { key: 'tourName', label: 'Tour Package' },
                { key: 'departureDate', label: 'Departure', transform: date => new Date(date).toLocaleDateString() },
                { key: 'returnDate', label: 'Return', transform: date => new Date(date).toLocaleDateString() },
                { key: 'adults', label: 'Adults' },
                { key: 'children', label: 'Children' },
                { key: 'specialRequests', label: 'Special Requests' },
                { key: 'createdAt', label: 'Date', transform: date => new Date(date).toLocaleString() }
            ]);
        } else {
            container.innerHTML = '<p>No submissions found.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching submissions:', error);
        container.innerHTML = '<p>Error loading submissions. Please try again later.</p>';
    });
}

/* 
 * Render a table of submissions
 */
function renderSubmissionsTable(container, data, columns) {
    container.innerHTML = '';
    
    const table = document.createElement('table');
    table.className = 'table';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column.label;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        columns.forEach(column => {
            const td = document.createElement('td');
            let value = item[column.key];
            
            // Apply transform if provided
            if (column.transform && typeof column.transform === 'function') {
                value = column.transform(value);
            }
            
            // Truncate long text
            if (typeof value === 'string' && value.length > 100) {
                const shortValue = value.substring(0, 100) + '...';
                td.innerHTML = `<span title="${value}">${shortValue}</span>`;
            } else {
                td.textContent = value || '-';
            }
            
            row.appendChild(td);
        });
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);
}

/**
 * Fetch honeymoon cards from API
 */
function fetchHoneymoonCards() {
    const container = document.getElementById('honeymoonCards');
    if (!container) return;
    
    container.innerHTML = '<p>Loading honeymoon cards...</p>';
    
    fetch(`${API_BASE_URL}/api/content/honeymoon`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            container.innerHTML = '';
            data.data.forEach(item => {
                container.appendChild(createHoneymoonCardItem(item));
            });
        } else {
            container.innerHTML = '<p>No honeymoon cards found. Add your first honeymoon card using the form.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching honeymoon cards:', error);
        container.innerHTML = '<p>Error loading honeymoon cards. Please try again later.</p>';
    });
}

/**
 * Create HTML for a honeymoon card item
 */
function createHoneymoonCardItem(item) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="content-card-img">
        <div class="content-card-body">
            <h3 class="content-card-title">${item.title}</h3>
            <p class="content-card-info"><i class='bx bx-time'></i> ${item.duration}</p>
            <p class="content-card-info"><i class='bx bx-map'></i> ${item.location}</p>
            <p class="content-card-info"><i class='bx bx-money'></i> ${item.price}</p>
            <p class="content-card-text">${truncateText(item.description, 100)}</p>
            <div class="tags">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="content-card-actions">
                <button class="btn btn-warning edit-btn" data-id="${item._id}" data-endpoint="${API_BASE_URL}/api/content/honeymoon/${item._id}" data-modal="editHoneymoonCardModal">
                    <i class="bx bx-edit"></i> Edit
                </button>
                <button class="btn btn-danger delete-btn" data-id="${item._id}" data-endpoint="${API_BASE_URL}/api/content/honeymoon/${item._id}">
                    <i class="bx bx-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    return card;
}

/**
 * Fetches dashboard statistics for all form submission types
 */
function fetchDashboardStats() {
    // Fetch counts for each submission type
    const endpoints = [
        { endpoint: `${API_BASE_URL}/api/forms/contact/count`, elementId: 'contactCount' },
        { endpoint: `${API_BASE_URL}/api/forms/flight/count`, elementId: 'flightCount' },
        { endpoint: `${API_BASE_URL}/api/forms/visa/count`, elementId: 'visaCount' },
        { endpoint: `${API_BASE_URL}/api/forms/honeymoon/count`, elementId: 'honeymoonCount' },
        { endpoint: `${API_BASE_URL}/api/forms/forex/count`, elementId: 'forexCount' },
        { endpoint: `${API_BASE_URL}/api/forms/tour/count`, elementId: 'tourCount' }
    ];
    
    endpoints.forEach(item => {
        fetch(item.endpoint, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            const element = document.getElementById(item.elementId);
            if (!element) return;
            
            if (data.success) {
                element.textContent = data.count;
            } else {
                element.textContent = 'Error';
            }
        })
        .catch(error => {
            console.error(`Error fetching ${item.endpoint}:`, error);
            const element = document.getElementById(item.elementId);
            if (element) {
                element.textContent = 'Error';
            }
        });
    });
}

/**
 * Fetches recent submissions across all form types
 */
function fetchRecentSubmissions() {
    const container = document.getElementById('recentSubmissions');
    if (!container) return;
    
    fetch(`${API_BASE_URL}/api/forms/recent`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            renderRecentSubmissionsTable(container, data.data);
        } else {
            container.innerHTML = '<p>No recent submissions found.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching recent submissions:', error);
        container.innerHTML = '<p>Error loading recent submissions. Please try again later.</p>';
    });
}

/**
 * Renders the recent submissions table
 * @param {HTMLElement} container - The container element
 * @param {Array} submissions - Array of submission objects
 */
function renderRecentSubmissionsTable(container, submissions) {
    container.innerHTML = '';
    
    const table = document.createElement('table');
    table.className = 'table';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    ['Type', 'Name', 'Contact', 'Date', 'Details'].forEach(heading => {
        const th = document.createElement('th');
        th.textContent = heading;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    submissions.forEach(item => {
        const row = document.createElement('tr');
        
        // Type cell
        const typeCell = document.createElement('td');
        typeCell.innerHTML = getSubmissionTypeIcon(item.type) + ' ' + item.type;
        row.appendChild(typeCell);
        
        // Name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);
        
        // Contact cell
        const contactCell = document.createElement('td');
        contactCell.textContent = item.email || item.phone || '-';
        row.appendChild(contactCell);
        
        // Date cell
        const dateCell = document.createElement('td');
        dateCell.textContent = new Date(item.createdAt).toLocaleString();
        row.appendChild(dateCell);
        
        // Details cell
        const detailsCell = document.createElement('td');
        const detailsLink = document.createElement('a');
        detailsLink.href = `/admin/${item.type.toLowerCase()}-submissions.html`;
        detailsLink.className = 'btn btn-sm btn-secondary';
        detailsLink.textContent = 'View Details';
        detailsCell.appendChild(detailsLink);
        row.appendChild(detailsCell);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);
}

/**
 * Returns the appropriate icon for a submission type
 * @param {string} type - The submission type
 * @returns {string} HTML for the icon
 */
function getSubmissionTypeIcon(type) {
    const icons = {
        'contact': '<i class="bx bxs-contact"></i>',
        'flight': '<i class="bx bxs-plane"></i>',
        'visa': '<i class="bx bxs-id-card"></i>',
        'honeymoon': '<i class="bx bxs-heart"></i>',
        'forex': '<i class="bx bx-money"></i>',
        'tour': '<i class="bx bxs-map"></i>'
    };
    
    return icons[type.toLowerCase()] || '';
} 