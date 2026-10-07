/**
 * Utility functions for text sanitization, school name detection,
 * and ensuring 'Profil Pelajar Pancasila' is completely replaced with 'Dimensi Profil Lulusan'.
 */

export function purgeProfilPelajarPancasila(text?: string): string {
  if (!text) return '';
  return text
    .replace(/dimensi\s+profil\s+pelajar\s+pancasila/gi, 'Dimensi Profil Lulusan')
    .replace(/profil\s+pelajar\s+pancasila\s*\((?:ppp|p3)\)/gi, 'Dimensi Profil Lulusan')
    .replace(/profil\s+pelajar\s+pancasila/gi, 'Dimensi Profil Lulusan')
    .replace(/dimensi\s+profil\s+pancasila/gi, 'Dimensi Profil Lulusan')
    .replace(/profil\s+pancasila/gi, 'Dimensi Profil Lulusan')
    .replace(/pelajar\s+pancasila/gi, 'Dimensi Profil Lulusan')
    .replace(/profil\s+pelajar/gi, 'Dimensi Profil Lulusan')
    .replace(/\bdimensi\s+pancasila\b/gi, 'Dimensi Profil Lulusan')
    .replace(/\bpancasila\b/gi, 'Profil Lulusan')
    .replace(/\b(P3|PPP)\b/g, 'Profil Lulusan')
    .replace(/dimensi\s+dimensi\s+profil\s+lulusan/gi, 'Dimensi Profil Lulusan')
    .replace(/dimensi\s+profil\s+lulusan\s+profil\s+lulusan/gi, 'Dimensi Profil Lulusan')
    .replace(/dimensi\s+profil\s+lulusan\s+dimensi\s+profil\s+lulusan/gi, 'Dimensi Profil Lulusan')
    .replace(/dimensi\s+profil\s+lulusan\s*\(\s*profil\s+lulusan\s*\)/gi, 'Dimensi Profil Lulusan');
}

export function detectSchoolName(text?: string): string | null {
  if (!text) return null;

  // 0. Direct check for known school: SMA Al HASRA / Al Hasra
  if (/\b(?:al[\s\-]?hasra)\b/i.test(text)) {
    return 'SMA Al HASRA';
  }

  // 1. If Rifa'atul Mahmudah is the teacher, she is at SMA Al HASRA
  if (/rifa[’']?atul\s+mahmudah/i.test(text)) {
    return 'SMA Al HASRA';
  }

  // 2. Explicit label with Colon/Equal or newline:
  // "Sekolah : SMA AL HASRA", "Satuan Pendidikan : SMA AL HASRA", or in table
  const labelMatch = text.match(
    /(?:nama\s+)?(?:satuan\s+pendidikan|sekolah|madrasah|instansi|unit\s+kerja)\s*[:=]?\s*[\r\n\t]*\s*([^\n\r,;|]+)/i
  );
  if (labelMatch) {
    let val = labelMatch[1].trim();
    // remove trailing noise like "Fase E", "Tahun Ajaran", "Alokasi", etc.
    val = val.replace(/\s+(?:tahun|fase|kelas|mata|mapel|semester|alokasi|guru|nama|semester|kurikulum|tp\b|ta\b).*/i, '').trim();
    if (val.length > 2 && !/^(satuan\s+pendidikan|sekolah|madrasah|instansi)$/i.test(val)) {
      if (/al[\s\-]?hasra/i.test(val)) return 'SMA Al HASRA';
      return val;
    }
  }

  // 3. Direct school naming pattern: e.g. "SMA AL HASRA", "SMA Al Hasra", "SMAS ...", "SMK ...", "MTs ..."
  const directMatch = text.match(
    /\b(SMA|SMK|SMP|MTs|MA|SD|MI|SMAS|SMKN|SMAN)\s+([A-Za-z0-9'\-\.]{2,}(?:[ \t]+[A-Za-z0-9'\-\.]+){0,4})/i
  );
  if (directMatch) {
    let val = directMatch[0].trim();
    val = val.replace(/\s+(?:tahun|fase|kelas|semester|kurikulum|mata|mapel|alokasi|tp\b|ta\b).*/i, '').trim();
    if (!/^(sma|smk|smp|mts|ma|sd|mi|smas|smkn|sman)\s+(kelas|fase|semester|kurikulum|mata|mapel|merdeka)$/i.test(val)) {
      if (/al[\s\-]?hasra/i.test(val)) return 'SMA Al HASRA';
      return val;
    }
  }

  // 4. Yayasan / Perguruan / Pesantren pattern
  const yayasanMatch = text.match(
    /\b(?:yayasan|perguruan|pesantren)\s+([A-Za-z0-9'\-\.]{2,}(?:[ \t]+[A-Za-z0-9'\-\.]+){0,4})/i
  );
  if (yayasanMatch) {
    let val = yayasanMatch[0].trim();
    if (/al[\s\-]?hasra/i.test(val)) return 'SMA Al HASRA';
    return val;
  }

  return null;
}
