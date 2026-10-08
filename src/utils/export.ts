import { AnalysisReport } from '../types/telaah';
import { purgeProfilPelajarPancasila } from './textPurge';

export function downloadJsonReport(report: AnalysisReport): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(report, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  const cleanTitle = (report.identity.title || report.fileName || 'hasil_telaah')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');
  downloadAnchor.setAttribute('download', `telaah_rpp_${cleanTitle}_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function printOrSavePdfReport(report: AnalysisReport): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Jendela cetak terblokir oleh peramban. Mohon izinkan popup untuk mencetak/menyimpan PDF.');
    return;
  }

  const html = generatePrintableHtml(report);
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

export function downloadDocxReport(report: AnalysisReport): void {
  const content = generateWordHtml(report);
  const blob = new Blob(['\ufeff' + content], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanTitle = (report.identity.title || report.fileName || 'hasil_telaah')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');
  a.download = `Telaah_RPP_${cleanTitle}_${new Date().toISOString().slice(0, 10)}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printOrSaveComparisonReport(beforeReport: AnalysisReport, afterReport: AnalysisReport): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Jendela cetak terblokir oleh peramban. Mohon izinkan popup untuk mencetak laporan komparasi.');
    return;
  }

  const html = generatePrintableComparisonHtml(beforeReport, afterReport);
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

export function downloadDocxComparisonReport(beforeReport: AnalysisReport, afterReport: AnalysisReport): void {
  const content = generateWordComparisonHtml(beforeReport, afterReport);
  const blob = new Blob(['\ufeff' + content], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const teacher = (beforeReport.identity.teacherName || 'guru').toLowerCase().replace(/[^a-z0-9]/g, '_');
  a.download = `Komparasi_Revisi_RPP_${teacher}_${new Date().toISOString().slice(0, 10)}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getScoreBadgeColor(score: any) {
  if (score === 2) return '#16a34a';
  if (score === 1) return '#d97706';
  if (score === 0) return '#dc2626';
  return '#64748b';
}

function generatePrintableHtml(report: AnalysisReport): string {
  const { identity, summary, indicators, feedback, priorities, incompatibleComponents, extraNotes, reviewDescription } = report;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Hasil Telaah RPP - ${identity.title || report.fileName}</title>
  <style>
    @page { size: A4; margin: 18mm 15mm; }
    body {
      font-family: 'Times New Roman', Times, serif;
      color: #111827;
      line-height: 1.4;
      font-size: 11pt;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      border-bottom: 3px double #1f2937;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .header h2 { margin: 0 0 4px 0; font-size: 15pt; text-transform: uppercase; letter-spacing: 0.5px; }
    .header h3 { margin: 0 0 4px 0; font-size: 13pt; font-weight: normal; }
    .header p { margin: 0; font-size: 10pt; color: #4b5563; }
    .score-summary-box {
      border: 2px solid #0f766e;
      background-color: #f0fdfa;
      border-radius: 6px;
      padding: 14px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-around;
      text-align: center;
    }
    .score-item .label { font-size: 9pt; text-transform: uppercase; color: #042f2e; font-weight: bold; }
    .score-item .value { font-size: 18pt; font-weight: bold; color: #0f766e; margin-top: 2px; }
    .score-item .sub { font-size: 8.5pt; color: #374151; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 10pt; }
    th, td { border: 1px solid #9ca3af; padding: 6px 8px; vertical-align: top; }
    th { background-color: #f3f4f6; font-weight: bold; text-align: left; }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8.5pt;
      font-weight: bold;
      color: #fff;
    }
    .badge-2 { background-color: #16a34a; }
    .badge-1 { background-color: #d97706; }
    .badge-0 { background-color: #dc2626; }
    .badge-na { background-color: #64748b; }
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      margin: 18px 0 8px 0;
      border-bottom: 1.5px solid #374151;
      padding-bottom: 3px;
      color: #111827;
      text-transform: uppercase;
    }
    .signature-container {
      margin-top: 35px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .signature-box { width: 45%; text-align: center; font-size: 10.5pt; }
    .signature-space { height: 65px; }
    ul { margin: 4px 0 8px 18px; padding: 0; }
    li { margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>INSTRUMEN TELAAH PERENCANAAN PEMBELAJARAN</h2>
    <h3>PENDEKATAN PEMBELAJARAN MENDALAM (DEEP LEARNING)</h3>
    <p>Sistem Penjaminan Mutu & Supervisi Akademik Perencanaan Kurikulum</p>
  </div>

  <table style="margin-bottom: 14px;">
    <tr>
      <td style="width: 20%; font-weight: bold; background-color: #f9fafb;">Satuan Pendidikan</td>
      <td style="width: 30%;">${identity.school || '-'}</td>
      <td style="width: 20%; font-weight: bold; background-color: #f9fafb;">Nama Guru / Penyusun</td>
      <td style="width: 30%;">${identity.teacherName || '-'}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; background-color: #f9fafb;">Mata Pelajaran</td>
      <td>${identity.subject || '-'}</td>
      <td style="font-weight: bold; background-color: #f9fafb;">NIP Guru</td>
      <td>${identity.teacherNip || '-'}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; background-color: #f9fafb;">Fase / Kelas</td>
      <td>${identity.gradePhase || '-'}</td>
      <td style="font-weight: bold; background-color: #f9fafb;">Alokasi Waktu</td>
      <td>${identity.timeAllocation || '-'}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; background-color: #f9fafb;">Materi Pokok</td>
      <td>${identity.topic || identity.title || '-'}</td>
      <td style="font-weight: bold; background-color: #f9fafb;">Tanggal Telaah</td>
      <td>${identity.reviewDate || identity.uploadDate || new Date().toLocaleDateString('id-ID')}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; background-color: #f9fafb;">Nama Penelaah / Asesor</td>
      <td>${identity.reviewerName || '-'}</td>
      <td style="font-weight: bold; background-color: #f9fafb;">NIP Penelaah</td>
      <td>${identity.reviewerNip || '-'}</td>
    </tr>
  </table>

  <div class="score-summary-box">
    <div class="score-item">
      <div class="label">NILAI AKHIR</div>
      <div class="value">${summary.finalScore.toFixed(2)}</div>
      <div class="sub">Skala 100</div>
    </div>
    <div class="score-item">
      <div class="label">PREDIKAT</div>
      <div class="value" style="font-size: 15pt;">${summary.predicate}</div>
      <div class="sub">Standar Kompetensi</div>
    </div>
    <div class="score-item">
      <div class="label">TINDAK LANJUT</div>
      <div class="value" style="font-size: 14pt; color: #0284c7;">${summary.followUpCategory}</div>
      <div class="sub">Arahan Supervisi</div>
    </div>
    <div class="score-item">
      <div class="label">REKAPITULASI SKOR</div>
      <div class="value" style="font-size: 14pt;">${summary.totalScore} / ${summary.maxPossibleScore}</div>
      <div class="sub">Dinilai: ${summary.evaluatedCount} | N/A: ${summary.naCount}</div>
    </div>
  </div>

  <div class="section-title">I. TABEL TELAAH 22 INDIKATOR PEMBELAJARAN MENDALAM</div>
  <table>
    <thead>
      <tr>
        <th style="width: 5%; text-align: center;">No</th>
        <th style="width: 22%;">Indikator</th>
        <th style="width: 8%; text-align: center;">Skor</th>
        <th style="width: 25%;">Bukti / Temuan Dokumen</th>
        <th style="width: 22%;">Komentar Kritis</th>
        <th style="width: 18%;">Rekomendasi</th>
      </tr>
    </thead>
    <tbody>
      ${indicators
        .map((ind) => {
          const badgeClass =
            ind.score === 2 ? 'badge-2' : ind.score === 1 ? 'badge-1' : ind.score === 0 ? 'badge-0' : 'badge-na';
          return `
          <tr>
            <td style="text-align: center; font-weight: bold;">${ind.id}</td>
            <td>
              <strong>${ind.name}</strong>
              ${ind.isOptional ? '<br><span style="font-size: 7.5pt; color: #64748b;">(Opsional)</span>' : ''}
            </td>
            <td style="text-align: center;">
              <span class="badge ${badgeClass}">${ind.score}</span>
              <div style="font-size: 7.5pt; color: #475569; margin-top: 2px;">${ind.status}</div>
            </td>
            <td style="font-size: 9.5pt;">${purgeProfilPelajarPancasila(ind.evidence) || '-'}</td>
            <td style="font-size: 9.5pt;">${purgeProfilPelajarPancasila(ind.criticalComment) || '-'}</td>
            <td style="font-size: 9.5pt;">${purgeProfilPelajarPancasila(ind.recommendation) || '-'}</td>
          </tr>
        `;
        })
        .join('')}
    </tbody>
  </table>

  ${
    incompatibleComponents.length > 0
      ? `
    <div class="section-title">II. KOMPONEN YANG BELUM SESUAI / PERLU PENYESUAIAN</div>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Indikator</th>
          <th style="width: 25%;">Temuan Dokumen</th>
          <th style="width: 25%;">Alasan Ketidaksesuaian</th>
          <th style="width: 25%;">Rekomendasi Perbaikan</th>
        </tr>
      </thead>
      <tbody>
        ${incompatibleComponents
          .map(
            (c) => `
          <tr>
            <td><strong>${c.indicatorName}</strong></td>
            <td>${c.finding}</td>
            <td>${c.reason}</td>
            <td>${c.recommendation}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `
      : ''
  }

  ${
    priorities.length > 0
      ? `
    <div class="section-title">III. PRIORITAS PERBAIKAN PERENCANAAN</div>
    <table>
      <thead>
        <tr>
          <th style="width: 15%;">Prioritas</th>
          <th style="width: 25%;">Indikator</th>
          <th style="width: 30%;">Permasalahan</th>
          <th style="width: 30%;">Rekomendasi Aksi</th>
        </tr>
      </thead>
      <tbody>
        ${priorities
          .map(
            (p) => `
          <tr>
            <td>
              <span style="font-weight: bold; color: ${p.level === 'Sangat Tinggi' ? '#dc2626' : p.level === 'Tinggi' ? '#d97706' : '#2563eb'};">
                ${p.level}
              </span>
            </td>
            <td><strong>${p.indicatorName}</strong></td>
            <td>${p.issue}</td>
            <td>${p.recommendation}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `
      : ''
  }

  <div class="section-title">IV. DESKRIPSI HASIL TELAAH & UMPAN BALIK PEMBELAJARAN</div>
  <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
    <strong>Deskripsi Komprehensif:</strong>
    <p style="margin: 6px 0 0 0;">${reviewDescription}</p>
  </div>

  <table style="margin-bottom: 14px;">
    <tr>
      <td style="width: 50%; vertical-align: top;">
        <strong style="color: #16a34a;">A. Kelebihan Utama Perencanaan:</strong>
        <ul>
          ${feedback.strengths.map((s) => `<li>${s}</li>`).join('')}
        </ul>
      </td>
      <td style="width: 50%; vertical-align: top;">
        <strong style="color: #dc2626;">B. Hal yang Perlu Ditingkatkan:</strong>
        <ul>
          ${feedback.improvements.map((im) => `<li>${im}</li>`).join('')}
        </ul>
      </td>
    </tr>
    <tr>
      <td style="vertical-align: top;">
        <strong style="color: #0284c7;">C. Rekomendasi Praktis:</strong>
        <ul>
          ${feedback.practicalRecommendations.map((r) => `<li>${r}</li>`).join('')}
        </ul>
      </td>
      <td style="vertical-align: top;">
        <strong style="color: #7c3aed;">D. Tindak Lanjut Supervisi:</strong>
        <ul>
          ${feedback.followUpSteps.map((f) => `<li>${f}</li>`).join('')}
        </ul>
      </td>
    </tr>
  </table>

  ${
    extraNotes.length > 0
      ? `
    <div class="section-title">V. CATATAN TAMBAHAN DI LUAR INSTRUMEN</div>
    <p style="font-size: 9pt; color: #6b7280; margin: 0 0 6px 0;">* Komponen ini tidak termasuk dalam 22 indikator instrumen sehingga tidak memengaruhi nilai akhir.</p>
    <table>
      <thead>
        <tr>
          <th style="width: 30%;">Nama Komponen</th>
          <th style="width: 35%;">Temuan Dokumen</th>
          <th style="width: 35%;">Catatan / Rekomendasi</th>
        </tr>
      </thead>
      <tbody>
        ${extraNotes
          .map(
            (n) => `
          <tr>
            <td><strong>${n.componentName}</strong></td>
            <td>${n.finding}</td>
            <td>${n.recommendation}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `
      : ''
  }

  <div class="signature-container" style="justify-content: flex-end;">
    <div class="signature-box" style="margin-left: auto;">
      <p>${identity.school ? identity.school.split(' ')[0] : 'Kota'}, ${identity.reviewDate || new Date().toLocaleDateString('id-ID')}<br>Penelaah / Asesor Pembelajaran,</p>
      <div class="signature-space"></div>
      <p><strong>${identity.reviewerName || '(..................................................)'}</strong><br>NIP. ${identity.reviewerNip || '......................................................'}</p>
    </div>
  </div>
</body>
</html>`;
}

function generateWordHtml(report: AnalysisReport): string {
  const { identity, summary, indicators, feedback, priorities, incompatibleComponents, extraNotes, reviewDescription } = report;

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Laporan Hasil Telaah RPP - ${identity.title || report.fileName}</title>
  <!--[if gte mso 9]>
  <xml>
  <w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
  </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.35; color: #111827; }
    h2 { font-size: 16pt; text-align: center; margin: 0 0 4px 0; color: #0f172a; text-transform: uppercase; }
    h3 { font-size: 13pt; text-align: center; margin: 0 0 8px 0; color: #334155; font-weight: normal; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 10pt; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: top; }
    th { background-color: #f1f5f9; font-weight: bold; }
    .title-sec { font-size: 12pt; font-weight: bold; margin-top: 18px; margin-bottom: 6px; color: #0f172a; border-bottom: 1.5px solid #0f172a; }
  </style>
</head>
<body>
  <h2>LAPORAN HASIL TELAAH PERENCANAAN PEMBELAJARAN</h2>
  <h3>PENDEKATAN PEMBELAJARAN MENDALAM (DEEP LEARNING)</h3>
  <hr style="border: 0; border-top: 2px solid #0f172a; margin-bottom: 16px;">

  <table>
    <tr>
      <td width="20%"><b>Satuan Pendidikan</b></td>
      <td width="30%">${identity.school || '-'}</td>
      <td width="20%"><b>Nama Guru / Penyusun</b></td>
      <td width="30%">${identity.teacherName || '-'}</td>
    </tr>
    <tr>
      <td><b>Mata Pelajaran</b></td>
      <td>${identity.subject || '-'}</td>
      <td><b>NIP Guru</b></td>
      <td>${identity.teacherNip || '-'}</td>
    </tr>
    <tr>
      <td><b>Fase / Kelas</b></td>
      <td>${identity.gradePhase || '-'}</td>
      <td><b>Alokasi Waktu</b></td>
      <td>${identity.timeAllocation || '-'}</td>
    </tr>
    <tr>
      <td><b>Materi Pokok</b></td>
      <td>${identity.topic || identity.title || '-'}</td>
      <td><b>Tanggal Telaah</b></td>
      <td>${identity.reviewDate || identity.uploadDate || new Date().toLocaleDateString('id-ID')}</td>
    </tr>
    <tr>
      <td><b>Nama Penelaah / Asesor</b></td>
      <td>${identity.reviewerName || '-'}</td>
      <td><b>NIP Penelaah</b></td>
      <td>${identity.reviewerNip || '-'}</td>
    </tr>
  </table>

  <table style="background-color: #f0fdf4; border: 2px solid #16a34a; text-align: center;">
    <tr>
      <td width="25%">
        <span style="font-size: 9pt; color: #166534; font-weight: bold;">NILAI AKHIR</span><br>
        <span style="font-size: 20pt; font-weight: bold; color: #15803d;">${summary.finalScore.toFixed(2)}</span><br>
        <span style="font-size: 8pt; color: #166534;">Skala 100</span>
      </td>
      <td width="25%">
        <span style="font-size: 9pt; color: #166534; font-weight: bold;">PREDIKAT</span><br>
        <span style="font-size: 16pt; font-weight: bold; color: #15803d;">${summary.predicate}</span>
      </td>
      <td width="25%">
        <span style="font-size: 9pt; color: #166534; font-weight: bold;">TINDAK LANJUT</span><br>
        <span style="font-size: 14pt; font-weight: bold; color: #0369a1;">${summary.followUpCategory}</span>
      </td>
      <td width="25%">
        <span style="font-size: 9pt; color: #166534; font-weight: bold;">TOTAL SKOR</span><br>
        <span style="font-size: 15pt; font-weight: bold;">${summary.totalScore} / ${summary.maxPossibleScore}</span><br>
        <span style="font-size: 8pt; color: #475569;">Dinilai: ${summary.evaluatedCount} | N/A: ${summary.naCount}</span>
      </td>
    </tr>
  </table>

  <div class="title-sec">I. TABEL 22 INDIKATOR TELAAH PEMBELAJARAN MENDALAM</div>
  <table>
    <thead>
      <tr>
        <th width="5%">No</th>
        <th width="20%">Indikator</th>
        <th width="10%">Skor</th>
        <th width="25%">Bukti / Temuan Dokumen</th>
        <th width="22%">Komentar Kritis</th>
        <th width="18%">Rekomendasi</th>
      </tr>
    </thead>
    <tbody>
      ${indicators
        .map(
          (ind) => `
        <tr>
          <td align="center"><b>${ind.id}</b></td>
          <td><b>${ind.name}</b>${ind.isOptional ? ' <i>(Opsional)</i>' : ''}</td>
          <td align="center"><b>${ind.score}</b><br><span style="font-size: 8pt; color: #64748b;">${ind.status}</span></td>
          <td>${purgeProfilPelajarPancasila(ind.evidence) || '-'}</td>
          <td>${purgeProfilPelajarPancasila(ind.criticalComment) || '-'}</td>
          <td>${purgeProfilPelajarPancasila(ind.recommendation) || '-'}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  ${
    incompatibleComponents.length > 0
      ? `
    <div class="title-sec">II. KOMPONEN YANG BELUM SESUAI</div>
    <table>
      <thead>
        <tr>
          <th width="25%">Indikator</th>
          <th width="25%">Temuan</th>
          <th width="25%">Alasan Ketidaksesuaian</th>
          <th width="25%">Rekomendasi</th>
        </tr>
      </thead>
      <tbody>
        ${incompatibleComponents
          .map(
            (c) => `
          <tr>
            <td><b>${c.indicatorName}</b></td>
            <td>${c.finding}</td>
            <td>${c.reason}</td>
            <td>${c.recommendation}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `
      : ''
  }

  ${
    priorities.length > 0
      ? `
    <div class="title-sec">III. PRIORITAS PERBAIKAN</div>
    <table>
      <thead>
        <tr>
          <th width="15%">Prioritas</th>
          <th width="25%">Indikator</th>
          <th width="30%">Masalah</th>
          <th width="30%">Rekomendasi</th>
        </tr>
      </thead>
      <tbody>
        ${priorities
          .map(
            (p) => `
          <tr>
            <td><b>${p.level}</b></td>
            <td><b>${p.indicatorName}</b></td>
            <td>${p.issue}</td>
            <td>${p.recommendation}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `
      : ''
  }

  <div class="title-sec">IV. DESKRIPSI HASIL TELAAH & UMPAN BALIK</div>
  <p><b>Deskripsi Hasil Telaah:</b><br>${reviewDescription}</p>

  <table>
    <tr>
      <td width="50%">
        <b>Kekuatan Utama:</b>
        <ul>${feedback.strengths.map((s) => `<li>${s}</li>`).join('')}</ul>
      </td>
      <td width="50%">
        <b>Hal yang Perlu Ditingkatkan:</b>
        <ul>${feedback.improvements.map((im) => `<li>${im}</li>`).join('')}</ul>
      </td>
    </tr>
    <tr>
      <td>
        <b>Rekomendasi Praktis:</b>
        <ul>${feedback.practicalRecommendations.map((r) => `<li>${r}</li>`).join('')}</ul>
      </td>
      <td>
        <b>Tindak Lanjut Supervisi:</b>
        <ul>${feedback.followUpSteps.map((f) => `<li>${f}</li>`).join('')}</ul>
      </td>
    </tr>
  </table>

  ${
    extraNotes.length > 0
      ? `
    <div class="title-sec">V. CATATAN TAMBAHAN DI LUAR INSTRUMEN</div>
    <table>
      <thead>
        <tr>
          <th width="30%">Komponen</th>
          <th width="35%">Temuan</th>
          <th width="35%">Rekomendasi</th>
        </tr>
      </thead>
      <tbody>
        ${extraNotes
          .map(
            (n) => `
          <tr>
            <td><b>${n.componentName}</b></td>
            <td>${n.finding}</td>
            <td>${n.recommendation}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `
      : ''
  }

  <br><br>
  <table style="border: none; width: 100%;">
    <tr style="border: none;">
      <td width="50%" style="border: none;"></td>
      <td width="50%" align="center" style="border: none;">
        ${identity.school ? identity.school.split(' ')[0] : 'Kota'}, ${identity.reviewDate || new Date().toLocaleDateString('id-ID')}<br>
        Penelaah / Asesor Pembelajaran,<br><br><br><br>
        <b>${identity.reviewerName || '(..................................................)'}</b><br>
        NIP. ${identity.reviewerNip || '......................................................'}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generatePrintableComparisonHtml(beforeReport: AnalysisReport, afterReport: AnalysisReport): string {
  const teacher = beforeReport.identity.teacherName || afterReport.identity.teacherName || 'Guru Pengampu';
  const teacherNip = afterReport.identity.teacherNip || beforeReport.identity.teacherNip || '';
  const school = beforeReport.identity.school || afterReport.identity.school || 'Satuan Pendidikan';
  const subject = beforeReport.identity.subject || afterReport.identity.subject || 'Mata Pelajaran';
  const grade = beforeReport.identity.gradePhase || afterReport.identity.gradePhase || 'Fase / Kelas';
  const reviewer = afterReport.identity.reviewerName || beforeReport.identity.reviewerName || 'Tim Penelaah';
  const reviewerNip = afterReport.identity.reviewerNip || beforeReport.identity.reviewerNip || '';

  const deltaScore = afterReport.summary.finalScore - beforeReport.summary.finalScore;
  const deltaText = (deltaScore >= 0 ? `+${deltaScore.toFixed(2)}` : deltaScore.toFixed(2)) + ' Poin';

  // Count indicator trends
  let improvedCount = 0;
  let optimalCount = 0;
  let regressedCount = 0;

  const indicatorRows = beforeReport.indicators.map((bInd) => {
    const aInd = afterReport.indicators.find((a) => a.id === bInd.id) || bInd;

    const bScoreVal = typeof bInd.score === 'number' ? bInd.score : -1;
    const aScoreVal = typeof aInd.score === 'number' ? aInd.score : -1;

    let trendLabel = 'Tetap';
    let trendClass = 'badge-na';

    if (bScoreVal !== -1 && aScoreVal !== -1) {
      if (aScoreVal > bScoreVal) {
        improvedCount++;
        trendLabel = `▲ +${aScoreVal - bScoreVal} Naik`;
        trendClass = 'badge-2';
      } else if (aScoreVal < bScoreVal) {
        regressedCount++;
        trendLabel = `▼ -${bScoreVal - aScoreVal} Turun`;
        trendClass = 'badge-0';
      } else if (aScoreVal === 2) {
        optimalCount++;
        trendLabel = '● Tetap Optimal';
        trendClass = 'badge-2';
      } else {
        trendLabel = '● Tetap';
        trendClass = 'badge-1';
      }
    } else if (bScoreVal === -1 && aScoreVal !== -1) {
      improvedCount++;
      trendLabel = `▲ Sekarang Diisi (${aScoreVal})`;
      trendClass = 'badge-2';
    }

    return `
      <tr>
        <td style="text-align: center; font-weight: bold;">${bInd.id}</td>
        <td>
          <strong>${bInd.name}</strong>
          ${bInd.isOptional ? '<br><span style="font-size: 7.5pt; color: #64748b;">(Opsional)</span>' : ''}
        </td>
        <td style="text-align: center;">
          <span class="badge ${bInd.score === 2 ? 'badge-2' : bInd.score === 1 ? 'badge-1' : bInd.score === 0 ? 'badge-0' : 'badge-na'}">${bInd.score}</span>
          <div style="font-size: 7.5pt; color: #64748b;">${bInd.status}</div>
        </td>
        <td style="text-align: center;">
          <span class="badge ${aInd.score === 2 ? 'badge-2' : aInd.score === 1 ? 'badge-1' : aInd.score === 0 ? 'badge-0' : 'badge-na'}">${aInd.score}</span>
          <div style="font-size: 7.5pt; color: #64748b;">${aInd.status}</div>
        </td>
        <td style="text-align: center;">
          <span class="badge ${trendClass}">${trendLabel}</span>
        </td>
        <td style="font-size: 9pt;">
          <div style="margin-bottom: 4px;">
            <b style="color: #64748b;">Sebelum:</b> ${purgeProfilPelajarPancasila(bInd.evidence) || 'Tidak dicantumkan'}
          </div>
          <div>
            <b style="color: #0f766e;">Sesudah:</b> ${purgeProfilPelajarPancasila(aInd.evidence) || 'Tidak dicantumkan'}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Berita Acara Komparasi Revisi RPP - ${teacher}</title>
  <style>
    @page { size: A4; margin: 18mm 15mm; }
    body {
      font-family: 'Times New Roman', Times, serif;
      color: #111827;
      line-height: 1.4;
      font-size: 10.5pt;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      border-bottom: 3px double #1f2937;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }
    .header h2 { margin: 0 0 4px 0; font-size: 14pt; text-transform: uppercase; letter-spacing: 0.5px; }
    .header h3 { margin: 0 0 4px 0; font-size: 12pt; font-weight: normal; color: #0f766e; }
    .header p { margin: 0; font-size: 9.5pt; color: #4b5563; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 10pt; }
    .meta-table td { border: 1px solid #d1d5db; padding: 5px 8px; vertical-align: top; }
    .meta-table .label { background-color: #f8fafc; font-weight: bold; width: 22%; }
    .summary-card {
      border: 2px solid #0f766e;
      background-color: #f0fdfa;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-around;
      text-align: center;
    }
    .summary-item .title { font-size: 8.5pt; text-transform: uppercase; color: #042f2e; font-weight: bold; }
    .summary-item .score { font-size: 17pt; font-weight: bold; color: #0f766e; margin-top: 2px; }
    .summary-item .sub { font-size: 8.5pt; color: #374151; }
    table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 9pt; }
    table.data-table th, table.data-table td { border: 1px solid #9ca3af; padding: 5px 6px; vertical-align: top; }
    table.data-table th { background-color: #f1f5f9; font-weight: bold; }
    .badge {
      display: inline-block;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: bold;
      color: #fff;
    }
    .badge-2 { background-color: #16a34a; }
    .badge-1 { background-color: #d97706; }
    .badge-0 { background-color: #dc2626; }
    .badge-na { background-color: #64748b; }
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      margin: 16px 0 6px 0;
      border-bottom: 1.5px solid #374151;
      padding-bottom: 3px;
      color: #111827;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>BERITA ACARA SUPERVISI AKADEMIK & KOMPARASI REVISI RPP</h2>
    <h3>PENDEKATAN PEMBELAJARAN MENDALAM (DEEP LEARNING)</h3>
    <p>Penilaian Peningkatan Kualitas Dokumen Perencanaan Pembelajaran Sebelum dan Sesudah Revisi</p>
  </div>

  <table class="meta-table">
    <tr>
      <td class="label">Nama Guru Pengampu</td>
      <td style="width: 28%; font-weight: bold;">${teacher}</td>
      <td class="label">Satuan Pendidikan</td>
      <td style="width: 28%; font-weight: bold;">${school}</td>
    </tr>
    <tr>
      <td class="label">NIP Guru</td>
      <td>${teacherNip || '-'}</td>
      <td class="label">Mata Pelajaran & Fase</td>
      <td>${subject} (${grade})</td>
    </tr>
    <tr>
      <td class="label">Nama Penelaah / Asesor</td>
      <td>${reviewer}</td>
      <td class="label">NIP Penelaah</td>
      <td>${reviewerNip || '-'}</td>
    </tr>
    <tr>
      <td class="label">Dokumen Sebelum Revisi</td>
      <td>${beforeReport.identity.title || beforeReport.fileName} (Tanggal Telaah: ${beforeReport.identity.reviewDate || beforeReport.identity.uploadDate || '-'})</td>
      <td class="label">Dokumen Sesudah Revisi</td>
      <td>${afterReport.identity.title || afterReport.fileName} (Tanggal Telaah: ${afterReport.identity.reviewDate || afterReport.identity.uploadDate || '-'})</td>
    </tr>
  </table>

  <div class="summary-card">
    <div class="summary-item">
      <div class="title">NILAI SEBELUM REVISI</div>
      <div class="score" style="color: #475569;">${beforeReport.summary.finalScore.toFixed(2)}</div>
      <div class="sub">${beforeReport.summary.predicate} (${beforeReport.summary.followUpCategory})</div>
    </div>
    <div class="summary-item">
      <div class="title">NILAI SESUDAH REVISI</div>
      <div class="score">${afterReport.summary.finalScore.toFixed(2)}</div>
      <div class="sub">${afterReport.summary.predicate} (${afterReport.summary.followUpCategory})</div>
    </div>
    <div class="summary-item">
      <div class="title">PENINGKATAN MUTU (DELTA)</div>
      <div class="score" style="color: ${deltaScore >= 0 ? '#16a34a' : '#dc2626'};">${deltaText}</div>
      <div class="sub">${improvedCount} Indikator Mengalami Peningkatan</div>
    </div>
  </div>

  <div class="section-title">I. TABEL KOMPARASI 22 INDIKATOR PEMBELAJARAN MENDALAM</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 5%; text-align: center;">No</th>
        <th style="width: 22%;">Indikator Telaah</th>
        <th style="width: 8%; text-align: center;">Skor Sebelum</th>
        <th style="width: 8%; text-align: center;">Skor Sesudah</th>
        <th style="width: 13%; text-align: center;">Perubahan</th>
        <th style="width: 44%;">Perbandingan Bukti &amp; Temuan Dokumen</th>
      </tr>
    </thead>
    <tbody>
      ${indicatorRows}
    </tbody>
  </table>

  <div class="section-title">II. KESIMPULAN REVISI &amp; CATATAN ASESOR</div>
  <p style="text-align: justify; margin: 4px 0 16px 0; font-size: 10pt; line-height: 1.5;">
    Berdasarkan hasil supervisi perbandingan, dokumen RPP / Modul Ajar milik <b>${teacher}</b> mengalami perubahan nilai dari <b>${beforeReport.summary.finalScore.toFixed(2)} (${beforeReport.summary.predicate})</b> menjadi <b>${afterReport.summary.finalScore.toFixed(2)} (${afterReport.summary.predicate})</b> dengan selisih peningkatan sebesar <b>${deltaText}</b>. Sebanyak <b>${improvedCount}</b> indikator berhasil disempurnakan dan <b>${optimalCount}</b> indikator tetap berada pada kategori optimal. Perencanaan pembelajaran ini telah memenuhi kriteria esensial kurikulum Pembelajaran Mendalam.
  </p>

  <br>
  <table style="border: none; width: 100%; margin-top: 20px;">
    <tr style="border: none;">
      <td width="50%" style="border: none;"></td>
      <td width="50%" align="center" style="border: none;">
        ${school ? school.split(' ')[0] : 'Kota'}, ${afterReport.identity.reviewDate || new Date().toLocaleDateString('id-ID')}<br>
        Penelaah / Asesor Supervisi Akademik,<br><br><br><br>
        <b>${reviewer}</b><br>
        NIP. ${reviewerNip || '......................................................'}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generateWordComparisonHtml(beforeReport: AnalysisReport, afterReport: AnalysisReport): string {
  return generatePrintableComparisonHtml(beforeReport, afterReport);
}
