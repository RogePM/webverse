// File: /backend/api/send-email.js
// This is a Vercel Serverless Function using Node.js.
// It will handle your contact form submissions.

// You'll need to install the 'resend' package in your backend directory.
// In your /backend/ folder, run: npm install resend

import { Resend } from 'resend';

// Initialize Resend with the API key from your Vercel environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // We only want to handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // This is a required field by Resend. It can be a generic address.
      to: ['perez122003@gmail.com'], // <<-- IMPORTANT: REPLACE THIS with your actual email address
      reply_to: email, // Set the reply-to to the user's email address
      subject: `New Message from ${name} on Web Verse`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error({ error });
      return res.status(500).json({ error: 'Error sending email.' });
    }

    // Send a success response
    return res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
}
