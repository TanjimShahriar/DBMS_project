// Global variables
let productsData = [];
let warehouseData = [];
let shipmentsData = [];
let currentSortColumn = -1;
let sortDirection = 1;
let currentDeleteIndex = -1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeData();
    initializeCharts();
    initializeMaps();
    initializeEventListeners();
    initializeFormEventListeners();
    initializeScrollAnimations();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// Initialize sample data
function initializeData() {
    // Sample products data
    productsData = [
        {
            cropType: 'Wheat',
            plantingDate: '2024-03-15',
            harvestDate: '2024-07-20',
            storageRequirements: 'Cool, dry environment',
            shelfLife: '12 months',
            packaging: 'Bulk bags',
            status: 'Growing'
        },
        {
            cropType: 'Corn',
            plantingDate: '2024-04-01',
            harvestDate: '2024-08-15',
            storageRequirements: 'Temperature controlled',
            shelfLife: '18 months',
            packaging: 'Silos',
            status: 'Growing'
        },
        {
            cropType: 'Soybeans',
            plantingDate: '2024-03-20',
            harvestDate: '2024-07-10',
            storageRequirements: 'Humidity controlled',
            shelfLife: '24 months',
            packaging: 'Bulk containers',
            status: 'Harvested'
        },
        {
            cropType: 'Rice',
            plantingDate: '2024-02-15',
            harvestDate: '2024-06-30',
            storageRequirements: 'Airtight containers',
            shelfLife: '36 months',
            packaging: 'Jute bags',
            status: 'Stored'
        },
        {
            cropType: 'Vegetables',
            plantingDate: '2024-05-01',
            harvestDate: '2024-08-30',
            storageRequirements: 'Refrigerated',
            shelfLife: '2 weeks',
            packaging: 'Plastic crates',
            status: 'In Transit'
        }
    ];

    // Sample warehouse data
    warehouseData = [
        {
            name: 'Central Warehouse A',
            location: 'Farm City, FC',
            status: 'Active',
            capacity: 5000,
            currentStock: 3200,
            temperature: '18°C',
            humidity: '45%'
        },
        {
            name: 'Distribution Center B',
            location: 'Logistics Hub, LH',
            status: 'Active',
            capacity: 3000,
            currentStock: 2800,
            temperature: '20°C',
            humidity: '50%'
        },
        {
            name: 'Storage Facility C',
            location: 'Port City, PC',
            status: 'Maintenance',
            capacity: 4000,
            currentStock: 800,
            temperature: '22°C',
            humidity: '55%'
        },
        {
            name: 'Regional Hub D',
            location: 'Market Town, MT',
            status: 'Active',
            capacity: 2500,
            currentStock: 2400,
            temperature: '19°C',
            humidity: '48%'
        }
    ];

    // Sample shipments data
    shipmentsData = [
        {
            id: 'SHP001',
            origin: 'Central Warehouse A',
            destination: 'Market Town, MT',
            status: 'On Time',
            driver: 'John Smith',
            vehicle: 'TRK001',
            eta: '2024-01-15 14:30',
            progress: 75
        },
        {
            id: 'SHP002',
            origin: 'Distribution Center B',
            destination: 'Port City, PC',
            status: 'Delayed',
            driver: 'Sarah Johnson',
            vehicle: 'TRK002',
            eta: '2024-01-16 09:15',
            progress: 45
        },
        {
            id: 'SHP003',
            origin: 'Regional Hub D',
            destination: 'Farm City, FC',
            status: 'Delivered',
            driver: 'Mike Davis',
            vehicle: 'TRK003',
            eta: '2024-01-14 16:45',
            progress: 100
        }
    ];

    // Populate tables and cards
    populateProductsTable();
    populateWarehouseCards();
    populateShipmentsList();
}

