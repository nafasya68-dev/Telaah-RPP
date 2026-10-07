import {
  CalculationSummary,
  FollowUpCategoryType,
  ImprovementPriority,
  IncompatibleComponent,
  IndicatorDefinition,
  IndicatorResult,
  PredicateType,
  ScoreType,
  StatusType,
} from '../types/telaah';

export const INSTRUMENT_DEFINITIONS: IndicatorDefinition[] = [
  {
    id: 1,
    name: 'IDENTITAS RPP',
    isOptional: false,
    category: 'Identitas & Perencanaan',
    description: 'Memeriksa kelengkapan komponen identitas perencanaan pembelajaran.',
    checklist: ['Satuan Pendidikan (Sekolah / Madrasah)', 'Mata Pelajaran', 'Fase/Kelas', 'Materi Pokok', 'Alokasi Waktu'],
    rubric2: 'Identitas RPP/Modul Ajar dicantumkan lengkap (Satuan Pendidikan/Sekolah/Madrasah, Mata Pelajaran, Fase/Kelas, Materi Pokok, Alokasi Waktu) dan jelas.',
    rubric1: 'Identitas RPP/Modul Ajar sudah ada tetapi belum lengkap (misal alokasi waktu atau fase belum spesifik).',
    rubric0: 'Identitas pokok RPP/Modul Ajar tidak dicantumkan atau tidak jelas.',
  },
  {
    id: 2,
    name: 'IDENTIFIKASI MURID',
    isOptional: true,
    category: 'Identitas & Perencanaan',
    description: 'Memeriksa identifikasi karakteristik dan profil awal peserta didik sebelum pembelajaran (Opsional).',
    checklist: ['Kesiapan belajar', 'Pengetahuan awal', 'Minat murid', 'Latar belakang', 'Kebutuhan belajar', 'Karakteristik murid'],
    rubric2: 'Terdapat pemetaan identifikasi murid yang komprehensif (kesiapan, minat, atau gaya belajar) yang dihubungkan dengan diferensiasi pembelajaran.',
    rubric1: 'Ada identifikasi murid secara umum namun belum terhubung langsung ke rancangan aktivitas pembelajaran.',
    rubric0: 'Komponen dicantumkan tetapi tidak memuat data relevan peserta didik.',
    rubricNA: 'Komponen bersifat opsional dan tidak dicantumkan dalam dokumen, sehingga tidak diperhitungkan dalam nilai akhir.',
  },
  {
    id: 3,
    name: 'MATERI PELAJARAN',
    isOptional: true,
    category: 'Identitas & Perencanaan',
    description: 'Memeriksa deskripsi dan struktur materi pembelajaran (Opsional).',
    checklist: ['Jenis pengetahuan (faktual/konseptual/prosedural/metakognitif)', 'Relevansi kehidupan nyata', 'Tingkat kesulitan', 'Struktur materi', 'Integrasi nilai dan karakter'],
    rubric2: 'Materi diuraikan terstruktur, relevan dengan kehidupan nyata murid, bertingkat logis, dan mengintegrasikan penguatan karakter.',
    rubric1: 'Materi hanya disebutkan secara garis besar tanpa penjabaran struktur konsep atau keterkaitannya dengan konteks nyata.',
    rubric0: 'Materi yang diuraikan keliru, tidak runtut, atau tidak sesuai dengan capaian yang dituju.',
    rubricNA: 'Komponen bersifat opsional dan tidak dicantumkan dalam dokumen, sehingga tidak diperhitungkan dalam nilai akhir.',
  },
  {
    id: 4,
    name: 'DIMENSI PROFIL LULUSAN',
    isOptional: false,
    category: 'Dimensi & Keselarasan',
    description: 'Memeriksa keberadaan Dimensi Profil Lulusan dan keselarasan dengan tujuan serta kegiatan.',
    checklist: ['Dimensi profil dinyatakan secara eksplisit', 'Selaras dengan sasaran tujuan pembelajaran', 'Tercermin nyata dalam alur kegiatan belajar'],
    rubric2: 'Dimensi Profil Lulusan dinyatakan spesifik, selaras dengan tujuan pembelajaran, dan terejawantahkan dalam kegiatan nyata murid.',
    rubric1: 'Dimensi Profil Lulusan dicantumkan tetapi sebatas label atau belum tampak jelas bagaimana dilatihkan dalam aktivitas.',
    rubric0: 'Dimensi Profil Lulusan tidak dicantumkan sama sekali.',
  },
  {
    id: 5,
    name: 'KESELARASAN TUJUAN, LANGKAH, DAN ASESMEN TERHADAP DIMENSI PROFIL LULUSAN',
    isOptional: false,
    category: 'Dimensi & Keselarasan',
    description: 'Memeriksa keselarasan segitiga pedagogis (tujuan, kegiatan, asesmen) terhadap dimensi profil lulusan yang disasar.',
    checklist: ['Tujuan menyasar dimensi profil', 'Langkah memfasilitasi pembentukan dimensi', 'Asesmen mengamati ketercapaian dimensi profil'],
    rubric2: 'Ketiga pilar (tujuan, langkah, asesmen) secara kohesif dan konsisten menopang dimensi profil lulusan yang ditargetkan.',
    rubric1: 'Ada ketidaksinkronan; misalnya tujuan memuat dimensi profil namun asesmen atau langkah pembelajarannya tidak memuat indikator ketercapaiannya.',
    rubric0: 'Tidak ada keterkaitan antara rancangan pembelajaran dengan dimensi profil kelulusan.',
  },
  {
    id: 6,
    name: 'KESELARASAN TUJUAN, LANGKAH, DAN ASESMEN',
    isOptional: false,
    category: 'Dimensi & Keselarasan',
    description: 'Memeriksa keterpaduan instruksional inti: apakah langkah pembelajaran dan asesmen benar-benar mengukur tujuan yang dirumuskan.',
    checklist: ['Benang merah tujuan, langkah, dan asesmen utuh', 'Aktivitas mengantarkan penguasaan tujuan', 'Asesmen mengukur langsung ketercapaian tujuan'],
    rubric2: 'Keselarasan konstruktif sangat kuat (Constructive Alignment optimal): aktivitas belajar menghantarkan pencapaian tujuan, dan instrumen asesmen mengukur tujuan tersebut secara presisi.',
    rubric1: 'Terdapat ketidakselarasan parsial; aktivitas tidak sepenuhnya melatih kompetensi tujuan atau asesmen menguji hal di luar tujuan.',
    rubric0: 'Tidak selaras; tujuan, langkah, dan asesmen berjalan terpisah tanpa benang merah.',
  },
  {
    id: 7,
    name: 'TUJUAN PEMBELAJARAN',
    isOptional: false,
    category: 'Dimensi & Keselarasan',
    description: 'Memeriksa perumusan Tujuan Pembelajaran (kompetensi, konten, ruang lingkup materi, KKO yang operasional).',
    checklist: ['Kompetensi yang dicapai', 'Konten materi yang dipelajari', 'Ruang lingkup materi jelas', 'Kata Kerja Operasional (KKO) dapat diamati/diukur'],
    rubric2: 'Tujuan pembelajaran memuat kompetensi yang jelas, konten esensial terfokus, KKO terukur, dan berorientasi pada pemahaman mendalam.',
    rubric1: 'Tujuan pembelajaran memuat kompetensi dan materi namun KKO belum sepenuhnya terukur atau terlalu berorientasi hafalan tingkat rendah.',
    rubric0: 'Tujuan pembelajaran tidak jelas, membingungkan, atau tidak memuat kompetensi/konten.',
  },
  {
    id: 8,
    name: 'PRAKTIK PEDAGOGIS',
    isOptional: false,
    category: 'Pedagogi & Lingkungan',
    description: 'Memeriksa model, strategi, metode, media, dan sumber pembelajaran yang dipilih.',
    checklist: ['Model pembelajaran (PBL, PJBL, Inkuiri, Discovery, dll.)', 'Strategi & metode variatif', 'Media pembelajaran relevan', 'Sumber belajar beragam'],
    rubric2: 'Model, metode, dan media pembelajaran dirancang interaktif, berbasis eksplorasi/masalah, berpusat pada murid, dan memicu rasa ingin tahu.',
    rubric1: 'Model/metode disebutkan namun sintaks/langkah pembelajarannya masih bersifat konvensional atau teacher-centered.',
    rubric0: 'Praktik pedagogis tidak dijabarkan atau tidak relevan dengan karakteristik materi.',
  },
  {
    id: 9,
    name: 'LINGKUNGAN PEMBELAJARAN',
    isOptional: false,
    category: 'Pedagogi & Lingkungan',
    description: 'Memeriksa pengelolaan budaya belajar, ruang fisik, ruang virtual, dan ketergambarannya dalam kegiatan/asesmen.',
    checklist: ['Budaya belajar aman dan positif', 'Pengaturan ruang fisik (kolaborasi/diskusi)', 'Pemanfaatan ruang virtual jika ada', 'Ketergambaran interaksi dalam aktivitas'],
    rubric2: 'Lingkungan belajar dirancang kondusif, aman psikologis, mendorong interaksi aktif antar murid, dan mendukung fleksibilitas ruang belajar.',
    rubric1: 'Lingkungan belajar hanya disinggung secara umum tanpa gambaran nyata tata kelola interaksi dan kenyamanan murid.',
    rubric0: 'Tidak ada perhatian terhadap pengelolaan iklim dan lingkungan pembelajaran.',
  },
  {
    id: 10,
    name: 'KEMITRAAN PEMBELAJARAN',
    isOptional: true,
    category: 'Pedagogi & Lingkungan',
    description: 'Memeriksa pelibatan kolaborasi/kemitraan di dalam atau luar sekolah (Opsional).',
    checklist: ['Kolaborasi dengan sesama guru/ahli/komunitas', 'Pelibatan orang tua/lingkungan sekitar', 'Kemitraan dunia usaha/industri/narasumber luar'],
    rubric2: 'Terdapat kemitraan nyata yang memperkaya pengalaman belajar (narasumber luar, komunitas, institusi, atau kemitraan orang tua yang terstruktur).',
    rubric1: 'Kemitraan dicantumkan namun perannya masih pasif atau sekadar formalitas.',
    rubric0: 'Komponen dicantumkan tetapi tidak terdapat rincian bentuk kerja sama.',
    rubricNA: 'Komponen bersifat opsional dan tidak dicantumkan dalam dokumen, sehingga tidak diperhitungkan dalam nilai akhir.',
  },
  {
    id: 11,
    name: 'PEMANFAATAN DIGITAL',
    isOptional: true,
    category: 'Pedagogi & Lingkungan',
    description: 'Memeriksa penggunaan teknologi digital untuk pembelajaran interaktif, kolaboratif, dan kontekstual (Opsional).',
    checklist: ['Teknologi digital interaktif & kolaboratif', 'Bukan sekadar presentasi satu arah', 'Tergambar dalam langkah pembelajaran dan/atau asesmen', 'Meningkatkan keterlibatan aktif murid'],
    rubric2: 'Teknologi digital digunakan secara interaktif, kolaboratif, memfasilitasi eksplorasi murid, dan terintegrasi organik dalam kegiatan atau asesmen.',
    rubric1: 'Penggunaan digital ada tetapi masih pasif (misal sekadar menayangkan proyektor/slide statis tanpa interaksi murid).',
    rubric0: 'Hanya menulis klaim teknologi tanpa ada rincian penggunaan dalam alur belajar.',
    rubricNA: 'Komponen bersifat opsional dan tidak dicantumkan dalam dokumen, sehingga tidak diperhitungkan dalam nilai akhir.',
  },
  {
    id: 12,
    name: 'MEMAHAMI',
    isOptional: false,
    category: 'Pengalaman Belajar',
    description: 'Memeriksa pengalaman menghubungkan pengetahuan baru dengan konsep sebelumnya, stimulasi berpikir, konteks nyata, eksplorasi, kolaborasi, dan nilai karakter.',
    checklist: ['Apersepsi menghubungkan konsep lama & baru', 'Stimulasi berpikir kritis/pertanyaan pemantik', 'Konteks kehidupan nyata murid', 'Eksplorasi konsep dan kolaborasi makna'],
    rubric2: 'Aktivitas belajar membimbing murid membangun pemahaman konseptual secara aktif, mengaitkan dengan konteks nyata dan pengalaman awal secara mendalam.',
    rubric1: 'Tahap memahami masih sebatas transmisi informasi searah dari guru atau sebatas mengingat/menghafal fakta.',
    rubric0: 'Tidak ada aktivitas terencana yang memfasilitasi proses pembentukan pemahaman murid.',
  },
  {
    id: 13,
    name: 'MENGAPLIKASI',
    isOptional: false,
    category: 'Pengalaman Belajar',
    description: 'Memeriksa penerapan pengetahuan pada situasi otentik/konteks nyata, berpikir kritis, eksplorasi lebih lanjut, dan pemecahan masalah inovatif.',
    checklist: ['Penerapan konsep pada situasi nyata/otentik', 'Pemecahan masalah kontekstual', 'Latihan berpikir analitis & kritis', 'Karya/solusi kreatif inovatif'],
    rubric2: 'Murid ditantang menerapkan konsep dalam situasi nyata/masalah otentik, menghasilkan analisis kritis, atau karya solusi kreatif.',
    rubric1: 'Latihan aplikasi masih bersifat mekanistis (soal tertulis hafalan atau rumus rutin tanpa konteks kehidupan nyata).',
    rubric0: 'Tidak ada kesempatan bagi murid untuk mengaplikasikan pengetahuan yang diperoleh.',
  },
  {
    id: 14,
    name: 'MEREFLEKSI',
    isOptional: false,
    category: 'Pengalaman Belajar',
    description: 'Memeriksa proses refleksi pencapaian tujuan, metakognisi, evaluasi diri, regulasi emosi, dan perumusan tindak lanjut belajar.',
    checklist: ['Refleksi terhadap proses dan capaian tujuan', 'Pertanyaan metakognitif (bagaimana saya belajar)', 'Evaluasi diri / umpan balik rekan', 'Rencana perbaikan/tindak lanjut belajar'],
    rubric2: 'Sesi refleksi dirancang bermakna dengan pertanyaan metakognitif terstruktur yang melatih murid meregulasi cara belajar dan emosinya.',
    rubric1: 'Refleksi dilakukan sekadarnya (hanya menanyakan perasaan senang/tidak tanpa mengulas strategi berpikir dan metakognisi).',
    rubric0: 'Tidak terdapat alur kegiatan refleksi di akhir pembelajaran.',
  },
  {
    id: 15,
    name: 'SALING MEMULIAKAN',
    isOptional: false,
    category: 'Prinsip & Karakteristik',
    description: 'Memeriksa budaya saling menghormati (Guru-Murid, Murid-Guru, Murid-Murid), penghargaan keragaman, inklusivitas, adaptivitas, dan responsivitas.',
    checklist: ['Relasi positif Guru-Murid saling menghargai', 'Interaksi kolaboratif Murid-Murid inklusif', 'Apresiasi terhadap perbedaan pendapat/latar belakang', 'Budaya tutur santun dan saling mendukung'],
    rubric2: 'Rancangan interaksi secara eksplisit mengedepankan etika saling memuliakan, inklusivitas, penghargaan atas keberagaman suara murid, dan empati.',
    rubric1: 'Nuansa saling menghormati tersirat namun belum dirancang terencana dalam protokol diskusi atau interaksi kelas.',
    rubric0: 'Tidak mencerminkan prinsip saling menghargai atau iklim belajar yang inklusif.',
  },
  {
    id: 16,
    name: 'PRINSIP PEMBELAJARAN MENDALAM',
    isOptional: false,
    category: 'Prinsip & Karakteristik',
    description: 'Memeriksa integrasi 3 pilar Pembelajaran Mendalam: Berkesadaran (Mindful), Bermakna (Meaningful), dan Menggembirakan (Joyful).',
    checklist: ['Berkesadaran (fokus, atensi penuh, kehadiran utuh)', 'Bermakna (relevan bagi kehidupan dan masa depan)', 'Menggembirakan (antusiasme, tantangan positif, kepuasan belajar)'],
    rubric2: 'Ketiga prinsip (Berkesadaran, Bermakna, Menggembirakan) terintegrasi harmonis dalam desain pengalaman belajar murid.',
    rubric1: 'Hanya satu atau dua prinsip yang tampak, atau pembelajaran belum sepenuhnya memberikan kesan bermakna dan menggembirakan.',
    rubric0: 'Pembelajaran bersifat mekanis, monoton, dan tidak mencerminkan prinsip Pembelajaran Mendalam.',
  },
  {
    id: 17,
    name: 'KARAKTERISTIK PESERTA DIDIK',
    isOptional: false,
    category: 'Prinsip & Karakteristik',
    description: 'Memeriksa bagaimana perencanaan mengakomodasi keragaman karakteristik, gaya belajar, minat, dan kecepatan belajar murid.',
    checklist: ['Diferensiasi konten/proses/produk jika dibutuhkan', 'Fleksibilitas tempo dan scaffolding', 'Akomodasi keragaman gaya belajar murid'],
    rubric2: 'Perencanaan pembelajaran secara luwes memfasilitasi scaffolding dan diferensiasi sesuai keragaman potensi murid.',
    rubric1: 'Perencanaan mengakui perbedaan murid tetapi implementasi aktivitas masih cenderung seragam (one size fits all).',
    rubric0: 'Aktivitas belajar kaku dan mengabaikan perbedaan karakteristik peserta didik.',
  },
  {
    id: 18,
    name: 'ASESMEN AWAL',
    isOptional: false,
    category: 'Asesmen & Evaluasi',
    description: 'Memeriksa asesmen diagnostik/awal untuk memetakan kesiapan, pengetahuan prasyarat, dan tindak lanjutnya dalam perencanaan.',
    checklist: ['Instrumen asesmen awal jelas', 'Mengukur kesiapan pengetahuan/emosional murid', 'Terdapat rencana tindak lanjut adaptif berdasarkan hasil asesmen awal'],
    rubric2: 'Asesmen awal dirancang terstruktur dilengkapi kriteria dan skenario tindak lanjut penyesuaian kegiatan untuk kelompok murid yang berbeda.',
    rubric1: 'Asesmen awal dicantumkan tetapi tidak disertai skenario tindak lanjut konkret untuk menyesuaikan pembelajaran.',
    rubric0: 'Tidak ada asesmen awal atau asesmen diagnostik.',
  },
  {
    id: 19,
    name: 'ASESMEN SELAMA PROSES',
    isOptional: false,
    category: 'Asesmen & Evaluasi',
    description: 'Memeriksa asesmen formatif selama pembelajaran: pemantauan berkala, umpan balik kontinyu (guru-murid, murid-guru), dan ragam teknik.',
    checklist: ['Pemantauan ketercapaian saat kegiatan berlangsung', 'Mekanisme umpan balik konstruktif langsung', 'Teknik asesmen bervariasi (observasi, tanya jawab, peer feedback)'],
    rubric2: 'Asesmen formatif terencana intensif dengan strategi umpan balik yang memberdayakan murid untuk terus memperbaiki kinerjanya.',
    rubric1: 'Asesmen proses ada tetapi hanya berupa checklist kehadiran/tugas tanpa mekanisme pemberian umpan balik konstruktif.',
    rubric0: 'Tidak ada asesmen formatif selama proses pembelajaran.',
  },
  {
    id: 20,
    name: 'ASESMEN HASIL PEMBELAJARAN',
    isOptional: false,
    category: 'Asesmen & Evaluasi',
    description: 'Memeriksa pengukuran ketercapaian kompetensi di akhir proses (tes, portofolio, unjuk kerja, produk, proyek, atau presentasi).',
    checklist: ['Alat ukur capaian akhir selaras dengan tujuan', 'Variasi bentuk asesmen (otentik, proyek, unjuk kerja, portofolio, tes)', 'Memfasilitasi pembuktian kompetensi nyata'],
    rubric2: 'Asesmen sumatif/akhir bersifat otentik, bervariasi, menguji penalaran tingkat tinggi, dan secara tepat mengukur penguasaan tujuan pembelajaran.',
    rubric1: 'Asesmen akhir ada namun hanya bertumpu pada tes tertulis pilihan ganda atau belum mengukur kompetensi esensial.',
    rubric0: 'Tidak terdapat asesmen ketercapaian hasil pembelajaran.',
  },
  {
    id: 21,
    name: 'RUBRIK PENILAIAN',
    isOptional: false,
    category: 'Asesmen & Evaluasi',
    description: 'Memeriksa ketersediaan rubrik/kriteria ketercapaian tujuan pembelajaran (KKTP) yang jelas dan terukur untuk setiap tujuan yang dinilai.',
    checklist: ['Kriteria ketercapaian tujuan pembelajaran (KKTP)', 'Deskriptor tingkatan capaian jelas dan terukur', 'Panduan penskoran transparan'],
    rubric2: 'Dilengkapi rubrik penilaian analitik/holistik yang jelas, memiliki indikator dan deskriptor capaian bertingkat untuk memandu evaluasi yang objektif.',
    rubric1: 'Rubrik dicantumkan namun deskriptornya masih kabur atau hanya berupa skala angka tanpa kriteria kualitatif yang jelas.',
    rubric0: 'Tidak ada rubrik atau kriteria penilaian sama sekali.',
  },
  {
    id: 22,
    name: 'LEMBAR KERJA MURID',
    isOptional: true,
    category: 'Asesmen & Evaluasi',
    description: 'Memeriksa ketersediaan dan kualitas LKPD/lembar kerja/worksheet (Opsional).',
    checklist: ['Ketersediaan LKPD/worksheet/lembar aktivitas', 'Keselarasan dengan tujuan dan alur kegiatan', 'Memfasilitasi pengalaman Memahami, Mengaplikasi, dan Merefleksi'],
    rubric2: 'Lembar kerja murid tersedia lengkap, instruktif, kontekstual, memicu nalar kritis, dan selaras dengan fase Memahami, Mengaplikasi, dan Merefleksi.',
    rubric1: 'Lembar kerja murid ada namun hanya berisi latihan soal repetitif atau tidak selaras dengan pengalaman belajar mendalam.',
    rubric0: 'Lembar kerja murid dilampirkan namun sama sekali tidak relevan dengan tujuan dan materi pembelajaran.',
    rubricNA: 'RPP/Modul Ajar tidak menyertakan LKPD/Lembar Kerja Murid (bersifat opsional), sehingga tidak diperhitungkan dalam nilai akhir.',
  },
];

