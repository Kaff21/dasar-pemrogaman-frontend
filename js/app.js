/* ==========================================================================
   Main Application Script (MedCare)
   jQuery & jQuery UI Integration and DOM Manipulations
   ========================================================================== */

$(document).ready(function () {
  console.log("MedCare App Initialized successfully.");

  // ------------------------------------------------------------------------
  // 1. Navigation & Section Switcher (NavBar)
  // ------------------------------------------------------------------------
  // Toggle Hamburger Menu (Logo Garis 3)
  $('#btn-toggle-menu').on('click', function (e) {
    e.stopPropagation();
    const $menu = $('#main-nav-menu');
    $menu.toggleClass('open');

    const $icon = $(this).find('i');
    if ($menu.hasClass('open')) {
      $icon.removeClass('fa-bars').addClass('fa-times');
    } else {
      $icon.removeClass('fa-times').addClass('fa-bars');
    }
  });

  // Close hamburger menu when clicking outside
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.navbar-container').length) {
      $('#main-nav-menu').removeClass('open');
      $('#btn-toggle-menu').find('i').removeClass('fa-times').addClass('fa-bars');
    }
  });


  $('.nav-link').on('click', function (e) {
    e.preventDefault();
    const targetSection = $(this).attr('href');

    $('.nav-link').removeClass('active');
    $(this).addClass('active');

    $('.page-section').removeClass('active');
    $(targetSection).addClass('active');

    // Sembunyikan menu mobile saat link diklik
    $('#main-nav-menu').removeClass('open');
    $('#btn-toggle-menu i').removeClass('fa-times').addClass('fa-bars');

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ------------------------------------------------------------------------
  // 2. Inisialisasi Widget jQuery UI
  // ------------------------------------------------------------------------

  // A. Datepicker (Tgl Kunjungan Pasien)
  $('#input-tanggal').datepicker({
    dateFormat: 'dd/mm/yy',
    minDate: 0, // Pembatasan: tidak bisa memilih tanggal lampau
    showAnim: 'fadeIn',
    dayNamesMin: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    monthNames: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  });

  // B. Autocomplete (Dokter & Spesialis)
  $('#input-dokter').autocomplete({
    source: doctorList,
    minLength: 1,
    select: function (event, ui) {
      $(this).val(ui.item.value);
    }
  });

  // Autocomplete untuk Keluhan Pasien
  $('#input-keluhan').autocomplete({
    source: complaintList,
    minLength: 1
  });

  // C. Selectmenu (Pilihan Poliklinik)
  $('#select-poli').selectmenu({
    change: function (event, ui) {
      $('#select-poli-wrapper').removeClass('is-invalid');
      $('#select-poli-wrapper').siblings('.invalid-feedback').removeClass('show');
    }
  });

  // D. Slider (Tingkat Urgensi Keluhan Pasien)
  const urgensiLabels = {
    1: { text: "1 - Rutin / MCU", class: "rutin" },
    2: { text: "2 - Sedang", class: "sedang" },
    3: { text: "3 - Tinggi", class: "tinggi" },
    4: { text: "4 - Darurat / Urgent", class: "darurat" }
  };

  $('#slider-urgensi').slider({
    value: 2,
    min: 1,
    max: 4,
    step: 1,
    slide: function (event, ui) {
      const labelInfo = urgensiLabels[ui.value];
      $('#urgensi-val').text(ui.value);
      $('#urgensi-badge')
        .text(labelInfo.text)
        .attr('class', 'badge-urgency ' + labelInfo.class);
      $('#input-urgensi-hidden').val(ui.value);
    }
  });

  // E. Accordion (Informasi FAQ Kesehatan)
  $('#accordion-faq').accordion({
    collapsible: true,
    active: 0,
    heightStyle: "content"
  });

  // F. Tabs (Kategori Layanan Klinik)
  $('#tabs-layanan').tabs();

  // G. Tooltips
  $(document).tooltip({
    track: true
  });

  // H. Progressbar (Kuota Harian Dokter/Klinik)
  $('#progressbar-kuota').progressbar({
    value: 65
  });

  // I. Dialog (Modal Detail Pasien)
  $('#dialog-detail').dialog({
    autoOpen: false,
    modal: true,
    width: 480,
    show: { effect: "fade", duration: 250 },
    hide: { effect: "fade", duration: 200 }
  });

  // Dialog Konfirmasi Hapus
  $('#dialog-confirm-delete').dialog({
    autoOpen: false,
    resizable: false,
    height: "auto",
    width: 400,
    modal: true,
    buttons: {
      "Ya, Hapus": function () {
        const idToDelete = $(this).data('target-id');
        deleteReservation(idToDelete);
        $(this).dialog("close");
      },
      "Batal": function () {
        $(this).dialog("close");
      }
    }
  });

  // ------------------------------------------------------------------------
  // 3. Render Data Tabel Awal & Statistics
  // ------------------------------------------------------------------------
  renderTableData(reservationsData);
  updateStatsCounters();
  initLiveValidation();

  // ------------------------------------------------------------------------
  // 4. Handling Submit Form Reservasi Baru (DOM Manipulation)
  // ------------------------------------------------------------------------
  $('#form-reservasi').on('submit', function (e) {
    e.preventDefault();

    // Jalankan validasi jQuery
    if (!validateReservationForm()) {
      return false;
    }

    // Ambil nilai dari input form
    const newReservation = {
      id: "RES-2026-0" + (reservationsData.length + 1),
      nik: $('#input-nik').val().trim(),
      nama: $('#input-nama').val().trim(),
      phone: $('#input-phone').val().trim(),
      poli: $('#select-poli').val(),
      dokter: $('#input-dokter').val().trim(),
      tanggal: $('#input-tanggal').val().trim(),
      urgensi: parseInt($('#input-urgensi-hidden').val()) || 2,
      urgensiText: urgensiLabels[$('#input-urgensi-hidden').val() || 2].text.split(' - ')[1],
      status: "Menunggu",
      catatan: $('#input-keluhan').val().trim() || "Tidak ada catatan khusus."
    };

    // Push ke dataset lokal
    reservationsData.unshift(newReservation);

    // Refresh Tabel dengan animasi highlight pada baris baru
    renderTableData(reservationsData);
    updateStatsCounters();

    // Reset Form & Slider
    resetReservationForm();

    // Tampilkan notifikasi sukses sederhana / pindah ke section Data Pasien
    showNotification("Pendaftaran Berhasil!", `Reservasi pasien atas nama ${newReservation.nama} telah ditambahkan.`);
    
    // Switch otomatis ke section data pasien
    setTimeout(function() {
      $('a[href="#section-pasien"]').click();
    }, 600);
  });

  // ------------------------------------------------------------------------
  // 5. Dynamic Table Filtering & Search (DOM Selection)
  // ------------------------------------------------------------------------
  $('#search-tabel').on('input', function () {
    filterTableData();
  });

  $('#filter-status').on('change', function () {
    filterTableData();
  });

  // ------------------------------------------------------------------------
  // 6. Action Handlers (Detail & Hapus via Event Delegation)
  // ------------------------------------------------------------------------
  $('#tabel-pasien-body').on('click', '.btn-detail', function () {
    const resId = $(this).data('id');
    const item = reservationsData.find(r => r.id === resId);

    if (item) {
      $('#detail-id').text(item.id);
      $('#detail-nama').text(item.nama);
      $('#detail-nik').text(item.nik);
      $('#detail-phone').text(item.phone);
      $('#detail-poli').text(item.poli);
      $('#detail-dokter').text(item.dokter);
      $('#detail-tanggal').text(item.tanggal);
      $('#detail-urgensi').text(item.urgensiText);
      $('#detail-status').text(item.status);
      $('#detail-catatan').text(item.catatan);

      $('#dialog-detail').dialog('open');
    }
  });

  $('#tabel-pasien-body').on('click', '.btn-delete', function () {
    const resId = $(this).data('id');
    $('#dialog-confirm-delete').data('target-id', resId).dialog('open');
  });

  $('#tabel-pasien-body').on('click', '.btn-status-toggle', function () {
    const resId = $(this).data('id');
    const item = reservationsData.find(r => r.id === resId);
    if (item) {
      // Toggle Status: Menunggu -> Terkonfirmasi -> Selesai
      if (item.status === "Menunggu") item.status = "Terkonfirmasi";
      else if (item.status === "Terkonfirmasi") item.status = "Selesai";
      else item.status = "Menunggu";

      renderTableData(reservationsData);
      updateStatsCounters();
    }
  });
});

