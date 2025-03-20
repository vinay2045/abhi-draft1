// Menu functionality for the travel blog
document.addEventListener('DOMContentLoaded', function() {
    // Track page visibility to handle tab switching
    let pageVisible = true;
    
    // Add visibility change detection
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            pageVisible = false;
            console.log('Page hidden, slideshow paused');
            // We don't stop the slideshow here, just track visibility
        } else {
            pageVisible = true;
            console.log('Page visible again, ensuring slideshow is running');
            // Restart slideshow in all carousel instances
            const carouselTracks = document.querySelectorAll('.hero-carousel-track');
            if (carouselTracks.length > 0) {
                setupHeroCarousel();
            }
        }
    });
    
    // Hero Carousel Setup
    setupHeroCarousel();
    
    // Rest of the code...
    
    // Setup all other features
    setupMenuAndUI();
    
    // Handle form submissions
    setupFormSubmissions();
});

// Make sure carousel and menu are set up even if DOMContentLoaded has issues
window.addEventListener('load', function() {
    const carouselTrack = document.getElementById('carouselTrack');
    // Check if carousel was already set up during DOMContentLoaded
    if (carouselTrack && carouselTrack.children.length === 0) {
        console.log('Fallback: Setting up carousel on window.load');
        setupHeroCarousel();
    }
    
    // Ensure menu is set up correctly regardless of how page was loaded
    const menuButton = document.getElementById('nav-part1');
    if (menuButton) {
        // If setupMenuAndUI hasn't been called yet, or we need to reinitialize
        setupMenuAndUI();
    }
});

