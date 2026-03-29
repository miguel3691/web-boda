import { NextResponse } from "next/server";
import { Resend } from "resend";

// Forzamos Node.js runtime para compatibilidad serverless con SDK de Resend.
export const runtime = "nodejs";
type DietaryRestrictions = {
  alergias?: string[] | null;
  glutenFree?: boolean | null;
  lactoseFree?: boolean | null;
  vegetarian?: boolean | null;
  vegan?: boolean | null;
  nuts?: boolean | null;
  seafood?: boolean | null;
  other?: string | null;
} | null;

type GuestInput = {
  name?: string | null;
  hasDietaryRestrictions?: string | boolean | null;
  dietaryRestrictions?: DietaryRestrictions;
};

type RsvpInput = {
  attendance?: string | null;
  asistira?: string | null; // compatibilidad con payload actual
  email?: string | null;
  guests?: GuestInput[] | null;
  mensaje?: string | null;
  message?: string | null; // compatibilidad por si cambia el cliente
};

type NormalizedGuest = {
  name: string;
  hasDietaryRestrictions: boolean;
  allergies: string[];
  otherRestrictions: string;
};

type NormalizedRsvp = {
  attendance: "yes" | "no";
  contactEmail: string;
  guests: NormalizedGuest[];
  message: string;
};

type NormalizationResult =
  | { ok: true; data: NormalizedRsvp }
  | { ok: false; error: string };

function toAttendance(value: unknown): "yes" | "no" | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (["yes", "si", "sí", "true"].includes(normalized)) return "yes";
  if (["no", "false"].includes(normalized)) return "no";
  return null;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  return ["yes", "si", "sí", "true"].includes(normalized);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePayload(input: RsvpInput): NormalizationResult {
  const attendance = toAttendance(input.attendance ?? input.asistira);
  if (!attendance) {
    return { ok: false, error: "Debes indicar asistencia (attendance)." };
  }

  const guestsRaw = Array.isArray(input.guests) ? input.guests : [];
  if (guestsRaw.length === 0) {
    return { ok: false, error: "Debes indicar al menos un invitado con nombre." };
  }
  if (guestsRaw.length > 6) {
    return { ok: false, error: "El máximo permitido es 6 invitados." };
  }

  const guests = guestsRaw
    .map((guest): NormalizedGuest | null => {
      const name = typeof guest?.name === "string" ? guest.name.trim() : "";
      if (!name) return null;

      const hasDietaryRestrictions =
        attendance === "yes" ? toBoolean(guest?.hasDietaryRestrictions) : false;
      const restrictions = guest?.dietaryRestrictions;
      const allergiesFromArray =
        hasDietaryRestrictions && restrictions && Array.isArray(restrictions.alergias)
          ? restrictions.alergias.filter((item): item is string => typeof item === "string")
          : [];
      const allergiesFromBooleans =
        hasDietaryRestrictions && restrictions
          ? ([
              restrictions.glutenFree ? "Sin gluten / Celíaco" : null,
              restrictions.lactoseFree ? "Sin lactosa" : null,
              restrictions.vegetarian ? "Vegetariano" : null,
              restrictions.vegan ? "Vegano" : null,
              restrictions.nuts ? "Alergia a frutos secos" : null,
              restrictions.seafood ? "Alergia a mariscos" : null,
            ].filter(Boolean) as string[])
          : [];
      const allergies = [...allergiesFromArray, ...allergiesFromBooleans];
      const otherRestrictions =
        hasDietaryRestrictions &&
        restrictions &&
        typeof restrictions.other === "string"
          ? restrictions.other.trim()
          : "";

      return {
        name,
        hasDietaryRestrictions,
        allergies,
        otherRestrictions,
      };
    })
    .filter((guest): guest is NormalizedGuest => guest !== null);

  if (guests.length === 0) {
    return { ok: false, error: "Debes indicar al menos un invitado con nombre." };
  }

  const contactEmail = typeof input.email === "string" ? input.email.trim() : "";
  if (contactEmail && !isValidEmail(contactEmail)) {
    return { ok: false, error: "El email de contacto no es válido." };
  }

  return {
    ok: true,
    data: {
      attendance,
      contactEmail,
      guests,
      message:
        typeof input.mensaje === "string"
          ? input.mensaje.trim()
          : typeof input.message === "string"
            ? input.message.trim()
            : "",
    },
  };
}

function getGuestRestrictionsText(guest: NormalizedGuest, attendance: "yes" | "no"): string {
  if (attendance === "no") return "No aplica (no asistirá)";
  if (!guest.hasDietaryRestrictions) return "Sin restricciones indicadas";
  const optionsText = guest.allergies.join(", ");
  return [optionsText, guest.otherRestrictions].filter(Boolean).join(" | ") || "Sin restricciones indicadas";
}

function getGuestAttendanceLabel(attendance: "yes" | "no"): string {
  return attendance === "yes" ? "Incluido en la confirmación (asistirá)" : "No asistirá";
}

