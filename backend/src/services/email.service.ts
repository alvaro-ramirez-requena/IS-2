import nodemailer from "nodemailer";

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Verifica tu correo en ReportaYa",
      html: `
        <h2>Verificación de correo</h2>
        <p>Gracias por registrarte en ReportaYa.</p>
        <p>Haz clic en el siguiente enlace para verificar tu correo:</p>
        <a href="${verificationUrl}">Verificar mi correo</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });
  }
}