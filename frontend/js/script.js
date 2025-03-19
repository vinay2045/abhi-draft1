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
});

// Make sure carousel is set up even if DOMContentLoaded has issues
window.addEventListener('load', function() {
    const carouselTrack = document.getElementById('carouselTrack');
    // Check if carousel was already set up during DOMContentLoaded
    if (carouselTrack && carouselTrack.children.length === 0) {
        console.log('Fallback: Setting up carousel on window.load');
        setupHeroCarousel();
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

// Menu and UI Setup Function
function setupMenuAndUI() {
    // Get the menu button and create the dropdown container
    const menuButton = document.getElementById('nav-part1');
    const menuContainer = document.createElement('div');
    menuContainer.className = 'dropdown-menu';
    menuContainer.style.display = 'none';
    
    // Create menu content with proper structure
    menuContainer.innerHTML = `
        <div class="menu-section">
            <a href="index.html" class="menu-item">Home</a>
            <a href="aboutus.html" class="menu-item">About Us</a>
            <div class="menu-item has-submenu">
                <span>Our Services</span>
                <div class="submenu" style="display: none;">
                    <a href="Flight Tickets.html" class="submenu-item"><i class='bx bxs-plane-alt'></i> Flight Tickets</a>
                    <a href="Apply For Passport Application.html" class="submenu-item"><i class='bx bxs-id-card'></i> Apply For Passport Application</a>
                    <a href="visa for all countries.html" class="submenu-item"><i class='bx bxs-file-doc'></i> Visa For All Countries</a>
                    <a href="honeymoonpackages.html" class="submenu-item"><i class='bx bxs-heart'></i> Honeymoon Packages</a>
                    <a href="forex.html" class="submenu-item"><i class='bx bx-money'></i> Forex Services</a>
                </div>
            </div>
            <div class="menu-item has-submenu">
                <span>Trips</span>
                <div class="submenu" style="display: none;">
                    <a href="Domestic Tours.html" class="submenu-item"><i class='bx bxs-map'></i> Domestic Tours</a>
                    <a href="International Tours.html" class="submenu-item"><i class='bx bx-globe'></i> International Tours</a>
                </div>
            </div>
            <a href="contactus.html" class="menu-item">Contact Us</a>
        </div>
    `;
    
    // Add styles for responsive menu
    const menuStyles = document.createElement('style');
    menuStyles.textContent = `
        @media (max-width: 1024px) {
            #nav-part1 {
                display: flex !important;
                align-items: center;
                cursor: pointer;
            }
            
            .dropdown-menu {
                position: fixed;
                top: 70px;
                right: 0;
                width: 280px;
                max-width: 90%;
                background-color: var(--bg-color, #333);
                color: var(--text-color, white);
                border-radius: 10px 0 0 10px;
                padding: 15px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                overflow-y: auto;
                max-height: calc(100vh - 80px);
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            }
            
            .menu-section {
                display: grid;
                grid-template-columns: 1fr;
                gap: 8px;
            }
            
            .menu-item {
                padding: 12px;
                color: var(--text-color, white);
                text-decoration: none;
                border-radius: 8px;
                transition: all 0.2s ease;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .menu-item:hover {
                background-color: var(--card-bg, rgba(255, 255, 255, 0.1));
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
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                margin-top: 5px;
                padding: 5px;
                transition: all 0.3s ease;
            }
            
            .submenu-item {
                padding: 10px 15px;
                color: var(--text-color, white);
                text-decoration: none;
                display: block;
                border-radius: 6px;
                margin: 3px 0;
                transition: all 0.2s ease;
            }
            
            .submenu-item:hover {
                background-color: var(--card-bg, rgba(255, 255, 255, 0.1));
                transform: translateX(3px);
            }
        }
        
        @media (min-width: 1025px) {
            #nav-part1 {
                display: none !important;
            }
            
            .dropdown-menu {
                display: none !important;
            }
        }
    `;
    
    document.head.appendChild(menuStyles);
    
    // Insert dropdown menu after the navigation
    const nav = document.querySelector('nav');
    nav.parentNode.insertBefore(menuContainer, nav.nextSibling);
    
    // Add toggle functionality to the menu button
    menuButton.addEventListener('click', function(event) {
        event.stopPropagation();
        if (menuContainer.style.display === 'none') {
            menuContainer.style.display = 'block';
        } else {
            menuContainer.style.display = 'none';
        }
    });
    
    // Handle submenu toggles
    const submenus = document.querySelectorAll('.has-submenu');
    submenus.forEach(submenu => {
        submenu.addEventListener('click', function(event) {
        event.stopPropagation();
            const submenuContent = this.querySelector('.submenu');
            const hasOpenClass = this.classList.contains('open');
            
            // Close all other open submenus
            document.querySelectorAll('.has-submenu.open').forEach(item => {
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
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!menuButton.contains(event.target) && !menuContainer.contains(event.target)) {
            menuContainer.style.display = 'none';
            // Close all submenus
            document.querySelectorAll('.submenu').forEach(submenu => {
                submenu.style.display = 'none';
            });
            document.querySelectorAll('.has-submenu.open').forEach(item => {
                item.classList.remove('open');
            });
        }
    });
    
    // Create Our Services dropdown for desktop
    const ourservices = document.getElementById('ourservices');
    const ourservicesmenu = document.createElement('div');
    ourservicesmenu.className = 'desktop-dropdown services-dropdown';
    
    // Create Trips dropdown for desktop
    const trips = document.getElementById('trips');
    const tripsmenu = document.createElement('div');
    tripsmenu.className = 'desktop-dropdown trips-dropdown';
    
    // Add styles for desktop dropdown menus
    const desktopDropdownStyle = document.createElement('style');
    desktopDropdownStyle.textContent = `
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
    `;
    document.head.appendChild(desktopDropdownStyle);

    // Create menu content for Our Services desktop dropdown
    ourservicesmenu.innerHTML = `
        <div class="Section-ourservices">
            <a href="Flight Tickets.html">Flight Tickets</a>
            <a href="Apply For Passport Application.html">Apply For Passport Application</a>
            <a href="visa for all countries.html">Visa For All Countries</a>
            <a href="honeymoonpackages.html">Honeymoon Packages</a>
            <a href="forex.html">Forex Services</a>
        </div>
    `;
    
    // Create menu content for Trips desktop dropdown
    tripsmenu.innerHTML = `
        <div class="Section-trips">
            <a href="Domestic Tours.html">Domestic Tours</a>
            <a href="International Tours.html">International Tours</a>
        </div>
    `;
    
    // Append dropdowns to the body
    document.body.appendChild(ourservicesmenu);
    document.body.appendChild(tripsmenu);

    // Toggle Our Services dropdown
    ourservices.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Position the dropdown
        const rect = this.getBoundingClientRect();
        ourservicesmenu.style.left = rect.left + 'px';
        ourservicesmenu.style.top = (rect.bottom + window.scrollY) + 'px';
        
        // Toggle classes and display
        this.classList.toggle('active');
        trips.classList.remove('active');
        
        if (ourservicesmenu.style.display === 'block') {
            ourservicesmenu.style.display = 'none';
        } else {
            ourservicesmenu.style.display = 'block';
            tripsmenu.style.display = 'none';
        }
    });

    // Toggle Trips dropdown
    trips.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Position the dropdown
        const rect = this.getBoundingClientRect();
        tripsmenu.style.left = rect.left + 'px';
        tripsmenu.style.top = (rect.bottom + window.scrollY) + 'px';
        
        // Toggle classes and display
        this.classList.toggle('active');
        ourservices.classList.remove('active');
        
        if (tripsmenu.style.display === 'block') {
            tripsmenu.style.display = 'none';
        } else {
            tripsmenu.style.display = 'block';
            ourservicesmenu.style.display = 'none';
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!ourservices.contains(e.target) && !ourservicesmenu.contains(e.target)) {
            ourservicesmenu.style.display = 'none';
            ourservices.classList.remove('active');
        }
        
        if (!trips.contains(e.target) && !tripsmenu.contains(e.target)) {
            tripsmenu.style.display = 'none';
            trips.classList.remove('active');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            // Hide mobile menu
            menuContainer.style.display = 'none';
            
            // Show desktop navigation
            const navPart3 = document.getElementById('nav-part3');
            if (navPart3) {
                navPart3.style.display = 'flex';
            }
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
    const style = document.createElement('style');
    style.textContent = `
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

    document.head.appendChild(style);
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
}