export const OPTIONAL_INDICATOR_IDS = [2, 3, 10, 11, 22];

export function determinePredicate(score: number): PredicateType {
  if (score >= 86) return 'SANGAT BAIK';
  if (score >= 76) return 'BAIK';
  if (score >= 66) return 'CUKUP';
  return 'PERLU PERBAIKAN';
}

export function determineFollowUp(predicate: PredicateType, hasScoreZero: boolean = false): FollowUpCategoryType {
  if (hasScoreZero && predicate === 'SANGAT BAIK') return 'Penyempurnaan Minor';
  switch (predicate) {
    case 'SANGAT BAIK':
      return 'Penyempurnaan Minor';
    case 'BAIK':
      return 'Revisi Terbatas';
    case 'CUKUP':
      return 'Revisi Terarah';
    case 'PERLU PERBAIKAN':
    default:
      return 'Revisi Mendasar';
  }
}

export function calculateSummary(indicators: IndicatorResult[]): CalculationSummary {
  let evaluatedCount = 0;
  let naCount = 0;
  let totalScore = 0;
  let score2 = 0;
  let score1 = 0;
  let score0 = 0;

  indicators.forEach((ind) => {
    if (ind.score === 'N/A') {
      naCount++;
    } else {
      evaluatedCount++;
      const numScore = Number(ind.score);
      totalScore += numScore;
      if (numScore === 2) score2++;
      else if (numScore === 1) score1++;
      else if (numScore === 0) score0++;
    }
  });

  const maxPossibleScore = evaluatedCount * 2;
  const rawFinal = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  const finalScore = Math.round(rawFinal * 100) / 100;
  const predicate = determinePredicate(finalScore);
  const followUpCategory = determineFollowUp(predicate, score0 > 0);

  return {
    totalIndicators: indicators.length,
    evaluatedCount,
    naCount,
    totalScore,
    maxPossibleScore,
    finalScore,
    predicate,
    followUpCategory,
    scoreCounts: {
      score2,
      score1,
      score0,
      na: naCount,
    },
  };
}