// Hero Carousel Setup Function
function setupHeroCarousel() {
    // Carousel data with images and their associated content
    const carouselItems = [
        {
            image: '../images/https://images.unsplash.com/photo-1739606944848-97662c0430f0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'Manali & Kashmir - ₹16,999',
            heading: 'Explore the Paradise ',
            subheading: 'Experience the serene beauty of north India',
            tags: ['Mountains', 'Nature', 'Adventure']
        },
        
        {
            image: '../images/photo-1590001155093-a3c66ab0c3ff.avif',
            title: 'Maldives - ₹65,999',
            heading: 'Discover Hidden Gems',
            subheading: 'Sun-kissed beaches await you',
            tags: ['Beach', 'Luxury', 'Island']
        },
        {
            image: '../images/premium_photo-1661929242720-140374d97c94.avif',
            title: 'Thailand - ₹31,999',
            heading: 'Explore Exotic Thailand',
            subheading: 'Experience vibrant culture and pristine beaches',
            tags: ['Culture', 'Beach', 'Adventure']
        },
        {
            image: '../images/https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop',
            title: 'Dubai - ₹49,999',
            heading: 'Luxury in the Desert',
            subheading: 'Experience modern marvels and traditional charm',
            tags: ['Luxury', 'Shopping', 'Adventure']
        }
    ];

    const carouselTrack = document.getElementById('carouselTrack');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    const slideTemplate = document.getElementById('slide-template');
    
    if (!carouselTrack || !indicatorsContainer) {
        console.error('Carousel elements not found');
        return;
    }
    
    // Clear existing content
    carouselTrack.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    
    // Create slides using the template
    carouselItems.forEach((item, index) => {
        // Create a new element from the template
        const slide = document.createElement('div');
        slide.className = 'hero-carousel-slide fade';
        slide.style.backgroundImage = `url('${item.image}')`;
        slide.style.display = 'none'; // Hide all slides initially
        
        // Create the content structure
        const content = `
            <div class="numbertext">${index + 1} / ${carouselItems.length}</div>
            <div class="hero-content">
               <h1>${item.heading}</h1>
                <h4>${item.subheading}</h4>
                <div class="card-content-white-bg">

                     <div class="card-title">${item.title}</div>
                
               
                   <div class="card-tags"></div>
                    <div class="read-more">→</div>
                </div>
            </div>
             <div class="hero-highlight">
                <h3>Book Your Seats Now                        </h3>
               
                <button class="cta-btn">Book now</button>
            </div>
           
        `;
        
        slide.innerHTML = content;
        
        // Add tags
        const tagsContainer = slide.querySelector('.card-tags');
        item.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.textContent = tag;
            tagsContainer.appendChild(tagSpan);
        });
        
        // Add the slide to the carousel
        carouselTrack.appendChild(slide);
        
        // Create indicator dot
        const indicator = document.createElement('span');
        indicator.className = 'hero-indicator';
        indicator.dataset.index = index;
        indicatorsContainer.appendChild(indicator);
    });
    
    // Add CSS for fade animation
    if (!document.getElementById('fade-animation-style')) {
        const fadeStyle = document.createElement('style');
        fadeStyle.id = 'fade-animation-style';
        fadeStyle.textContent = `
            @keyframes fade {
                from {opacity: 0.4}
                to {opacity: 1}
            }
            
            .fade {
                animation-name: fade;
                animation-duration: 1.5s;
            }
        `;
        document.head.appendChild(fadeStyle);
    }
    
    // Get all carousel elements
    const slides = carouselTrack.querySelectorAll('.hero-carousel-slide');
    const dots = indicatorsContainer.querySelectorAll('.hero-indicator');
    const prevButton = document.querySelector('.hero-carousel-nav.prev');
    const nextButton = document.querySelector('.hero-carousel-nav.next');
    const carouselContainer = document.querySelector('.hero-carousel-container');
    
    if (slides.length === 0) {
        console.error('No slides found');
        return;
    }
    
    // Global variables for slideshow control
    let slideIndex = 0;
    let slideInterval = null;
    
    // Show a specific slide
    function showSlide(n) {
        // Handle index bounds
        if (n >= slides.length) {
            slideIndex = 0;
        } else if (n < 0) {
            slideIndex = slides.length - 1;
        } else {
            slideIndex = n;
        }
        
        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
            dots[i].classList.remove("active");
        }
        
        // Show the current slide
        slides[slideIndex].style.display = "block";
        dots[slideIndex].classList.add("active");
        console.log('Showing slide', slideIndex + 1, 'of', slides.length);
    }
    
    // Start the automatic slideshow
    function startSlideshow() {
        // Clear any existing interval first
        stopSlideshow();
        
        // Set the slide interval
        slideInterval = setInterval(function() {
            slideIndex++;
            
            // Ensure we loop back to the first slide after the last one
            if (slideIndex >= slides.length) {
                slideIndex = 0;
            }
            
            showSlide(slideIndex);
            console.log('Auto-advancing to slide:', slideIndex + 1);
        }, 2000); // Use 2000ms (2 seconds) for better user experience
        
        console.log('Slideshow interval started with ID:', slideInterval);
    }
    
    // Function to stop the slideshow
    function stopSlideshow() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    // Initialize the first slide and ensure it's visible
    showSlide(0);
    
    // Make sure our first slide is actually visible
    slides[0].style.display = "block";
    dots[0].classList.add("active");
    
    // Force the slideshow to start after a small delay to ensure DOM is ready
    window.setTimeout(function() {
        startSlideshow();
        console.log('Forced slideshow start after timeout');
        
        // Test the slideshow is working by advancing to next slide after 2 seconds
        window.setTimeout(function() {
            if (slideIndex === 0) {
                // If still on first slide after 2 seconds, force advance to next slide
                slideIndex++;
                showSlide(slideIndex);
                console.log('Forced first slide change');
            }
        }, 2000);
    }, 500);
    
    // Previous button click handler
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            stopSlideshow();
            showSlide(slideIndex - 1);
            startSlideshow();
        });
    }
    
    // Next button click handler
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            stopSlideshow();
            showSlide(slideIndex + 1);
            startSlideshow();
        });
    }
    
    // Indicator dots click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopSlideshow();
            showSlide(index);
            startSlideshow();
        });
    });
    
    // Pause slideshow on hover
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopSlideshow);
        
        // Resume slideshow when mouse leaves
        carouselContainer.addEventListener('mouseleave', startSlideshow);
    }
    
    // Debug info
    console.log('Slideshow initialized with ' + slides.length + ' slides');
}

/**
 * Setup navigation menu and UI elements
 */
