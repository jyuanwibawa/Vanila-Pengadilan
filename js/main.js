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

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    loadSidebar();
    
    // Add any other initialization code here
    
    // Example: Update active menu item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
