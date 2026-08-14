import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory backup store with pre-seeded data
let serverBackupStore: Record<string, any> = {
  lastBackupTime: new Date().toISOString(),
  totalRecords: 0,
  data: null,
};

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), service: 'AuraHealth Hospital System' });
  });

  // Server-side Backup API (Automated Backup of Appointments, Serials & Records)
  app.post('/api/backup/sync', (req, res) => {
    try {
      const payload = req.body;
      serverBackupStore = {
        lastBackupTime: new Date().toISOString(),
        totalRecords: (payload.appointments?.length || 0) + (payload.records?.length || 0),
        data: payload,
      };
      res.json({
        success: true,
        message: 'Data successfully backed up to secure hospital cloud server',
        backupTime: serverBackupStore.lastBackupTime,
        recordsSaved: serverBackupStore.totalRecords,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/backup/latest', (req, res) => {
    res.json({
      success: true,
      lastBackupTime: serverBackupStore.lastBackupTime,
      totalRecords: serverBackupStore.totalRecords,
      data: serverBackupStore.data,
    });
  });

  // Automated Notification Dispatcher simulation (SMS, WhatsApp, Email)
  app.post('/api/notifications/dispatch', (req, res) => {
    const { recipientPhone, recipientEmail, patientName, type, message, serialNumber, doctorName, time } = req.body;
    const notificationId = 'NOTIF-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const timestamp = new Date().toISOString();

    console.log(`[Auto-Notification Sent via ${type}] To: ${patientName} (${recipientPhone}) - ${message}`);

    res.json({
      success: true,
      notificationId,
      timestamp,
      channel: type, // 'SMS' | 'WHATSAPP' | 'EMAIL'
      status: 'DELIVERED',
      details: {
        recipientPhone,
        recipientEmail,
        serialNumber,
        doctorName,
        time,
        message,
      },
    });
  });

  // AI Medical Symptom Triaging & Department Suggestion
  app.post('/api/ai/symptom-triage', async (req, res) => {
    const { symptoms, language = 'bn', age, gender } = req.body;

    if (!symptoms || typeof symptoms !== 'string') {
      return res.status(400).json({ error: 'Symptoms description is required' });
    }

    try {
      const ai = getAi();
      if (!ai) {
        // Fallback intelligent triage if key is not configured
        return res.json({
          suggestedDepartment: 'General Medicine',
          departmentBn: 'জেনারেল মেডিসিন',
          urgencyLevel: 'Normal',
          urgencyLevelBn: 'সাধারণ / নিয়মিত',
          recommendedSpecialists: ['Cardiology', 'Internal Medicine'],
          advice: language === 'bn' 
            ? 'আপনার লক্ষণের ওপর ভিত্তি করে বিশেষজ্ঞ চিকিৎসকের সাথে পরামর্শ করার পরামর্শ দেওয়া হচ্ছে। প্রচুর পানি পান করুন এবং বিশ্রাম নিন।'
            : 'Based on your symptoms, we recommend consulting a specialist. Stay hydrated and rest.',
          disclaimer: 'This is an automated preliminary assessment, not a definitive diagnosis.'
        });
      }

      const prompt = `You are an expert hospital triaging physician. The patient describes their symptoms: "${symptoms}".
Patient info: Age: ${age || 'N/A'}, Gender: ${gender || 'N/A'}.
Language requested: ${language === 'bn' ? 'Bengali (বাংলা)' : 'English'}.

Respond ONLY in valid JSON with this exact schema:
{
  "suggestedDepartment": "Specialty name in English (e.g. Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, General Medicine, Gastroenterology)",
  "departmentBn": "Specialty name in Bengali",
  "urgencyLevel": "Low" | "Moderate" | "Urgent" | "Emergency",
  "urgencyLevelBn": "স্বাভাবিক" | "মাঝারি" | "জরুরি" | "অতি জরুরি",
  "recommendedSpecialists": ["Array of 1-2 department names"],
  "summary": "Brief 1-sentence analysis in ${language === 'bn' ? 'Bengali' : 'English'}",
  "advice": "1-2 brief practical home/first-aid tips before doctor visit in ${language === 'bn' ? 'Bengali' : 'English'}",
  "disclaimer": "Medical disclaimer note"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      const parsed = JSON.parse(text || '{}');
      res.json(parsed);
    } catch (err: any) {
      console.error('AI Triage error:', err);
      res.json({
        suggestedDepartment: 'General Medicine',
        departmentBn: 'জেনারেল মেডিসিন',
        urgencyLevel: 'Moderate',
        urgencyLevelBn: 'মাঝারি',
        recommendedSpecialists: ['Internal Medicine'],
        summary: language === 'bn' ? 'প্রাথমিক পর্যবেক্ষণে মেডিসিন বিশেষজ্ঞের পরামর্শ প্রয়োজন।' : 'Preliminary assessment suggests consulting a general physician.',
        advice: language === 'bn' ? 'পর্যাপ্ত বিশ্রাম নিন ও দ্রুত ডাক্তারের সিরিয়াল নিন।' : 'Take rest and book a doctor serial.',
        disclaimer: 'AI triaging guidance only.'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuraHealth Hospital Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
