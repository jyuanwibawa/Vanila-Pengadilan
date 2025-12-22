// Load sidebar content
function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        fetch('components/sidebar.html')
            .then(response => response.text())
            .then(html => {
                sidebarContainer.innerHTML = html;
                // Add event listener for mobile menu toggle
                const menuToggle = document.querySelector('.fa-bars');
                if (menuToggle) {
                    menuToggle.addEventListener('click', toggleSidebar);
                }
            })
            .catch(error => {
                console.error('Error loading sidebar:', error);
                sidebarContainer.innerHTML = '<p>Error loading navigation</p>';
            });
    }
}

// Toggle sidebar for mobile view
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// Set active menu item based on current page
function setActiveMenuItem() {
    // Get the current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.menu-link');
    
    // Small delay to ensure DOM is fully updated
    setTimeout(() => {
        menuLinks.forEach(link => {
            // Remove 'active' class from all links first
            link.classList.remove('active');
            
            // Get the href attribute and clean it up
            const linkHref = link.getAttribute('href');
            
            // Special case for index.html
            if ((!linkHref || linkHref === 'index.html') && (currentPage === '' || currentPage === 'index.html')) {
                link.classList.add('active');
                return;
            }
            
            // For parameter-sistem.html
            if (linkHref === 'parameter-sistem.html' && currentPage === 'parameter-sistem.html') {
                link.classList.add('active');
                return;
            }
            
            // For other pages
            if (linkHref && currentPage.includes(linkHref) && linkHref !== 'index.html') {
                link.classList.add('active');
            }
        });
    }, 100); // Small delay to ensure DOM is ready
}

// Close sidebar on mobile when clicking outside
function handleOutsideClick(event) {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.fa-bars');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (window.innerWidth <= 768 && 
        !sidebar.contains(event.target) && 
        !menuToggle.contains(event.target)) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    loadSidebar();
    
    // Set active menu item after sidebar is loaded
    setTimeout(() => {
        setActiveMenuItem();
        
        // Add click event to menu toggle
        const menuToggle = document.querySelector('.fa-bars');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                const sidebar = document.querySelector('.sidebar');
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            });
        }
        
        // Close sidebar when clicking on overlay
        if (overlay) {
            overlay.addEventListener('click', function() {
                const sidebar = document.querySelector('.sidebar');
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
        
        // Close sidebar when clicking on menu items (for mobile)
        const menuLinks = document.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    const sidebar = document.querySelector('.sidebar');
                    const overlay = document.querySelector('.sidebar-overlay');
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                }
            });
        });
        
        // Close sidebar when clicking outside (for mobile)
        document.addEventListener('click', handleOutsideClick);
    }, 100); // Small delay to ensure sidebar is loaded
});
