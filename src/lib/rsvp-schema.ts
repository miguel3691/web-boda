import { z } from "zod";

const ALLERGY_OPTIONS = [
  "sin_gluten",
  "sin_lactosa",
  "vegetariano",
  "vegano",
  "alergia_frutos_secos",
  "alergia_mariscos",
] as const;

const guestSchema = z.object({
  name: z.string().trim().min(1, "Introduce el nombre del invitado"),
  hasDietaryRestrictions: z.enum(["si", "no"], {
    message: "Indica si tiene alergias o intolerancias",
  }),
  dietaryRestrictions: z
    .object({
      alergias: z.array(z.enum(ALLERGY_OPTIONS)).default([]),
      other: z.string().optional(),
    })
    .nullable(),
});

export const rsvpSchema = z
  .object({
    email: z
      .string()
      .optional()
      .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Email no válido"),
    asistira: z.enum(["si", "no"], { message: "Indica si asistirás" }),
    guests: z
      .array(guestSchema)
      .min(1, "Debe haber al menos un invitado")
      .max(6, "Máximo 6 invitados"),
    mensaje: z.string().optional(),
  })
  .superRefine((form, ctx) => {
    if (form.asistira !== "si") return;

    form.guests.forEach((guest, index) => {
      if (guest.hasDietaryRestrictions !== "si") return;
      const restrictions = guest.dietaryRestrictions;
      const hasAnyAllergy = (restrictions?.alergias?.length ?? 0) > 0;
      const hasOther = (restrictions?.other?.trim()?.length ?? 0) > 0;
      if (!hasAnyAllergy && !hasOther) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecciona al menos una restricción o indica otra.",
          path: ["guests", index, "dietaryRestrictions"],
        });
      }
    });
  });

export type RsvpFormData = z.infer<typeof rsvpSchema>;

export { ALLERGY_OPTIONS };
