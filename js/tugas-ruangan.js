// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set room name from session storage
    const roomName = sessionStorage.getItem('currentRoom') || 'Ruang';
    document.getElementById('room-title').textContent = `Tugas untuk ${roomName}`;
    
    // Load tasks for this room
    loadTasks(roomName);
    
    // Initialize sidebar
    if (typeof loadSidebar === 'function') {
        loadSidebar();
    }
    
    // Set active menu item
    if (typeof setActiveMenuItem === 'function') {
        setActiveMenuItem();
    }
    
    // Function to close modal
    function tutupModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Edit form submission
    const editForm = document.getElementById('editTugasForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditFormSubmit);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
        }
    });
    
    // Close modal when clicking X button
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Add event listener for mobile menu toggle
    const menuToggle = document.getElementById('sidebarToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }
});

// Function to load tasks for a room
function loadTasks(roomName) {
    // In a real app, you would fetch this data from an API
    const tasks = [
        { 
            name: 'Menyapu dan Mengepel', 
            description: 'Membersihkan lantai ruangan', 
            frequency: 'Harian', 
            duration: '45' 
        },
        { 
            name: 'Membersihkan Jendela', 
            description: 'Membersihkan kaca jendela', 
            frequency: 'Mingguan', 
            duration: '30' 
        },
        { 
            name: 'Membersihkan Meja', 
            description: 'Membersihkan dan merapikan meja', 
            frequency: 'Harian', 
            duration: '20' 
        }
    ];
    
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="td-task-name">${task.name}</td>
            <td class="td-desc">${task.description}</td>
            <td>${task.frequency}</td>
            <td>${task.duration}</td>
            <td>
                <div class="action-cell">
                    <button class="btn-icon btn-edit" title="Edit Tugas">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icon btn-delete" title="Hapus Tugas">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
        taskList.appendChild(row);
    });
    
    // Add event listeners to new buttons
    addTaskEventListeners();
}

// Function to add event listeners to task buttons
function addTaskEventListeners() {
    // Delete button
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const taskName = row.cells[0].innerText;
            if(confirm(`Hapus tugas "${taskName}"?`)) {
                row.style.opacity = '0';
                setTimeout(() => row.remove(), 300);
            }
        });
    });
    
    // Edit button
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', handleEditTask);
    });
    
    // Make entire row clickable
    document.querySelectorAll('tbody tr').forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', function() {
            // You can add functionality when clicking on a row
            // For example, show task details in a modal
            console.log('Row clicked:', this.cells[0].innerText);
        });
    });
}

// Function to handle edit task
function handleEditTask(e) {
    e.stopPropagation();
    const row = e.target.closest('tr');
    const taskId = row.getAttribute('data-task-id');
    const task = {
        id: taskId,
        name: row.cells[0].textContent,
        description: row.cells[1].textContent,
        frequency: row.cells[2].textContent,
        duration: row.cells[3].textContent,
        category: row.getAttribute('data-category') || 'Lainnya'
    };
    
    // Fill the edit form with task data
    document.getElementById('editTugasId').value = task.id;
    document.getElementById('editNamaTugas').value = task.name;
    document.getElementById('editDeskripsi').value = task.description;
    document.getElementById('editFrekuensi').value = task.frequency;
    document.getElementById('editDurasi').value = task.duration;
    document.getElementById('editKategori').value = task.category;
    
    // Show the edit modal
    document.getElementById('editTugasModal').classList.add('show');
}

// Function to handle edit form submission
function handleEditFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const taskId = document.getElementById('editTugasId').value;
    const namaTugas = document.getElementById('editNamaTugas').value.trim();
    const deskripsi = document.getElementById('editDeskripsi').value.trim();
    const frekuensi = document.getElementById('editFrekuensi').value;
    const durasi = document.getElementById('editDurasi').value;
    const kategori = document.getElementById('editKategori').value;
    
    // Update the task in the table
    const row = document.querySelector(`tr[data-task-id="${taskId}"]`);
    if (row) {
        row.cells[0].textContent = namaTugas;
        row.cells[1].textContent = deskripsi;
        row.cells[2].textContent = frekuensi;
        row.cells[3].textContent = durasi;
        row.setAttribute('data-category', kategori);
        
        // Show success message
        showSuccessMessage('Tugas berhasil diperbarui');
    }
    
    // Close the modal
    document.getElementById('editTugasModal').classList.remove('show');
}

