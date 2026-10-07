import { Request, Response } from 'express';
import dotenv from 'dotenv';
import zlib from 'zlib';
import { GoogleGenAI } from '@google/genai';
import mammoth from 'mammoth';
import * as pdfParseModule from 'pdf-parse';
import {
  INSTRUMENT_DEFINITIONS,
  OPTIONAL_INDICATOR_IDS,
  calculateSummary,
  buildPriorities,
  buildIncompatibilities,
} from '../data/instruments';
import { purgeProfilPelajarPancasila, detectSchoolName } from '../utils/textPurge';
import { IndicatorResult, ScoreType, StatusType } from '../types/telaah';

dotenv.config();

const PDFParseClass: any =
  (pdfParseModule as any).PDFParse ||
  (pdfParseModule as any).default ||
  pdfParseModule;

// Extract text from PDF using multiple strategies
async function extractAllPdfText(pdfBuffer: Buffer): Promise<string> {
  // Strategy 1: PDFParse library
  try {
    const parser = new PDFParseClass({ data: pdfBuffer });
    const res = await parser.getText();
    if (res && res.text && res.text.trim().length > 30) {
      return res.text;
    }
  } catch {
    // Continue to next strategy
  }

  // Strategy 2: Decompress flate streams
  try {
    const raw = pdfBuffer.toString('latin1');
    const chunks: string[] = [];
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let match;
    while ((match = streamRegex.exec(raw)) !== null) {
      try {
        const decompressed = zlib.inflateSync(Buffer.from(match[1], 'latin1'));
        chunks.push(decompressed.toString('utf-8'));
      } catch {
        try {
          const decompressed = zlib.inflateRawSync(Buffer.from(match[1], 'latin1'));
          chunks.push(decompressed.toString('utf-8'));
        } catch {
          // ignore stream decompression error
        }
      }
    }
    const combined = chunks.join('\n');
    const matches = combined.match(/\(([^()]{2,})\)/g);
    if (matches && matches.length > 5) {
      return matches.map((m) => m.slice(1, -1)).join(' ');
    }
    if (combined.trim().length > 50) {
      return combined;
    }
  } catch {
    // Continue
  }

  // Strategy 3: Raw UTF-8
  return pdfBuffer.toString('utf-8');
}

// Robust JSON extractor from AI markdown text
function extractJsonFromText(raw: string): any {
  if (!raw) throw new Error('Respon teks dari AI kosong.');

  try {
    return JSON.parse(raw);
  } catch {
    // Continue to extraction
  }

  const cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*$/g, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonSub = cleaned.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(jsonSub);
    } catch {
      const regexFixed = jsonSub.replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(regexFixed);
    }
  }

  throw new Error('Gagal mengekstrak struktur JSON yang valid dari respon AI.');
}

