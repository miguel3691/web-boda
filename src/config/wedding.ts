/**
 * Configuración centralizada de la boda.
 * Edita este archivo para cambiar nombres, fechas, textos y comportamiento sin tocar componentes.
 */

/** Nombres de la pareja (para hero, footer, ics, etc.) */
export const couple = {
  name1: "Miguel",
  name2: "Maria Jose",
} as const;

/** Nombre formateado para mostrar (ej. "Miguel & Maria Jose") */
export const coupleDisplayName = `${couple.name1} & ${couple.name2}`;

/** Fecha de la boda (mes 0-indexed para Date: 5 = junio) */
export const weddingDate = {
  day: 20,
  month: 5, // junio
  year: 2026,
  hour: 12,
  minute: 0,
} as const;

/** Fecha para countdown y lógica (objeto Date) */
export const weddingDateObj = new Date(
  weddingDate.year,
  weddingDate.month,
  weddingDate.day,
  weddingDate.hour,
  weddingDate.minute,
  0
);

/** Fecha formateada para mostrar (ej. "20 de junio de 2026") */
export const weddingDateFormatted = "20 de junio de 2026";

/** Línea de fecha para hero (ej. "JUNIO | 20 | SÁBADO") */
export const heroDateLine = "JUNIO | 20 | SÁBADO";

/** Año para hero */
export const heroYear = "2026";

/** Textos del hero */
export const hero = {
  saveTheDate: "Save the date",
  weAreGettingMarried: "¡Nos casamos!",
  dateLine: heroDateLine,
  year: heroYear,
  ctaLabel: "Acompañanos en nuestro gran día",
  ctaAriaLabel: "Ir a cuenta atrás",
} as const;

/** Lugar del evento */
export const place = {
  name: "Iglesia Nuestra Señora de Guadalupe",
  city: "Baena, Córdoba",
  /** Horario mostrado (ej. "De 12:00 a 00:00") */
  schedule: "De 12:00 a 13:00",
  /** Dirección completa para ics / email */
  fullAddress: "Iglesia Nuestra Señora de Guadalupe, Baena, Córdoba",
} as const;

/** Coordenadas y enlaces de mapa */
export const map = {
  lat: 37.61566592618724,
  lng: -4.322199826960005,
  zoom: 16,
  /** URL para iframe (embed) */
  get embedSrc() {
    return `https://maps.google.com/maps?output=embed&q=${this.lat},${this.lng}&z=${this.zoom}`;
  },
  /** URL para abrir en Google Maps (nueva pestaña) */
  get openUrl() {
    return `https://www.google.com/maps?q=${this.lat},${this.lng}`;
  },
} as const;

/** Clave del icono para cada evento (mapeada a Lucide en el componente) */
export type ScheduleEventIconKey =
  | "mapPin"
  | "heart"
  | "wine"
  | "utensilsCrossed"
  | "music2"
  | "music"
  | "sparkles";

/** Eventos del timeline (programa del día) */
export const scheduleEvents: ReadonlyArray<{
  time: string;
  title: string;
  description: string;
  icon: ScheduleEventIconKey;
}> = [
  { time: "11:30", title: "Llegada", description: "Llegada de los invitados", icon: "mapPin" },
  { time: "12:00", title: "Ceremonia", description: "Nos damos el sí", icon: "heart" },
  { time: "13:30", title: "Cóctel", description: "Copa de espera", icon: "wine" },
  { time: "15:00", title: "Almuerzo", description: "Banquete nupcial", icon: "utensilsCrossed" },
  { time: "19:00", title: "Primer baile", description: "Nuestro momento", icon: "music2" },
  { time: "19:10", title: "Fiesta", description: "¡A bailar!", icon: "music" },
  { time: "00:00", title: "Fin de fiesta", description: "Hasta pronto", icon: "sparkles" },
];

/** Textos de la sección lugar */
export const locationTexts = {
  title: "El lugar",
  subtitle: "Donde celebraremos nuestro amor",
  openInMaps: "Abrir en Maps",
  addToCalendar: "Añadir al calendario",
} as const;

