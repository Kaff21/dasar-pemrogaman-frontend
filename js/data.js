/* ==========================================================================
   Data Initializer & State Management (MedCare)
   ========================================================================== */

// Initial Reservation Dataset
let reservationsData = [
  {
    id: "RES-2026-001",
    nik: "3504121508980001",
    nama: "Budi Santoso",
    phone: "081234567890",
    poli: "Poli Umum",
    dokter: "dr. Andi Wijaya, Sp.PD",
    tanggal: "12/08/2026",
    urgensi: 2,
    urgensiText: "Sedang",
    status: "Terkonfirmasi",
    catatan: "Pemeriksaan rutin tekanan darah dan gula darah."
  },
  {
    id: "RES-2026-002",
    nik: "3504122204950003",
    nama: "Siti Rahmawati",
    phone: "085712345678",
    poli: "Poli Gigi",
    dokter: "drg. Maya Putri",
    tanggal: "14/08/2026",
    urgensi: 1,
    urgensiText: "Rutin",
    status: "Menunggu",
    catatan: "Pembersihan karang gigi (Scaling)."
  },
  {
    id: "RES-2026-003",
    nik: "3504121010900002",
    nama: "Hendra Pratama",
    phone: "082198765432",
    poli: "Poli Anak",
    dokter: "dr. Rina Kurnia, Sp.A",
    tanggal: "15/08/2026",
    urgensi: 4,
    urgensiText: "Darurat",
    status: "Terkonfirmasi",
    catatan: "Demam tinggi 38.5C disertai batuk pilek 3 hari."
  },
  {
    id: "RES-2026-004",
    nik: "3504120503000004",
    nama: "Dewi Anggraini",
    phone: "083811223344",
    poli: "Poli Mata",
    dokter: "dr. Budi Rahardjo, Sp.M",
    tanggal: "16/08/2026",
    urgensi: 3,
    urgensiText: "Tinggi",
    status: "Selesai",
    catatan: "Mata merah dan perih terkena iritasi debu."
  }
];

// Doctors list for Autocomplete Suggestion
const doctorList = [
  "dr. Andi Wijaya, Sp.PD (Poli Umum / Penyakit Dalam)",
  "drg. Maya Putri (Poli Gigi)",
  "dr. Rina Kurnia, Sp.A (Poli Anak)",
  "dr. Budi Rahardjo, Sp.M (Poli Mata)",
  "dr. Ahmad Faris, Sp.B (Poli Bedah)",
  "dr. Citra Lestari, Sp.DVE (Poli Kulit & Kelamin)",
  "dr. Doni Prasetyo, Sp.OT (Poli Tulang / Orthopedi)",
  "dr. Eka Novita, Sp.N (Poli Saraf)"
];

// Diagnosis / Complaint suggestions for Autocomplete
const complaintList = [
  "Demam & Batuk Pilek",
  "Pemeriksaan Kesehatan Rutin (Medical Check Up)",
  "Nyeri Gigi / Sakit Gusi",
  "Pembersihan Karang Gigi (Scaling)",
  "Iritasi Mata Merah & Perih",
  "Nyeri Sendi & Asam Urat",
  "Sakit Maag / Asam Lambung (Gerd)",
  "Konsultasi Alergi Kulit"
];
