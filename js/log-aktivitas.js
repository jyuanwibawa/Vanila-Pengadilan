// Inisialisasi DataTable
$(document).ready(function() {
    // Inisialisasi DataTable
    var table = $('#logTable').DataTable({
        responsive: true,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/id.json'
        },
        order: [[0, 'desc']], // Urutkan berdasarkan kolom waktu (indeks 0) secara descending
        columnDefs: [
            { responsivePriority: 1, targets: 0 }, // Kolom Waktu
            { responsivePriority: 2, targets: 1 }, // Kolom Pengguna
            { responsivePriority: 3, targets: 2 }, // Kolom Aktivitas
            { responsivePriority: 4, targets: 3 }, // Kolom Deskripsi
            { responsivePriority: 5, targets: 4 }, // Kolom IP Address
            { responsivePriority: 6, targets: 5 }  // Kolom Status
        ],
        pageLength: 10,
        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Semua"]]
    });

    // Inisialisasi Date Range Picker
    $('input[name="dateRange"]').daterangepicker({
        locale: {
            format: 'DD/MM/YYYY',
            applyLabel: 'Terapkan',
            cancelLabel: 'Batal',
            fromLabel: 'Dari',
            toLabel: 'Sampai',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
            monthNames: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
            firstDay: 1
        },
        opens: 'right',
        autoUpdateInput: false,
        showDropdowns: true,
        alwaysShowCalendars: true,
        ranges: {
            'Hari Ini': [moment(), moment()],
            'Kemarin': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            '7 Hari Terakhir': [moment().subtract(6, 'days'), moment()],
            '30 Hari Terakhir': [moment().subtract(29, 'days'), moment()],
            'Bulan Ini': [moment().startOf('month'), moment().endOf('month')],
            'Bulan Lalu': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    });

    // Handler untuk menampilkan tanggal yang dipilih
    $('input[name="dateRange"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });

    // Handler untuk mereset input tanggal
    $('input[name="dateRange"]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });

    // Toggle filter section
    $('#filterBtn').on('click', function() {
        $('#filterSection').slideToggle(300);
        $(this).toggleClass('active');
    });

    // Handle filter form submission
    $('.btn-apply-filter').on('click', function() {
        // Dapatkan nilai filter
        var dateRange = $('input[name="dateRange"]').val();
        var user = $('#user').val();
        var activityType = $('#activityType').val();
        
        // Lakukan filter data di sini (contoh sederhana)
        table.draw();
        
        // Tampilkan notifikasi
        showToast('Filter berhasil diterapkan', 'success');
        
        // Sembunyikan filter section setelah menerapkan filter
        $('#filterSection').slideUp(300);
        $('#filterBtn').removeClass('active');
    });

    // Handle reset filter
    $('.btn-reset-filter').on('click', function() {
        $('#filterForm')[0].reset();
        $('input[name="dateRange"]').val('');
        
        // Reset tabel ke kondisi awal
        table.search('').columns().search('').draw();
        
        // Tampilkan notifikasi
        showToast('Filter telah direset', 'info');
    });

    // Fungsi untuk menampilkan toast notifikasi
    function showToast(message, type = 'info') {
        // Hapus toast yang sudah ada
        $('.toast-container').remove();
        
        // Buat elemen toast
        var toast = $('<div class="toast-container">' +
            '<div class="toast toast-' + type + '">' +
            '<div class="toast-message">' + message + '</div>' +
            '<button type="button" class="toast-close">&times;</button>' +
            '</div></div>');
        
        // Tambahkan toast ke body
        $('body').append(toast);
        
        // Tampilkan toast dengan efek slide down
        toast.find('.toast').slideDown(300);
        
        // Sembunyikan toast setelah 3 detik
        var toastTimeout = setTimeout(function() {
            toast.find('.toast').slideUp(300, function() {
                $(this).remove();
            });
        }, 3000);
        
        // Handler untuk tombol close
        toast.find('.toast-close').on('click', function() {
            clearTimeout(toastTimeout);
            $(this).closest('.toast').slideUp(300, function() {
                $(this).closest('.toast-container').remove();
            });
        });
    }

    // Load komponen sidebar dan header
    loadSidebar();
    loadHeader();
});

// Fungsi untuk memuat komponen sidebar
function loadSidebar() {
    $('#sidebar-container').load('components/sidebar.html', function() {
        // Set active menu
        $('.nav-link[href="log-aktivitas.html"]').addClass('active');
        
        // Inisialisasi tooltip
        $('[data-bs-toggle="tooltip"]').tooltip();
    });
}

// Fungsi untuk memuat komponen header
function loadHeader() {
    $('#header-container').load('components/header.html', function() {
        // Set active menu di header jika diperlukan
        $('.header-nav .nav-link[href="log-aktivitas.html"]').addClass('active');
        
        // Inisialisasi dropdown user menu
        $('.user-dropdown').on('click', function(e) {
            e.preventDefault();
            $(this).find('.dropdown-menu').toggleClass('show');
        });
        
        // Tutup dropdown saat klik di luar
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.user-dropdown').length) {
                $('.user-dropdown .dropdown-menu').removeClass('show');
            }
        });
    });
}

// Fungsi untuk menangani logout
function handleLogout() {
    // Tampilkan konfirmasi
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        // Lakukan proses logout di sini
        // Contoh: hapus token dari localStorage
        localStorage.removeItem('auth_token');
        
        // Redirect ke halaman login
        window.location.href = 'login.html';
    }
}

// Fungsi untuk mengekspor data ke Excel
function exportToExcel() {
    // Dapatkan data dari DataTable
    var data = [];
    var headers = [];
    
    // Dapatkan header
    $('#logTable thead th').each(function() {
        headers.push($(this).text().trim());
    });
    
    // Dapatkan data
    $('#logTable tbody tr').each(function() {
        var rowData = [];
        $(this).find('td').each(function() {
            // Hapus elemen span badge dan ambil teksnya saja
            var cellText = $(this).clone().find('span').remove().end().text().trim();
            rowData.push(cellText);
        });
        data.push(rowData);
    });
    
    // Buat file Excel
    var csvContent = headers.join(';') + '\n';
    data.forEach(function(rowArray) {
        csvContent += rowArray.join(';') + '\n';
    });
    
    // Buat link download
    var encodedUri = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'log_aktivitas_' + new Date().toISOString().split('T')[0] + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event listener untuk tombol ekspor
$(document).on('click', '.btn-export', function() {
    exportToExcel();
});

// Event listener untuk tombol logout
$(document).on('click', '.logout-btn', function(e) {
    e.preventDefault();
    handleLogout();
});