const BASE_ANALYSIS_PROMPT = `
Anda adalah Pakar Asesor dan Kurikulum Pendidikan Nasional Indonesia yang bertugas melakukan telaah resmi dan objektif terhadap RPP / Modul Ajar dengan pendekatan **PEMBELAJARAN MENDALAM** (Deep Learning).

TUGAS UTAMA:
Lakukan telaah kritis, objektif, dan berbasis bukti tekstual terhadap dokumen RPP/Modul Ajar berdasarkan tepat 22 Indikator Instrumen Telaah Perencanaan Pembelajaran.

ATURAN ANALISIS WAJIB:
1. BACA ISI DOKUMEN SECARA TELITI TERLEBIH DAHULU. Jangan berasumsi atau mengarang isi dokumen.
2. Setiap skor HARUS memiliki dasar bukti temuan spesifik (kutipan kalimat/paragraf dan lokasi bagian dokumen). Jika tidak ditemukan bukti sama sekali dalam dokumen, tuliskan secara tegas: "Tidak ditemukan bukti yang mendukung indikator ini dalam dokumen."
3. SKALA PENILAIAN RESMI:
   - 2 = TERPENUHI SECARA OPTIMAL (Indikator tersedia, lengkap, jelas, relevan, dan selaras dengan perencanaan pembelajaran).
   - 1 = TERPENUHI SEBAGIAN / BELUM OPTIMAL (Indikator sudah ada, tetapi belum lengkap, belum jelas, belum konsisten, atau belum sepenuhnya selaras).
   - 0 = BELUM TERPENUHI (Indikator wajib belum ada, belum tergambar, atau tidak sesuai dengan yang dipersyaratkan).
   - "N/A" = TIDAK RELEVAN (HANYA boleh digunakan untuk indikator opsional yang memang TIDAK terdapat dalam dokumen).
4. INDIKATOR OPSIONAL (Hanya 5 indikator ini yang boleh bernilai "N/A"):
   - Indikator No 2: IDENTIFIKASI MURID
   - Indikator No 3: MATERI PELAJARAN
   - Indikator No 10: KEMITRAAN PEMBELAJARAN
   - Indikator No 11: PEMANFAATAN DIGITAL
   - Indikator No 22: LEMBAR KERJA MURID
   ATURAN KHUSUS INDIKATOR OPSIONAL:
   - Jika komponen dicantumkan dalam dokumen: Beri skor 0, 1, atau 2 berdasarkan kualitas pemenuhannya.
   - Jika komponen TIDAK dicantumkan dalam dokumen: Wajib beri skor "N/A", status "N/A", bukti: "Komponen bersifat opsional dan tidak dicantumkan dalam dokumen, sehingga tidak diperhitungkan dalam nilai akhir."
   - Indikator yang bernilai "N/A" TIDAK AKAN masuk ke penyebut perhitungan nilai akhir (tidak mengurangi nilai).
5. INDIKATOR WAJIB:
   - Seluruh 17 indikator selain 5 indikator opsional di atas adalah WAJIB (Indikator 1, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21).
   - Jika indikator wajib tidak ditemukan sama sekali dalam dokumen, skornya HARUS 0 (status "Belum Terpenuhi"). DILARANG KERAS memberi skor "N/A" pada indikator wajib.
6. LARANGAN ISTILAH:
   - DILARANG MEMUNCULKAN ISTILAH "Profil Pelajar Pancasila". Gunakan HANYA istilah resmi "Dimensi Profil Lulusan".
7. SATUAN PENDIDIKAN & GURU:
   - Deteksi nama sekolah/madrasah nyata dari teks dokumen (misal: "SMA Al HASRA", "SMP Negeri 1", dll). Jangan biarkan generic jika tercantum di dokumen.

FORMAT RESPON HARUS BERUPA JSON VALID DENGAN SKEMA:
{
  "identity": {
    "teacherName": "...",
    "teacherNip": "...",
    "subject": "...",
    "gradePhase": "...",
    "school": "...",
    "title": "...",
    "topic": "...",
    "timeAllocation": "...",
    "reviewDate": "...",
    "uploadDate": "...",
    "reviewerName": "...",
    "reviewerNip": "..."
  },
  "indicators": [
    {
      "id": 1,
      "name": "IDENTITAS RPP",
      "status": "Terpenuhi Optimal",
      "score": 2,
      "evidence": "Kutipan bukti langsung dari naskah RPP...",
      "criticalComment": "Ulasan kritis asesor...",
      "recommendation": "Rekomendasi spesifik..."
    }
  ],
  "incompatibleComponents": [
    {
      "indicatorName": "...",
      "finding": "...",
      "reason": "...",
      "recommendation": "..."
    }
  ],
  "extraNotes": [
    {
      "componentName": "...",
      "finding": "...",
      "recommendation": "..."
    }
  ],
  "reviewDescription": "Paragraf ringkasan eksekutif hasil telaah kurikuler...",
  "feedback": {
    "strengths": ["...", "..."],
    "improvements": ["...", "..."],
    "practicalRecommendations": ["...", "..."],
    "followUpSteps": ["...", "..."]
  }
}
Pastikan seluruh 22 indikator dievaluasi tanpa ada yang terlewat.
`;

