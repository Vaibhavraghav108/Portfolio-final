import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60_000;
const MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter(t => t > windowStart);
  if (recent.length >= MAX_REQUESTS) return true;
  rateLimitMap.set(ip, [...recent, now]);
  return false;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitize = (s: string): string =>
  s.replace(/[<>"'&]/g, '').slice(0, 5000);

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before sending another message.' },
        { status: 429 }
      );
    }

    const { recruiterEmail, message } = await request.json();

    if (!recruiterEmail || !message || typeof recruiterEmail !== 'string' || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Email and message are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = recruiterEmail.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    const cleanMessage = sanitize(message.trim());

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: cleanEmail,
      subject: `New Job Opportunity from ${cleanEmail} via Neural Terminal`,
      text: `You have received a new message from your portfolio terminal:\n\nRecruiter Email: ${cleanEmail}\n\nMessage:\n${cleanMessage}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