// Function to show success message
function showSuccessMessage(message) {
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
    document.body.appendChild(successMsg);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        successMsg.classList.add('show');
        setTimeout(() => {
            successMsg.classList.remove('show');
            setTimeout(() => successMsg.remove(), 300);
        }, 2500);
    }, 100);
}

// Function to handle add task button
window.tambahTugas = function() {
    const modal = document.getElementById('tambahTugasModal');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.btn-cancel');
    const form = document.getElementById('tugasForm');
    
    // Show modal
    modal.classList.add('show');
    
    // Close modal when clicking X button
    closeBtn.onclick = function() {
        modal.classList.remove('show');
    };
    
    // Close modal when clicking cancel button
    cancelBtn.onclick = function() {
        modal.classList.remove('show');
    };
    
    // Close modal when clicking outside the modal
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    };
    
    // Handle form submission
    form.onsubmit = function(e) {
        e.preventDefault();
        
        // Get form values
        const namaTugas = document.getElementById('namaTugas').value.trim();
        const deskripsi = document.getElementById('deskripsi').value.trim();
        const frekuensi = document.getElementById('frekuensi').value;
        const durasi = document.getElementById('durasi').value;
        const kategori = document.getElementById('kategori').value;
        
        // Validate required fields
        if (!namaTugas || !frekuensi || !durasi) {
            alert('Harap isi semua field yang wajib diisi!');
            return;
        }
        
        // Create new task object with current timestamp as ID
        const newTask = {
            id: Date.now(),
            name: namaTugas,
            description: deskripsi,
            frequency: frekuensi,
            duration: durasi,
            category: kategori || 'Lainnya',
            createdAt: new Date().toISOString()
        };
        
        // Add task to the table
        addTaskToTable(newTask);
        
        // Reset form and close modal
        form.reset();
        modal.classList.remove('show');
        
        // Show success message with animation
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = '<i class="fa-solid fa-check-circle"></i> Tugas berhasil ditambahkan';
        document.body.appendChild(successMsg);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMsg.classList.add('show');
            setTimeout(() => {
                successMsg.classList.remove('show');
                setTimeout(() => successMsg.remove(), 300);
            }, 2500);
        }, 100);
    };
};

// Function to add new task to the table
function addTaskToTable(task) {
    const taskList = document.getElementById('task-list');
    const row = document.createElement('tr');
    row.setAttribute('data-task-id', task.id);
    
    // Format the date
    const date = new Date(task.createdAt);
    const formattedDate = date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    
    // Create category badge
    const categoryClass = task.category.toLowerCase().replace(' ', '-');
    
    row.innerHTML = `
        <td class="td-task-name">
            <div class="task-name-wrapper">
                <span class="task-name">${task.name}</span>
                <span class="task-category ${categoryClass}">${task.category}</span>
            </div>
        </td>
        <td class="td-desc">
            <div class="task-description">
                ${task.description || '<span class="text-muted">Tidak ada deskripsi</span>'}
            </div>
            <div class="task-meta">
                <span class="task-date"><i class="fa-regular fa-calendar"></i> ${formattedDate}</span>
            </div>
        </td>
        <td>
            <span class="task-frequency">${task.frequency}</span>
        </td>
        <td>
            <span class="task-duration">${task.duration} menit</span>
        </td>
        <td>
            <div class="action-cell">
                <button class="btn-icon btn-edit" title="Edit Tugas">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-icon btn-delete" title="Hapus Tugas">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        </td>
    `;
    
    // Add animation class
    row.classList.add('fade-in');
    
    // Add to the beginning of the list
    if (taskList.firstChild) {
        taskList.insertBefore(row, taskList.firstChild);
    } else {
        taskList.appendChild(row);
    }
    
    // Add event listeners to the new buttons
    const newRow = taskList.querySelector(`[data-task-id="${task.id}"]`);
    newRow.querySelector('.btn-edit').addEventListener('click', handleEditTask);
    newRow.querySelector('.btn-delete').addEventListener('click', handleDeleteTask);
    
    // Save to localStorage (for persistence)
    saveTasksToLocalStorage();
}

// Function to handle delete task
function handleDeleteTask(e) {
    e.stopPropagation();
    const row = this.closest('tr');
    const taskName = row.cells[0].innerText;
    
    if(confirm(`Hapus tugas "${taskName}"?`)) {
        row.style.opacity = '0';
        setTimeout(() => row.remove(), 300);
    }
}
