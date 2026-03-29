import { z } from "zod";

const ALLERGY_OPTIONS = [
  "glutenFree",
  "lactoseFree",
  "vegetarian",
  "vegan",
  "nuts",
  "seafood",
] as const;

const dietaryRestrictionsSchema = z.object({
  glutenFree: z.boolean().default(false),
  lactoseFree: z.boolean().default(false),
  vegetarian: z.boolean().default(false),
  vegan: z.boolean().default(false),
  nuts: z.boolean().default(false),
  seafood: z.boolean().default(false),
  other: z.string().default(""),
});

const DEFAULT_DIETARY_RESTRICTIONS = {
  glutenFree: false,
  lactoseFree: false,
  vegetarian: false,
  vegan: false,
  nuts: false,
  seafood: false,
  other: "",
} as const;

const guestSchema = z.object({
  name: z.string().trim().min(1, "Introduce el nombre del invitado"),
  hasDietaryRestrictions: z.enum(["si", "no"]).nullable().default(null),
  dietaryRestrictions: dietaryRestrictionsSchema.default(DEFAULT_DIETARY_RESTRICTIONS),
});

export const rsvpSchema = z.object({
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
}).superRefine((form, ctx) => {
  if (form.asistira === "no") return;

  form.guests.forEach((guest, index) => {
    if (guest.hasDietaryRestrictions === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Indica si tiene alergias o intolerancias.",
        path: ["guests", index, "hasDietaryRestrictions"],
      });
      return;
    }

    if (guest.hasDietaryRestrictions === "no") return;

    const r = guest.dietaryRestrictions;
    const hasAnyCheckbox =
      r.glutenFree ||
      r.lactoseFree ||
      r.vegetarian ||
      r.vegan ||
      r.nuts ||
      r.seafood;
    const hasOther = r.other.trim().length > 0;

    if (!hasAnyCheckbox && !hasOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Marca una alergia o escribe una restricción en \"Otras alergias\".",
        path: ["guests", index, "dietaryRestrictions"],
      });
    }
  });
});

export type RsvpFormData = z.infer<typeof rsvpSchema>;

export { ALLERGY_OPTIONS };