// Populate products table
function populateProductsTable() {
    const tableBody = document.getElementById('productsTableBody');
    tableBody.innerHTML = '';

    productsData.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.cropType}</td>
            <td>${formatDate(product.plantingDate)}</td>
            <td>${formatDate(product.harvestDate)}</td>
            <td>${product.storageRequirements}</td>
            <td>${product.shelfLife}</td>
            <td>${product.packaging}</td>
            <td><span class="status-badge status-${product.status.toLowerCase().replace(' ', '')}">${product.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editProduct(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteProduct(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Populate warehouse cards
function populateWarehouseCards() {
    const warehouseGrid = document.getElementById('warehouseGrid');
    warehouseGrid.innerHTML = '';

    warehouseData.forEach(warehouse => {
        const stockPercentage = (warehouse.currentStock / warehouse.capacity) * 100;
        const isLowStock = stockPercentage < 20;
        
        const card = document.createElement('div');
        card.className = `warehouse-card ${isLowStock ? 'low-stock' : ''}`;
        card.innerHTML = `
            <div class="warehouse-header">
                <div class="warehouse-name">${warehouse.name}</div>
                <div class="warehouse-status status-${warehouse.status.toLowerCase()}">${warehouse.status}</div>
            </div>
            <div class="warehouse-details">
                <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${warehouse.location}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Temperature</div>
                    <div class="detail-value">${warehouse.temperature}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Humidity</div>
                    <div class="detail-value">${warehouse.humidity}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Stock Level</div>
                    <div class="detail-value">${warehouse.currentStock}/${warehouse.capacity} tons</div>
                </div>
            </div>
            <div class="stock-bar">
                <div class="stock-fill ${isLowStock ? 'low' : ''}" style="width: ${stockPercentage}%"></div>
            </div>
            ${isLowStock ? '<div style="color: #e74c3c; font-weight: 600; margin-top: 10px;">⚠️ Low Stock Alert</div>' : ''}
        `;
        warehouseGrid.appendChild(card);
    });
}

// Populate shipments list
function populateShipmentsList() {
    const shipmentList = document.getElementById('shipmentList');
    shipmentList.innerHTML = '';

    shipmentsData.forEach(shipment => {
        const item = document.createElement('div');
        item.className = 'shipment-item';
        item.innerHTML = `
            <div class="shipment-header">
                <div class="shipment-id">${shipment.id}</div>
                <div class="shipment-status-badge status-${shipment.status.toLowerCase().replace(' ', '')}">${shipment.status}</div>
            </div>
            <div class="shipment-details">
                <div><strong>From:</strong> ${shipment.origin}</div>
                <div><strong>To:</strong> ${shipment.destination}</div>
                <div><strong>Driver:</strong> ${shipment.driver} (${shipment.vehicle})</div>
                <div><strong>ETA:</strong> ${formatDateTime(shipment.eta)}</div>
                <div><strong>Progress:</strong> ${shipment.progress}%</div>
            </div>
        `;
        shipmentList.appendChild(item);
    });
}

// Initialize charts
function initializeCharts() {
    // Delivery Times Chart
    const deliveryCtx = document.getElementById('deliveryChart').getContext('2d');
    new Chart(deliveryCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Average Delivery Time (hours)',
                data: [4.2, 3.8, 4.1, 3.5, 3.2, 3.0],
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });

    // Transportation Costs Chart
    const costCtx = document.getElementById('costChart').getContext('2d');
    new Chart(costCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Costs ($)',
                data: [12500, 11800, 13200, 11500, 10800, 10200],
                backgroundColor: '#f39c12',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Carrier Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'doughnut',
        data: {
            labels: ['Excellent', 'Good', 'Average', 'Poor'],
            datasets: [{
                data: [45, 35, 15, 5],
                backgroundColor: [
                    '#27ae60',
                    '#2ecc71',
                    '#f39c12',
                    '#e74c3c'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Initialize maps
function initializeMaps() {
    // Route optimization map
    const routeMap = L.map('routeMap').setView([40.7128, -74.0060], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(routeMap);

    // Add sample route
    const routeCoordinates = [
        [40.7128, -74.0060], // Start
        [40.7589, -73.9851], // Waypoint 1
        [40.7505, -73.9934], // Waypoint 2
        [40.7484, -73.9857]  // End
    ];

    L.polyline(routeCoordinates, {color: '#2ecc71', weight: 4}).addTo(routeMap);
    L.marker(routeCoordinates[0]).addTo(routeMap).bindPopup('Start Point');
    L.marker(routeCoordinates[routeCoordinates.length - 1]).addTo(routeMap).bindPopup('Destination');

    // Tracking map
    const trackingMap = L.map('trackingMap').setView([40.7128, -74.0060], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(trackingMap);

    // Add sample tracking points
    const trackingPoints = [
        {lat: 40.7128, lng: -74.0060, id: 'SHP001', status: 'On Time'},
        {lat: 40.7589, lng: -73.9851, id: 'SHP002', status: 'Delayed'},
        {lat: 40.7505, lng: -73.9934, id: 'SHP003', status: 'Delivered'}
    ];

    trackingPoints.forEach(point => {
        const color = point.status === 'Delivered' ? '#27ae60' : 
                     point.status === 'Delayed' ? '#e74c3c' : '#2ecc71';
        
        L.circleMarker([point.lat, point.lng], {
            radius: 8,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(trackingMap).bindPopup(`<b>${point.id}</b><br>Status: ${point.status}`);
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Product search and filtering
    const productSearch = document.getElementById('productSearch');
    const cropFilter = document.getElementById('cropFilter');
    const statusFilter = document.getElementById('statusFilter');

    productSearch.addEventListener('input', filterProducts);
    cropFilter.addEventListener('change', filterProducts);
    statusFilter.addEventListener('change', filterProducts);

    // Transportation form
    const transportationForm = document.getElementById('transportationForm');
    transportationForm.addEventListener('submit', handleTransportationSubmit);

    // Contact form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleContactSubmit);

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);

    // Document download buttons
    const downloadButtons = document.querySelectorAll('.document-card .btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', handleDocumentDownload);
    });
}

// Filter products
function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const cropFilter = document.getElementById('cropFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const filteredProducts = productsData.filter(product => {
        const matchesSearch = product.cropType.toLowerCase().includes(searchTerm) ||
                            product.storageRequirements.toLowerCase().includes(searchTerm) ||
                            product.packaging.toLowerCase().includes(searchTerm);
        const matchesCrop = !cropFilter || product.cropType === cropFilter;
        const matchesStatus = !statusFilter || product.status === statusFilter;

        return matchesSearch && matchesCrop && matchesStatus;
    });

    displayFilteredProducts(filteredProducts);
}

// Display filtered products
function displayFilteredProducts(products) {
    const tableBody = document.getElementById('productsTableBody');
    tableBody.innerHTML = '';

    products.forEach((product, index) => {
        // Find the original index in the productsData array
        const originalIndex = productsData.findIndex(p => 
            p.cropType === product.cropType && 
            p.plantingDate === product.plantingDate &&
            p.harvestDate === product.harvestDate
        );
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.cropType}</td>
            <td>${formatDate(product.plantingDate)}</td>
            <td>${formatDate(product.harvestDate)}</td>
            <td>${product.storageRequirements}</td>
            <td>${product.shelfLife}</td>
            <td>${product.packaging}</td>
            <td><span class="status-badge status-${product.status.toLowerCase().replace(' ', '')}">${product.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editProduct(${originalIndex})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteProduct(${originalIndex})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Sort table
function sortTable(columnIndex) {
    const tableBody = document.getElementById('productsTableBody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    if (currentSortColumn === columnIndex) {
        sortDirection *= -1;
    } else {
        sortDirection = 1;
        currentSortColumn = columnIndex;
    }

    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();

        if (columnIndex === 1 || columnIndex === 2) { // Date columns
            return sortDirection * (new Date(aValue) - new Date(bValue));
        } else {
            return sortDirection * aValue.localeCompare(bValue);
        }
    });

    rows.forEach(row => tableBody.appendChild(row));
}

// Handle transportation form submission
function handleTransportationSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const deliveryData = {
        vehicle: formData.get('vehicleId'),
        destination: formData.get('destination'),
        deliveryDate: formData.get('deliveryDate'),
        cargoType: formData.get('cargoType'),
        quantity: formData.get('quantity')
    };

    // Simulate form submission
    showNotification('Delivery scheduled successfully!', 'success');
    e.target.reset();
    
    // Update route optimization
    updateRouteOptimization(deliveryData);
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    e.target.reset();
}

// Handle newsletter subscription
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    showNotification(`Thank you for subscribing with ${email}!`, 'success');
    e.target.reset();
}

// Handle document download
function handleDocumentDownload(e) {
    e.preventDefault();
    const documentType = e.target.closest('.document-card').querySelector('h3').textContent;
    showNotification(`${documentType} download started...`, 'info');
}

// Update route optimization
function updateRouteOptimization(deliveryData) {
    const routeStats = document.querySelectorAll('.route-stat span');
    
    // Simulate route calculation
    const distance = Math.floor(Math.random() * 200) + 150;
    const time = Math.floor(distance / 60) + 'h ' + (distance % 60) + 'm';
    const cost = Math.floor(distance * 0.8);

    routeStats[0].textContent = `Optimal Route: ${distance} km`;
    routeStats[1].textContent = `Estimated Time: ${time}`;
    routeStats[2].textContent = `Fuel Cost: $${cost}`;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const elementsToAnimate = document.querySelectorAll('.section, .warehouse-card, .document-card, .kpi-card');
    elementsToAnimate.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Product CRUD functions
function openAddProductModal() {
    openModal('addProductModal');
}

function editProduct(index) {
    const product = productsData[index];
    if (!product) return;

    // Populate the edit form
    document.getElementById('editProductIndex').value = index;
    document.getElementById('editCropType').value = product.cropType;
    document.getElementById('editPlantingDate').value = product.plantingDate;
    document.getElementById('editHarvestDate').value = product.harvestDate;
    document.getElementById('editStorageRequirements').value = product.storageRequirements;
    document.getElementById('editShelfLife').value = product.shelfLife;
    document.getElementById('editPackaging').value = product.packaging;
    document.getElementById('editStatus').value = product.status;

    openModal('editProductModal');
}

function deleteProduct(index) {
    const product = productsData[index];
    if (!product) return;

    currentDeleteIndex = index;
    document.getElementById('deleteProductName').textContent = product.cropType;
    openModal('deleteProductModal');
}

function confirmDeleteProduct() {
    if (currentDeleteIndex >= 0 && currentDeleteIndex < productsData.length) {
        const deletedProduct = productsData[currentDeleteIndex];
        productsData.splice(currentDeleteIndex, 1);
        
        // Refresh the table
        populateProductsTable();
        
        // Close modal
        closeModal('deleteProductModal');
        
        // Show notification
        showNotification(`Product "${deletedProduct.cropType}" has been deleted successfully.`, 'success');
        
        // Reset current delete index
        currentDeleteIndex = -1;
    }
}

// Initialize form event listeners
function initializeFormEventListeners() {
    // Add product form
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newProduct = {
                cropType: document.getElementById('newCropType').value,
                plantingDate: document.getElementById('newPlantingDate').value,
                harvestDate: document.getElementById('newHarvestDate').value,
                storageRequirements: document.getElementById('newStorageRequirements').value,
                shelfLife: document.getElementById('newShelfLife').value,
                packaging: document.getElementById('newPackaging').value,
                status: document.getElementById('newStatus').value
            };

            // Add to products data
            productsData.push(newProduct);
            
            // Refresh the table
            populateProductsTable();
            
            // Close modal and reset form
            closeModal('addProductModal');
            addProductForm.reset();
            
            // Show notification
            showNotification(`Product "${newProduct.cropType}" has been added successfully.`, 'success');
        });
    }

    // Edit product form
    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        editProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const index = parseInt(document.getElementById('editProductIndex').value);
            if (index >= 0 && index < productsData.length) {
                const updatedProduct = {
                    cropType: document.getElementById('editCropType').value,
                    plantingDate: document.getElementById('editPlantingDate').value,
                    harvestDate: document.getElementById('editHarvestDate').value,
                    storageRequirements: document.getElementById('editStorageRequirements').value,
                    shelfLife: document.getElementById('editShelfLife').value,
                    packaging: document.getElementById('editPackaging').value,
                    status: document.getElementById('editStatus').value
                };

                // Update the product
                productsData[index] = updatedProduct;
                
                // Refresh the table
                populateProductsTable();
                
                // Close modal
                closeModal('editProductModal');
                
                // Show notification
                showNotification(`Product "${updatedProduct.cropType}" has been updated successfully.`, 'success');
            }
        });
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Real-time updates simulation
setInterval(() => {
    // Update condition monitoring values
    const temperatureGauge = document.querySelector('.condition-item:nth-child(1) .gauge-fill');
    const humidityGauge = document.querySelector('.condition-item:nth-child(2) .gauge-fill');
    const vibrationGauge = document.querySelector('.condition-item:nth-child(3) .gauge-fill');

    if (temperatureGauge) {
        const newTemp = Math.random() * 30 + 15; // 15-45°C
        const tempPercentage = ((newTemp - 15) / 30) * 100;
        temperatureGauge.style.width = `${tempPercentage}%`;
        temperatureGauge.nextElementSibling.textContent = `${newTemp.toFixed(1)}°C`;
    }

    if (humidityGauge) {
        const newHumidity = Math.random() * 40 + 30; // 30-70%
        const humidityPercentage = ((newHumidity - 30) / 40) * 100;
        humidityGauge.style.width = `${humidityPercentage}%`;
        humidityGauge.nextElementSibling.textContent = `${newHumidity.toFixed(0)}%`;
    }

    if (vibrationGauge) {
        const newVibration = Math.random() * 100;
        vibrationGauge.style.width = `${newVibration}%`;
        vibrationGauge.nextElementSibling.textContent = newVibration < 30 ? 'Low' : newVibration < 70 ? 'Medium' : 'High';
    }
}, 5000); // Update every 5 seconds

// Export functions for global access
window.scrollToSection = scrollToSection;
window.sortTable = sortTable; 