export function buildPriorities(indicators: IndicatorResult[]): ImprovementPriority[] {
  const priorities: ImprovementPriority[] = [];

  // Sort score 0 first (Sangat Tinggi / Tinggi), then score 1 (Tinggi / Sedang)
  indicators.forEach((ind) => {
    if (ind.score === 0) {
      priorities.push({
        level: 'Sangat Tinggi',
        indicatorName: ind.name,
        score: 0,
        issue: ind.criticalComment || 'Indikator belum terpenuhi dalam perencanaan pembelajaran.',
        recommendation: ind.recommendation || 'Lengkapi komponen ini agar perencanaan pembelajaran memenuhi standar Pembelajaran Mendalam.',
      });
    }
  });

  indicators.forEach((ind) => {
    if (ind.score === 1) {
      priorities.push({
        level: ind.isOptional ? 'Sedang' : 'Tinggi',
        indicatorName: ind.name,
        score: 1,
        issue: ind.criticalComment || 'Indikator sudah ada namun belum optimal atau belum sepenuhnya selaras.',
        recommendation: ind.recommendation || 'Optimalkan kelengkapan dan keselarasan komponen dengan tujuan pembelajaran.',
      });
    }
  });

  return priorities;
}

export function buildIncompatibilities(indicators: IndicatorResult[]): IncompatibleComponent[] {
  const list: IncompatibleComponent[] = [];

  indicators.forEach((ind) => {
    if (ind.score === 0) {
      list.push({
        indicatorName: ind.name,
        finding: ind.evidence || 'Komponen tidak ditemukan dalam naskah RPP/Modul Ajar.',
        reason: ind.criticalComment || 'Indikator wajib belum terpenuhi atau belum dirumuskan.',
        recommendation: ind.recommendation || 'Tambahkan komponen sesuai panduan instrumen.',
      });
    } else if (ind.score === 1 && !ind.isOptional) {
      list.push({
        indicatorName: ind.name,
        finding: ind.evidence || 'Komponen sudah tercantum sebagian.',
        reason: ind.criticalComment || 'Kualitas pelaksanaan atau deskripsi belum selaras secara optimal.',
        recommendation: ind.recommendation || 'Sempurnakan keterhubungan komponen ini dengan tujuan dan asesmen.',
      });
    }
  });

  return list;
}

