// Global variables
let currentEditingId = null;

// Function to show modal
function showModal(modalId, focusId = null) {
    // Hide all modals first
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Show the requested modal
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus on the specified element if provided
        if (focusId) {
            setTimeout(() => {
                const element = document.getElementById(focusId);
                if (element) element.focus();
            }, 100);
        }
    }
}

// Function to close modal
function tutupModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Function to show tambah ruangan modal - will be called only when button is clicked
function tambahRuangan() {
    // Reset form
    const form = document.getElementById('formTambahRuangan');
    if (form) form.reset();
    
    // Show modal
    showModal('modalTambahRuangan', 'namaRuangan');
    
    // Hentikan event agar tidak ada eksekusi lebih lanjut
    if (window.event) {
        window.event.preventDefault();
        window.event.stopPropagation();
    }
    return false;
}

// Function to handle edit ruangan
function editRuangan(button) {
    const row = button.closest('tr');
    const cells = row.cells;
    
    // Get data from the row
    const data = {
        id: row.dataset.id || Date.now(),
        nama: cells[0].textContent,
        lantai: cells[1].textContent,
        luas: cells[2].textContent,
        administrator: cells[3].querySelector('.admin-name').textContent,
        prioritas: cells[6].textContent.trim()
    };
    
    // Fill the form
    document.getElementById('editId').value = data.id;
    document.getElementById('editNamaRuangan').value = data.nama;
    document.getElementById('editLantai').value = data.lantai;
    document.getElementById('editLuas').value = data.luas;
    document.getElementById('editAdministrator').value = data.administrator;
    document.getElementById('editPrioritas').value = data.prioritas;
    
    // Store the current editing ID
    currentEditingId = data.id;
    
    // Show the modal
    showModal('modalEditRuangan', 'editNamaRuangan');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Pastikan modal dalam keadaan tertutup saat halaman dimuat
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Toggle sidebar
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('collapsed');
        });
    }

    // Handle task button clicks
    document.querySelectorAll('.badge-task').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const roomName = row.cells[0].textContent;
            sessionStorage.setItem('currentRoom', roomName);
            window.location.href = 'tugas-ruangan.html';
        });
    });

    // Handle standard button clicks
    document.querySelectorAll('.badge-standard').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const roomName = row.cells[0].textContent;
            sessionStorage.setItem('currentRoom', roomName);
            window.location.href = 'standar-kebersihan.html';
        });
    });

    // Assign the function to window for global access
    window.tambahRuangan = tambahRuangan;

    // Fungsi untuk menutup modal
    function tutupModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Menutup modal saat mengklik di luar konten modal
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('modalTambahRuangan');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Menangani submit form
    const formTambahRuangan = document.getElementById('formTambahRuangan');
    if (formTambahRuangan) {
        formTambahRuangan.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ambil nilai dari form
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Add ID and other metadata
            data.id = Date.now();
            data.tanggalDibuat = new Date().toISOString();
            
            // Here you would typically send this data to a server
            console.log('Form submitted:', data);
            
            // Add to table (in a real app, this would be handled after server response)
            addRuanganToTable(data);
            
            // Show success message
            alert('Ruangan berhasil ditambahkan!');
            
            // Close modal and reset form
            tutupModal('modalTambahRuangan');
            this.reset();
        });
    } else {
        console.error('Form Tambah Ruangan tidak ditemukan');
    }

    // Handle edit ruangan form submission
    const formEditRuangan = document.getElementById('formEditRuangan');
    if (formEditRuangan) {
        formEditRuangan.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            data.id = document.getElementById('editId').value;
            
            // Here you would typically send this data to a server
            console.log('Form updated:', data);
            
            // Update table (in a real app, this would be handled after server response)
            updateRuanganInTable(data);
            
            // Show success message
            alert('Data ruangan berhasil diperbarui!');
        });
    }

    // Add click handler for all edit buttons
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function() {
                editRuangan(this);
            });
        });
    });

    // Make functions available globally
    window.tutupModal = tutupModal;
    window.editRuangan = editRuangan;
    
    // Pastikan semua modal dalam keadaan tertutup saat halaman dimuat
    document.addEventListener('DOMContentLoaded', function() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    });

    // Fungsi simulasi Edit
    const editBtns = document.querySelectorAll('.btn-edit');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Mencegah event bubbling ke parent
            const row = this.closest('tr');
            const roomName = row.cells[0].innerText;
            alert('Mengedit ruangan: ' + roomName);
        });
    });

    // Fungsi simulasi Delete
    const deleteBtns = document.querySelectorAll('.btn-delete');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Mencegah event bubbling ke parent
            const row = this.closest('tr');
            const roomName = row.cells[0].innerText;
            if(confirm('Apakah Anda yakin ingin menghapus ' + roomName + '?')) {
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                }, 300);
            }
        });
    });
});