// ==========================================================================
// Helper Functions for DOM Manipulation
// ==========================================================================

/**
 * Render array of data into HTML table rows dynamically
 * @param {Array} data 
 */
function renderTableData(data) {
  const $tbody = $('#tabel-pasien-body');
  $tbody.empty();

  if (data.length === 0) {
    $tbody.append(`
      <tr>
        <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <i class="fas fa-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
          Tidak ada data reservasi pasien ditemukan.
        </td>
      </tr>
    `);
    return;
  }

  data.forEach((item, index) => {
    // Generate Status Badge Class
    let statusClass = "menunggu";
    let statusIcon = "fa-clock";
    if (item.status === "Terkonfirmasi") { statusClass = "terkonfirmasi"; statusIcon = "fa-check-circle"; }
    else if (item.status === "Selesai") { statusClass = "selesai"; statusIcon = "fa-user-check"; }
    else if (item.status === "Batal") { statusClass = "batal"; statusIcon = "fa-times-circle"; }

    // Generate Urgensi Badge
    let urgensiClass = "rutin";
    if (item.urgensi === 2) urgensiClass = "sedang";
    if (item.urgensi === 3) urgensiClass = "tinggi";
    if (item.urgensi === 4) urgensiClass = "darurat";

    const trHtml = `
      <tr data-id="${item.id}">
        <td><strong>${item.id}</strong></td>
        <td>
          <div style="font-weight: 600;">${escapeHtml(item.nama)}</div>
          <small style="color: var(--text-muted);">${item.nik}</small>
        </td>
        <td>${escapeHtml(item.poli)}</td>
        <td><small>${escapeHtml(item.dokter)}</small></td>
        <td><i class="far fa-calendar-alt" style="color: var(--primary);"></i> ${item.tanggal}</td>
        <td><span class="badge-urgency ${urgensiClass}">${item.urgensiText}</span></td>
        <td>
          <span class="badge-status ${statusClass} btn-status-toggle" data-id="${item.id}" style="cursor: pointer;" title="Klik untuk mengubah status">
            <i class="fas ${statusIcon}"></i> ${item.status}
          </span>
        </td>
        <td class="actions-cell">
          <button class="btn btn-secondary btn-sm btn-detail" data-id="${item.id}" title="Lihat Detail">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-danger btn-sm btn-delete" data-id="${item.id}" title="Hapus Data">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `;

    $tbody.append(trHtml);
  });
}

