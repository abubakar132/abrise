import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  niche: string;
  situation: string; // 'new-website' | 'existing-website' | 'not-sure'
  challenge: string;
  pricing?: string;
  presence?: { type: string; value: string }[];
  leadSource?: 'website-form' | 'chat-widget';
  timestamp?: string;
}

// ─── GOOGLE SHEETS ──────────────────────────────────────────
async function appendToSheet(lead: LeadData) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.GOOGLE_SHEET_ID) {
    console.warn('Google Sheets not configured — skipping sheet append');
    return;
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const row = [
      lead.timestamp || new Date().toISOString(),
      lead.name,
      lead.email,
      lead.phone || '',
      lead.niche,
      lead.situation,
      lead.challenge,
      lead.pricing || '',
      (lead.presence || []).map((p) => `${p.type}: ${p.value}`).join(' | '),
      lead.leadSource || 'website-form',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Leads!A:J',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });

    console.log('✅ Lead appended to Google Sheet');
  } catch (err) {
    console.error('Google Sheets error:', err);
    // Don't throw — email is more important
  }
}

// ─── EMAIL NOTIFICATION ─────────────────────────────────────
async function sendEmailNotification(lead: LeadData) {
  if (!process.env.EMAIL_FROM || !process.env.EMAIL_APP_PASSWORD || !process.env.EMAIL_TO) {
    console.warn('Email not configured — skipping notification');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const situationLabel: Record<string, string> = {
    'new-website': '🆕 Needs New Website',
    'existing-website': '🔧 Has Existing Website (wants upgrade)',
    'not-sure': '🤔 Not Sure Yet',
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:system-ui,sans-serif;background:#0A0A0B;color:#F2EFE8;padding:32px;">
      <div style="max-width:600px;margin:0 auto;background:#16161A;border:1px solid #2A2A30;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#C9A84C,#8A6218);padding:24px 32px;">
          <h1 style="font-size:1.3rem;margin:0;color:#0A0800;font-weight:800;">🎯 New Lead — Abrise</h1>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;color:#9A9490;font-size:0.85rem;width:140px;vertical-align:top;">Name</td><td style="padding:10px 0;font-weight:600;font-size:0.95rem;">${lead.name}</td></tr>
            <tr><td style="padding:10px 0;color:#9A9490;font-size:0.85rem;vertical-align:top;">Email</td><td style="padding:10px 0;"><a href="mailto:${lead.email}" style="color:#C9A84C;">${lead.email}</a></td></tr>
            ${lead.phone ? `<tr><td style="padding:10px 0;color:#9A9490;font-size:0.85rem;vertical-align:top;">Phone / WhatsApp</td><td style="padding:10px 0;"><a href="https://wa.me/${lead.phone.replace(/\D/g,'')}" style="color:#C9A84C;">${lead.phone}</a></td></tr>` : ''}
            <tr><td style="padding:10px 0;color:#9A9490;font-size:0.85rem;vertical-align:top;">Coaching Niche</td><td style="padding:10px 0;">${lead.niche}</td></tr>
            <tr><td style="padding:10px 0;color:#9A9490;font-size:0.85rem;vertical-align:top;">Website Situation</td><td style="padding:10px 0;">${situationLabel[lead.situation] || lead.situation}</td></tr>
            <tr><td style="padding:10px 0;color:#9A9490;font-size:0.85rem;vertical-align:top;">Biggest Challenge</td><td style="padding:10px 0;">${lead.challenge}</td></tr>
            ${lead.pricing ? `<tr><td style="padding:10px 0;color:#9A9490;font-size:0.85rem;vertical-align:top;">Budget / Pricing Context</td><td style="padding:10px 0;">${lead.pricing}</td></tr>` : ''}
            ${(lead.presence || []).length ? `<tr><td style="padding:10px 0;color:#9A9490;font-size:0.85rem;vertical-align:top;">Current Presence</td><td style="padding:10px 0;">${(lead.presence || []).map((p) => `${p.type}: ${p.value}`).join('<br/>')}</td></tr>` : ''}
            <tr><td style="padding:10px 0;color:#9A9490;font-size:0.85rem;vertical-align:top;">Lead Source</td><td style="padding:10px 0;">${lead.leadSource || 'website-form'}</td></tr>
            <tr><td style="padding:10px 0;color:#9A9490;font-size:0.85rem;vertical-align:top;">Submitted At</td><td style="padding:10px 0;">${new Date(lead.timestamp || Date.now()).toLocaleString()}</td></tr>
          </table>
          <div style="margin-top:28px;padding-top:20px;border-top:1px solid #2A2A30;text-align:center;">
            <a href="mailto:${lead.email}" style="background:linear-gradient(135deg,#C9A84C,#8A6218);color:#0A0800;padding:12px 28px;border-radius:8px;font-weight:700;text-decoration:none;display:inline-block;">Reply to ${lead.name} →</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Abrise Leads" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    subject: `🎯 New Lead: ${lead.name} — ${lead.niche}`,
    html,
  });

  console.log('✅ Email notification sent');
}

// ─── HANDLER ────────────────────────────────────────────────
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const lead: LeadData = {
    ...req.body,
    timestamp: new Date().toISOString(),
  };

  const { name, email, niche, situation, challenge } = lead;
  if (!name || !email || !niche || !situation || !challenge) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await Promise.allSettled([
      appendToSheet(lead),
      sendEmailNotification(lead),
    ]);

    return res.status(200).json({ success: true, message: 'Lead captured successfully' });
  } catch (err) {
    console.error('Lead capture error:', err);
    return res.status(500).json({ error: 'Failed to capture lead' });
  }
}
