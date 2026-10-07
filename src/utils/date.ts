export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toIsoDate(dateStr?: string): string {
  if (!dateStr) return getTodayIsoDate();
  const trimmed = dateStr.trim();

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // Format DD/MM/YYYY or D/M/YYYY
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const day = slashMatch[1].padStart(2, '0');
    const month = slashMatch[2].padStart(2, '0');
    const year = slashMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Indonesian month mapping
  const monthNamesIndo: Record<string, string> = {
    januari: '01',
    februari: '02',
    maret: '03',
    april: '04',
    mei: '05',
    juni: '06',
    juli: '07',
    agustus: '08',
    september: '09',
    oktober: '10',
    november: '11',
    desember: '12',
  };

  const match = trimmed.match(/(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
  if (match) {
    const day = match[1].padStart(2, '0');
    const month = monthNamesIndo[match[2].toLowerCase()] || '01';
    const year = match[3];
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return getTodayIsoDate();
}

export function formatIndonesianDate(dateStr?: string): string {
  if (!dateStr) return '';
  const iso = toIsoDate(dateStr);
  const [year, month, day] = iso.split('-');
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const mIndex = parseInt(month, 10) - 1;
  const monthName = months[mIndex] || month;
  return `${parseInt(day, 10)} ${monthName} ${year}`;
}
