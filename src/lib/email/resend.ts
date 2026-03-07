import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM    = process.env.EMAIL_FROM     ?? 'Viconia Care <onboarding@resend.dev>'
const REPLY   = process.env.EMAIL_REPLY_TO ?? 'info@rettungsanker-freiburg.de'

// ── Branded HTML base template ────────────────────────────────────────────────
function baseTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:'Lato',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0d9488,#0f766e);padding:32px 40px;">
            <table width="100%"><tr>
              <td><span style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.02em;">
                Pflege<span style="color:#fb923c;">Plus</span>
              </span></td>
              <td align="right"><span style="font-size:28px;">🫀</span></td>
            </tr></table>
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:40px;">${body}</td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f5f5f4;padding:24px 40px;border-top:1px solid #e7e5e4;">
            <p style="margin:0;font-size:12px;color:#78716c;line-height:1.6;">
              ViconiaCare GmbH · Weidestr. 120 b · 22083 Hamburg<br>
              <a href="tel:+4940123456789" style="color:#0d9488;">+49 40 123 456 789</a> ·
              <a href="mailto:info@rettungsanker-freiburg.de" style="color:#0d9488;">info@rettungsanker-freiburg.de</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── Email helpers ─────────────────────────────────────────────────────────────
function h1(text: string) {
  return `<h1 style="margin:0 0 16px;font-size:26px;font-weight:900;color:#042f2e;font-family:Georgia,serif;">${text}</h1>`
}
function p(text: string) {
  return `<p style="margin:0 0 14px;font-size:15px;color:#44403c;line-height:1.7;">${text}</p>`
}
function highlight(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f766e;width:140px;">${label}</td>
    <td style="padding:10px 16px;font-size:15px;color:#1c1917;font-weight:600;">${value}</td>
  </tr>`
}
function infoBox(rows: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0"
    style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:16px;margin:20px 0;">${rows}</table>`
}
function btn(text: string, href: string) {
  return `<a href="${href}" style="display:inline-block;margin-top:24px;padding:14px 32px;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;font-size:15px;font-weight:700;text-decoration:none;border-radius:100px;letter-spacing:0.04em;">${text}</a>`
}

// ── Appointment type labels ───────────────────────────────────────────────────
const appointmentLabels: Record<string, Record<string, string>> = {
  de: { info: 'Info-Telefonat', eval: 'Bedarfsanalyse', visit: 'Hausbesuch' },
  en: { info: 'Info call',       eval: 'Needs assessment', visit: 'Home visit' },
  it: { info: 'Telefonata info', eval: 'Analisi bisogni',  visit: 'Visita domiciliare' },
  es: { info: 'Llamada info',    eval: 'Análisis necesidades', visit: 'Visita domicilio' },
  pt: { info: 'Ligação info',    eval: 'Análise necessidades', visit: 'Visita domiciliar' },
  tr: { info: 'Bilgi Görüşmesi', eval: 'İhtiyaç Analizi', visit: 'Ev Ziyareti' },
}

// ── Email functions ───────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, firstName: string) {
  const body = [
    h1(`Willkommen, ${firstName}! 👋`),
    p('Wir freuen uns, Sie bei Viconia Care begrüßen zu dürfen.'),
    p('In Ihrem persönlichen Bereich können Sie Ihre Dokumente einsehen, Termine verwalten und Ihren Pflegeplan verfolgen.'),
    btn('Jetzt anmelden', `${process.env.NEXT_PUBLIC_SITE_URL}/de/login`),
  ].join('')

  return resend.emails.send({
    from: FROM, reply_to: REPLY, to,
    subject: `Willkommen bei Viconia Care, ${firstName}!`,
    html: baseTemplate('Willkommen', body),
  })
}

export async function sendAppointmentConfirmation({
  to, firstName, appointmentType, date, time, locale = 'de',
}: {
  to: string; firstName: string
  appointmentType: 'info' | 'eval' | 'visit'
  date: string; time: string; locale?: string
}) {
  const typeLabel = appointmentLabels[locale]?.[appointmentType]
                 ?? appointmentLabels.de[appointmentType]

  const body = [
    h1(`Ihr Termin ist bestätigt! ✅`),
    p(`Hallo ${firstName},`),
    p('Wir haben Ihre Buchung erhalten und freuen uns auf das Gespräch:'),
    infoBox([
      highlight('Art', typeLabel),
      highlight('Datum', date),
      highlight('Uhrzeit', time),
    ].join('')),
    p('Sollten Sie den Termin absagen oder verschieben müssen, können Sie dies bis 24 Stunden vorher kostenfrei tun.'),
    p('Bei Fragen erreichen Sie uns jederzeit unter <a href="tel:+4940123456789" style="color:#0d9488;">+49 40 123 456 789</a>.'),
    btn('Termin verwalten', `${process.env.NEXT_PUBLIC_SITE_URL}/de/buchung`),
  ].join('')

  return resend.emails.send({
    from: FROM, reply_to: REPLY, to,
    subject: `Terminbestätigung: ${typeLabel} – Viconia Care`,
    html: baseTemplate('Terminbestätigung', body),
  })
}

export async function sendPasswordResetEmail(to: string, firstName: string, resetLink: string) {
  const body = [
    h1('Passwort zurücksetzen 🔑'),
    p(`Hallo ${firstName},`),
    p('Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt. Klicken Sie auf den folgenden Button:'),
    btn('Passwort zurücksetzen', resetLink),
    p('<span style="color:#78716c;font-size:13px;">Dieser Link ist 1 Stunde gültig. Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.</span>'),
  ].join('')

  return resend.emails.send({
    from: FROM, reply_to: REPLY, to,
    subject: 'Passwort zurücksetzen – Viconia Care',
    html: baseTemplate('Passwort zurücksetzen', body),
  })
}

export default resend