function buildEmailHtml(data: NormalizedRsvp & { sentAt: string }): string {
  const attendanceText = data.attendance === "yes" ? "Sí, asistiré" : "No, no podré asistir";
  const namesSummary = data.guests.map((g) => g.name).join(", ");
  const guestBlocks = data.guests
    .map((guest, index) => {
      const restrictions = getGuestRestrictionsText(guest, data.attendance);
      const guestAttendance = getGuestAttendanceLabel(data.attendance);
      return `
      <div style="border: 1px solid #eee; border-radius: 10px; padding: 12px 14px; margin-top: ${index === 0 ? "0" : "10px"};">
        <p style="margin: 0 0 6px; font-weight: 600; color: #5c3d4a;">Invitado ${index + 1}: ${escapeHtml(guest.name)}</p>
        <p style="margin: 0 0 4px;"><strong>Estado:</strong> ${escapeHtml(guestAttendance)}</p>
        <p style="margin: 0;"><strong>Alergias / restricciones:</strong> ${escapeHtml(restrictions)}</p>
      </div>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Nueva confirmación RSVP</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #5c3d4a; font-size: 1.5rem;">Nueva confirmación de asistencia</h1>
  <p style="margin-top: 8px; color: #666;">Enviado el ${data.sentAt}</p>
  <div style="margin-top: 20px; border: 1px solid #eee; border-radius: 10px; padding: 14px;">
    <p style="margin: 0 0 8px;"><strong>Estado de asistencia:</strong> ${attendanceText}</p>
    <p style="margin: 0 0 8px;"><strong>Email de contacto:</strong> ${data.contactEmail ? escapeHtml(data.contactEmail) : "—"}</p>
    <p style="margin: 0 0 8px;"><strong>Número total de invitados:</strong> ${data.guests.length}</p>
    <p style="margin: 0;"><strong>Lista de invitados:</strong> ${escapeHtml(namesSummary)}</p>
  </div>
  <h2 style="margin-top: 24px; margin-bottom: 10px; color: #5c3d4a; font-size: 1.1rem;">Invitados</h2>
  ${guestBlocks}
  ${data.message ? `<div style="margin-top: 24px;"><p style="margin: 0 0 8px;"><strong>Mensaje para los novios:</strong></p><p style="white-space: pre-wrap; background: #faf8f6; padding: 12px; border-radius: 8px; margin: 0;">${escapeHtml(data.message)}</p></div>` : ""}
  <p style="margin-top: 20px; color: #666; font-size: 12px;">Fecha/hora de envío: ${data.sentAt}</p>
</body>
</html>
  `.trim();
}

function buildEmailText(data: NormalizedRsvp & { sentAt: string }): string {
  const attendanceText = data.attendance === "yes" ? "Sí, asistiré" : "No, no podré asistir";
  const namesSummary = data.guests.map((g) => g.name).join(", ");
  const guestLines = data.guests.map((guest, index) => {
    const restrictions = getGuestRestrictionsText(guest, data.attendance);
    const guestAttendance = getGuestAttendanceLabel(data.attendance);
    return [
      `Invitado ${index + 1}: ${guest.name}`,
      `  Estado: ${guestAttendance}`,
      `  Alergias / restricciones: ${restrictions}`,
    ].join("\n");
  });

  const lines = [
    "Nueva confirmación de asistencia",
    `Enviado el ${data.sentAt}`,
    "",
    `Asistencia: ${attendanceText}`,
    `Email de contacto: ${data.contactEmail || "—"}`,
    `Total de invitados: ${data.guests.length}`,
    `Lista de invitados: ${namesSummary}`,
    "",
    "Invitados:",
    ...guestLines,
  ];
  if (data.message) {
    lines.push("", "Mensaje para los novios:", data.message);
  }
  lines.push("", `Fecha/hora de envío: ${data.sentAt}`);
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
  const apiKey = process.env.RESEND_API_KEY;
  // Destinatario final de confirmaciones RSVP.
  const toEmail = process.env.RSVP_TO_EMAIL || "molina.miguel369@gmail.com";
  // Remitente verificado en Resend (obligatorio en producción).
  const fromEmail = process.env.RSVP_FROM_EMAIL;

  if (!apiKey) {
    console.error("[RSVP] RESEND_API_KEY no está configurada");
    return NextResponse.json(
      { error: "El servicio de envío no está configurado" },
      { status: 500 }
    );
  }
  if (!fromEmail) {
    console.error("[RSVP] RSVP_FROM_EMAIL no está configurada");
    return NextResponse.json(
      { error: "El remitente de RSVP no está configurado" },
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

  const normalized = normalizePayload((body ?? {}) as RsvpInput);
  if (!normalized.ok) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }
  const payload = normalized.data;

  const sentAt = new Date().toLocaleString("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const resend = new Resend(apiKey);
  const html = buildEmailHtml({
    ...payload,
    sentAt,
  });
  const text = buildEmailText({
    ...payload,
    sentAt,
  });
  const leadGuest = payload.guests[0]?.name ?? "Invitado";

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    subject: `RSVP: ${leadGuest} (+${Math.max(payload.guests.length - 1, 0)}) - ${payload.attendance === "yes" ? "Asistirá" : "No asistirá"}`,
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

  return NextResponse.json({ ok: true });
}
