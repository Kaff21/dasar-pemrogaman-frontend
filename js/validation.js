/* ==========================================================================
   jQuery Form Validation Helper (MedCare)
   ========================================================================== */

/**
 * Validates the reservation form inputs using jQuery
 * @returns {boolean} isValid
 */
function validateReservationForm() {
  let isValid = true;

  // Clear previous validation messages & styles
  $('.invalid-feedback').removeClass('show').text('');
  $('.form-control').removeClass('is-invalid');

  // 1. Validasi Nama Pasien (Wajib, min 3 karakter)
  const namaVal = $('#input-nama').val().trim();
  if (namaVal === '') {
    showError('#input-nama', 'Nama pasien wajib diisi.');
    isValid = false;
  } else if (namaVal.length < 3) {
    showError('#input-nama', 'Nama pasien minimal 3 karakter.');
    isValid = false;
  }

  // 2. Validasi NIK (Wajib, persis 16 digit angka)
  const nikVal = $('#input-nik').val().trim();
  const nikRegex = /^[0-9]{16}$/;
  if (nikVal === '') {
    showError('#input-nik', 'NIK (Nomor Induk Kependudukan) wajib diisi.');
    isValid = false;
  } else if (!nikRegex.test(nikVal)) {
    showError('#input-nik', 'NIK harus berupa 16 digit angka valid.');
    isValid = false;
  }

  // 3. Validasi No. Telepon (Wajib, 10-13 digit angka)
  const phoneVal = $('#input-phone').val().trim();
  const phoneRegex = /^08[0-9]{8,11}$/;
  if (phoneVal === '') {
    showError('#input-phone', 'Nomor telepon/WhatsApp wajib diisi.');
    isValid = false;
  } else if (!phoneRegex.test(phoneVal)) {
    showError('#input-phone', 'Nomor telepon tidak valid (contoh: 081234567890).');
    isValid = false;
  }

  // 4. Validasi Poliklinik (Pilihan tidak boleh default/kosong)
  const poliVal = $('#select-poli').val();
  if (!poliVal || poliVal === '') {
    showError('#select-poli-wrapper', 'Silakan pilih Poliklinik tujuan.');
    isValid = false;
  }

  // 5. Validasi Dokter (Wajib diisi/dipilih dari autocomplete)
  const dokterVal = $('#input-dokter').val().trim();
  if (dokterVal === '') {
    showError('#input-dokter', 'Silakan tentukan / cari Dokter Spesialis.');
    isValid = false;
  }

  // 6. Validasi Tanggal Kunjungan (Wajib diisi via Datepicker)
  const tanggalVal = $('#input-tanggal').val().trim();
  if (tanggalVal === '') {
    showError('#input-tanggal', 'Tanggal kunjungan wajib ditentukan.');
    isValid = false;
  }

  return isValid;
}

/**
 * Utility to display error feedback on target element
 * @param {string} selector 
 * @param {string} message 
 */
function showError(selector, message) {
  const $el = $(selector);
  $el.addClass('is-invalid');
  
  // Find associated feedback element or create sibling
  let $feedback = $el.siblings('.invalid-feedback');
  if ($feedback.length === 0) {
    $feedback = $el.parent().find('.invalid-feedback');
  }
  
  $feedback.text(message).addClass('show');

  // Trigger smooth error animation
  $el.css({ transform: 'scale(1.01)' });
  setTimeout(() => $el.css({ transform: 'scale(1)' }), 200);
}

/**
 * Setup live real-time input clear validation error on typing
 */
function initLiveValidation() {
  $('.form-control').on('input change', function () {
    if ($(this).val().trim() !== '') {
      $(this).removeClass('is-invalid');
      $(this).siblings('.invalid-feedback').removeClass('show');
    }
  });

  // Restrict NIK input to digits only
  $('#input-nik').on('keypress', function (e) {
    if (e.which < 48 || e.which > 57) {
      e.preventDefault();
    }
  });
}
