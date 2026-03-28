/**
 * POST /api/rsvp
 *
 * Recibe el formulario RSVP, valida los datos y envía un correo a los novios
 * usando Resend.
 *
 * Configuración necesaria:
 * - RESEND_API_KEY: API key de Resend (https://resend.com/api-keys).
 * - FROM_EMAIL (opcional): Remitente del correo. Si no se define, se usa
 *   "Boda <onboarding@resend.dev>" (dominio de prueba de Resend; solo permite
 *   enviar a la cuenta con la que te registraste). Para producción, verifica
 *   tu dominio en https://resend.com/domains y usa ej. "Boda <rsvp@tudominio.com>".
 *
 * Probar en local:
 * 1. Crea cuenta en Resend y obtén RESEND_API_KEY.
 * 2. Añade en .env.local: RESEND_API_KEY=re_xxxx
 * 3. Con el dominio de prueba (onboarding@resend.dev), Resend solo envía a
 *    el email de tu cuenta; para recibir en molina.miguel369@gmail.com,
 *    verifica un dominio o usa ese email como cuenta en Resend.
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rsvpSchema, ALLERGY_OPTIONS, type RsvpFormData } from "@/lib/rsvp-schema";
import { rsvpEmailTo } from "@/config/wedding";

const ALLERGY_LABELS: Record<(typeof ALLERGY_OPTIONS)[number], string> = {
  sin_gluten: "Sin gluten / Celíaco",
  sin_lactosa: "Sin lactosa",
  vegetariano: "Vegetariano",
  vegano: "Vegano",
  alergia_frutos_secos: "Alergia a frutos secos",
  alergia_mariscos: "Alergia a mariscos",
};

function getGuestRestrictionsText(guest: RsvpFormData["guests"][number]): string {
  if (guest.hasDietaryRestrictions !== "si" || !guest.dietaryRestrictions) {
    return "Ninguna";
  }
  const allergies = guest.dietaryRestrictions.alergias ?? [];
  const optionsText =
    allergies.length > 0
      ? allergies.map((k) => ALLERGY_LABELS[k as keyof typeof ALLERGY_LABELS]).join(", ")
      : "";
  const otherText = guest.dietaryRestrictions.other?.trim() ?? "";
  return [optionsText, otherText].filter(Boolean).join(" | ") || "No especificadas";
}

function buildEmailHtml(data: RsvpFormData & { sentAt: string }): string {
  const asistenciaText = data.asistira === "si" ? "Sí asistirá" : "No podrá asistir";
  const guestsRows = data.guests
    .map((guest, idx) => {
      const guestName = guest.name || `Invitado ${idx + 1}`;
      const restrictions = getGuestRestrictionsText(guest);
      return `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${escapeHtml(guestName)}</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(restrictions)}</td></tr>`;
    })
    .join("");
  const namesSummary = data.guests.map((g) => g.name).join(", ");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Nueva confirmación RSVP</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #5c3d4a; font-size: 1.5rem;">Nueva confirmación de asistencia</h1>
  <p style="margin-top: 8px; color: #666;">Enviado el ${data.sentAt}</p>
  <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Invitados</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(namesSummary)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.email ? escapeHtml(data.email) : "—"}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>¿Asistirá?</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${asistenciaText}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Número de invitados</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.guests.length}</td></tr>
  </table>
  <h2 style="margin-top: 24px; color: #5c3d4a; font-size: 1.1rem;">Alergias por invitado</h2>
  <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
    ${guestsRows}
  </table>
  ${data.mensaje ? `<p style="margin-top: 24px;"><strong>Mensaje para los novios:</strong></p><p style="white-space: pre-wrap; background: #faf8f6; padding: 12px; border-radius: 8px;">${escapeHtml(data.mensaje)}</p>` : ""}
</body>
</html>
  `.trim();
}

function buildEmailText(data: RsvpFormData & { sentAt: string }): string {
  const asistenciaText = data.asistira === "si" ? "Sí asistirá" : "No podrá asistir";
  const namesSummary = data.guests.map((g) => g.name).join(", ");
  const guestLines = data.guests.map((guest, idx) => {
    const guestName = guest.name || `Invitado ${idx + 1}`;
    const restrictions = getGuestRestrictionsText(guest);
    return `- ${guestName}: ${restrictions}`;
  });

  const lines = [
    `Nueva confirmación de asistencia`,
    `Enviado el ${data.sentAt}`,
    "",
    `Invitados: ${namesSummary}`,
    `Email: ${data.email ?? "—"}`,
    `¿Asistirá?: ${asistenciaText}`,
    `Número de invitados: ${data.guests.length}`,
    "",
    "Alergias por invitado:",
    ...guestLines,
  ];
  if (data.mensaje) {
    lines.push("", "Mensaje para los novios:", data.mensaje);
  }
  return lines.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[RSVP] RESEND_API_KEY no está configurada");
    return NextResponse.json(
      { error: "El servicio de envío no está configurado" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la petición inválido (JSON esperado)" },
      { status: 400 }
    );
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message = Object.values(first).flat().join(" ") || "Datos inválidos";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const data = parsed.data;
  const sentAt = new Date().toLocaleString("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const fromEmail =
    process.env.FROM_EMAIL || "Boda <onboarding@resend.dev>";

  const resend = new Resend(apiKey);
  const html = buildEmailHtml({
    ...data,
    sentAt,
  });
  const text = buildEmailText({
    ...data,
    sentAt,
  });
  const leadGuest = data.guests[0]?.name ?? "Invitado";

  const { data: sendData, error } = await resend.emails.send({
    from: fromEmail,
    to: [rsvpEmailTo],
    subject: `RSVP: ${leadGuest} (+${Math.max(data.guests.length - 1, 0)}) - ${data.asistira === "si" ? "Asistirá" : "No asistirá"}`,
    html,
    text,
  });

  if (error) {
    console.error("[RSVP] Error Resend:", error);
    return NextResponse.json(
      { error: "No se pudo enviar la confirmación. Inténtalo de nuevo en unos minutos." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: sendData?.id });
}
