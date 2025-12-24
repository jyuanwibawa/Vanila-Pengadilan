// Function to set active menu item based on current page
function setActiveMenuItem() {
    // Get current page path
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Find all menu links
    const menuLinks = document.querySelectorAll('.menu-link');
    
    // Loop through each menu link
    menuLinks.forEach(link => {
        // Remove active class from all links first
        link.classList.remove('active');
        
        // Get the href attribute and extract just the filename
        const linkHref = link.getAttribute('href');
        if (linkHref && (linkHref === currentPath || 
                         (currentPath === 'admin-ruangan.html' && linkHref.includes('admin-ruangan')) ||
                         (currentPath === 'parameter-sistem.html' && linkHref.includes('parameter-sistem')))) {
            // Add active class to the matching link
            link.classList.add('active');
            
            // Also add active class to parent li if it exists
            if (link.parentElement && link.parentElement.classList.contains('menu-item')) {
                link.parentElement.classList.add('active');
            }
        }
    });
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', setActiveMenuItem);

// Also run when the page is fully loaded in case of SSI
window.addEventListener('load', setActiveMenuItem);
