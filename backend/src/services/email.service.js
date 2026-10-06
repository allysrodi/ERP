import { Resend } from 'resend';
import { AppError } from '../utils/appError.js';
import { env } from '../config/env.js';

const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

export async function sendPasswordResetEmail({ email, token }) {
  if (!resend) {
    throw new AppError('Recuperacion por correo no configurada', 503);
  }

  const url = new URL(env.PASSWORD_RESET_URL);
  url.searchParams.set('token', token);
  const resetUrl = url.toString().replaceAll('&', '&amp;').replaceAll('\"', '&quot;');

  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: [email],
    subject: 'Recupera tu contraseña de KIT-LI ERP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>KIT-LI ERP</h2>

        <p>Recibimos una solicitud para restablecer tu contraseña.</p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #E2482F;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Restablecer contraseña
          </a>
        </p>

        <p>Este enlace expira en 15 minutos.</p>

        <p>
          Si no solicitaste este cambio, puedes ignorar este correo.
        </p>
      </div>
    `
  });

  if (error) {
    console.error('Error al enviar correo con Resend:', error);
    throw new Error('No fue posible enviar el correo de recuperacion');
  }

  return data;
}