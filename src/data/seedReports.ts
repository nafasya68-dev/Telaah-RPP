import { AnalysisReport } from '../types/telaah';
import {
  INSTRUMENT_DEFINITIONS,
  buildIncompatibilities,
  buildPriorities,
  calculateSummary,
  generateFeedback,
  generateReviewDescription,
} from './instruments';

export function createInitialSeedReports(): AnalysisReport[] {
  // 1. Report 1: Modul Ajar IPAS SD (Sangat Baik ~ 94.44)
  const ind1 = INSTRUMENT_DEFINITIONS.map((def) => {
    if (def.id === 1) {
      return {
        id: 1,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian Identitas Awal: Satuan Pendidikan: SD Negeri Nusantara Ceria, Mapel: IPAS, Fase C/Kelas 5, Materi: Harmoni dalam Ekosistem, Alokasi: 3 Pertemuan (6 x 35 Menit).",
        criticalComment: "Identitas RPP/Modul Ajar dicantumkan sangat lengkap, terstruktur rapi, dan memberikan konteks instruksional yang jelas.",
        recommendation: "Pertahankan kelengkapan informasi identitas kurikuler ini.",
      };
    }
    if (def.id === 2) {
      return {
        id: 2,
        name: def.name,
        isOptional: true,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian A (Identifikasi Murid): Pemetaan kesiapan 65% paham rantai makanan, 25% masih rancu, 10% butuh bimbingan konkret; serta profil gaya belajar kinestetik/visual.",
        criticalComment: "Identifikasi murid sangat mendalam, memetakan kesiapan kognitif berbasis data persentase dan memuat rekomendasi gaya belajar.",
        recommendation: "Gunakan data ini secara berkala untuk memonitor progres transisi murid yang membutuhkan bimbingan.",
      };
    }
    if (def.id === 3) {
      return {
        id: 3,
        name: def.name,
        isOptional: true,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian B (Materi Pelajaran): Membagi materi ke dalam pengetahuan faktual, konseptual, prosedural, dan integrasi nilai kepedulian lingkungan hidup.",
        criticalComment: "Struktur pengetahuan sangat komprehensif membedakan dimensi faktual hingga metakognitif/nilai moral.",
        recommendation: "Pertahankan kedalaman pemetaan materi konseptual ini.",
      };
    }
    if (def.id === 4) {
      return {
        id: 4,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian C: Beriman & Berakhlak Mulia (akhlak alam), Bernalar Kritis, Gotong Royong.",
        criticalComment: "Dimensi Profil Lulusan terdefinisi spesifik beserta indikator perilakunya dalam konteks materi ekosistem.",
        recommendation: "Pertahankan konsistensi penanaman dimensi profil dalam rubrik penilaian.",
      };
    }
    if (def.id === 5) {
      return {
        id: 5,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Tujuan nomor 1 dan 2 menargetkan nalar kritis dan gotong royong; langkah investigasi lapangan mewadahi kerja sama; asesmen rubrik mengukur penalaran kritis.",
        criticalComment: "Penyelarasan segitiga pedagogis terhadap dimensi profil lulusan sangat erat dan konsisten.",
        recommendation: "Pertahankan keselarasan holistik ini.",
      };
    }
    if (def.id === 6) {
      return {
        id: 6,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Constructive alignment optimal: Tujuan menganalisis jaring makanan terfasilitasi pada kegiatan inti dan diukur melalui asesmen produk poster.",
        criticalComment: "Terdapat benang merah yang sangat jelas dan tanpa disrupsi antara tujuan, langkah kegiatan, dan teknik asesmen.",
        recommendation: "Pertahankan keselarasan instruksional ini.",
      };
    }
    if (def.id === 7) {
      return {
        id: 7,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian D: 'Murid mampu menganalisis hubungan saling ketergantungan...' (KKO: Menganalisis & Memprediksi; Konten: Jaring-jaring makanan).",
        criticalComment: "Rumusan tujuan menggunakan KKO operasional tingkat tinggi (HOTS) serta memuat batasan konten yang terukur.",
        recommendation: "Pertahankan rumusan tujuan berorientasi kompetensi mendalam.",
      };
    }
    if (def.id === 8) {
      return {
        id: 8,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian E: Model Problem-Based Learning (PBL) dipadukan dengan Inquiry Lapangan di kebun sekolah.",
        criticalComment: "Pendekatan pedagogis berpusat pada murid, interaktif, memicu keingintahuan, dan sesuai karakteristik materi ekosistem.",
        recommendation: "Pertahankan variasi eksploratif inquiry ini.",
      };
    }
    if (def.id === 9) {
      return {
        id: 9,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian E: Ruang fisik kebun sekolah, tata letak meja melingkar U-shape untuk dialog santun, dan papan pajang karya kelas.",
        criticalComment: "Lingkungan belajar dirancang memperhatikan kenyamanan fisik, psikologis, dan interaksi kolaboratif murid.",
        recommendation: "Dapat ditambahkan protokol komunikasi kelas untuk memperkuat budaya saling mendengarkan.",
      };
    }
    if (def.id === 10) {
      return {
        id: 10,
        name: def.name,
        isOptional: true,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian F: Kolaborasi terstruktur dengan Petugas Kebun Sekolah dan Komunitas Bank Sampah/Pecinta Lingkungan Desa.",
        criticalComment: "Kemitraan nyata dengan narasumber lokal memperluas wawasan murid terhadap realitas ekologis di luar kelas.",
        recommendation: "Pertahankan keterlibatan komunitas lokal dalam projek pembelajaran.",
      };
    }
    if (def.id === 11) {
      return {
        id: 11,
        name: def.name,
        isOptional: true,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian F: Pemanfaatan 'Ecosystem Energy Flow Simulator' pada tablet dan dinding kolaboratif Padlet untuk refleksi bersama.",
        criticalComment: "Penggunaan digital bersifat interaktif dan kolaboratif dua arah, bukan sekadar tayangan video pasif.",
        recommendation: "Sediakan alternatif lembar fisik jika terdapat kendala jaringan.",
      };
    }
    if (def.id === 12) {
      return {
        id: 12,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian G.1 (Memahami): Mindful breathing udara segar, pertanyaan pemantik cacing/jamur lenyap, observasi biotik kebun.",
        criticalComment: "Tahap memahami menstimulasi nalar kritis dan mengaitkan konsep sains dengan observasi inderawi secara berkesadaran.",
        recommendation: "Pertahankan stimulasi berpikir awal yang kaya ini.",
      };
    }
    if (def.id === 13) {
      return {
        id: 13,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian G.2 (Mengaplikasi): Studi kasus nyata 'Hama Tikus akibat Penurunan Populasi Ular/Burung Hantu di Sawah Desa Sebelah'.",
        criticalComment: "Aktivitas mengaplikasi sangat otentik menghadapkan murid pada problem ekologis nyata di sekitar mereka.",
        recommendation: "Pertahankan studi kasus kontekstual yang problematik.",
      };
    }
    if (def.id === 14) {
      return {
        id: 14,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian G.3 (Merefleksi): 3 pertanyaan metakognitif terstruktur mengulas tantangan, strategi belajar kelompok, dan komitmen aksi nyata di rumah.",
        criticalComment: "Refleksi metakognitif sangat kuat melatih kesadaran diri murid atas proses belajarnya.",
        recommendation: "Dokumentasikan jurnal refleksi berkala murid.",
      };
    }
    if (def.id === 15) {
      return {
        id: 15,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian E: Budaya belajar saling memuliakan, memberi kesempatan tiap anak berbicara tanpa interupsi, dan apresiasi positif.",
        criticalComment: "Etika saling menghormati dan inklusivitas dirancang terstruktur dalam tata kelola diskusi kelompok.",
        recommendation: "Pertahankan iklim kelas yang aman dan saling memuliakan ini.",
      };
    }
    if (def.id === 16) {
      return {
        id: 16,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian H: Berkesadaran (mindful breathing & kesadaran ekologis), Bermakna (relevansi pangan lokal), Menggembirakan (permainan Web of Life).",
        criticalComment: "Ketiga pilar Pembelajaran Mendalam (Mindful, Meaningful, Joyful) berpadu harmonis dalam rancangan skenario kegiatan.",
        recommendation: "Pertahankan rancangan pembelajaran yang menggembirakan murid.",
      };
    }
    if (def.id === 17) {
      return {
        id: 17,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian I.1 & A: Murid yang butuh bantuan dipasangkan dengan teman sebaya (peer scaffolding) dan disediakan kartu bergambar tambahan.",
        criticalComment: "Akomodasi keragaman peserta didik diimplementasikan nyata melalui diferensiasi proses dan scaffolding bertingkat.",
        recommendation: "Pantau efektivitas kelompok tutor sebaya saat sesi praktikum.",
      };
    }
    if (def.id === 18) {
      return {
        id: 18,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian I.1: Asesmen awal diagnostik kuis visual 4 pertanyaan dengan tindak lanjut penyesuaian pendampingan kelompok.",
        criticalComment: "Asesmen awal tidak hanya formalitas, namun memiliki rencana tindak lanjut adaptif yang jelas bagi kelompok murid.",
        recommendation: "Pertahankan integrasi asesmen awal dengan diferensiasi pembelajaran.",
      };
    }
    if (def.id === 19) {
      return {
        id: 19,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian I.2: Lembar observasi partisipasi aktif kelompok, catatan anekdot guru, dan umpan balik dua arah kontinyu.",
        criticalComment: "Asesmen selama proses memfasilitasi umpan balik formatif secara berkelanjutan untuk perbaikan langsung saat belajar.",
        recommendation: "Pertahankan catatan anekdotal guru saat mendampingi kelompok.",
      };
    }
    if (def.id === 20) {
      return {
        id: 20,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian I.3: Penilaian produk diagram aliran energi ekosistem dan unjuk kerja presentasi solusi ekologis berkelanjutan.",
        criticalComment: "Asesmen hasil pembelajaran bersifat otentik (produk karya dan unjuk kerja), bukan sebatas tes pilihan ganda hafalan.",
        recommendation: "Pertahankan asesmen otentik berbasis unjuk kerja nyata.",
      };
    }
    if (def.id === 21) {
      return {
        id: 21,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian I.4: Rubrik KKTP terperinci 4 jenjang (Perlu Bimbingan, Cukup, Baik, Sangat Mahir) memuat deskriptor kelogisan solusi.",
        criticalComment: "Kriteria ketercapaian tujuan pembelajaran (KKTP) dirumuskan jelas dengan deskriptor kualitatif objektif.",
        recommendation: "Bagikan rubrik ini kepada murid di awal tugas agar mereka paham standar keberhasilan.",
      };
    }
    // id 22: Lembar Kerja Murid
    return {
      id: 22,
      name: def.name,
      isOptional: true,
      status: 'Terpenuhi Optimal' as const,
      score: 2 as const,
      evidence: "Bagian J (Lampiran): LKPD 'Detektif Ekosistem Kebun Sekolah' dan Lembar Refleksi Metakognitif Murid.",
      criticalComment: "Lembar kerja murid tersedia terstruktur, instruktif, kontekstual, dan selaras mendukung alur Memahami, Mengaplikasi, dan Merefleksi.",
      recommendation: "Pertahankan lembar kerja berorientasi penemuan mandiri ini.",
    };
  });

  const sum1 = calculateSummary(ind1);
  const rep1: AnalysisReport = {
    id: 'report-sample-1',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    fileName: 'Modul_Ajar_IPAS_Kelas5_Ekosistem.pdf',
    fileSize: '412 KB',
    fileType: 'application/pdf',
    identity: {
      teacherName: 'Ratna Dewi, S.Pd.',
      teacherNip: '19880415 201101 2 018',
      subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
      gradePhase: 'Fase C / Kelas 5',
      school: 'SD Negeri Nusantara Ceria',
      title: 'Harmoni dalam Ekosistem: Aliran Energi dan Jaring Makanan',
      topic: 'Ekosistem & Jaring-Jaring Makanan',
      timeAllocation: '3 Pertemuan (6 x 35 Menit)',
      reviewDate: '03 Oktober 2026',
      reviewerName: 'Dr. H. Muhammad Arifin, M.Pd. (Pengawas Sekolah)',
      reviewerNip: '19750812 200003 1 004',
    },
    indicators: ind1,
    summary: sum1,
    incompatibleComponents: buildIncompatibilities(ind1),
    extraNotes: [
      {
        componentName: 'GLOSARIUM SAINS LOKAL',
        finding: 'Modul melampirkan glosarium istilah ekologi dalam bahasa lokal Sunda dan Indonesia untuk mempermudah murid.',
        recommendation: 'Inisiatif sangat baik untuk konteks kearifan lokal, tidak memengaruhi nilai 22 indikator.',
      },
    ],
    feedback: generateFeedback(ind1, sum1),
    reviewDescription: generateReviewDescription(sum1, ind1),
    priorities: buildPriorities(ind1),
  };

  // 2. Report 2: Modul Ajar Matematika SMP (Baik ~ 78.57)
  const ind2 = INSTRUMENT_DEFINITIONS.map((def) => {
    if (def.id === 1) {
      return {
        id: 1,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian A: Penyusun: Bambang Kusuma, SMPN 3 Bintang Harapan, Fase D (Kelas 8), Matematika, Alokasi 4 JP.",
        criticalComment: "Identitas dicantumkan lengkap dan informatif.",
        recommendation: "Pertahankan kelengkapan identitas.",
      };
    }
    if (def.id === 2) {
      return {
        id: 2,
        name: def.name,
        isOptional: true,
        status: 'N/A' as const,
        score: 'N/A' as const,
        evidence: "Komponen bersifat opsional dan tidak dicantumkan dalam dokumen, sehingga tidak diperhitungkan dalam nilai akhir.",
        criticalComment: "Dokumen tidak mencantumkan pemetaan profil/karakteristik awal peserta didik.",
        recommendation: "Disarankan menambahkan pemetaan kesiapan belajar numerasi murid.",
      };
    }
    if (def.id === 3) {
      return {
        id: 3,
        name: def.name,
        isOptional: true,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Hanya disebutkan judul materi 'Menemukan dan Mengaplikasikan Teorema Pythagoras' tanpa rincian jenis pengetahuan konseptual/faktual.",
        criticalComment: "Materi hanya dicantumkan judulnya tanpa pemetaan struktur konsep yang sistematis.",
        recommendation: "Uraikan materi secara terstruktur dari pembuktian visual hingga penerapan kontekstual.",
      };
    }
    if (def.id === 4) {
      return {
        id: 4,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Bagian C: Bernalar Kritis dan Mandiri disebutkan secara umum.",
        criticalComment: "Dimensi Profil Lulusan dicantumkan tetapi belum dijabarkan rubrik perilaku spesifiknya dalam proses belajar.",
        recommendation: "Perjelas indikator ketercapaian Bernalar Kritis dalam langkah pembuktian rumus.",
      };
    }
    if (def.id === 5) {
      return {
        id: 5,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Tujuan memuat bernalar kritis, namun asesmen sumatif hanya tes tertulis angka rutin.",
        criticalComment: "Keselarasan terhadap dimensi profil masih parsial karena asesmen belum menilai proses bernalar kritis secara eksplisit.",
        recommendation: "Tambahkan rubrik proses untuk mengukur penalaran kritis saat manipulasi puzzle origami.",
      };
    }
    if (def.id === 6) {
      return {
        id: 6,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Tujuan nomor 2 menargetkan masalah kontekstual atap rumah, tetapi langkah kegiatan hanya sampai potongan origami.",
        criticalComment: "Penerapan kontekstual pada langkah pembelajaran belum mendalam dibandingkan target tujuan pembelajaran.",
        recommendation: "Sediakan aktivitas latihan lapangan langsung mengukur tangga atau bayangan tiang bendera.",
      };
    }
    if (def.id === 7) {
      return {
        id: 7,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian B: 'Peserta didik dapat membuktikan kebenaran Teorema Pythagoras... dan menghitung panjang sisi...'.",
        criticalComment: "Tujuan pembelajaran memuat kompetensi operasional dan lingkup materi yang jelas.",
        recommendation: "Pertahankan perumusan tujuan pembelajaran terukur.",
      };
    }
    if (def.id === 8) {
      return {
        id: 8,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Bagian D & E: Model Discovery Learning dengan media manipulatif kertas origami berpetak.",
        criticalComment: "Praktik pedagogis mendorong penemuan konsep secara aktif melalui manipulasi alat peraga konkret.",
        recommendation: "Pertahankan pendekatan konstruktivis penemuan konsep ini.",
      };
    }
    if (def.id === 9) {
      return {
        id: 9,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Pengaturan kelompok disebutkan singkat, tanpa deskripsi iklim psikologis atau norma diskusi.",
        criticalComment: "Lingkungan fisik dan budaya belajar kelas belum diuraikan secara mendalam.",
        recommendation: "Deskripsikan bagaimana meja kelompok ditata dan bagaimana iklim saling menghargai dijaga.",
      };
    }
    if (def.id === 10) {
      return {
        id: 10,
        name: def.name,
        isOptional: true,
        status: 'N/A' as const,
        score: 'N/A' as const,
        evidence: "Komponen bersifat opsional dan tidak dicantumkan dalam dokumen, sehingga tidak diperhitungkan dalam nilai akhir.",
        criticalComment: "Kemitraan pembelajaran tidak dicantumkan dalam dokumen.",
        recommendation: "Dapat melibatkan guru seni atau arsitek lokal jika memungkinkan.",
      };
    }
    if (def.id === 11) {
      return {
        id: 11,
        name: def.name,
        isOptional: true,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Disebutkan 'geogebra applet di proyektor' yang didemonstrasikan oleh guru di depan kelas.",
        criticalComment: "Penggunaan digital masih terpusat pada guru (demonstrasi satu arah) dan belum dimanipulasi mandiri oleh murid.",
        recommendation: "Beri kesempatan murid mengeksplorasi geogebra secara interaktif melalui gawai atau laboratorium komputer.",
      };
    }
    if (def.id === 12) {
      return {
        id: 12,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Siswa memotong origami luas persegi a^2, b^2, c^2 untuk memahami hubungan luas bidang pada segitiga siku-siku.",
        criticalComment: "Tahap memahami terlaksana secara konkret melalui pengalaman visual dan kinestetik yang kuat.",
        recommendation: "Pertahankan aktivitas pembuktian bermakna ini.",
      };
    }
    if (def.id === 13) {
      return {
        id: 13,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Aplikasi kontekstual diakhiri dengan PR 5 butir soal di buku paket konvensional.",
        criticalComment: "Aplikasi konsep belum menantang murid menyelesaikan masalah nyata yang otentik di lingkungan sekolah.",
        recommendation: "Ganti PR buku paket dengan tugas mini-proyek pengukuran tinggi tiang bendera menggunakan klinometer dan teorema pythagoras.",
      };
    }
    if (def.id === 14) {
      return {
        id: 14,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Penutup: 'Siswa ditanya apakah pelajaran menyenangkan.'",
        criticalComment: "Refleksi masih sangat dangkal, hanya menanyakan perasaan senang tanpa menyentuh metakognisi strategi berpikir matematika.",
        recommendation: "Gunakan panduan refleksi metakognitif: bagaimana cara kamu mengatasi kebuntuan saat membuktikan rumus pythagoras tadi?",
      };
    }
    if (def.id === 15) {
      return {
        id: 15,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Interaksi diskusi kelompok ada, namun protokol saling menghargai pendapat rekan belum tertulis.",
        criticalComment: "Budaya saling memuliakan dan mendengarkan ide matematika teman belum tertuang secara eksplisit.",
        recommendation: "Sematkan aturan diskusi saling mengapresiasi cara berpikir yang berbeda.",
      };
    }
    if (def.id === 16) {
      return {
        id: 16,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Pembelajaran bermakna dengan origami, namun aspek berkesadaran (mindful) dan refleksi mendalam belum muncul.",
        criticalComment: "Prinsip Pembelajaran Mendalam baru terpenuhi pada aspek aktivitas penemuan konsep, tetapi belum utuh pada aspek mindful.",
        recommendation: "Integrasikan jeda berpikir berkesadaran saat siswa mengamati pola bilangan kuadrat.",
      };
    }
    if (def.id === 17) {
      return {
        id: 17,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Semua murid mengerjakan set puzzle origami yang seragam tanpa diferensiasi scaffolding.",
        criticalComment: "Belum tampak penyesuaian bimbingan untuk siswa yang mengalami kesulitan dengan konsep perkalian/akar bilangan.",
        recommendation: "Sediakan petunjuk bertingkat (scaffolding cards) bagi siswa yang membutuhkan bantuan ekstra.",
      };
    }
    if (def.id === 18) {
      return {
        id: 18,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Asesmen awal berupa tanya jawab lisan tanpa pencatatan dan tanpa skenario tindak lanjut.",
        criticalComment: "Asesmen awal belum memiliki instrumen diagnostik yang jelas dan belum ada rencana tindak lanjut adaptif.",
        recommendation: "Buat kuis singkat 3 soal prasyarat akar/kuadrat dan kelompokkan siswa berdasarkan hasil untuk menentukan pendampingan.",
      };
    }
    if (def.id === 19) {
      return {
        id: 19,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Pengamatan keaktifan saat berdiskusi dicatat guru secara umum.",
        criticalComment: "Asesmen formatif belum memfasilitasi umpan balik konstruktif langsung kepada murid.",
        recommendation: "Gunakan lembar checklist observasi formatif disertai umpan balik lisan spesifik kepada tiap kelompok.",
      };
    }
    if (def.id === 20) {
      return {
        id: 20,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Tes tertulis 5 butir soal uraian di akhir bab.",
        criticalComment: "Bentuk asesmen masih bersifat tes tertulis konvensional dan belum menguji penalaran pemecahan masalah otentik.",
        recommendation: "Kombinasikan dengan unjuk kerja pemecahan masalah atau proyek miniatur bangunan siku-siku.",
      };
    }
    if (def.id === 21) {
      return {
        id: 21,
        name: def.name,
        isOptional: false,
        status: 'Belum Terpenuhi' as const,
        score: 0 as const,
        evidence: "Dokumen hanya menulis 'Rubrik Penilaian: Skor 0 - 100 berdasarkan rumus matematika' tanpa ada deskriptor kriteria kualitatif.",
        criticalComment: "Rubrik KKTP dengan deskriptor tingkatan capaian sama sekali belum tersedia dalam naskah modul.",
        recommendation: "Wajib menyusun rubrik analitik KKTP yang memuat tingkatan (Baru Berkembang, Layak, Cakap, Mahir) beserta deskriptornya.",
      };
    }
    // id 22: Lembar Kerja Murid
    return {
      id: 22,
      name: def.name,
      isOptional: true,
      status: 'Terpenuhi Optimal' as const,
      score: 2 as const,
      evidence: "Terdapat lembar kerja puzzle pythagoras berbasis origami untuk memotong dan menempel persegi.",
      criticalComment: "Lembar kerja murid tersedia dan selaras mendukung proses eksplorasi penemuan konsep pythagoras.",
      recommendation: "Pertahankan lembar aktivitas kinestetik ini.",
    };
  });

  const sum2 = calculateSummary(ind2);
  const rep2: AnalysisReport = {
    id: 'report-sample-2',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    fileName: 'Modul_Ajar_Matematika_FaseD_Pythagoras.docx',
    fileSize: '185 KB',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    identity: {
      teacherName: 'Bambang Kusuma, M.Pd.',
      teacherNip: '19820719 200604 1 012',
      subject: 'Matematika',
      gradePhase: 'Fase D / Kelas 8 SMP',
      school: 'SMP Negeri 3 Bintang Harapan',
      title: 'Eksplorasi Teorema Pythagoras dalam Arsitektur',
      topic: 'Teorema Pythagoras & Segitiga Siku-Siku',
      timeAllocation: '2 Pertemuan (4 x 40 Menit)',
      reviewDate: '30 September 2026',
      reviewerName: 'Siti Aminah, M.Pd. (Instruktur Pelatihan Kurikulum)',
      reviewerNip: '19790321 200501 2 006',
    },
    indicators: ind2,
    summary: sum2,
    incompatibleComponents: buildIncompatibilities(ind2),
    extraNotes: [],
    feedback: generateFeedback(ind2, sum2),
    reviewDescription: generateReviewDescription(sum2, ind2),
    priorities: buildPriorities(ind2),
  };

  // 3. Report 3: RPP Bahasa Indonesia Klasik (Perlu Perbaikan ~ 45.45)
  const ind3 = INSTRUMENT_DEFINITIONS.map((def) => {
    if (def.id === 1) {
      return {
        id: 1,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Optimal' as const,
        score: 2 as const,
        evidence: "Identitas RPP mencantumkan Sekolah, Mapel, Kelas/Semester, Materi Pokok, Alokasi Waktu.",
        criticalComment: "Identitas administratif RPP lengkap.",
        recommendation: "Pertahankan kelengkapan administratif.",
      };
    }
    if (def.id === 2 || def.id === 3 || def.id === 10 || def.id === 11) {
      return {
        id: def.id,
        name: def.name,
        isOptional: true,
        status: 'N/A' as const,
        score: 'N/A' as const,
        evidence: "Komponen bersifat opsional dan tidak dicantumkan dalam dokumen, sehingga tidak diperhitungkan dalam nilai akhir.",
        criticalComment: `Komponen opsional "${def.name}" tidak dicantumkan dalam RPP konvensional ini.`,
        recommendation: `Disarankan mengintegrasikan ${def.name} untuk memperkaya pembelajaran.`,
      };
    }
    if (def.id === 4) {
      return {
        id: 4,
        name: def.name,
        isOptional: false,
        status: 'Belum Terpenuhi' as const,
        score: 0 as const,
        evidence: "Tidak ditemukan bukti yang mendukung indikator ini dalam dokumen.",
        criticalComment: "Dimensi Profil Lulusan sama sekali tidak dicantumkan dalam RPP.",
        recommendation: "Wajib mencantumkan dimensi profil lulusan yang disasar (misal: Bernalar Kritis dan Mandiri) serta cara pembinaannya.",
      };
    }
    if (def.id === 5) {
      return {
        id: 5,
        name: def.name,
        isOptional: false,
        status: 'Belum Terpenuhi' as const,
        score: 0 as const,
        evidence: "Tidak ditemukan bukti yang mendukung indikator ini dalam dokumen.",
        criticalComment: "Karena dimensi profil tidak dicantumkan, tidak ada keselarasan segitiga pedagogis terhadap profil kelulusan.",
        recommendation: "Petakan dimensi profil pada tujuan, kegiatan, dan asesmen secara kohesif.",
      };
    }
    if (def.id === 6) {
      return {
        id: 6,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Tujuan menjelaskan pengertian & ciri kebahasaan; langkah pembelajaran diisi guru ceramah dan mendiktekan contoh.",
        criticalComment: "Hubungan tujuan dan langkah bersifat satu arah dan mekanistik tanpa ruang eksplorasi mandiri murid.",
        recommendation: "Rancang langkah kegiatan yang mengaktifkan nalar murid untuk menganalisis teks secara langsung.",
      };
    }
    if (def.id === 7) {
      return {
        id: 7,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Siswa dapat menjelaskan pengertian dan mengidentifikasi ciri kebahasaan.",
        criticalComment: "Tujuan pembelajaran masih berada pada ranah kognitif tingkat rendah (mengingat/menjelaskan definisi) dan belum mendorong produksi teks nyata.",
        recommendation: "Tingkatkan kedalaman tujuan pembelajaran hingga murid mampu memproduksi dan mengevaluasi teks LHO kontekstual.",
      };
    }
    if (def.id === 8) {
      return {
        id: 8,
        name: def.name,
        isOptional: false,
        status: 'Belum Terpenuhi' as const,
        score: 0 as const,
        evidence: "Metode hanya: ceramah bervariasi, tanya jawab, penugasan mandiri. Tidak ada model pembelajaran inovatif.",
        criticalComment: "Praktik pedagogis sangat konvensional dan didominasi metode ceramah guru (teacher-centered).",
        recommendation: "Gunakan model pembelajaran aktif seperti Genre-Based Approach (Pedagogi Genre) atau Problem-Based Learning.",
      };
    }
    if (def.id === 9) {
      return {
        id: 9,
        name: def.name,
        isOptional: false,
        status: 'Belum Terpenuhi' as const,
        score: 0 as const,
        evidence: "Tidak ditemukan bukti yang mendukung indikator ini dalam dokumen.",
        criticalComment: "Tidak ada perhatian terhadap pengelolaan iklim kelas, lingkungan fisik, maupun budaya belajar.",
        recommendation: "Rancang lingkungan kelas yang mendukung interaksi aktif dan budaya literasi positif.",
      };
    }
    if (def.id === 12) {
      return {
        id: 12,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Guru menjelaskan definisi dan membacakan contoh teks lidah buaya; siswa mencatat di buku catatan.",
        criticalComment: "Tahap memahami hanya berupa transmisi pasif dan mencatat penjelasan guru, bukan membangun konsep sendiri.",
        recommendation: "Gunakan pertanyaan pemantik dan aktivitas membedah teks otentik secara berpasangan.",
      };
    }
    if (def.id === 13) {
      return {
        id: 13,
        name: def.name,
        isOptional: false,
        status: 'Belum Terpenuhi' as const,
        score: 0 as const,
        evidence: "Siswa hanya mengerjakan latihan di LKS halaman 14 menentukan bagian paragraf, tidak melakukan observasi objek nyata.",
        criticalComment: "Aktivitas mengaplikasi sangat minim; tidak ada pengamatan objek nyata padahal materi adalah laporan hasil observasi.",
        recommendation: "Ajak siswa melakukan observasi langsung terhadap tanaman/fasilitas di lingkungan sekolah dan menulis laporannya.",
      };
    }
    if (def.id === 14) {
      return {
        id: 14,
        name: def.name,
        isOptional: false,
        status: 'Belum Terpenuhi' as const,
        score: 0 as const,
        evidence: "Penutup hanya guru merangkum dan menugaskan membaca bab selanjutnya.",
        criticalComment: "Tidak ada kegiatan refleksi metakognisi bagi murid sama sekali.",
        recommendation: "Alokasikan 10 menit di penutup untuk refleksi diri murid mengenai proses dan tantangan belajar mereka.",
      };
    }
    if (def.id === 15) {
      return {
        id: 15,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Terdapat sesi tanya jawab jika murid belum paham.",
        criticalComment: "Interaksi didominasi satu arah guru ke murid, belum tergambar relasi saling memuliakan dan kolaborasi antar rekan.",
        recommendation: "Tumbuhkan budaya saling mendengarkan dan saling memberikan umpan balik apresiatif antar siswa.",
      };
    }
    if (def.id === 16) {
      return {
        id: 16,
        name: def.name,
        isOptional: false,
        status: 'Belum Terpenuhi' as const,
        score: 0 as const,
        evidence: "Tidak ditemukan bukti yang mendukung indikator ini dalam dokumen.",
        criticalComment: "Tidak mencerminkan prinsip Pembelajaran Mendalam (berkesadaran, bermakna, menggembirakan); suasana belajar cenderung pasif dan monoton.",
        recommendation: "Rekonstruksi alur kegiatan agar menggugah rasa ingin tahu dan memberikan kegembiraan belajar bagi siswa.",
      };
    }
    if (def.id === 17) {
      return {
        id: 17,
        name: def.name,
        isOptional: false,
        status: 'Belum Terpenuhi' as const,
        score: 0 as const,
        evidence: "Semua siswa diperlakukan seragam (one size fits all) menyimak dan mengerjakan halaman yang sama.",
        criticalComment: "Tidak ada akomodasi terhadap keragaman minat atau kecepatan belajar murid.",
        recommendation: "Berikan keleluasaan bagi murid memilih objek observasi yang sesuai dengan minat mereka masing-masing.",
      };
    }
    if (def.id === 18) {
      return {
        id: 18,
        name: def.name,
        isOptional: false,
        status: 'Belum Terpenuhi' as const,
        score: 0 as const,
        evidence: "Tidak ditemukan bukti yang mendukung indikator ini dalam dokumen.",
        criticalComment: "Tidak terdapat asesmen awal / diagnostik untuk memetakan kesiapan membaca atau menulis murid.",
        recommendation: "Wajib merancang asesmen awal untuk mengetahui kemampuan prasyarat menyusun teks laporan observasi.",
      };
    }
    if (def.id === 19) {
      return {
        id: 19,
        name: def.name,
        isOptional: false,
        status: 'Belum Terpenuhi' as const,
        score: 0 as const,
        evidence: "Penilaian hanya di akhir: nilai latihan LKS dan kelengkapan catatan.",
        criticalComment: "Tidak ada asesmen formatif selama proses pembelajaran dan tidak ada mekanisme umpan balik dialogis.",
        recommendation: "Lakukan asesmen formatif saat murid membedah struktur teks dengan memberikan umpan balik langsung.",
      };
    }
    if (def.id === 20) {
      return {
        id: 20,
        name: def.name,
        isOptional: false,
        status: 'Terpenuhi Sebagian' as const,
        score: 1 as const,
        evidence: "Penilaian pengetahuan berupa nilai latihan LKS skala 0-100.",
        criticalComment: "Pengukuran kompetensi masih sempit hanya mengandalkan lembar soal LKS komersial.",
        recommendation: "Lakukan penilaian unjuk kerja otentik berupa naskah laporan hasil observasi karya murid sendiri.",
      };
    }
    if (def.id === 21) {
      return {
        id: 21,
        name: def.name,
        isOptional: false,
        status: 'Belum Terpenuhi' as const,
        score: 0 as const,
        evidence: "Tidak ditemukan bukti yang mendukung indikator ini dalam dokumen.",
        criticalComment: "Tidak ada rubrik atau kriteria penilaian sama sekali.",
        recommendation: "Wajib menyusun rubrik penilaian teks LHO memuat kriteria kelengkapan struktur dan ketepatan kaidah kebahasaan.",
      };
    }
    // id 22: Lembar Kerja Murid (Opsional)
    return {
      id: 22,
      name: def.name,
      isOptional: true,
      status: 'Terpenuhi Sebagian' as const,
      score: 1 as const,
      evidence: "Hanya merujuk pada latihan LKS komersial halaman 14 tanpa melampirkan lembar kerja orisinal rancangan guru.",
      criticalComment: "Lembar kerja murid belum dirancang sendiri dan belum memfasilitasi tahapan Mengaplikasi dan Merefleksi secara utuh.",
      recommendation: "Buat LKPD observasi langsung yang memandu murid dari observasi lapangan hingga penyusunan draf teks.",
    };
  });

  const sum3 = calculateSummary(ind3);
  const rep3: AnalysisReport = {
    id: 'report-sample-3',
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    fileName: 'RPP_Bahasa_Indonesia_Kelas10_LHO.docx',
    fileSize: '98 KB',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    identity: {
      teacherName: 'Drs. Hendro Wibowo',
      teacherNip: '19851103 200902 1 007',
      subject: 'Bahasa Indonesia',
      gradePhase: 'Fase E / Kelas 10 SMA',
      school: 'SMA Bina Cendekia',
      title: 'Teks Laporan Hasil Observasi (Format Klasik)',
      topic: 'Teks Laporan Hasil Observasi',
      timeAllocation: '2 x 45 Menit (1 Pertemuan)',
      reviewDate: '26 September 2026',
      reviewerName: 'Drs. Supriyanto (Pengawas SMA Cabang Dinas Wilayah I)',
      reviewerNip: '19680514 199303 1 003',
    },
    indicators: ind3,
    summary: sum3,
    incompatibleComponents: buildIncompatibilities(ind3),
    extraNotes: [],
    feedback: generateFeedback(ind3, sum3),
    reviewDescription: generateReviewDescription(sum3, ind3),
    priorities: buildPriorities(ind3),
  };

  // 4. Report 4A: RPP Biologi SMA Al HASRA - Sebelum Revisi (Draf Awal) ~ 72.22 (BAIK)
  const ind4A = INSTRUMENT_DEFINITIONS.map((def) => {
    switch (def.id) {
      case 1:
        return {
          id: 1,
          name: def.name,
          isOptional: false,
          status: 'Terpenuhi Optimal' as const,
          score: 2 as const,
          evidence: "Tercantum identitas: Satuan Pendidikan SMA Al HASRA, Mapel Biologi Fase E Kelas X, Materi Ekosistem, 2 x 45 Menit.",
          criticalComment: "Identitas perencanaan dicantumkan lengkap dan jelas.",
          recommendation: "Pertahankan kelengkapan informasi identitas kurikuler ini.",
        };
      case 2: // Identifikasi Murid / Peserta Didik
        return {
          id: 2,
          name: def.name,
          isOptional: true,
          status: 'Terpenuhi Sebagian' as const,
          score: 1 as const,
          evidence: "Tercantum kalimat singkat: 'Peserta didik kelas X memiliki minat pada biologi lingkungan.'",
          criticalComment: "Identifikasi peserta didik baru bersifat umum, belum memetakan kesiapan kognitif awal dan gaya belajar secara rinci.",
          recommendation: "Lengkapi dengan data asesmen diagnostik kesiapan materi ekosistem dan pemetaan gaya belajar.",
        };
      case 3:
        return {
          id: 3,
          name: def.name,
          isOptional: true,
          status: 'Terpenuhi Sebagian' as const,
          score: 1 as const,
          evidence: "Materi memuat komponen biotik, abiotik, dan rantai makanan.",
          criticalComment: "Uraian materi masih dominan faktual, belum terstruktur hingga level konseptual dan metakognitif.",
          recommendation: "Uraikan materi dari ranah faktual hingga metakognitif kontekstual kelestarian alam.",
        };
      case 4: // Dimensi Profil Lulusan
        return {
          id: 4,
          name: def.name,
          isOptional: false,
          status: 'Terpenuhi Optimal' as const,
          score: 2 as const,
          evidence: "Tercantum target Dimensi Profil Lulusan: Bernalar Kritis dan Gotong Royong.",
          criticalComment: "Dimensi Profil Lulusan dinyatakan spesifik relevan dengan materi biologi.",
          recommendation: "Pastikan ketercapaian dimensi profil terukur pada rubrik asesmen.",
        };
      case 8: // Praktik Pedagogis
        return {
          id: 8,
          name: def.name,
          isOptional: false,
          status: 'Terpenuhi Sebagian' as const,
          score: 1 as const,
          evidence: "Metode ceramah dan tanya jawab di dalam kelas.",
          criticalComment: "Model pembelajaran belum menerapkan penyelidikan aktif kontekstual.",
          recommendation: "Terapkan Problem-Based Learning (PBL) berbasis observasi keanekaragaman taman sekolah.",
        };
      case 14: // Merefleksi
        return {
          id: 14,
          name: def.name,
          isOptional: false,
          status: 'Terpenuhi Sebagian' as const,
          score: 1 as const,
          evidence: "Guru menanyakan: 'Apakah kalian paham pelajaran hari ini?'",
          criticalComment: "Refleksi masih bersifat konfirmasi satu arah, belum menyentuh metakognitif murid.",
          recommendation: "Sediakan pertanyaan refleksi terstruktur mengenai strategi belajar dan aksi nyata menjaga alam.",
        };
      case 21: // Rubrik Penilaian
        return {
          id: 21,
          name: def.name,
          isOptional: false,
          status: 'Terpenuhi Sebagian' as const,
          score: 1 as const,
          evidence: "Pedoman penskoran tes pilihan ganda dan uraian singkat.",
          criticalComment: "Rubrik analitik KKTP bertingkat kualitatif belum dilampirkan.",
          recommendation: "Susun rubrik analitik KKTP 4 jenjang memuat deskriptor capaian yang terukur.",
        };
      case 22: // LKPD
        return {
          id: 22,
          name: def.name,
          isOptional: true,
          status: 'N/A' as const,
          score: 'N/A' as const,
          evidence: "Komponen bersifat opsional dan belum dilampirkan dalam draf awal.",
          criticalComment: "Modul draf awal belum menyertakan LKPD khusus investigasi ekosistem.",
          recommendation: "Lampirkan LKPD kontekstual penyelidikan taman sekolah untuk memperdalam pemahaman.",
        };
      default:
        return {
          id: def.id,
          name: def.name,
          isOptional: def.isOptional,
          status: 'Terpenuhi Sebagian' as const,
          score: 1 as const,
          evidence: "Tercantum komponen dasar dalam draf awal perencanaan.",
          criticalComment: "Komponen tersedia namun perlu penyelarasan dengan siklus Pembelajaran Mendalam.",
          recommendation: "Perkuat keterpaduan komponen sesuai panduan supervisi kurikulum.",
        };
    }
  });

  const sum4A = calculateSummary(ind4A);
  const rep4A: AnalysisReport = {
    id: 'report-rifa-awal',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    fileName: 'RPP_Biologi_Ekosistem_Draf_Awal.docx',
    fileSize: '112 KB',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    identity: {
      teacherName: 'RIFA’ATUL MAHMUDAH, S.Pd.',
      teacherNip: '19920314 201903 2 021',
      subject: 'Biologi',
      gradePhase: 'Fase E / Kelas X SMA',
      school: 'SMA Al HASRA',
      title: 'Modul Ajar Biologi: Ekosistem & Lingkungan (Sebelum Revisi / Draf Awal)',
      topic: 'Interaksi Komponen Ekosistem',
      timeAllocation: '2 Pertemuan (4 x 45 Menit)',
      reviewDate: '28 September 2026',
      uploadDate: '28 September 2026',
      reviewerName: 'Dr. H. Muhammad Arifin, M.Pd.',
      reviewerNip: '19750812 200003 1 004',
    },
    indicators: ind4A,
    summary: sum4A,
    incompatibleComponents: buildIncompatibilities(ind4A),
    extraNotes: [],
    feedback: generateFeedback(ind4A, sum4A),
    reviewDescription: generateReviewDescription(sum4A, ind4A),
    priorities: buildPriorities(ind4A),
  };

  // 5. Report 4B: RPP Biologi SMA Al HASRA - Sesudah Revisi (Hasil Supervisi Siklus 1) ~ 97.22 (SANGAT BAIK)
  const ind4B = INSTRUMENT_DEFINITIONS.map((def) => {
    switch (def.id) {
      case 1:
        return {
          id: 1,
          name: def.name,
          isOptional: false,
          status: 'Terpenuhi Optimal' as const,
          score: 2 as const,
          evidence: "Satuan Pendidikan: SMA Al HASRA, Mata Pelajaran: Biologi, Fase E/Kelas X, Alokasi 4 x 45 Menit terstruktur rapi.",
          criticalComment: "Identitas perencanaan sangat lengkap dan memandu konteks pembelajaran jelas.",
          recommendation: "Pertahankan kelengkapan informasi identitas modul.",
        };
      case 2: // Identifikasi Peserta Didik (Optimal)
        return {
          id: 2,
          name: def.name,
          isOptional: true,
          status: 'Terpenuhi Optimal' as const,
          score: 2 as const,
          evidence: "Bagian A (Identifikasi Peserta Didik): Berdasarkan asesmen diagnostik kognitif, 78% paham konsep dasar trofik, 15% perlu penguatan dekomposer, 7% butuh bimbingan; serta gaya belajar dominan visual dan kinestetik.",
          criticalComment: "Identifikasi peserta didik memetakan kesiapan kognitif berbasis data dan profil gaya belajar secara mendalam untuk diferensiasi.",
          recommendation: "Gunakan data ini untuk pendampingan berjenjang (scaffolding) saat kegiatan inti.",
        };
      case 3:
        return {
          id: 3,
          name: def.name,
          isOptional: true,
          status: 'Terpenuhi Optimal' as const,
          score: 2 as const,
          evidence: "Bagian B: Terstruktur lengkap memuat pengetahuan faktual, konseptual, prosedural, dan metakognitif kelestarian lingkungan.",
          criticalComment: "Materi telah disusun berjenjang hingga pemaknaan kontekstual daya dukung ekosistem.",
          recommendation: "Pertahankan integrasi nilai keberlanjutan bumi dalam studi kasus biologi.",
        };
      case 4: // Dimensi Profil Lulusan
        return {
          id: 4,
          name: def.name,
          isOptional: false,
          status: 'Terpenuhi Optimal' as const,
          score: 2 as const,
          evidence: "Bagian C: Beriman & Berakhlak Mulia (akhlak alam), Bernalar Kritis (analisis data piramida trofik), dan Gotong Royong.",
          criticalComment: "Dimensi Profil Lulusan dijabarkan terintegrasi dengan capaian materi dan lembar penilaian.",
          recommendation: "Pertahankan keterukuran dimensi profil dalam rubrik evaluasi berkala.",
        };
      case 8: // Praktik Pedagogis
        return {
          id: 8,
          name: def.name,
          isOptional: false,
          status: 'Terpenuhi Optimal' as const,
          score: 2 as const,
          evidence: "Penerapan model Problem-Based Learning (PBL) terintegrasi investigasi biotik di taman sekolah SMA Al HASRA.",
          criticalComment: "Pendekatan pedagogis sangat kontekstual mendorong penyelidikan otentik murid di lingkungan sekitar.",
          recommendation: "Pertahankan eksplorasi lapangan interaktif ini.",
        };
      case 14: // Merefleksi
        return {
          id: 14,
          name: def.name,
          isOptional: false,
          status: 'Terpenuhi Optimal' as const,
          score: 2 as const,
          evidence: "Refleksi metakognitif 3 pertanyaan: esensi konsep yang dipahami, kontribusi dalam tim, dan aksi nyata pelestarian alam di rumah.",
          criticalComment: "Refleksi mendalam melatih metakognisi murid dan menumbuhkan komitmen aksi nyata.",
          recommendation: "Pertahankan instrumen refleksi dua arah yang bermakna ini.",
        };
      case 21: // Rubrik KKTP
        return {
          id: 21,
          name: def.name,
          isOptional: false,
          status: 'Terpenuhi Optimal' as const,
          score: 2 as const,
          evidence: "Dilengkapi rubrik analitik KKTP 4 tingkatan (Perlu Bimbingan, Cukup, Baik, Sangat Mahir) memuat deskriptor perilaku terukur.",
          criticalComment: "Rubrik penilaian objektif, transparan, dan memberikan panduan penskoran yang jelas bagi guru dan murid.",
          recommendation: "Sosialisasikan kriteria rubrik ini kepada murid sejak awal kegiatan.",
        };
      case 22: // LKPD
        return {
          id: 22,
          name: def.name,
          isOptional: true,
          status: 'Terpenuhi Optimal' as const,
          score: 2 as const,
          evidence: "Tersedia lampiran LKPD 'Detektif Ekosistem SMA Al HASRA' memandu tahapan Memahami, Mengaplikasi, dan Merefleksi.",
          criticalComment: "Lembar kerja peserta didik kontekstual dan sistematis memfasilitasi penemuan konsep secara aktif.",
          recommendation: "Pertahankan lembar aktivitas bermakna berbasis penyelidikan nyata ini.",
        };
      default:
        return {
          id: def.id,
          name: def.name,
          isOptional: def.isOptional,
          status: 'Terpenuhi Optimal' as const,
          score: 2 as const,
          evidence: "Komponen telah disempurnakan optimal selaras dengan prinsip Pembelajaran Mendalam.",
          criticalComment: "Indikator terpenuhi sangat baik dan mencerminkan kualitas perencanaan bermutu tinggi.",
          recommendation: "Pertahankan standar mutu perencanaan ini dalam implementasi kelas nyata.",
        };
    }
  });

  const sum4B = calculateSummary(ind4B);
  const rep4B: AnalysisReport = {
    id: 'report-rifa-revisi',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    fileName: 'RPP_Biologi_Ekosistem_Hasil_Revisi_Siklus1.docx',
    fileSize: '145 KB',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    identity: {
      teacherName: 'RIFA’ATUL MAHMUDAH, S.Pd.',
      teacherNip: '19920314 201903 2 021',
      subject: 'Biologi',
      gradePhase: 'Fase E / Kelas X SMA',
      school: 'SMA Al HASRA',
      title: 'Modul Ajar Biologi: Ekosistem & Lingkungan (Sesudah Revisi / Siklus 1)',
      topic: 'Interaksi Komponen Ekosistem & Solusi Ekologis',
      timeAllocation: '2 Pertemuan (4 x 45 Menit)',
      reviewDate: '5 Oktober 2026',
      uploadDate: '5 Oktober 2026',
      reviewerName: 'Dr. H. Muhammad Arifin, M.Pd.',
      reviewerNip: '19750812 200003 1 004',
    },
    indicators: ind4B,
    summary: sum4B,
    incompatibleComponents: [],
    extraNotes: [],
    feedback: generateFeedback(ind4B, sum4B),
    reviewDescription: generateReviewDescription(sum4B, ind4B),
    priorities: buildPriorities(ind4B),
  };

  return [rep1, rep2, rep3, rep4A, rep4B];
}