export function generateReviewDescription(summary: CalculationSummary, indicators: IndicatorResult[]): string {
  const topStrengths = indicators.filter((i) => i.score === 2).map((i) => i.name).slice(0, 3);
  const urgentFixes = indicators.filter((i) => i.score === 0).map((i) => i.name);
  const partialFixes = indicators.filter((i) => i.score === 1).map((i) => i.name);

  let desc = `Perencanaan pembelajaran yang ditelaah memperoleh Nilai Akhir ${summary.finalScore.toFixed(2)} dengan predikat ${summary.predicate} dan rekomendasi tindak lanjut "${summary.followUpCategory}". `;

  if (topStrengths.length > 0) {
    desc += `Kekuatan utama dokumen ini tampak pada pemenuhan optimal indikator ${topStrengths.join(', ')}, di mana perencanaan menunjukkan keselarasan dan kejelasan substansi yang baik. `;
  }

  if (urgentFixes.length > 0) {
    desc += `Namun demikian, terdapat aspek krusial yang belum terpenuhi dan menjadi prioritas perbaikan utama, khususnya pada: ${urgentFixes.join(', ')}. `;
  } else if (partialFixes.length > 0) {
    desc += `Meskipun tidak ditemukan indikator yang sama sekali belum terpenuhi, beberapa aspek masih membutuhkan penyempurnaan agar lebih optimal, antara lain pada: ${partialFixes.slice(0, 3).join(', ')}. `;
  }

  desc += `Secara keseluruhan, kualitas pengalaman Pembelajaran Mendalam (Memahami, Mengaplikasi, Merefleksi) dan keselarasan asesmen perlu terus diperkuat agar mampu menghadirkan suasana belajar yang berkesadaran, bermakna, dan menggembirakan bagi seluruh peserta didik.`;

  return desc;
}

