document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Filter functionality for products and blog
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productCards = document.querySelectorAll('.product-card');
    const blogCards = document.querySelectorAll('.blog-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Filter products if on products page
            if (productCards.length > 0) {
                filterProducts(category);
            }

            // Filter blog posts if on blog page
            if (blogCards.length > 0) {
                filterBlogPosts(category);
            }
        });
    });

    function filterProducts(category) {
        productCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // filterBlogPosts function moved to pagination section

    // Search functionality
    const productSearch = document.getElementById('product-search');
    const blogSearch = document.getElementById('blog-search');

    if (productSearch) {
        productSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchProducts(searchTerm);
        });
    }

    if (blogSearch) {
        blogSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchBlogPosts(searchTerm);
        });
    }

    function searchProducts(searchTerm) {
        productCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const category = card.querySelector('.category').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // searchBlogPosts function moved to pagination section

    // Newsletter subscription
    const subscribeBtn = document.getElementById('subscribe-btn');
    const newsletterSubscribe = document.getElementById('newsletter-subscribe');
    const emailInput = document.getElementById('email-input');
    const newsletterEmail = document.getElementById('newsletter-email');

    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function() {
            handleSubscription(emailInput);
        });
    }

    if (newsletterSubscribe) {
        newsletterSubscribe.addEventListener('click', function() {
            handleSubscription(newsletterEmail);
        });
    }

    function handleSubscription(input) {
        const email = input.value.trim();
        
        if (!email) {
            showNotification('Please enter your email address', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate subscription process
        showNotification('Thank you for subscribing! Welcome to GreenHub.', 'success');
        input.value = '';
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Blog pagination functionality
    let currentPage = 1;
    let articlesPerPage = 6;
    let allBlogCards = [];
    let filteredBlogCards = [];

    function initializePagination() {
        allBlogCards = Array.from(document.querySelectorAll('.blog-card'));
        filteredBlogCards = [...allBlogCards];
        
        if (allBlogCards.length > 0) {
            setupPaginationEventListeners();
            showPage(1);
        }
    }

    function setupPaginationEventListeners() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const itemsPerPageSelect = document.getElementById('items-per-page-select');

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    showPage(currentPage - 1);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                const totalPages = Math.ceil(filteredBlogCards.length / articlesPerPage);
                if (currentPage < totalPages) {
                    showPage(currentPage + 1);
                }
            });
        }

        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', function() {
                articlesPerPage = parseInt(this.value);
                currentPage = 1; // Reset to first page
                showPage(1);
                
                // Show notification about change
                showNotification(`Showing ${articlesPerPage} articles per page`, 'info');
            });
        }
    }

    function showPage(page) {
        currentPage = page;
        const startIndex = (page - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;

        // Hide all blog cards first
        allBlogCards.forEach(card => {
            card.style.display = 'none';
        });

        // Show only the cards for current page
        filteredBlogCards.slice(startIndex, endIndex).forEach(card => {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease-out';
        });

        updatePaginationUI();
        
        // Scroll to top of blog section
        const blogSection = document.querySelector('.content-section');
        if (blogSection) {
            blogSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function updatePaginationUI() {
        const totalPages = Math.ceil(filteredBlogCards.length / articlesPerPage);
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const pageNumbers = document.getElementById('page-numbers');
        const paginationInfo = document.getElementById('pagination-info');
        const paginationNav = document.getElementById('pagination');

        // Hide pagination if only one page or no articles
        if (totalPages <= 1) {
            if (paginationNav) paginationNav.style.display = 'none';
        } else {
            if (paginationNav) paginationNav.style.display = 'flex';
        }

        // Update Previous button
        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
            prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
        }

        // Update Next button
        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
        }

        // Update page numbers
        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            
            // Show maximum 7 page numbers for better UX
            let startPage = Math.max(1, currentPage - 3);
            let endPage = Math.min(totalPages, startPage + 6);
            
            if (endPage - startPage < 6) {
                startPage = Math.max(1, endPage - 6);
            }

            // Add first page and ellipsis if needed
            if (startPage > 1) {
                const firstPageBtn = createPageButton(1);
                pageNumbers.appendChild(firstPageBtn);
                
                if (startPage > 2) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    ellipsis.className = 'pagination-ellipsis';
                    ellipsis.style.cssText = 'display: flex; align-items: center; padding: 0 8px; color: var(--text-light);';
                    pageNumbers.appendChild(ellipsis);
                }
            }
            
            // Add main page numbers
            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = createPageButton(i);
                pageNumbers.appendChild(pageBtn);
            }
            
            // Add last page and ellipsis if needed
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    ellipsis.className = 'pagination-ellipsis';
                    ellipsis.style.cssText = 'display: flex; align-items: center; padding: 0 8px; color: var(--text-light);';
                    pageNumbers.appendChild(ellipsis);
                }
                
                const lastPageBtn = createPageButton(totalPages);
                pageNumbers.appendChild(lastPageBtn);
            }
        }

        // Update pagination info
        if (paginationInfo) {
            const startItem = filteredBlogCards.length === 0 ? 0 : (currentPage - 1) * articlesPerPage + 1;
            const endItem = Math.min(currentPage * articlesPerPage, filteredBlogCards.length);
            
            if (filteredBlogCards.length === 0) {
                paginationInfo.textContent = 'No articles found';
            } else if (filteredBlogCards.length === 1) {
                paginationInfo.textContent = 'Showing 1 article';
            } else {
                paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredBlogCards.length} articles`;
            }
        }
    }

    function createPageButton(pageNum) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = pageNum;
        pageBtn.className = 'btn btn-outline page-number';
        
        if (pageNum === currentPage) {
            pageBtn.classList.add('active');
            pageBtn.style.backgroundColor = 'var(--primary-green)';
            pageBtn.style.color = 'white';
        }
        
        pageBtn.addEventListener('click', function() {
            showPage(pageNum);
        });
        
        return pageBtn;
    }

    // Override the existing filterBlogPosts function to work with pagination
    function filterBlogPosts(category) {
        allBlogCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.classList.remove('filtered-out');
            } else {
                card.classList.add('filtered-out');
            }
        });

        // Update filtered cards array
        filteredBlogCards = allBlogCards.filter(card => !card.classList.contains('filtered-out'));
        
        // Reset to first page and update display
        showPage(1);
    }

    // Override the existing searchBlogPosts function to work with pagination
    function searchBlogPosts(searchTerm) {
        allBlogCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const category = card.querySelector('.category').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
                card.classList.remove('search-filtered');
            } else {
                card.classList.add('search-filtered');
            }
        });

        // Update filtered cards array (consider both category filter and search)
        filteredBlogCards = allBlogCards.filter(card => 
            !card.classList.contains('filtered-out') && !card.classList.contains('search-filtered')
        );
        
        // Reset to first page and update display
        showPage(1);
    }

    // Pagination initialization moved to end of DOMContentLoaded

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Card hover effects
    const cards = document.querySelectorAll('.product-card, .blog-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(400px);
            transition: transform 0.3s ease-out;
        `;

        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                notification.style.backgroundColor = '#f44336';
                break;
            case 'info':
                notification.style.backgroundColor = '#2196F3';
                break;
            default:
                notification.style.backgroundColor = '#4CAF50';
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);

        // Click to dismiss
        notification.addEventListener('click', function() {
            this.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            }, 300);
        });
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .nav-toggle.active .bar:nth-child(2) {
            opacity: 0;
        }

        .nav-toggle.active .bar:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }

        .nav-toggle.active .bar:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }

        .product-card, .blog-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .navbar {
            transition: transform 0.3s ease;
        }

        .price {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--primary-green);
            margin-bottom: 1rem;
        }
    `;
    document.head.appendChild(style);

    // Initialize any URL parameters for filtering
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        // Find and activate the corresponding filter tab
        const targetTab = document.querySelector(`.filter-tab[data-category="${categoryParam}"]`);
        if (targetTab) {
            targetTab.click();
        }
    }

    // Add price styles to CSS
    const priceStyle = document.createElement('style');
    priceStyle.textContent = `
        .price {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--primary-green);
            margin-bottom: 1rem;
        }
    `;
    document.head.appendChild(priceStyle);

    // Welcome message on first visit
    if (!localStorage.getItem('hasVisited')) {
        setTimeout(() => {
            showNotification('Welcome to GreenHub! Explore our products and articles.', 'success');
            localStorage.setItem('hasVisited', 'true');
        }, 2000);
    }

    // Initialize pagination for blog page
    if (document.querySelector('.blog-card')) {
        initializePagination();
    }
});