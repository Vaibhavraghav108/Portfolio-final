import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { recruiterEmail, message } = await request.json();

    if (!recruiterEmail || !message) {
      return NextResponse.json(
        { error: 'Email and message are required.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      replyTo: recruiterEmail, // So you can hit 'reply' and it goes to the recruiter
      subject: `New Job Opportunity from ${recruiterEmail} via Neural Terminal`,
      text: `You have received a new message from your portfolio terminal:\n\nRecruiter Email: ${recruiterEmail}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send message.', details: error.message },
      { status: 500 }
    );
  }
}
