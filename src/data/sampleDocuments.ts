export interface SampleDocumentItem {
  id: string;
  title: string;
  subject: string;
  gradePhase: string;
  school: string;
  teacher: string;
  expectedScoreCategory: 'SANGAT BAIK' | 'BAIK' | 'PERLU PERBAIKAN';
  description: string;
  content: string;
}

export const SAMPLE_DOCUMENTS: SampleDocumentItem[] = [
  {
    id: 'sample-ipas-sd',
    title: 'Modul Ajar IPAS: Harmoni Ekosistem dan Aliran Energi Berkelanjutan',
    subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    gradePhase: 'Kelas 5 / Fase C',
    school: 'SD Negeri Nusantara Ceria',
    teacher: 'Ratna Dewi, S.Pd.',
    expectedScoreCategory: 'SANGAT BAIK',
    description: 'Modul ajar komprehensif berprinsip Pembelajaran Mendalam (Mindful, Meaningful, Joyful) dengan tahapan Memahami-Mengaplikasi-Merefleksi, asesmen diagnostik, rubrik KKTP, dan LKPD kontekstual.',
    content: `MODUL AJAR PEMBELAJARAN MENDALAM
MATA PELAJARAN: ILMU PENGETAHUAN ALAM DAN SOSIAL (IPAS)
FASE / KELAS: FASE C / KELAS 5
SATUAN PENDIDIKAN: SD NEGERI NUSANTARA CERIA
PENYUSUN: RATNA DEWI, S.Pd.
ALOKASI WAKTU: 3 Pertemuan (6 x 35 Menit)
MATERI POKOK: Harmoni dalam Ekosistem: Aliran Energi dan Jaring-Jaring Makanan di Lingkungan Sekitar

A. IDENTIFIKASI MURID & PROFIL AWAL
1. Kesiapan Belajar: Berdasarkan pemetaan awal, 65% murid telah memahami konsep rantai makanan sederhana; 25% masih rancu membedakan produsen dan dekomposer; 10% memerlukan bimbingan konkret.
2. Karakteristik & Minat: Mayoritas murid tertarik pada pengamatan alam nyata dan interaksi visual, serta memiliki gaya belajar kinestetik dan visual.

B. MATERI PELAJARAN
1. Pengetahuan Faktual: Komponen biotik dan abiotik di kebun sekolah.
2. Pengetahuan Konseptual: Peran produsen, konsumen tingkat I-III, dekomposer, dan rantai makanan saling kait membentuk jaring makanan.
3. Pengetahuan Prosedural: Langkah memetakan aliran energi dan menganalisis dampak kepunahan satu organisme.
4. Integrasi Nilai: Kepedulian lingkungan, kesadaran menjaga keseimbangan ekologis ciptaan Tuhan.

C. DIMENSI PROFIL LULUSAN
1. Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia (akhlak terhadap alam).
2. Bernalar Kritis (menganalisis sebab-akibat terputusnya rantai makanan).
3. Gotong Royong (bekerja sama dalam investigasi biotik kebun sekolah).

D. TUJUAN PEMBELAJARAN
1. Murid mampu menganalisis hubungan saling ketergantungan antar komponen ekosistem melalui investigasi jaring-jaring makanan di lingkungan sekitar secara kritis dan tepat.
2. Murid mampu memprediksi dan merumuskan solusi alternatif atas dampak kepunahan salah satu populasi terhadap keseimbangan ekosistem dengan penuh tanggung jawab.

E. PRAKTIK PEDAGOGIS & LINGKUNGAN PEMBELAJARAN
- Pendekatan: Pembelajaran Mendalam (Deep Learning)
- Model Pembelajaran: Problem-Based Learning (PBL) terintegrasi Inquiry Lapangan.
- Lingkungan Pembelajaran: Ruang fisik kebun sekolah untuk investigasi langsung, penataan meja melingkar (U-shape) untuk dialog santun, dan papan pajang karya kelas.
- Budaya Belajar: Saling memuliakan, memberi kesempatan tiap anak berbicara tanpa interupsi, dan apresiasi positif.

F. KEMITRAAN & PEMANFAATAN DIGITAL
- Kemitraan: Kolaborasi dengan petugas kebun sekolah dan Komunitas Bank Sampah/Pecinta Lingkungan Desa untuk edukasi pengomposan.
- Pemanfaatan Digital: Penggunaan tablet kelas untuk simulasi interaktif "Ecosystem Energy Flow Simulator" dan platform kolaboratif Padlet dinding refleksi.

G. PENGALAMAN PEMBELAJARAN MENDALAM
1. MEMAHAMI (Mindful & Meaningful):
   - Apersepsi berkesadaran: Murid diajak hening sejenak merasakan udara segar dan mengamati pohon di luar jendela (Mindful breathing).
   - Pertanyaan pemantik: "Apa yang terjadi jika seluruh cacing dan jamur di bumi lenyap seketika?"
   - Eksplorasi lapangan: Mengamati organisme di kebun sekolah, mencatat temuan dalam tabel ketergantungan.
2. MENGAPLIKASI (Kontekstual & Kritis):
   - Studi kasus nyata: Problem "Serangan Hama Tikus akibat Penurunan Populasi Ular/Burung Hantu di Sawah Desa Sebelah".
   - Murid bekerja dalam kelompok heterogen merancang bagan rekayasa solusi ekologis dan mempresentasikannya secara kreatif (poster/infografis).
3. MEREFLEKSI (Metakognisi & Tindak Lanjut):
   - Refleksi diri dengan 3 pertanyaan metakognitif:
     a. Konsep apa yang paling menantang bagi saya hari ini?
     b. Bagaimana strategi saya memahami aliran energi bersama teman sekelompok?
     c. Apa satu aksi nyata yang akan saya lakukan di rumah untuk menjaga keseimbangan alam sekitar?

H. PRINSIP PEMBELAJARAN MENDALAM
- Berkesadaran: Mengajak murid menyadari perannya sebagai bagian dari ekosistem global.
- Bermakna: Menghubungkan sains dengan krisis pangan lokal dan kelestarian habitat sekitar sekolah.
- Menggembirakan: Permainan peran "Web of Life" (simulasi jaring kehidupan menggunakan gulungan benang merah).

I. ASESMEN PEMBELAJARAN
1. Asesmen Awal (Diagnostik): Kuis visual 4 pertanyaan identifikasi peran hewan/tumbuhan. Tindak lanjut: Murid yang butuh bantuan dipasangkan dengan teman sebaya (peer scaffolding) dan diberikan kartu bergambar tambahan.
2. Asesmen Formatif (Proses): Lembar observasi partisipasi aktif kelompok, catatan anekdot guru, dan umpan balik formatif dua arah (Guru-Murid dan antar rekan).
3. Asesmen Sumatif (Hasil): Penilaian produk analisis jaring-jaring makanan dan unjuk kerja solusi ekologis.
4. Rubrik KKTP: Kriteria terperinci 4 jenjang (Perlu Bimbingan, Cukup, Baik, Sangat Mahir) memuat indikator ketepatan analisis rantai makanan dan kelogisan solusi.

J. LAMPIRAN
1. Lembar Kerja Peserta Didik (LKPD) "Detektif Ekosistem Kebun Sekolah".
2. Lembar Refleksi Metakognitif Murid.`
  },
  {
    id: 'sample-math-smp',
    title: 'Modul Ajar Matematika: Eksplorasi Teorema Pythagoras dalam Arsitektur',
    subject: 'Matematika',
    gradePhase: 'Fase D / Kelas 8 SMP',
    school: 'SMP Negeri 3 Bintang Harapan',
    teacher: 'Bambang Kusuma, M.Pd.',
    expectedScoreCategory: 'BAIK',
    description: 'Modul ajar matematika dengan pendekatan pemecahan masalah kontekstual. Memiliki asesmen awal dan model pembelajaran baik, namun refleksi metakognitif dan kemitraan masih minimal.',
    content: `MODUL AJAR MATEMATIKA KURIKULUM MERDEKA
MATA PELAJARAN: MATEMATIKA
SATUAN PENDIDIKAN: SMP NEGERI 3 BINTANG HARAPAN
KELAS / SEMESTER: VIII / GANJIL
ALOKASI WAKTU: 2 Pertemuan (4 x 40 Menit)
MATERI: Menemukan dan Mengaplikasikan Teorema Pythagoras dalam Pemecahan Masalah

A. IDENTITAS UMUM
Penyusun: Bambang Kusuma, M.Pd.
Instansi: SMP Negeri 3 Bintang Harapan
Fase: D (Kelas 8)
Mata Pelajaran: Matematika
Materi Pokok: Teorema Pythagoras
Alokasi Waktu: 4 Jam Pelajaran (2 x pertemuan)

B. TUJUAN PEMBELAJARAN
1. Peserta didik dapat membuktikan kebenaran Teorema Pythagoras menggunakan model visual luas persegi pada segitiga siku-siku.
2. Peserta didik dapat menghitung panjang sisi miring atau sisi tegak segitiga siku-siku dalam masalah kontekstual pengukuran tangga dan atap rumah.

C. DIMENSI PROFIL LULUSAN
- Bernalar Kritis: Mengidentifikasi hipotenusa dan hubungan kuadrat sisi.
- Mandiri: Mengerjakan latihan soal kontekstual secara bertanggung jawab.

D. PRAKTIK PEDAGOGIS & MEDIA
- Model: Discovery Learning
- Metode: Diskusi kelompok, demonstrasi, penugasan.
- Media: Kertas origami berpetak, gunting, jangka, penggaris, geogebra applet di proyektor.

E. LANGKAH PEMBELAJARAN
Pertemuan 1:
1. Pendahuluan (15 Menit):
   - Salam pembuka dan presensi.
   - Apersepsi: Menampilkan gambar tukang bangunan memasang keramik siku atau tiang penyangga jembatan.
   - Guru menyampaikan tujuan pembelajaran.
2. Kegiatan Inti (55 Menit):
   - Stimulasi: Siswa diberi segitiga siku-siku dengan panjang sisi 3 cm, 4 cm, dan 5 cm.
   - Identifikasi Masalah: Bagaimana hubungan luas persegi di setiap sisi segitiga?
   - Pengumpulan Data: Siswa memotong kertas origami untuk menyusun persegi pada sisi a, b, dan c.
   - Pembuktian: Siswa menemukan bahwa a^2 + b^2 = c^2.
   - Generalisasi: Guru mengonfirmasi pembuktian teorema.
3. Penutup (10 Menit):
   - Guru dan siswa menyimpulkan teorema pythagoras.
   - Siswa ditanya apakah pelajaran menyenangkan.
   - Guru memberikan PR 5 nomor latihan di buku paket.

F. ASESMEN
- Asesmen Awal: Tanya jawab lisan materi prasyarat kuadrat dan akar kuadrat bilangan. (Catatan: Belum ada instrumen tertulis atau diferensiasi tindak lanjut).
- Asesmen Formatif: Pengamatan keaktifan saat berdiskusi dan lembar kerja puzzle pythagoras.
- Asesmen Sumatif: Tes tertulis 5 butir soal uraian di akhir bab.
- Rubrik Penilaian: Skor 0 - 100 berdasarkan rumus matematika.`
  },
  {
    id: 'sample-bahasa-sma',
    title: 'RPP Bahasa Indonesia: Mengonstruksi Teks Laporan Hasil Observasi',
    subject: 'Bahasa Indonesia',
    gradePhase: 'Kelas X SMA',
    school: 'SMA Bina Cendekia',
    teacher: 'Drs. Hendro Wibowo',
    expectedScoreCategory: 'PERLU PERBAIKAN',
    description: 'Format RPP konvensional. Belum mencerminkan pembelajaran mendalam, minim interaksi reflektif, tidak ada asesmen awal berkesadaran, serta asesmen hanya tes tulis akhir.',
    content: `RENCANA PELAKSANAAN PEMBELAJARAN (RPP)
Sekolah: SMA Bina Cendekia
Mata Pelajaran: Bahasa Indonesia
Kelas / Semester: X / 1
Materi Pokok: Teks Laporan Hasil Observasi (LHO)
Alokasi Waktu: 2 x 45 Menit (1 Pertemuan)

I. TUJUAN PEMBELAJARAN
Siswa dapat:
1. Menjelaskan pengertian dan struktur teks laporan hasil observasi.
2. Mengidentifikasi ciri kebahasaan teks laporan hasil observasi.

II. METODE PEMBELAJARAN
- Ceramah bervariasi
- Tanya jawab
- Penugasan mandiri

III. MEDIA & SUMBER BELAJAR
- Papan tulis, spidol, buku paket Bahasa Indonesia Kelas X Kemdikbud.

IV. KEGIATAN PEMBELAJARAN
A. Pendahuluan (10 Menit)
1. Guru memberi salam dan memimpin doa.
2. Guru memeriksa presensi siswa.
3. Guru menyampaikan judul materi teks LHO.

B. Kegiatan Inti (70 Menit)
1. Guru menjelaskan definisi teks laporan hasil observasi di papan tulis.
2. Guru membacakan contoh teks LHO berjudul "Mengenal Tanaman Lidah Buaya".
3. Siswa menyimak penjelasan guru dan mencatat poin-poin penting di buku catatan.
4. Siswa diberi kesempatan bertanya jika belum paham.
5. Guru memberikan latihan di LKS halaman 14: menentukan bagian pernyataan umum dan deskripsi bagian.
6. Siswa mengumpulkan hasil catatan dan latihan ke meja guru.

C. Kegiatan Penutup (10 Menit)
1. Guru merangkum kembali pengertian teks LHO.
2. Guru menugaskan siswa membaca bab selanjutnya di rumah.
3. Doa penutup dan salam.

V. PENILAIAN
1. Sikap: Disiplin dan ketertiban selama mencatat di kelas.
2. Pengetahuan: Nilai latihan LKS (skala 0 - 100).
3. Keterampilan: Kelengkapan catatan di buku tulis.

Mengetahui,
Kepala Sekolah,                            Guru Mata Pelajaran,
H. Suryanto, M.Pd.                         Drs. Hendro Wibowo`
  },
  {
    id: 'sample-biologi-alhasra',
    title: 'Modul Ajar Biologi: Ekosistem & Keseimbangan Lingkungan Hidup',
    subject: 'Biologi',
    gradePhase: 'Fase E / Kelas X SMA',
    school: 'SMA Al HASRA',
    teacher: 'RIFA’ATUL MAHMUDAH, S.Pd.',
    expectedScoreCategory: 'SANGAT BAIK',
    description: 'Modul Ajar Biologi Fase E SMA Al HASRA karya Ibu Rifa’atul Mahmudah, S.Pd. Memuat identitas lengkap, bagian Identifikasi Peserta Didik, Dimensi Profil Lulusan, dan siklus Pembelajaran Mendalam.',
    content: `MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING)
SATUAN PENDIDIKAN : SMA Al HASRA
MATA PELAJARAN    : BIOLOGI
FASE / KELAS       : FASE E / KELAS X
PENYUSUN           : RIFA’ATUL MAHMUDAH, S.Pd.
ALOKASI WAKTU      : 2 Pertemuan (4 x 45 Menit)
MATERI POKOK       : Interaksi Komponen Biotik-Abiotik dan Keseimbangan Ekosistem

A. IDENTIFIKASI PESERTA DIDIK
1. Kesiapan Belajar:
   Berdasarkan hasil asesmen diagnostik kognitif awal, 78% peserta didik telah memahami konsep dasar rantai makanan dan tingkatan trofik dari jenjang SMP; 15% masih memerlukan penguatan perbedaan dekomposer dan detritivor; 7% memerlukan pendampingan konkret mengenai siklus biogeokimia.
2. Minat dan Profil Belajar:
   Peserta didik kelas X SMA Al HASRA memiliki kecenderungan gaya belajar visual dan kinestetik yang tinggi (suka studi kasus nyata lingkungan, investigasi mikroba/tanaman, dan penyusunan infografis digital).

B. MATERI PELAJARAN
1. Pengetahuan Faktual: Keanekaragaman komponen biotik dan kondisi abiotik di lingkungan SMA Al HASRA dan sekitarnya.
2. Pengetahuan Konseptual: Pola interaksi simbiosis, rantai makanan, jaring-jaring kehidupan, dan dinamika piramida ekologi.
3. Pengetahuan Prosedural: Metode observasi lapangan, pencatatan data keanekaragaman, dan analisis dampak ketidakseimbangan lingkungan.
4. Pengetahuan Metakognitif: Evaluasi peran manusia dalam melestarikan daya dukung lingkungan hidup.

C. DIMENSI PROFIL LULUSAN
1. Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia: Menumbuhkan rasa syukur dan etika menjaga keutuhan ekosistem ciptaan Tuhan.
2. Bernalar Kritis: Menganalisis data dinamika populasi dan memprediksi konsekuensi logis gangguan trofik.
3. Gotong Royong: Berkolaborasi aktif dalam investigasi kelompok dan diskusi sintesis temuan.

D. TUJUAN PEMBELAJARAN
1. Peserta didik mampu menganalisis interaksi antar komponen ekosistem dan jaring-jaring makanan secara kritis berbasis bukti observasi lingkungan.
2. Peserta didik mampu memprediksi dampak perubahan lingkungan terhadap dinamika trofik dan merumuskan solusi kontekstual pencegahan degradasi lingkungan secara kolaboratif.

E. PRAKTIK PEDAGOGIS & LINGKUNGAN BELAJAR
- Pendekatan: Pembelajaran Mendalam (Deep Learning)
- Model: Problem-Based Learning (PBL) berbasis Investigasi Nyata.
- Lingkungan Pembelajaran: Area taman sekolah SMA Al HASRA, laboratorium biologi, dan setting meja kelompok dinamis.
- Budaya Belajar: Saling memuliakan, mengapresiasi perspektif teman, dan ruang berpendapat yang aman dan bermakna.

F. KEMITRAAN & PEMANFAATAN DIGITAL
- Kemitraan: Kerja sama dengan pengelola laboratorium lingkungan dan narasumber konservasi alam.
- Pemanfaatan Digital: Penggunaan aplikasi interaktif BioSim ekosistem dan presentasi digital Canva / Google Slide kelompok.

G. PENGALAMAN PEMBELAJARAN MENDALAM
1. MEMAHAMI (Mindful & Meaningful):
   - Apersepsi hening berkesadaran: Murid diajak mengamati interaksi serangga dan tanaman di taman sekolah SMA Al HASRA.
   - Pertanyaan pemantik kontekstual: "Apa yang akan terjadi pada rantai makanan jika populasi predator puncak lenyap seketika?"
2. MENGAPLIKASI (Kontekstual & Kolaboratif):
   - Studi kasus nyata: "Analisis dampak pencemaran air terhadap keanekaragaman plankton dan ikan lokal".
   - Kerja tim terstruktur dengan scaffolding bagi kelompok yang membutuhkan bimbingan intensif.
3. MEREFLEKSI (Reflektif & Metakognitif):
   - Menjawab pertanyaan reflektif di akhir pembelajaran:
     a. Pemahaman esensial apa yang saya dapatkan hari ini?
     b. Bagaimana kontribusi saya dalam kelompok?
     c. Apa aksi nyata yang dapat saya lakukan untuk menjaga keseimbangan alam sekitar?

H. PRINSIP PEMBELAJARAN MENDALAM
- Berkesadaran (Mindful): Mengajak murid menyadari keterkaitan erat makhluk hidup dengan lingkungannya.
- Bermakna (Meaningful): Mengaitkan biologi dengan isu nyata keberlanjutan bumi.
- Menggembirakan (Joyful): Diskusi berbasis eksplorasi interaktif dan apresiasi karya sejawat.

I. ASESMEN PEMBELAJARAN
1. Asesmen Awal (Diagnostik): Kuis awal pemetaan kesiapan materi ekologi untuk menentukan kelompok belajar adaptif.
2. Asesmen Proses (Formatif): Observasi partisipasi, jurnal refleksi berkala, dan umpan balik konstruktif langsung dari guru.
3. Asesmen Akhir (Sumatif): Penilaian portofolio laporan investigasi ekosistem dan presentasi solusi.
4. Rubrik Penilaian KKTP: Rubrik analitik memuat 4 jenjang capaian (Perlu Bimbingan, Cukup, Baik, Sangat Mahir).

J. LAMPIRAN
1. Lembar Kerja Peserta Didik (LKPD) "Detektif Ekosistem SMA Al HASRA".
2. Lembar Refleksi Diri dan Rekan Sejawat.`
  }
];
