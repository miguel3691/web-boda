"use client";

import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useInView } from "framer-motion";
import { Send, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { rsvpSchema, type RsvpFormData, ALLERGY_OPTIONS } from "@/lib/rsvp-schema";
import { rsvpTexts } from "@/config/wedding";

type SubmitStatus = "idle" | "loading" | "success" | "error";
type AttendanceValue = RsvpFormData["asistira"] | null;

const ALLERGY_LABELS: Record<(typeof ALLERGY_OPTIONS)[number], string> = {
  sin_gluten: "Sin gluten / Celíaco",
  sin_lactosa: "Sin lactosa",
  vegetariano: "Vegetariano",
  vegano: "Vegano",
  alergia_frutos_secos: "Alergia a frutos secos",
  alergia_mariscos: "Alergia a mariscos",
};

const inputBase =
  "w-full rounded-md border bg-[var(--background-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)]/50 focus:border-[var(--accent-rose)] transition-colors";
const inputBorder = "border-[var(--border-soft)]";

export function RSVPSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(formRef, { once: true, margin: "-40px 0px -40px 0px" });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmittedAttendance, setLastSubmittedAttendance] = useState<AttendanceValue>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema) as Resolver<RsvpFormData>,
    shouldUnregister: true,
    defaultValues: {
      email: "",
      asistira: undefined,
      guests: [
        {
          name: "",
          hasDietaryRestrictions: "no",
          dietaryRestrictions: null,
        },
      ],
      mensaje: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "guests",
  });
  const guests = useWatch({ control, name: "guests" }) ?? [];
  const attendance = useWatch({ control, name: "asistira" });
  const shouldShowDietary = attendance === "si";

  useEffect(() => {
    if (attendance !== "no") return;
    guests.forEach((_, index) => {
      setValue(`guests.${index}.hasDietaryRestrictions`, "no", { shouldValidate: false });
      setValue(`guests.${index}.dietaryRestrictions`, null, { shouldValidate: false });
    });
  }, [attendance, guests.length, setValue]);

  const isSending = submitStatus === "loading";

  const onSubmit = async (data: RsvpFormData) => {
    setSubmitStatus("loading");
    setSubmitError(null);
    try {
      const cleanedGuests = data.guests.map((guest) => {
        const name = guest.name.trim();
        const hasDietaryRestrictions =
          data.asistira === "si" ? guest.hasDietaryRestrictions : "no";
        if (hasDietaryRestrictions === "no") {
          return {
            name,
            hasDietaryRestrictions: "no" as const,
            dietaryRestrictions: null,
          };
        }
        return {
          name,
          hasDietaryRestrictions: "si" as const,
          dietaryRestrictions: {
            alergias: guest.dietaryRestrictions?.alergias ?? [],
            other: guest.dietaryRestrictions?.other?.trim() ?? "",
          },
        };
      });

      // Payload normalizado para la API real de RSVP.
      const payload = {
        attendance: data.asistira,
        email: data.email,
        guests: cleanedGuests,
        message: data.mensaje,
        // Compatibilidad con el shape actual del formulario.
        asistira: data.asistira,
        mensaje: data.mensaje,
      };

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitStatus("error");
        setSubmitError(json?.error ?? "Algo ha fallado. Inténtalo de nuevo.");
        return;
      }
      setLastSubmittedAttendance(data.asistira);
      setSubmitStatus("success");
      reset();
    } catch {
      setSubmitStatus("error");
      setSubmitError("Error de conexión. Revisa tu red e inténtalo de nuevo.");
    }
  };

  return (
    <section id="rsvp" className="section-padding">
      <div className="section-content">
        <p className="section-kicker">RSVP</p>
        <h2
          className="section-title-script mt-2"
          style={{ fontFamily: "var(--font-script)" }}
        >
          {rsvpTexts.sectionTitle}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {rsvpTexts.sectionSubtitle}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-10 md:mt-12"
        >
          <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className="rsvp-form-card mx-auto w-full max-w-lg rounded-lg border border-[var(--border-soft)] bg-[var(--background-card)] p-4 text-left shadow-[var(--shadow-soft)] sm:p-6 md:p-8"
          >
            <div className="space-y-5 sm:space-y-6">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--text-primary)]">
                  {rsvpTexts.emailLabel}
                </label>
                <input
                  type="email"
                  placeholder={rsvpTexts.emailPlaceholder}
                  className={`${inputBase} ${inputBorder} h-12`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="rsvp-error text-xs text-[var(--text-muted)]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* ¿Asistirás? */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[var(--text-primary)]">
                  {rsvpTexts.willAttendLabel} <span className="text-[var(--accent-rose)]">*</span>
                </label>
                <div className="flex flex-wrap gap-6">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      value="si"
                      className="peer sr-only"
                      {...register("asistira")}
                    />
                    <span className="h-4 w-4 shrink-0 rounded-full border-2 border-[var(--border-soft)] transition-colors peer-checked:border-[var(--text-primary)] peer-checked:bg-[var(--text-primary)]" />
                    <span className="text-sm text-[var(--text-primary)]">
                      {rsvpTexts.willAttendYes}
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      value="no"
                      className="peer sr-only"
                      {...register("asistira")}
                    />
                    <span className="h-4 w-4 shrink-0 rounded-full border-2 border-[var(--border-soft)] transition-colors peer-checked:border-[var(--text-primary)] peer-checked:bg-[var(--text-primary)]" />
                    <span className="text-sm text-[var(--text-primary)]">
                      {rsvpTexts.willAttendNo}
                    </span>
                  </label>
                </div>
                {errors.asistira && (
                  <p className="rsvp-error text-xs text-[var(--text-muted)]">
                    {errors.asistira.message}
                  </p>
                )}
              </div>

              {/* Invitados dinámicos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-[var(--text-primary)]">
                    {rsvpTexts.guestsLabel} <span className="text-[var(--accent-rose)]">*</span>
                  </label>
                  <span className="text-xs text-[var(--text-muted)]">
                    {guests.length}/6
                  </span>
                </div>
                {fields.map((field, index) => {
                  const guest = guests[index];
                  const hasRestrictions = guest?.hasDietaryRestrictions === "si";
                  const guestName = guest?.name?.trim();
                  const dietaryQuestion = guestName
                    ? `${rsvpTexts.dietaryQuestionPrefix}${guestName}${rsvpTexts.dietaryQuestionSuffix}`
                    : rsvpTexts.dietaryQuestionFallback;

                  return (
                    <div
                      key={field.id}
                      className="rounded-md border border-[var(--border-soft)]/70 bg-[var(--background-card)] p-3 sm:p-4 space-y-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-end gap-3">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-xs text-[var(--text-muted)] underline underline-offset-2 hover:text-[var(--text-primary)] transition-colors"
                            >
                              {rsvpTexts.removeGuestButton}
                            </button>
                          )}
                        </div>
                        <label className="block text-sm font-medium text-[var(--text-primary)]">
                          {rsvpTexts.guestNameLabel} <span className="text-[var(--accent-rose)]">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder={rsvpTexts.guestNamePlaceholder}
                          className={`${inputBase} ${inputBorder} h-12`}
                          {...register(`guests.${index}.name`)}
                        />
                        {errors.guests?.[index]?.name && (
                          <p className="rsvp-error text-xs text-[var(--text-muted)]">
                            {errors.guests[index]?.name?.message}
                          </p>
                        )}
                      </div>

                      {shouldShowDietary && (
                        <>
                          <div className="space-y-3">
                            <div className="flex items-start gap-2">
                              <AlertTriangle
                                className="h-4 w-4 shrink-0 text-[var(--text-primary)] mt-0.5"
                                strokeWidth={1.8}
                                aria-hidden
                              />
                              <label className="block text-sm font-medium text-[var(--text-primary)]">
                                {dietaryQuestion}
                              </label>
                            </div>
                            <div className="flex flex-wrap gap-6">
                              <label className="flex cursor-pointer items-center gap-2">
                                <input
                                  type="radio"
                                  value="si"
                                  className="peer sr-only"
                                  {...register(`guests.${index}.hasDietaryRestrictions`, {
                                    onChange: () =>
                                      setValue(`guests.${index}.dietaryRestrictions`, {
                                        alergias: [],
                                        other: "",
                                      }),
                                  })}
                                />
                                <span className="h-4 w-4 shrink-0 rounded-full border-2 border-[var(--border-soft)] transition-colors peer-checked:border-[var(--text-primary)] peer-checked:bg-[var(--text-primary)]" />
                                <span className="text-sm text-[var(--text-primary)]">
                                  {rsvpTexts.dietaryYes}
                                </span>
                              </label>
                              <label className="flex cursor-pointer items-center gap-2">
                                <input
                                  type="radio"
                                  value="no"
                                  className="peer sr-only"
                                  {...register(`guests.${index}.hasDietaryRestrictions`, {
                                    onChange: () =>
                                      setValue(`guests.${index}.dietaryRestrictions`, null),
                                  })}
                                />
                                <span className="h-4 w-4 shrink-0 rounded-full border-2 border-[var(--border-soft)] transition-colors peer-checked:border-[var(--text-primary)] peer-checked:bg-[var(--text-primary)]" />
                                <span className="text-sm text-[var(--text-primary)]">
                                  {rsvpTexts.dietaryNo}
                                </span>
                              </label>
                            </div>
                            {errors.guests?.[index]?.hasDietaryRestrictions && (
                              <p className="rsvp-error text-xs text-[var(--text-muted)]">
                                {errors.guests[index]?.hasDietaryRestrictions?.message}
                              </p>
                            )}
                          </div>

                          {hasRestrictions && (
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-[var(--text-primary)]">
                                {rsvpTexts.guestAllergiesTitle}
                              </label>
                              <p className="text-xs text-[var(--text-muted)]">
                                {rsvpTexts.allergiesHint}
                              </p>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {ALLERGY_OPTIONS.map((key) => (
                                  <label key={key} className="flex cursor-pointer items-center gap-2">
                                    <input
                                      type="checkbox"
                                      className="peer sr-only"
                                      value={key}
                                      {...register(`guests.${index}.dietaryRestrictions.alergias`)}
                                    />
                                    <span className="rsvp-checkbox-box h-4 w-4 shrink-0 rounded border-2 border-[var(--border-soft)] bg-[var(--background-card)] transition-colors peer-checked:border-[var(--text-primary)] peer-checked:bg-[var(--text-primary)]" />
                                    <span className="text-sm text-[var(--text-primary)]">
                                      {ALLERGY_LABELS[key]}
                                    </span>
                                  </label>
                                ))}
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-[var(--text-primary)]">
                                  {rsvpTexts.otherAllergiesLabel}
                                </label>
                                <input
                                  type="text"
                                  placeholder={rsvpTexts.otherAllergiesPlaceholder}
                                  className={`${inputBase} ${inputBorder} h-12`}
                                  {...register(`guests.${index}.dietaryRestrictions.other`)}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
                {errors.guests && typeof errors.guests.message === "string" && (
                  <p className="rsvp-error text-xs text-[var(--text-muted)]">
                    {errors.guests.message}
                  </p>
                )}
                {fields.length < 6 && (
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        name: "",
                        hasDietaryRestrictions: "no",
                        dietaryRestrictions: null,
                      })
                    }
                    className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-[var(--border-soft)] bg-[var(--background-card)] px-4 py-2 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-rose)]/10"
                  >
                    {rsvpTexts.addGuestButton}
                  </button>
                )}
              </div>

              {/* Mensaje para los novios */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--text-primary)]">
                  {rsvpTexts.messageLabel}
                </label>
                <textarea
                  placeholder={rsvpTexts.messagePlaceholder}
                  rows={4}
                  className={`${inputBase} ${inputBorder} min-h-[100px] resize-y`}
                  {...register("mensaje")}
                />
              </div>

              {/* Feedback éxito / error */}
              {submitStatus === "success" && (
                <div
                  className="flex items-center gap-2 rounded-md border border-[var(--accent-rose)]/40 bg-[var(--accent-rose)]/10 px-4 py-3 text-sm text-[var(--text-primary)]"
                  role="status"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--accent-rose)]" aria-hidden />
                  <p>
                    {lastSubmittedAttendance === "no"
                      ? rsvpTexts.successMessageNoAttendance
                      : rsvpTexts.successMessage}
                  </p>
                </div>
              )}
              {submitStatus === "error" && submitError && (
                <div
                  className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-[var(--text-primary)]"
                  role="alert"
                >
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" aria-hidden />
                  <p>{submitError}</p>
                </div>
              )}

              {/* Botón enviar */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isSending}
                  className="focus-ring rsvp-submit-btn inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-medium text-white shadow-[0_2px_12px_rgba(92,61,74,0.12)] transition-opacity hover:opacity-95 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed sm:w-auto"
                  style={{ backgroundColor: "var(--text-primary)" }}
                >
                  {isSending ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
                      {rsvpTexts.submitButtonLoading}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" strokeWidth={2} aria-hidden />
                      {rsvpTexts.submitButton}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