function setupMenuAndUI() {
    // Get the menu button and containers
    const menuButton = document.getElementById('nav-part1');
    const desktopMenu = document.getElementById('nav-part3');
    
    // Remove any existing dropdown menus to prevent duplication
    const existingMenus = document.querySelectorAll('.dropdown-menu');
    existingMenus.forEach(menu => menu.remove());
    
    // Create mobile dropdown menu
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'dropdown-menu-js';
    mobileMenu.style.display = 'none';
    
    // Define common menu structure for both mobile and desktop
    const menuItems = [
        { type: 'link', text: 'Home', url: 'index.html', icon: 'bx bxs-home-alt-2' },
        { type: 'link', text: 'About Us', url: 'aboutus.html', icon: 'bx bxs-invader' },
        { 
            type: 'dropdown', 
            text: 'Our Services', 
            id: 'ourservices',
            icon: 'bx bxs-invader',
            items: [
                { text: 'Flight Tickets', url: 'Flight Tickets.html', icon: 'bx bxs-plane-alt' },
                { text: 'Apply For Passport Application', url: 'Apply For Passport Application.html', icon: 'bx bxs-id-card' },
                { text: 'Visa For All Countries', url: 'visa for all countries.html', icon: 'bx bxs-file-doc' },
                { text: 'Honeymoon Packages', url: 'honeymoonpackages.html', icon: 'bx bxs-heart' },
                { text: 'Forex Services', url: 'forex.html', icon: 'bx bx-money' }
            ]
        },
        { 
            type: 'dropdown', 
            text: 'Trips', 
            id: 'trips',
            icon: 'bx bxl-airbnb',
            items: [
                { text: 'Domestic Tours', url: 'Domestic Tours.html', icon: 'bx bxs-map' },
                { text: 'International Tours', url: 'International Tours.html', icon: 'bx bx-globe' }
            ]
        },
        { type: 'link', text: 'Contact Us', url: 'contactus.html', icon: 'bx bx-mail-send' }
    ];

    // Update URL paths to ensure spaces are properly encoded
    menuItems.forEach(item => {
        if (item.url) {
            item.url = item.url.replace(/ /g, '%20');
        }
        if (item.items) {
            item.items.forEach(subItem => {
                if (subItem.url) {
                    subItem.url = subItem.url.replace(/ /g, '%20');
                }
            });
        }
    });
    
    // Functions to generate menu HTML
    function generateMobileMenuHTML() {
        let html = '<div class="menu-section">';
        
        menuItems.forEach(item => {
            if (item.type === 'link') {
                html += `<a href="${item.url}" class="menu-item">${item.text}</a>`;
            } else if (item.type === 'dropdown') {
                html += `
                    <div class="menu-item has-submenu">
                        <span>${item.text}</span>
                        <div class="submenu" style="display: none;">
                `;
                
                item.items.forEach(subItem => {
                    html += `<a href="${subItem.url}" class="submenu-item"><i class='${subItem.icon}'></i> ${subItem.text}</a>`;
                });
                
                html += `
                        </div>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        return html;
    }
    
    function generateDesktopMenuHTML() {
        let html = '';
        
        menuItems.forEach(item => {
            if (item.type === 'link') {
                html += `<a href="${item.url}"><h3><span>${item.text}</span> <span><i class='${item.icon}'></i></span></h3></a>`;
            } else if (item.type === 'dropdown') {
                html += `<h3 id="${item.id}"><span>${item.text}</span> <span><i class='${item.icon}'></i></span></h3>`;
            }
        });
        
        return html;
    }
    
    // Populate mobile menu
    mobileMenu.innerHTML = generateMobileMenuHTML();
    
    // Populate desktop menu
    desktopMenu.innerHTML = generateDesktopMenuHTML();
    
    // Insert dropdown menu after the navigation
    const nav = document.querySelector('nav');
    nav.parentNode.insertBefore(mobileMenu, nav.nextSibling);
    
    // Add CSS for consistent menu styling
    const menuStyles = document.createElement('style');
    menuStyles.textContent = `
        /* Desktop Menu Styles */
        #nav-part3.desktop-menu {
            display: flex;
            align-items: center;
            gap: 8px;
            max-width: 60%;
            flex-wrap: wrap;
            justify-content: flex-end;
        }
        
        #nav-part3.desktop-menu a i {
            font-size: 1.3rem;
            color: var(--text-color);
            font-weight: 900;
            margin-left: .5rem;
        }
        
        #nav-part3.desktop-menu a h3 {
            display: flex;
            align-items: center;
        }
        
        nav h3 {
            border: 1.5px solid var(--text-color);
            color: var(--text-color);
            font-weight: 500;
            padding: 5px 10px;
            border-radius: 50px;
            cursor: pointer;
        }
        
        /* Mobile Menu Styles */
        .dropdown-menu-js {
            position: fixed;
            background-color: var(--bg-color);
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 999;
            padding: 12px;
            transition: all 0.3s ease;
            border: 1px solid var(--border-color);
            max-height: calc(80vh - 70px);
            overflow-y: auto;
            width: 250px;
        }
        
        .menu-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .menu-item {
            display: block;
            padding: 8px 12px;
            color: var(--text-color);
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 15px;
            transition: background-color 0.3s ease;
            position: relative;
        }
        
        .menu-item:hover {
            background-color: var(--card-bg);
        }
        
        .has-submenu {
            cursor: pointer;
            position: relative;
        }
        
        .has-submenu > span {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }
        
        .has-submenu > span::after {
            content: '›';
            font-size: 18px;
            transform: rotate(90deg);
            transition: transform 0.3s ease;
        }
        
        .has-submenu.open > span::after {
            transform: rotate(270deg);
        }
        
        .submenu {
            position: relative;
            left: 0;
            top: 5px;
            background-color: var(--bg-color);
            border-radius: 6px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            padding: 8px;
            width: 100%;
            border: 1px solid var(--border-color);
            margin-left: 10px;
            max-height: calc(60vh - 70px);
            overflow-y: auto;
        }
        
        .submenu-item {
            display: block;
            padding: 6px 12px;
            color: var(--text-color);
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .submenu-item:hover {
            background-color: var(--card-bg);
        }
        
        /* Desktop Dropdowns */
        .desktop-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            background-color: var(--bg-color);
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            padding: 15px;
            min-width: 220px;
            z-index: 1000;
            margin-top: 10px;
            display: none;
            border: 1px solid var(--border-color);
        }
        
        .desktop-dropdown a {
            display: block;
            padding: 10px 15px;
            color: var(--text-color);
            text-decoration: none;
            border-radius: 5px;
            margin: 5px 0;
            transition: all 0.2s ease;
        }
        
        .desktop-dropdown a:hover {
            background-color: rgba(26, 138, 158, 0.1);
            color: #1a8a9e;
            transform: translateX(5px);
        }
        
        #ourservices, #trips {
            cursor: pointer;
            position: relative;
        }
        
        #ourservices::after, #trips::after {
            content: '▼';
            font-size: 10px;
            margin-left: 5px;
            display: inline-block;
            transition: transform 0.3s ease;
        }
        
        #ourservices.active::after, #trips.active::after {
            transform: rotate(180deg);
        }
        
        /* Responsive Styles */
        @media (max-width: 1024px) {
            #nav-part1 {
                display: flex !important;
                align-items: center;
                cursor: pointer;
            }
            
            #nav-part3.desktop-menu {
                display: none !important;
            }
            
            /* Ensure dropdown menu has correct z-index */
            .dropdown-menu-js {
                z-index: 1010;
            }
        }
        
        @media (min-width: 1025px) {
            #nav-part1 {
                display: none !important;
            }
            
            .dropdown-menu-js {
                display: none !important;
            }
            
            #nav-part3.desktop-menu {
                display: flex !important;
            }
        }
        
        @media (max-width: 768px) {
            .dropdown-menu-js {
                width: 240px;
                top: 65px;
                left: 15px;
            }
        }
        
        @media (max-width: 480px) {
            .dropdown-menu-js {
                width: 220px;
                left: 10px;
            }
        }
    `;
    
    document.head.appendChild(menuStyles);
    
    // Create desktop dropdowns
    const ourServicesDropdown = document.createElement('div');
    ourServicesDropdown.className = 'desktop-dropdown services-dropdown';
    
    const tripsDropdown = document.createElement('div');
    tripsDropdown.className = 'desktop-dropdown trips-dropdown';
    
    // Generate dropdowns content
    let ourServicesHTML = '<div class="Section-ourservices">';
    menuItems[2].items.forEach(item => {
        ourServicesHTML += `<a href="${item.url}">${item.text}</a>`;
    });
    ourServicesHTML += '</div>';
    
    let tripsHTML = '<div class="Section-trips">';
    menuItems[3].items.forEach(item => {
        tripsHTML += `<a href="${item.url}">${item.text}</a>`;
    });
    tripsHTML += '</div>';
    
    ourServicesDropdown.innerHTML = ourServicesHTML;
    tripsDropdown.innerHTML = tripsHTML;
    
    // Append dropdowns to the body
    document.body.appendChild(ourServicesDropdown);
    document.body.appendChild(tripsDropdown);
    
    // Toggle mobile menu
    menuButton.addEventListener('click', function(event) {
        event.stopPropagation();
        const isVisible = mobileMenu.style.display === 'block';
        
        // Toggle menu visibility
        mobileMenu.style.display = isVisible ? 'none' : 'block';
        
        // Position the menu - fixed positioning relative to menu button
        if (!isVisible) {
            const buttonRect = menuButton.getBoundingClientRect();
            const navRect = nav.getBoundingClientRect();
            
            // Set fixed position relative to the nav element
            mobileMenu.style.position = 'fixed';
            mobileMenu.style.top = `${buttonRect.bottom}px`;
            
            // Adjust left position based on screen size
            if (window.innerWidth <= 480) {
                mobileMenu.style.left = '10px';
            } else if (window.innerWidth <= 768) {
                mobileMenu.style.left = '15px';
            } else {
                mobileMenu.style.left = '20px';
            }
        }
    });
    
    // Update menu position when scrolling
    window.addEventListener('scroll', function() {
        if (mobileMenu.style.display === 'block') {
            const buttonRect = menuButton.getBoundingClientRect();
            mobileMenu.style.top = `${buttonRect.bottom}px`;
        }
    });
    
    // Handle mobile submenu toggles
    const mobileSubmenus = mobileMenu.querySelectorAll('.has-submenu');
    mobileSubmenus.forEach(submenu => {
        submenu.addEventListener('click', function(event) {
            event.stopPropagation();
            const submenuContent = this.querySelector('.submenu');
            const hasOpenClass = this.classList.contains('open');
            
            // Close other submenus
            mobileSubmenus.forEach(item => {
                if (item !== this) {
                    item.classList.remove('open');
                    item.querySelector('.submenu').style.display = 'none';
                }
            });
            
            // Toggle current submenu
            if (!hasOpenClass) {
                this.classList.add('open');
                submenuContent.style.display = 'block';
            } else {
                this.classList.remove('open');
                submenuContent.style.display = 'none';
            }
        });
    });
    
    // Handle desktop menu dropdowns
    const ourservices = document.getElementById('ourservices');
    const trips = document.getElementById('trips');
    
    if (ourservices) {
        ourservices.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Position dropdown
            const rect = this.getBoundingClientRect();
            ourServicesDropdown.style.left = rect.left + 'px';
            ourServicesDropdown.style.top = (rect.bottom + window.scrollY) + 'px';
            
            // Toggle dropdown
            this.classList.toggle('active');
            trips.classList.remove('active');
            
            const isVisible = ourServicesDropdown.style.display === 'block';
            ourServicesDropdown.style.display = isVisible ? 'none' : 'block';
            tripsDropdown.style.display = 'none';
        });
    }
    
    if (trips) {
        trips.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Position dropdown
            const rect = this.getBoundingClientRect();
            tripsDropdown.style.left = rect.left + 'px';
            tripsDropdown.style.top = (rect.bottom + window.scrollY) + 'px';
            
            // Toggle dropdown
            this.classList.toggle('active');
            ourservices.classList.remove('active');
            
            const isVisible = tripsDropdown.style.display === 'block';
            tripsDropdown.style.display = isVisible ? 'none' : 'block';
            ourServicesDropdown.style.display = 'none';
        });
    }
    
    // Close all menus when clicking outside
    document.addEventListener('click', function(event) {
        // Close mobile menu and submenus
        if (!menuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.style.display = 'none';
            mobileSubmenus.forEach(item => {
                item.classList.remove('open');
                item.querySelector('.submenu').style.display = 'none';
            });
        }
        
        // Close desktop dropdowns
        if (ourservices && !ourservices.contains(event.target) && !ourServicesDropdown.contains(event.target)) {
            ourServicesDropdown.style.display = 'none';
            ourservices.classList.remove('active');
        }
        
        if (trips && !trips.contains(event.target) && !tripsDropdown.contains(event.target)) {
            tripsDropdown.style.display = 'none';
            trips.classList.remove('active');
        }
    });
    
    // Create and add WhatsApp floating button
    const whatsappButton = document.createElement('a');
    whatsappButton.href = 'https://wa.me/+918886226565'; // Abhi Tours & Travels WhatsApp number
    whatsappButton.target = '_blank';
    whatsappButton.className = 'whatsapp-float';
    whatsappButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/>
        </svg>
    `;

    // Add styles for the WhatsApp button
    const whatsappStyle = document.createElement('style');
    whatsappStyle.textContent = `
        .whatsapp-float {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: #25D366;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
            margin: 15px;
        }

        .whatsapp-float:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
            background-color: #22c15e;
        }

        .whatsapp-float svg {
            width: 28px;
            height: 28px;
            transition: all 0.3s ease;
        }

        .whatsapp-float:hover svg {
            transform: scale(1.1);
        }

        @media (max-width: 768px) {
            .whatsapp-float {
                bottom: 15px;
                right: 15px;
                width: 45px;
                height: 45px;
                margin: 10px;
            }

            .whatsapp-float svg {
                width: 24px;
                height: 24px;
            }
        }

        @media (min-width: 1200px) {
            .whatsapp-float {
                right: calc((100vw - 1200px) / 2 + 30px);
            }
        }
    `;

    document.head.appendChild(whatsappStyle);
    document.body.appendChild(whatsappButton);

    // Contact Form Popup Functionality
    const contactBtn = document.getElementById('contactBtn');
    const contactPopup = document.getElementById('contactPopup');
    const closeContactPopup = document.getElementById('closeContactPopup');
    const contactForm = document.getElementById('contactForm');

    if (contactBtn && contactPopup && closeContactPopup && contactForm) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            contactPopup.style.display = 'flex';
        });

        closeContactPopup.addEventListener('click', function() {
            contactPopup.style.display = 'none';
        });

        // Close popup when clicking outside
        contactPopup.addEventListener('click', function(e) {
            if (e.target === contactPopup) {
                contactPopup.style.display = 'none';
            }
        });

        // Handle form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you can add your form submission logic
            // For now, we'll just close the popup
            alert('Thank you for your message! We will contact you soon.');
            contactPopup.style.display = 'none';
            contactForm.reset();
        });
    }

    // Also update resize event handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            // Hide mobile menu
            mobileMenu.style.display = 'none';
            
            // Show desktop navigation
            if (desktopMenu) {
                desktopMenu.style.display = 'flex';
            }
        } else if (mobileMenu.style.display === 'block') {
            // Reposition the menu if it's visible during resize
            const buttonRect = menuButton.getBoundingClientRect();
            mobileMenu.style.top = `${buttonRect.bottom}px`;
            
            // Adjust left position based on new screen size
            if (window.innerWidth <= 480) {
                mobileMenu.style.left = '10px';
            } else if (window.innerWidth <= 768) {
                mobileMenu.style.left = '15px';
            } else {
                mobileMenu.style.left = '20px';
            }
        }
    });
}

/**
 * Handle form submissions with AJAX
 */
function setupFormSubmissions() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(form);
            const url = form.getAttribute('action');
            
            fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Form submitted successfully!');
                    form.reset();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            });
        });
    });
}