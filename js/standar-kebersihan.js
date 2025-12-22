// Global variables
let standarData = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }

    // Load room name from session storage
    const roomName = sessionStorage.getItem('currentRoom') || 'Ruang Sidang A';
    document.getElementById('roomName').textContent = roomName;
    
    // Load standar data for the room
    loadStandarData(roomName);
    
    // Initialize form submission handlers
    initFormHandlers();
    
    // Initialize modal close buttons
    initModalCloseButtons();
});

// Function to load standar data
function loadStandarData(roomName) {
    // In a real app, this would be an API call
    // For now, we'll use sample data
    standarData = [
        { 
            id: 1, 
            kriteria: 'Lantai bersih tanpa debu', 
            keterangan: 'Lantai harus bebas dari debu dan noda', 
            nilai: 10 
        },
        { 
            id: 2, 
            kriteria: 'Meja hakim rapi', 
            keterangan: 'Meja hakim harus tertata dengan rapi', 
            nilai: 10 
        },
        { 
            id: 3, 
            kriteria: 'Tidak ada sampah', 
            keterangan: 'Ruang sidang bebas dari sampah', 
            nilai: 10 
        }
    ];

    // Clear existing table rows
    const tbody = document.getElementById('standarList');
    tbody.innerHTML = '';

    // Add sample data to table
    standarData.forEach(standar => {
        addStandarToTable(standar);
    });
}

// Function to add standar to table
function addStandarToTable(standar) {
    const tbody = document.getElementById('standarList');
    const row = document.createElement('tr');
    row.setAttribute('data-standar-id', standar.id);
    
    // Escape single quotes in kriteria for the delete confirmation
    const escapedKriteria = standar.kriteria.replace(/'/g, "\\'");
    
    row.innerHTML = `
        <td class="td-criteria">${standar.kriteria}</td>
        <td class="td-desc">${standar.keterangan}</td>
        <td class="td-score">${standar.nilai}</td>
        <td>
            <div class="action-cell">
                <button class="btn-icon btn-edit" onclick="editStandar(${standar.id})" title="Edit Standar">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="hapusStandar(${standar.id}, '${escapedKriteria}')" title="Hapus Standar">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        </td>
    `;
    
    tbody.prepend(row);
}

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
            }, 10);
        }
    }
}

// Function to close modal
function tutupModal(modalId = null) {
    if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    } else {
        // Close all modals if no ID provided
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
}

// Function to add new standar
function tambahStandar() {
    const modal = document.getElementById('tambahStandarModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            document.getElementById('kriteria').focus();
        }, 10);
    }
}

// Function to edit standar
function editStandar(id) {
    // Find the standar in our data
    const standar = standarData.find(item => item.id == id);
    if (!standar) {
        alert('Data standar tidak ditemukan');
        return;
    }
    
    // Fill the edit form with standar data
    document.getElementById('editStandarId').value = standar.id;
    document.getElementById('editKriteria').value = standar.kriteria;
    document.getElementById('editKeterangan').value = standar.keterangan;
    document.getElementById('editNilai').value = standar.nilai;
    
    // Show the edit modal
    showModal('editStandarModal', 'editKriteria');
}

// Function to delete standar
function hapusStandar(id, kriteria) {
    if (confirm(`Apakah Anda yakin ingin menghapus standar "${kriteria}"?`)) {
        // In a real app, this would make an API call to delete the standar
        const row = document.querySelector(`[data-standar-id="${id}"]`);
        if (row) {
            row.style.opacity = '0';
            setTimeout(() => row.remove(), 300);
        }
        
        // Remove from standarData array
        standarData = standarData.filter(item => item.id != id);
    }
}

// Function to show success message
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Initialize form submission handlers
function initFormHandlers() {
    // Handle tambah standar form submission
    const formTambah = document.getElementById('tambahStandarForm');
    if (formTambah) {
        formTambah.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const kriteria = document.getElementById('kriteria').value;
            const keterangan = document.getElementById('keterangan').value;
            const nilai = document.getElementById('nilai').value;
            
            // Create new standar object
            const newStandar = {
                id: Date.now(), // Use timestamp as ID
                kriteria,
                keterangan,
                nilai: parseInt(nilai)
            };
            
            // Add to data array
            standarData.unshift(newStandar);
            
            // Add to table
            addStandarToTable(newStandar);
            
            // Reset form and close modal
            this.reset();
            tutupModal('tambahStandarModal');
            
            // Show success message
            showSuccessMessage('Standar berhasil ditambahkan!');
        });
    }
    
    // Handle edit standar form submission
    const formEdit = document.getElementById('editStandarForm');
    if (formEdit) {
        formEdit.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const id = parseInt(document.getElementById('editStandarId').value);
            const kriteria = document.getElementById('editKriteria').value;
            const keterangan = document.getElementById('editKeterangan').value;
            const nilai = parseInt(document.getElementById('editNilai').value);
            
            // Find and update standar in data array
            const standarIndex = standarData.findIndex(item => item.id === id);
            if (standarIndex !== -1) {
                standarData[standarIndex] = {
                    ...standarData[standarIndex],
                    kriteria,
                    keterangan,
                    nilai
                };
                
                // Update table row
                const row = document.querySelector(`[data-standar-id="${id}"]`);
                if (row) {
                    row.cells[0].textContent = kriteria;
                    row.cells[1].textContent = keterangan;
                    row.cells[2].textContent = nilai;
                }
                
                // Close modal and show success message
                tutupModal('editStandarModal');
                showSuccessMessage('Standar berhasil diperbarui!');
            }
        });
    }
}

// Initialize modal close buttons
function initModalCloseButtons() {
    // Close modal when clicking outside content
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.preventDefault();
            tutupModal(event.target.id);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            tutupModal();
        }
    });
    
    // Close modal when clicking close button
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                tutupModal(modal.id);
            }
        });
    });
}

// Make functions globally available
window.tambahStandar = tambahStandar;
window.editStandar = editStandar;
window.hapusStandar = hapusStandar;
window.tutupModal = tutupModal;
