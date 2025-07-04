import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required.' }), { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: ['perez122003@gmail.com'],
      reply_to: email,
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
      return new Response(JSON.stringify({ error: 'Error sending email.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Message sent successfully!' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 500 });
  }
}