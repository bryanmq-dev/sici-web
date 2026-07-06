import nodemailer from 'nodemailer';

// ponytail: sin retry/cola — si el SMTP falla, se loguea y se sigue; no revertimos la
// aprobación/rechazo por un correo caído. Revisar logs si un usuario dice no haber recibido nada.
export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.warn(`[mail] SMTP no configurado — no se envió "${subject}" a ${to}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  try {
    await transporter.sendMail({ from: SMTP_USER, to, subject, html });
  } catch (err) {
    console.error(`[mail] Error enviando "${subject}" a ${to}:`, err);
  }
}

export function approvalEmailHtml(name: string, loginUrl: string) {
  return `<p>Hola ${name},</p>
<p>Tu solicitud de ingreso a la SICI fue <strong>aprobada</strong>. Ya puedes iniciar sesión con el correo y contraseña que registraste.</p>
<p><a href="${loginUrl}">Iniciar sesión</a></p>`;
}

export function rejectionEmailHtml(name: string, reason: string) {
  return `<p>Hola ${name},</p>
<p>Tu solicitud de ingreso a la SICI fue <strong>rechazada</strong> por el siguiente motivo:</p>
<p>${reason}</p>`;
}
