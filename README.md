This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Formulario RSVP (envío de correos con Resend)

El formulario "Confirma tu asistencia" envía un correo a la dirección configurada en la API usando [Resend](https://resend.com).

### Configuración local

1. **Copia las variables de ejemplo**
   ```bash
   cp .env.example .env.local
   ```

2. **Configura variables de entorno en `.env.local`**
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxx
   RSVP_TO_EMAIL=molina.miguel369@gmail.com
   RSVP_FROM_EMAIL="Boda <onboarding@resend.dev>"
   ```

   - `RESEND_API_KEY`: clave de [Resend API Keys](https://resend.com/api-keys)
   - `RSVP_TO_EMAIL`: email que recibe las respuestas
   - `RSVP_FROM_EMAIL`: remitente del correo

   Valor temporal recomendado para local:
   - `RSVP_FROM_EMAIL="Boda <onboarding@resend.dev>"`
   - Nota: en sandbox de Resend solo podrás enviar al email de tu propia cuenta Resend.

### Configuración en Vercel (producción)

1. Abre tu proyecto en Vercel.
2. Ve a **Settings → Environment Variables**.
3. Crea estas 3 variables para los entornos necesarios (Production/Preview/Development):
   - `RESEND_API_KEY`
   - `RSVP_TO_EMAIL`
   - `RSVP_FROM_EMAIL`
4. Redeploy del proyecto para que tomen efecto.

Para producción, configura `RSVP_FROM_EMAIL` con un remitente de dominio verificado en Resend, por ejemplo:
```env
RSVP_FROM_EMAIL="Boda <rsvp@tudominio.com>"
```

### Probar en local

1. `pnpm dev`
2. Abre la web, rellena el formulario RSVP y envía.
3. Revisa el correo en la bandeja configurada (o en la cuenta Resend si usas `onboarding@resend.dev`).

La ruta de la API está en `src/app/api/rsvp/route.ts`; ahí se valida el body y se construye y envía el email. Está preparada para entorno serverless (runtime `nodejs`). No expongas `RESEND_API_KEY` en el frontend.
