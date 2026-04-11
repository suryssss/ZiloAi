import nodemailer from 'nodemailer'

async function testEmail() {
    console.log("Checking credentials in .env via bun...");
    console.log("Email:", process.env.NODE_MAILER_EMAIL);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.NODE_MAILER_EMAIL,
          pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.NODE_MAILER_EMAIL,
            to: process.env.NODE_MAILER_EMAIL, // sending to yourself for testing
            subject: 'Test Realtime Support Email',
            text: 'This is a test verifying that the nodemailer configuration is working.',
        });
        console.log("✅ Email sent successfully! Message ID:", info.messageId);
    } catch (err) {
        console.error("❌ Failed to send email:", err);
    }
}

testEmail();
