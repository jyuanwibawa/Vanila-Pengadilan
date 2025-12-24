// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load sidebar component
    fetch('components/sidebar.html')
        .then(response => response.text())
        .then(data => {
            const sidebarContainer = document.getElementById('sidebar-container');
            if (sidebarContainer) {
                sidebarContainer.innerHTML = data;
                
                // Initialize sidebar toggle functionality
                const sidebarToggle = document.getElementById('sidebarToggle');
                const body = document.body;
                const mainContent = document.querySelector('.main-content');
                
                if (sidebarToggle) {
                    sidebarToggle.addEventListener('click', function() {
                        body.classList.toggle('sidebar-collapsed');
                        if (mainContent) {
                            mainContent.style.marginLeft = body.classList.contains('sidebar-collapsed') ? '0' : '250px';
                        }
                    });
                }

                // Initialize counter animation
                const counters = document.querySelectorAll('.card-value');
                counters.forEach(counter => {
                    animateCounter(counter);
                });
            }
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
        });
});

/**
 * Animates a counter element from 0 to its target value
 * @param {HTMLElement} counter - The element containing the counter value
 */
function animateCounter(counter) {
    const target = parseFloat(counter.getAttribute('data-target'));
    const isFloat = target % 1 !== 0;
    let count = 0;
    const speed = 30;
    const increment = target / speed;

    const updateCount = () => {
        if (count < target) {
            let newValue = count + increment;
            counter.innerText = isFloat ? 
                (newValue > target ? target.toFixed(1) : newValue.toFixed(1)) : 
                Math.ceil(newValue);
            count = newValue;
            setTimeout(updateCount, 30);
        } else {
            counter.innerText = isFloat ? target.toFixed(1) : target;
        }
    };
    
    updateCount();
}