export function generateFeedback(indicators: IndicatorResult[], summary: CalculationSummary) {
  const score2Items = indicators.filter((i) => i.score === 2);
  const score1Items = indicators.filter((i) => i.score === 1);
  const score0Items = indicators.filter((i) => i.score === 0);

  const strengths = score2Items.length > 0
    ? score2Items.slice(0, 4).map((i) => `Pemenuhan optimal pada "${i.name}": ${i.criticalComment || 'Telah dirancang dengan jelas, terstruktur, dan selaras dengan prinsip pembelajaran.'}`)
    : ['Perencanaan sudah memiliki kerangka dasar dan struktur umum dokumen kurikulum.'];

  const improvements: string[] = [];
  score0Items.forEach((i) => {
    improvements.push(`[Wajib Diperbaiki] "${i.name}": Belum tergambar dalam dokumen. ${i.criticalComment || 'Perlu ditambahkan secara eksplisit.'}`);
  });
  score1Items.slice(0, 4).forEach((i) => {
    improvements.push(`[Perlu Dioptimalkan] "${i.name}": ${i.criticalComment || 'Perlu diperjelas keselarasan dan implementasinya.'}`);
  });
  if (improvements.length === 0) {
    improvements.push('Pertahankan kualitas rancangan dan lakukan pengayaan variasi strategi pembelajaran berkala.');
  }

  const practicalRecommendations: string[] = [];
  const needsFix = [...score0Items, ...score1Items];
  if (needsFix.length > 0) {
    needsFix.slice(0, 4).forEach((i) => {
      practicalRecommendations.push(`Pada ${i.name}: ${i.recommendation}`);
    });
  } else {
    practicalRecommendations.push('Lanjutkan implementasi perencanaan di kelas dan lakukan refleksi berkala bersama komunitas belajar guru.');
    practicalRecommendations.push('Bagikan praktik baik modul ajar ini kepada rekan sejawat sebagai inspirasi Pembelajaran Mendalam.');
  }

  const followUpSteps = [
    `Kategori Tindak Lanjut: ${summary.followUpCategory}.`,
    score0Items.length > 0
      ? `Fokuskan revisi pertama pada ${score0Items.length} indikator dengan skor 0 sebagai prioritas utama perbaikan.`
      : 'Lakukan penyesuaian minor pada indikator yang masih bernilai sebagian (skor 1).',
    'Konsultasikan hasil perbaikan modul ajar dengan Kepala Sekolah atau Pengawas Sekolah.',
    'Ujicobakan rancangan aktivitas Memahami, Mengaplikasi, dan Merefleksi dalam pembelajaran di kelas nyata.',
  ];

  return {
    strengths,
    improvements,
    practicalRecommendations,
    followUpSteps,
  };
}