// Helper timeout wrapper
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Batas waktu pemrosesan AI terlampaui (${ms / 1000} detik)`)), ms)
    ),
  ]);

// Normalize and validate indicators strictly without hardcoded score overrides
function normalizeAndValidateIndicators(rawIndicators: any[]): IndicatorResult[] {
  const result: IndicatorResult[] = [];

  for (const def of INSTRUMENT_DEFINITIONS) {
    const existing = Array.isArray(rawIndicators)
      ? rawIndicators.find(
          (ind: any) =>
            ind.id === def.id ||
            (typeof ind.name === 'string' && ind.name.toUpperCase().includes(def.name.toUpperCase()))
        )
      : null;

    if (existing) {
      let validScore: ScoreType;
      const rawScore = existing.score;

      if (rawScore === 2 || rawScore === '2' || rawScore === 2.0) {
        validScore = 2;
      } else if (rawScore === 1 || rawScore === '1' || rawScore === 1.0) {
        validScore = 1;
      } else if (rawScore === 0 || rawScore === '0' || rawScore === 0.0) {
        validScore = 0;
      } else if (rawScore === 'N/A' || rawScore === 'NA' || rawScore === null) {
        // Only optional indicators may have N/A
        validScore = def.isOptional ? 'N/A' : 0;
      } else {
        validScore = def.isOptional ? 'N/A' : 0;
      }

      let validStatus: StatusType;
      if (validScore === 2) validStatus = 'Terpenuhi Optimal';
      else if (validScore === 1) validStatus = 'Terpenuhi Sebagian';
      else if (validScore === 0) validStatus = 'Belum Terpenuhi';
      else validStatus = 'N/A';

      const evidence = purgeProfilPelajarPancasila(
        existing.evidence ||
          (validScore === 'N/A'
            ? 'Komponen bersifat opsional dan tidak dicantumkan dalam dokumen.'
            : 'Tidak ditemukan bukti pendukung dalam naskah dokumen.')
      );
      const criticalComment = purgeProfilPelajarPancasila(
        existing.criticalComment || 'Evaluasi komponen berdasarkan indikator standar.'
      );
      const recommendation = purgeProfilPelajarPancasila(
        existing.recommendation || 'Tingkatkan kualitas komponen sesuai rubrik.'
      );

      result.push({
        id: def.id,
        name: def.name,
        isOptional: def.isOptional,
        status: validStatus,
        score: validScore,
        evidence,
        criticalComment,
        recommendation,
      });
    } else {
      // Indicator missing from AI output
      const missingScore: ScoreType = def.isOptional ? 'N/A' : 0;
      const missingStatus: StatusType = def.isOptional ? 'N/A' : 'Belum Terpenuhi';
      result.push({
        id: def.id,
        name: def.name,
        isOptional: def.isOptional,
        status: missingStatus,
        score: missingScore,
        evidence: def.isOptional
          ? 'Komponen bersifat opsional dan tidak dicantumkan dalam dokumen, sehingga tidak diperhitungkan dalam nilai akhir.'
          : 'Tidak ditemukan bukti yang mendukung indikator ini dalam dokumen RPP.',
        criticalComment: def.isOptional
          ? `Komponen opsional "${def.name}" tidak dicantumkan.`
          : `Indikator wajib "${def.name}" belum terpenuhi dalam dokumen RPP/Modul Ajar.`,
        recommendation: def.isOptional
          ? `Dapat dipertimbangkan mencantumkan ${def.name} untuk memperkaya pembelajaran.`
          : `Wajib menyusun komponen ${def.name} sesuai rubrik Pembelajaran Mendalam.`,
      });
    }
  }

  return result;
}

// Health check handler
export function handleHealth(_req: Request, res: Response): void {
  const apiKey = process.env.GEMINI_API_KEY;
  res.json({
    status: apiKey ? 'ok' : 'warning',
    geminiKeyConfigured: Boolean(apiKey),
    time: new Date().toISOString(),
    message: apiKey
      ? 'Gemini API Key terkonfigurasi'
      : 'GEMINI_API_KEY belum terpasang di Environment Variables',
  });
}

// Primary Analysis Handler
export async function handleAnalyzeRpp(req: Request, res: Response): Promise<void> {
  const requestId = 'REQ-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

  try {
    const {
      fileBase64,
      mimeType,
      fileName,
      documentText,
      reviewerName,
      reviewerNip,
      teacherNip,
      uploadDate,
      aiConfig,
    } = req.body || {};

    const safeFileName = typeof fileName === 'string' ? fileName : 'Dokumen_RPP.docx';
    const lowerFileName = safeFileName.toLowerCase();

    console.log(
      `[${requestId}] Status: RECEIVED | File: "${safeFileName}" | Mime: "${mimeType || 'unknown'}" | Base64Length: ${fileBase64 ? fileBase64.length : 0} | TextLength: ${documentText ? documentText.length : 0}`
    );

    if (!fileBase64 && !documentText) {
      res.status(400).json({
        success: false,
        requestId,
        error: 'Dokumen belum disertakan. Harap sertakan fileBase64 atau documentText.',
      });
      return;
    }

    // Check Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn(`[${requestId}] Status: ERROR | Reason: GEMINI_API_KEY not configured in environment`);
      res.status(500).json({
        success: false,
        requestId,
        error:
          'GEMINI_API_KEY belum dikonfigurasi di Environment Variables server. Jika menggunakan Vercel, buka Project Settings -> Environment Variables dan tambahkan GEMINI_API_KEY.',
      });
      return;
    }

    const isDocx =
      (mimeType && (mimeType.includes('word') || mimeType.includes('officedocument'))) ||
      lowerFileName.endsWith('.docx') ||
      lowerFileName.endsWith('.doc');
    const isPdf = (mimeType && mimeType.includes('pdf')) || lowerFileName.endsWith('.pdf');

    const contentsParts: any[] = [];
    let extractedDocText = '';

    // 1. Text Extraction
    if (fileBase64 && isDocx) {
      try {
        const buffer = Buffer.from(fileBase64, 'base64');
        const mammothResult = await mammoth.extractRawText({ buffer });
        extractedDocText = mammothResult.value || '';
        console.log(`[${requestId}] Status: DOCX_EXTRACTED | TextChars: ${extractedDocText.length}`);
        contentsParts.push({
          text: `DOKUMEN RPP / MODUL AJAR (DIPEROLEH DARI FILE DOCX: "${safeFileName}"):\n\n${extractedDocText}\n\nNAMA PENELAAH: "${reviewerName || 'Tim Penelaah'}"\nTANGGAL TELAAH: "${uploadDate || new Date().toLocaleDateString('id-ID')}"`,
        });
      } catch (docxErr: any) {
        console.warn(`[${requestId}] Status: DOCX_EXTRACTION_WARN | Error: ${docxErr?.message}`);
      }
    } else if (fileBase64 && isPdf) {
      try {
        const buf = Buffer.from(fileBase64, 'base64');
        extractedDocText = await extractAllPdfText(buf);
        console.log(`[${requestId}] Status: PDF_EXTRACTED | TextChars: ${extractedDocText.length}`);
      } catch (pdfParseErr: any) {
        console.warn(`[${requestId}] Status: PDF_EXTRACTION_WARN | Error: ${pdfParseErr?.message}`);
      }

      contentsParts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: fileBase64,
        },
      });

      const extractedSnippet =
        extractedDocText && extractedDocText.trim().length > 30
          ? `\n\nTEKS DOKUMEN RPP HASIL EKSTRAKSI SISTEM:\n"""\n${extractedDocText.slice(0, 45000)}\n"""\n`
          : '';

      contentsParts.push({
        text: `Lakukan telaah resmi dokumen RPP / Modul Ajar (file PDF: "${safeFileName}") di atas sesuai dengan seluruh 22 indikator instrumen Pembelajaran Mendalam.${extractedSnippet}\nNAMA PENELAAH: "${reviewerName || 'Tim Penelaah'}"\nTANGGAL TELAAH: "${uploadDate || new Date().toLocaleDateString('id-ID')}"`,
      });
    } else if (documentText) {
      extractedDocText = documentText;
      console.log(`[${requestId}] Status: RAW_TEXT_PROVIDED | TextChars: ${extractedDocText.length}`);
      contentsParts.push({
        text: `DOKUMEN RPP / MODUL AJAR:\n\n${documentText}\n\nNAMA PENELAAH: "${reviewerName || 'Tim Penelaah'}"\nTANGGAL TELAAH: "${uploadDate || new Date().toLocaleDateString('id-ID')}"`,
      });
    } else if (fileBase64) {
      extractedDocText = Buffer.from(fileBase64, 'base64').toString('utf-8');
      contentsParts.push({
        text: `DOKUMEN RPP / MODUL AJAR ("${safeFileName}"):\n\n${extractedDocText}\n\nNAMA PENELAAH: "${reviewerName || 'Tim Penelaah'}"\nTANGGAL TELAAH: "${uploadDate || new Date().toLocaleDateString('id-ID')}"`,
      });
    }

    if (contentsParts.length === 0) {
      res.status(400).json({
        success: false,
        requestId,
        error: 'Konten dokumen RPP tidak dapat dibaca atau diekstraksi.',
      });
      return;
    }

    // Dynamic System Instruction Customization based on user configuration
    let dynamicPrompt = BASE_ANALYSIS_PROMPT;
    if (aiConfig?.strictness === 'ketat') {
      dynamicPrompt += `\n\nINSTRUKSI TINGKAT KETELITIAN: **KETAT & STANDAR ASESOR TINGGI**.\nEvaluasi setiap indikator secara kritis. Berikan skor 2 hanya jika bukti sangat lengkap, terstruktur, dan konsisten. Jika ada ketidakselarasan, berikan skor 1 atau 0 dengan alasan pedagogis yang jelas.`;
    } else if (aiConfig?.strictness === 'pembinaan') {
      dynamicPrompt += `\n\nINSTRUKSI TINGKAT KETELITIAN: **FASILITATIF & PEMBINAAN GURU**.\nFokus pada masukan pedagogis yang membangun, apresiasi inovasi guru, serta saran perbaikan langkah demi langkah yang ramah guru.`;
    }

    if (aiConfig?.focus === 'diferensiasi') {
      dynamicPrompt += `\n\nFOKUS PEDAGOGIS KHUSUS: Prioritaskan penelaahan pada diferensiasi pembelajaran, pemetaan kesiapan belajar (Indikator 2), karakteristik murid (Indikator 17), dan pemenuhan kebutuhan belajar murid.`;
    } else if (aiConfig?.focus === 'kktp_keselarasan') {
      dynamicPrompt += `\n\nFOKUS PEDAGOGIS KHUSUS: Prioritaskan keselarasan Tujuan Pembelajaran (Indikator 7), Langkah Kegiatan (Indikator 8), serta Asesmen & Rubrik KKTP (Indikator 5, 6, 21).`;
    } else if (aiConfig?.focus === 'deep_learning') {
      dynamicPrompt += `\n\nFOKUS PEDAGOGIS KHUSUS: Prioritaskan 3 Pilar Pembelajaran Mendalam (Indikator 12 Memahami, 13 Mengaplikasi, 14 Merefleksi, serta 15 Saling Memuliakan & 16 Prinsip Deep Learning).`;
    } else if (aiConfig?.focus === 'dimensi_profil') {
      dynamicPrompt += `\n\nFOKUS PEDAGOGIS KHUSUS: Prioritaskan integrasi Dimensi Profil Lulusan pada tujuan dan alur kegiatan belajar (Indikator 4 & 5).`;
    }

    if (aiConfig?.extractQuotes) {
      dynamicPrompt += `\n\nKEWAJIBAN BUKTI AUTENTIK: Pada kolom 'evidence' di setiap indikator, WAJIB sertakan kutipan teks asli dari dokumen (contoh: "Tercantum kutipan: '...'").`;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const preferredModel = (aiConfig?.model as string) || 'gemini-3.8-flash';
    const candidateModels = [
      preferredModel,
      ...(preferredModel !== 'gemini-3.1-flash-lite' ? ['gemini-3.1-flash-lite'] : []),
      ...(preferredModel !== 'gemini-flash-latest' ? ['gemini-flash-latest'] : []),
      'gemini-3.8-flash',
    ].filter((v, i, a) => a.indexOf(v) === i);

    let aiParsedData: any = null;
    let successfulModel = '';
    let lastAiError: any = null;

    for (const modelName of candidateModels) {
      if (aiParsedData) break;
      const startTime = Date.now();
      try {
        console.log(`[${requestId}] STATUS: CALLING_AI | Model: ${modelName}`);
        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: contentsParts,
          config: {
            systemInstruction: dynamicPrompt,
            responseMimeType: 'application/json',
            temperature: 0.1,
            maxOutputTokens: 8192,
          },
        });

        const response = await withTimeout(generatePromise, 28000);
        const duration = Date.now() - startTime;
        const rawOutput = response.text || '';
        const parsed = extractJsonFromText(rawOutput);

        if (parsed && Array.isArray(parsed.indicators) && parsed.indicators.length > 0) {
          aiParsedData = parsed;
          successfulModel = modelName;
          console.log(`[${requestId}] Status: AI_SUCCESS | Model: ${modelName} | Duration: ${duration}ms`);
          break;
        }
      } catch (err: any) {
        lastAiError = err;
        console.warn(`[${requestId}] Status: AI_FAILED | Model: ${modelName} | Error: ${err?.message || err}`);
      }
    }

    if (!aiParsedData) {
      const errMsg = lastAiError?.message || 'Model AI tidak dapat mengembalikan struktur evaluasi yang valid.';
      console.error(`[${requestId}] Status: FATAL_AI_FAILURE | Message: ${errMsg}`);
      res.status(502).json({
        success: false,
        requestId,
        error: `Gagal memproses telaah dokumen dengan Gemini AI: ${errMsg}. Silakan periksa kembali berkas dokumen atau coba beberapa saat lagi.`,
      });
      return;
    }

    // 2. Validate all 22 indicators without artificial score overrides
    const validatedIndicators = normalizeAndValidateIndicators(aiParsedData.indicators);

    // 3. Compute final summary using the single unified calculation function
    const summary = calculateSummary(validatedIndicators);
    const priorities = buildPriorities(validatedIndicators);
    const incompatibleComponents = (
      Array.isArray(aiParsedData.incompatibleComponents)
        ? aiParsedData.incompatibleComponents
        : buildIncompatibilities(validatedIndicators)
    ).map((inc: any) => ({
      indicatorName: purgeProfilPelajarPancasila(inc.indicatorName || ''),
      finding: purgeProfilPelajarPancasila(inc.finding || ''),
      reason: purgeProfilPelajarPancasila(inc.reason || ''),
      recommendation: purgeProfilPelajarPancasila(inc.recommendation || ''),
    }));

    // Diagnostic log of verified calculations (safe, zero PII)
    console.log(
      `[${requestId}] STATUS: CALCULATION | ValidIndicators: ${validatedIndicators.length} | Evaluated: ${summary.evaluatedCount} | NA: ${summary.naCount} | TotalScore: ${summary.totalScore} | Denominator: ${summary.maxPossibleScore} | FinalScore: ${summary.finalScore} | Predicate: ${summary.predicate}`
    );

    // Dynamic identity resolution strictly from document
    const extractedSchool = detectSchoolName(`${extractedDocText || ''} ${safeFileName}`) || aiParsedData.identity?.school;
    const finalSchool = extractedSchool || 'Satuan Pendidikan (Sekolah / Madrasah)';

    let finalTeacher = aiParsedData.identity?.teacherName?.trim();
    if (!finalTeacher || /^(guru|pendidik|guru\s+pengampu|-)$/i.test(finalTeacher)) {
      const teacherMatch = (extractedDocText || '').match(
        /(?:guru|penyusun|pengampu|nama guru|pendidik)\s*[:=]\s*([^\n\r\t]+?)(?=(?:\.\s+[A-Z]|\n|\r|materi|tujuan|sekolah|madrasah|satuan|$))/i
      );
      if (teacherMatch && teacherMatch[1].trim().length > 2) {
        finalTeacher = teacherMatch[1].trim();
      } else {
        finalTeacher = 'Guru Pengampu';
      }
    }

    const rawFeedback = aiParsedData.feedback || {};
    const feedback = {
      strengths: (Array.isArray(rawFeedback.strengths) && rawFeedback.strengths.length > 0
        ? rawFeedback.strengths
        : ['Perencanaan memenuhi struktur kurikulum.']
      ).map((s: string) => purgeProfilPelajarPancasila(s)),
      improvements: (Array.isArray(rawFeedback.improvements) && rawFeedback.improvements.length > 0
        ? rawFeedback.improvements
        : ['Perlu penyempurnaan keselarasan pengalaman belajar.']
      ).map((s: string) => purgeProfilPelajarPancasila(s)),
      practicalRecommendations: (Array.isArray(rawFeedback.practicalRecommendations) && rawFeedback.practicalRecommendations.length > 0
        ? rawFeedback.practicalRecommendations
        : ['Optimalkan tahapan Memahami, Mengaplikasi, dan Merefleksi.']
      ).map((s: string) => purgeProfilPelajarPancasila(s)),
      followUpSteps: (Array.isArray(rawFeedback.followUpSteps) && rawFeedback.followUpSteps.length > 0
        ? rawFeedback.followUpSteps
        : ['Lakukan revisi sesuai rekomendasi sebelum pembelajaran dilaksanakan.']
      ).map((s: string) => purgeProfilPelajarPancasila(s)),
    };

    const finalReportData = {
      identity: {
        teacherName: finalTeacher,
        teacherNip: teacherNip || aiParsedData.identity?.teacherNip || undefined,
        subject: aiParsedData.identity?.subject || 'Mata Pelajaran',
        gradePhase: aiParsedData.identity?.gradePhase || 'Fase / Kelas',
        school: finalSchool,
        title: aiParsedData.identity?.title || safeFileName.replace(/\.[^/.]+$/, ''),
        topic: aiParsedData.identity?.topic || aiParsedData.identity?.title || 'Materi Pokok',
        timeAllocation: aiParsedData.identity?.timeAllocation || '2 JP',
        reviewDate: uploadDate || new Date().toLocaleDateString('id-ID'),
        uploadDate: uploadDate || new Date().toLocaleDateString('id-ID'),
        reviewerName: reviewerName || 'Tim Penelaah Pembelajaran Mendalam',
        reviewerNip: reviewerNip || undefined,
      },
      indicators: validatedIndicators,
      summary,
      priorities,
      incompatibleComponents,
      extraNotes: Array.isArray(aiParsedData.extraNotes) ? aiParsedData.extraNotes : [],
      reviewDescription: purgeProfilPelajarPancasila(
        aiParsedData.reviewDescription || 'Analisis perencanaan pembelajaran telah selesai dilaksanakan.'
      ),
      feedback,
    };

    res.json({
      success: true,
      requestId,
      data: finalReportData,
      fileName: safeFileName,
      engine: `Google Gemini (${successfulModel})`,
    });
  } catch (err: any) {
    console.error(`[${requestId}] Status: SERVER_ERROR | Message: ${err?.message || err}`);
    res.status(500).json({
      success: false,
      requestId,
      error: `Terjadi kendala teknis saat memproses telaah dokumen: ${err?.message || 'Internal server error'}`,
    });
  }
}