/**
 * Filters the table by search keyword and dropdown filter
 */
function filterTableData() {
  const searchKey = $('#search-tabel').val().toLowerCase().trim();
  const statusFilter = $('#filter-status').val();

  const filtered = reservationsData.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchKey) ||
                          item.nik.includes(searchKey) ||
                          item.poli.toLowerCase().includes(searchKey) ||
                          item.dokter.toLowerCase().includes(searchKey) ||
                          item.id.toLowerCase().includes(searchKey);

    const matchesStatus = (statusFilter === 'all') || (item.status === statusFilter);

    return matchesSearch && matchesStatus;
  });

  renderTableData(filtered);
}

/**
 * Delete a reservation by ID
 * @param {string} id 
 */
function deleteReservation(id) {
  reservationsData = reservationsData.filter(r => r.id !== id);
  renderTableData(reservationsData);
  updateStatsCounters();
}

/**
 * Update dashboard metrics cards dynamically
 */
function updateStatsCounters() {
  const total = reservationsData.length;
  const terkonfirmasi = reservationsData.filter(r => r.status === "Terkonfirmasi").length;
  const menunggu = reservationsData.filter(r => r.status === "Menunggu").length;

  $('#stat-total-reservasi').text(total);
  $('#stat-terkonfirmasi').text(terkonfirmasi);
  $('#stat-menunggu').text(menunggu);

  // Update progress bar kuota klinik
  const kuotaPersen = Math.min(Math.round((total / 15) * 100), 100);
  $('#progressbar-kuota').progressbar("value", kuotaPersen);
  $('#kuota-label').text(`${total}/15 Pasien Terdaftar (${kuotaPersen}%)`);
}

/**
 * Reset form inputs to clean default state
 */
function resetReservationForm() {
  $('#form-reservasi')[0].reset();
  $('#slider-urgensi').slider("value", 2);
  $('#urgensi-val').text('2');
  $('#urgensi-badge').text('2 - Sedang').attr('class', 'badge-urgency sedang');
  $('#input-urgensi-hidden').val(2);
  $('#select-poli').val('Poli Umum').selectmenu('refresh');
  $('.invalid-feedback').removeClass('show');
  $('.form-control').removeClass('is-invalid');
}

/**
 * Temporary toaster notification popup
 */
function showNotification(title, message) {
  const $toast = $(`
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: #0f172a; color: white; padding: 1rem 1.4rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border-left: 4px solid #0d9488; animation: slideIn 0.3s forwards;">
      <h4 style="margin:0 0 0.2rem 0; font-size: 0.95rem; font-family: 'Outfit'; color: #ccfbf1;"><i class="fas fa-check-circle"></i> ${title}</h4>
      <p style="margin:0; font-size: 0.85rem; color: #cbd5e1;">${message}</p>
    </div>
  `);

  $('body').append($toast);
  setTimeout(() => {
    $toast.fadeOut(400, function() { $(this).remove(); });
  }, 3500);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}