/** Lugar del convite (banquete) */
export const convitePlace = {
  name: "Salones Espartero",
  city: "Baena, Córdoba",
  schedule: "Desde las 13:30",
  fullAddress: "Salones Espartero, Baena, Córdoba",
} as const;

/** Mapa del convite: coordenadas del banquete */
export const conviteMap = {
  lat: 37.622387038480454,
  lng: -4.303728257890111,
  zoom: 16,
  get embedSrc() {
    return `https://maps.google.com/maps?output=embed&q=${this.lat},${this.lng}&z=${this.zoom}`;
  },
  get openUrl() {
    return `https://www.google.com/maps?q=${this.lat},${this.lng}`;
  },
} as const;

/** Textos de la sección convite */
export const conviteTexts = {
  title: "El convite",
  subtitle: "Donde celebraremos el banquete",
  openInMaps: locationTexts.openInMaps,
  addToCalendar: locationTexts.addToCalendar,
} as const;

/** Textos del formulario RSVP */
export const rsvpTexts = {
  sectionTitle: "Confirma tu asistencia",
  sectionSubtitle: "Esperamos contar contigo",
  guestsLabel: "Tus datos y los de tus acompañantes",
  guestNameLabel: "Nombre y apellidos",
  guestNamePlaceholder: "Nombre y apellidos del invitado",
  guestTag: "Invitado",
  addGuestButton: "Añadir invitado",
  removeGuestButton: "Eliminar invitado",
  dietaryQuestionFallback: "¿Este invitado tiene alguna alergia o intolerancia alimentaria?",
  dietaryQuestionPrefix: "¿",
  dietaryQuestionSuffix: " tiene alguna alergia o intolerancia alimentaria?",
  dietaryYes: "Sí",
  dietaryNo: "No",
  guestAllergiesTitle: "Alergias e intolerancias alimentarias",
  emailLabel: "Email (opcional)",
  emailPlaceholder: "tu@email.com",
  willAttendLabel: "¿Asistirás?",
  willAttendYes: "Sí, asistiré",
  willAttendNo: "No podré asistir",
  allergiesHint:
    "Es muy importante para nosotros conocer cualquier restricción alimentaria. Selecciona las que apliquen:",
  otherAllergiesLabel: "Otras alergias o restricciones:",
  otherAllergiesPlaceholder: "Ej: alergia al huevo, intolerancia a la fructosa...",
  messageLabel: "Mensaje para los novios (opcional)",
  messagePlaceholder: "Escríbenos unas palabras...",
  submitButton: "Enviar confirmación",
  submitButtonLoading: "Enviando...",
  successMessage: "Gracias por confirmar tu asistencia.",
  successMessageNoAttendance: "Gracias por enviarnos tu respuesta.",
} as const;

/** Email al que se envían las confirmaciones RSVP (backend) */
export const rsvpEmailTo = "molina.miguel369@gmail.com";

/** Título del evento para ics / email */
export const eventTitle = `Boda - ${coupleDisplayName}`;

/** Fecha fin del evento para ics (día siguiente 00:00 si la fiesta termina de madrugada) */
export const eventEndDate = new Date(
  weddingDate.year,
  weddingDate.month,
  weddingDate.day + 1,
  0,
  0,
  0
);

/** Formato ics: YYYYMMDDTHHmmss */
function toIcsDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const s = "00";
  return `${y}${m}${day}T${h}${min}${s}`;
}

export const icsDates = {
  start: toIcsDate(weddingDateObj),
  end: toIcsDate(eventEndDate),
} as const;

/** Textos del footer */
export const footerTexts = {
  date: weddingDateFormatted,
  closing: "Con todo nuestro amor",
} as const;

/** Flags de funcionalidad */
export const flags = {
  enableIntroVideo: false,
  enableAudio: true,
  enableAnimations: true,
} as const;

/** Rutas de medios */
export const media = {
  introVideoSrc: "/intro.mp4",
  audioSrc: "/song.mp3",
} as const;
