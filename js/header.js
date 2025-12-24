// js/header.js
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi elemen header
    const header = document.querySelector('.top-header');
    if (!header) return; // Hentikan jika header tidak ditemukan
    
    // 1. Logika Toggle Sidebar
    const sidebarToggle = header.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle class active pada sidebar
            const sidebar = document.querySelector('.sidebar, #sidebar-container');
            if (sidebar) {
                sidebar.classList.toggle('active');
                document.body.classList.toggle('sidebar-active');
                
                // Simpan state sidebar di localStorage
                const isActive = sidebar.classList.contains('active');
                localStorage.setItem('sidebarCollapsed', isActive);
            }
            
            // Efek visual klik
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = 'scale(1)', 100);
        });
    }

    // 2. Logika Logout
    const logoutBtn = header.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Tampilkan konfirmasi logout
            const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari aplikasi?");
            if (confirmLogout) {
                // Lakukan proses logout
                // Contoh: window.location.href = '/logout';
                console.log('Logout berhasil');
                // Redirect ke halaman login
                // window.location.href = '/login';
            }
        });
    }

    // 3. Inisialisasi state sidebar dari localStorage
    function initSidebarState() {
        const sidebar = document.querySelector('.sidebar, #sidebar-container');
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        
        if (sidebar && isCollapsed) {
            sidebar.classList.add('active');
            document.body.classList.add('sidebar-active');
        }
    }
    
    // Panggil inisialisasi
    initSidebarState();
});

// Ekspor fungsi yang bisa digunakan di file lain (jika menggunakan modul)
// export { initHeader };

// Jika menggunakan jQuery (opsional)
/*
$(document).ready(function() {
    // Kode jQuery di sini
});
*/
