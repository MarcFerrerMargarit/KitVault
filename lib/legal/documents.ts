import type { Locale } from "@/lib/i18n/config";

/**
 * Privacy policy and terms, in every interface language.
 *
 * Kept out of the message dictionaries on purpose: they are long, change on a
 * legal rather than a product rhythm, and a reviewer should be able to read
 * each one top to bottom in a single file.
 *
 * Every factual claim here is about how the app actually behaves — what is
 * stored, who processes it, how deletion and export work. When the product
 * changes in any of those respects, this file must change with it, and
 * `LEGAL.updated` with it.
 *
 * A paragraph is a string; a bulleted list is an array of strings. `{name}`
 * placeholders are filled from `LEGAL` in `./config`; a list item whose
 * placeholder is empty there is left out.
 *
 * This is a careful draft, not legal advice. Have it read by someone qualified
 * before charging anyone.
 */
export type LegalBlock = string | string[];

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  title: string;
  intro: string;
  sections: LegalSection[];
}

export const PRIVACY: Record<Locale, LegalDoc> = {
  es: {
    title: "Política de privacidad",
    intro:
      "Esta política explica qué datos tratamos cuando usas KitVault, para qué, con quién los compartimos y cómo ejercer tus derechos. Está escrita para que se entienda: si algo no queda claro, escríbenos.",
    sections: [
      {
        heading: "Quién es el responsable",
        blocks: [
          [
            "Responsable: {controller}",
            "NIF: {taxId}",
            "Dirección: {address}",
            "Contacto para privacidad: {contactEmail}",
          ],
        ],
      },
      {
        heading: "Qué datos tratamos",
        blocks: [
          [
            "Tu cuenta: correo electrónico, fecha de alta y el plan en el que estás, y lo que añadas a tu perfil (nombre, foto, equipo favorito, la descripción sobre ti y, si la eliges, tu dirección pública). La foto se recorta y se reduce en tu navegador antes de subirla, y se guarda en privado como las de tu colección. La contraseña la guarda nuestro proveedor de autenticación cifrada; nosotros nunca la vemos.",
            "Tu colección: los datos de cada camiseta (equipo, temporada, versión, país, liga, marca, notas) y sus fotos. Las fotos se reducen en tu propio navegador antes de subirlas, y al hacerlo se eliminan sus metadatos, incluida la ubicación GPS que muchos móviles guardan en la imagen.",
            "La identificación con IA: lo que la IA propuso para cada foto, los detalles que leyó en ella (escudo, patrocinador, parches o textos visibles), lo que tú guardaste finalmente, y un registro de cada identificación (fecha, modelo usado y tamaño de la petición) que usamos para aplicar los límites diarios y controlar el coste.",
            "Los mensajes que nos envías desde el formulario de ayuda, junto con la página desde la que escribiste y el idioma de la interfaz.",
            "Si te apuntas a la lista de espera del plan Pro, ese hecho y la fecha.",
            "Datos técnicos: la cookie de sesión que te mantiene identificado, una cookie que recuerda tu idioma, y los registros de servidor habituales (dirección IP, fecha y página solicitada) que generan nuestros proveedores de alojamiento.",
          ],
        ],
      },
      {
        heading: "Para qué los usamos y con qué base",
        blocks: [
          [
            "Prestarte el servicio — guardar tu colección, identificar camisetas con IA, enviarte los correos de confirmación y de recuperación de contraseña. Base: la ejecución del contrato que aceptas al registrarte (art. 6.1.b RGPD).",
            "Aplicar los límites de cada plan y evitar abusos. Base: nuestro interés legítimo en mantener el servicio disponible y su coste bajo control (art. 6.1.f).",
            "Atender tus mensajes de ayuda. Base: interés legítimo, y la ejecución del contrato cuando se refieren al servicio.",
            "Mejorar la identificación en el futuro a partir de las correcciones que haces a las propuestas de la IA. Base: interés legítimo. Puedes oponerte escribiéndonos.",
            "Contar visitas de forma agregada para saber qué páginas se usan. Se hace sin cookies y sin identificarte (ver «Cookies»). Base: interés legítimo.",
          ],
          "No vendemos tus datos, no los usamos para publicidad y no tomamos decisiones automatizadas con efectos jurídicos sobre ti.",
        ],
      },
      {
        heading: "Con quién los compartimos",
        blocks: [
          "Usamos proveedores que tratan datos por cuenta nuestra (encargados del tratamiento), con contrato y solo para prestar el servicio:",
          [
            "Supabase — autenticación, base de datos y almacenamiento de fotos. Tus datos y tus fotos se guardan en la Unión Europea, en {supabaseRegion}.",
            "Google (API de Gemini) — recibe la foto cuando pides una identificación y devuelve su propuesta. Usamos el nivel de pago de la API, en el que Google no utiliza las peticiones ni las respuestas para mejorar sus productos.",
            "Vercel — aloja la web y cuenta las visitas de forma agregada.",
            "Resend — envía los correos de la cuenta y los mensajes del formulario de ayuda, desde servidores en la Unión Europea (Irlanda).",
            "Cloudflare — gestiona el dominio y el reenvío del correo de contacto.",
          ],
          "Varios de estos proveedores son empresas estadounidenses. Cuando sus servicios implican transferir datos fuera del Espacio Económico Europeo, se hacen al amparo del Marco de Privacidad de Datos UE-EE. UU. o de las cláusulas contractuales tipo aprobadas por la Comisión Europea.",
        ],
      },
      {
        heading: "Tu vitrina pública",
        blocks: [
          "Tu colección es privada salvo que tú decidas lo contrario. Si eliges una dirección y activas «Vitrina pública» en tu perfil, cualquiera que tenga el enlace kitvault.dev/u/<tu dirección> podrá ver:",
          [
            "Tu nombre, tu foto, tu equipo favorito y la descripción sobre ti.",
            "Tus camisetas con sus fotos y sus datos (equipo, temporada, versión, país, liga y marca), y el total de camisetas, países y ligas.",
          ],
          "Nunca se muestran tu correo, las notas de tus camisetas ni los datos de la identificación con IA.",
          "La vitrina no se ofrece a los buscadores, pero quien tenga el enlace puede reenviarlo, y lo que alguien ve puede guardarlo. La base es tu consentimiento (art. 6.1.a RGPD), y puedes retirarlo cuando quieras desactivando la opción: la vitrina deja de verse al momento, aunque los enlaces a fotos que alguien ya haya cargado pueden seguir funcionando hasta una hora.",
        ],
      },
      {
        heading: "Cuánto tiempo los guardamos",
        blocks: [
          "Mientras tengas la cuenta. Cuando la borras desde el menú de tu cuenta, eliminamos primero tus fotos y después la cuenta junto con todo lo que cuelga de ella: colección, correcciones, registro de identificaciones, mensajes de ayuda y lista de espera. Es inmediato y no se puede deshacer.",
          "Las copias de seguridad de nuestros proveedores pueden conservar esos datos durante su ciclo normal de rotación antes de desaparecer también. La cookie de idioma caduca al año.",
        ],
      },
      {
        heading: "Tus derechos",
        blocks: [
          "Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad. Varios los tienes a un clic en la propia aplicación:",
          [
            "Rectificación: edita cualquier camiseta desde tu colección.",
            "Acceso y portabilidad: «Descargar mis datos», en el menú de tu cuenta, te da un archivo con todo lo que guardamos sobre ti.",
            "Supresión: «Borrar cuenta», en el mismo menú.",
          ],
          "Para todo lo demás, escribe a {contactEmail}. Te responderemos en el plazo de un mes. Si crees que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).",
        ],
      },
      {
        heading: "Cookies",
        blocks: [
          "Solo usamos cookies necesarias para que la web funcione: la de sesión, que te mantiene identificado, y la que recuerda el idioma que eliges. Ninguna sirve para publicidad ni para seguirte entre sitios, y por eso no te pedimos consentimiento.",
          "Las visitas las contamos con Vercel Web Analytics, que no usa cookies ni guarda nada que te identifique.",
        ],
      },
      {
        heading: "Seguridad",
        blocks: [
          "Cada usuario solo puede leer y modificar sus propios datos — salvo lo que tú mismo hagas público en tu vitrina —, y esa separación la impone la propia base de datos, no solo la aplicación. Las fotos están en un almacenamiento privado y se sirven con enlaces que caducan. Toda la comunicación va cifrada (HTTPS).",
        ],
      },
      {
        heading: "Menores",
        blocks: [
          "KitVault no está dirigido a menores de 14 años, y no pueden crear una cuenta.",
        ],
      },
      {
        heading: "Cambios",
        blocks: [
          "Si cambiamos esta política de forma relevante, te avisaremos por correo antes de que el cambio se aplique.",
        ],
      },
    ],
  },

  en: {
    title: "Privacy policy",
    intro:
      "This policy explains what data we process when you use KitVault, why, who we share it with, and how to exercise your rights. It is written to be understood: if anything is unclear, write to us.",
    sections: [
      {
        heading: "Who is responsible",
        blocks: [
          [
            "Controller: {controller}",
            "Tax ID: {taxId}",
            "Address: {address}",
            "Privacy contact: {contactEmail}",
          ],
        ],
      },
      {
        heading: "What we process",
        blocks: [
          [
            "Your account: email address, sign-up date and the plan you are on, plus whatever you add to your profile (name, photo, favourite team, the description about you and, if you choose one, your public address). The photo is cropped and downscaled in your browser before upload, and stored privately like your collection's. Your password is kept, hashed, by our authentication provider; we never see it.",
            "Your collection: the details of each shirt (team, season, version, country, league, manufacturer, notes) and its photos. Photos are downscaled in your own browser before upload, which also strips their metadata — including the GPS location many phones write into the image.",
            "AI identification: what the AI suggested for each photo, the details it read from it (crest, sponsor, patches or visible text), what you finally saved, and a record of each identification (time, model used and request size) that we use to apply the daily limits and keep the cost under control.",
            "Messages you send through the help form, with the page you wrote from and the interface language.",
            "If you join the Pro waiting list, that fact and the date.",
            "Technical data: the session cookie that keeps you signed in, a cookie that remembers your language, and the usual server logs (IP address, time and page requested) produced by our hosting providers.",
          ],
        ],
      },
      {
        heading: "Why we use it, and on what basis",
        blocks: [
          [
            "To provide the service — storing your collection, identifying shirts with AI, sending confirmation and password-reset emails. Basis: performing the contract you accept when you sign up (GDPR art. 6.1.b).",
            "To apply each plan's limits and prevent abuse. Basis: our legitimate interest in keeping the service available and its cost under control (art. 6.1.f).",
            "To answer your help messages. Basis: legitimate interest, and the contract when they concern the service.",
            "To improve identification in the future from the corrections you make to the AI's suggestions. Basis: legitimate interest. You can object by writing to us.",
            "To count visits in aggregate so we know which pages are used. This is done without cookies and without identifying you (see “Cookies”). Basis: legitimate interest.",
          ],
          "We do not sell your data, do not use it for advertising, and make no automated decisions with legal effects on you.",
        ],
      },
      {
        heading: "Who we share it with",
        blocks: [
          "We use providers that process data on our behalf (processors), under contract and only to run the service:",
          [
            "Supabase — authentication, database and photo storage. Your data and photos are stored in the European Union, in {supabaseRegion}.",
            "Google (Gemini API) — receives the photo when you ask for an identification and returns its suggestion. We use the paid tier of the API, under which Google does not use requests or responses to improve its products.",
            "Vercel — hosts the website and counts visits in aggregate.",
            "Resend — sends account emails and help-form messages, from servers in the European Union (Ireland).",
            "Cloudflare — manages the domain and forwards mail sent to our contact address.",
          ],
          "Several of these providers are US companies. Where their services involve transferring data outside the European Economic Area, this is done under the EU-US Data Privacy Framework or the Standard Contractual Clauses approved by the European Commission.",
        ],
      },
      {
        heading: "Your public vault",
        blocks: [
          "Your collection is private unless you decide otherwise. If you choose an address and switch on “Public vault” in your profile, anyone with the link kitvault.dev/u/<your address> can see:",
          [
            "Your name, photo, favourite team and the description about you.",
            "Your shirts with their photos and details (team, season, version, country, league and manufacturer), and the totals of shirts, countries and leagues.",
          ],
          "Your email, your shirts' notes and the AI identification data are never shown.",
          "The vault is not offered to search engines, but anyone with the link can pass it on, and what someone sees they can save. The basis is your consent (GDPR art. 6.1.a), which you can withdraw at any time by switching the option off: the vault stops being visible at once, though links to photos someone has already loaded may keep working for up to an hour.",
        ],
      },
      {
        heading: "How long we keep it",
        blocks: [
          "For as long as you have an account. When you delete it from your account menu, we delete your photos first and then the account with everything attached to it: collection, corrections, identification record, help messages and waiting-list entry. It is immediate and cannot be undone.",
          "Our providers' backups may hold that data for their normal rotation period before it disappears from them too. The language cookie expires after a year.",
        ],
      },
      {
        heading: "Your rights",
        blocks: [
          "You can exercise your rights of access, rectification, erasure, objection, restriction and portability at any time. Several are one click away in the app itself:",
          [
            "Rectification: edit any shirt from your collection.",
            "Access and portability: “Download my data”, in your account menu, gives you a file with everything we hold about you.",
            "Erasure: “Delete account”, in the same menu.",
          ],
          "For anything else, write to {contactEmail}. We will reply within one month. If you think we have not handled your request properly, you can complain to the Spanish Data Protection Agency (www.aepd.es) or the authority where you live.",
        ],
      },
      {
        heading: "Cookies",
        blocks: [
          "We only use cookies the site needs to work: the session cookie that keeps you signed in, and the one that remembers the language you choose. Neither is used for advertising or to follow you across sites, which is why we do not ask for consent.",
          "Visits are counted with Vercel Web Analytics, which uses no cookies and stores nothing that identifies you.",
        ],
      },
      {
        heading: "Security",
        blocks: [
          "Each user can only read and change their own data — apart from what you choose to make public in your vault — and that separation is enforced by the database itself, not just the application. Photos are kept in private storage and served through links that expire. All traffic is encrypted (HTTPS).",
        ],
      },
      {
        heading: "Children",
        blocks: [
          "KitVault is not aimed at children under 14, and they cannot create an account.",
        ],
      },
      {
        heading: "Changes",
        blocks: [
          "If we change this policy in a meaningful way, we will tell you by email before the change applies.",
        ],
      },
    ],
  },
};

export const TERMS: Record<Locale, LegalDoc> = {
  es: {
    title: "Términos de uso",
    intro:
      "Estas condiciones regulan el uso de KitVault. Al crear una cuenta las aceptas. Son cortas a propósito: léelas.",
    sections: [
      {
        heading: "Quién presta el servicio",
        blocks: [
          [
            "Titular: {controller}",
            "NIF: {taxId}",
            "Dirección: {address}",
            "Contacto: {contactEmail}",
            "Web: kitvault.dev",
          ],
        ],
      },
      {
        heading: "Qué es KitVault",
        blocks: [
          "Una aplicación para catalogar tu colección de camisetas de fútbol: guardas cada camiseta con sus datos y fotos, una IA te propone de qué camiseta se trata a partir de la foto, y puedes ver y filtrar la colección, también en un mapa.",
          "Hoy el servicio es gratuito. Los planes de pago aparecen anunciados pero todavía no se pueden contratar; cuando se abran, estas condiciones se ampliarán con lo relativo al pago, la renovación y la cancelación, y te avisaremos.",
        ],
      },
      {
        heading: "Tu cuenta",
        blocks: [
          [
            "Tienes que tener al menos 14 años.",
            "Usa un correo que sea tuyo y mantén tu contraseña en secreto: lo que se haga desde tu cuenta es responsabilidad tuya.",
            "Una cuenta es para una persona.",
          ],
        ],
      },
      {
        heading: "Tu contenido",
        blocks: [
          "Las fotos y los datos que subes siguen siendo tuyos. Nos das el permiso necesario para guardarlos, procesarlos y mostrártelos, y para enviar las fotos al proveedor de IA cuando pides una identificación — nada más. Si activas tu vitrina pública, nos das además permiso para mostrar a quien tenga el enlace lo que explica la política de privacidad. Ese permiso termina cuando borras el contenido o la cuenta, o desactivas la vitrina.",
          "Al subir una foto confirmas que tienes derecho a hacerlo. No subas contenido ilegal, ofensivo, que vulnere derechos de terceros o que no tenga que ver con el servicio, ni elijas una dirección que suplante a otra persona, club o marca. Podemos retirar contenido que incumpla estas condiciones.",
        ],
      },
      {
        heading: "La identificación con IA",
        blocks: [
          "La IA propone equipo, temporada, versión, marca, país y liga a partir de la foto, y puede equivocarse. Revisa siempre la propuesta antes de guardarla: lo que queda en tu colección es lo que tú confirmas.",
          "KitVault no tasa camisetas ni verifica su autenticidad, y la información que muestra no es oficial. No tenemos relación con ningún club, federación ni fabricante; sus nombres y marcas pertenecen a sus titulares y aparecen solo para describir tu colección.",
        ],
      },
      {
        heading: "Límites y uso aceptable",
        blocks: [
          "Cada plan tiene límites — por ejemplo, cuántas camisetas puedes guardar o cuántas identificaciones con IA puedes hacer al día — y la aplicación te los muestra. Podemos ajustarlos; si un cambio te afecta de forma relevante, te avisaremos con antelación.",
          "No está permitido:",
          [
            "Saltarte los límites, por ejemplo con varias cuentas o automatizando peticiones.",
            "Extraer datos del servicio de forma masiva o interferir en su funcionamiento.",
            "Usar KitVault para cualquier fin ilegal.",
          ],
        ],
      },
      {
        heading: "Disponibilidad",
        blocks: [
          "KitVault está en desarrollo activo: las funciones pueden cambiar y el servicio puede tener interrupciones. Hacemos lo razonable para que funcione bien y para no perder tus datos, pero no podemos garantizar que nunca falle. Por eso tienes siempre a mano «Descargar mis datos» para guardar tu propia copia.",
        ],
      },
      {
        heading: "Responsabilidad",
        blocks: [
          "En la medida en que la ley lo permita, no respondemos de daños indirectos ni de decisiones que tomes basándote en las identificaciones de la IA. Nada de esto limita los derechos que te reconoce la normativa de consumidores ni nuestra responsabilidad por dolo o culpa grave.",
        ],
      },
      {
        heading: "Baja",
        blocks: [
          "Puedes borrar tu cuenta cuando quieras desde el menú de tu cuenta, y con ella tus datos, como explica la política de privacidad. Podemos suspender o cerrar cuentas que incumplan estas condiciones de forma grave o reiterada.",
        ],
      },
      {
        heading: "Cambios y ley aplicable",
        blocks: [
          "Si cambiamos estas condiciones de forma relevante, te avisaremos por correo antes de que se apliquen. Se rigen por la ley española. Si eres consumidor, conservas los derechos que te reconozca la ley de tu país de residencia y puedes acudir a los tribunales de tu domicilio.",
        ],
      },
    ],
  },

  en: {
    title: "Terms of use",
    intro:
      "These terms govern your use of KitVault. By creating an account you accept them. They are short on purpose: please read them.",
    sections: [
      {
        heading: "Who provides the service",
        blocks: [
          [
            "Provider: {controller}",
            "Tax ID: {taxId}",
            "Address: {address}",
            "Contact: {contactEmail}",
            "Website: kitvault.dev",
          ],
        ],
      },
      {
        heading: "What KitVault is",
        blocks: [
          "An app for cataloguing your football shirt collection: you store each shirt with its details and photos, an AI suggests which shirt it is from the photo, and you can browse and filter the collection, including on a map.",
          "The service is free today. Paid plans are announced but cannot be bought yet; when they open, these terms will be extended to cover payment, renewal and cancellation, and we will tell you.",
        ],
      },
      {
        heading: "Your account",
        blocks: [
          [
            "You must be at least 14.",
            "Use an email address that is yours and keep your password secret: what is done from your account is your responsibility.",
            "One account is for one person.",
          ],
        ],
      },
      {
        heading: "Your content",
        blocks: [
          "The photos and details you upload stay yours. You give us the permission needed to store them, process them and show them to you, and to send photos to the AI provider when you ask for an identification — nothing more. If you switch on your public vault, you also give us permission to show anyone with the link what the privacy policy describes. That permission ends when you delete the content or your account, or switch the vault off.",
          "By uploading a photo you confirm you have the right to. Do not upload content that is illegal, offensive, infringes someone else's rights or has nothing to do with the service, or choose an address that impersonates another person, club or brand. We may remove content that breaks these terms.",
        ],
      },
      {
        heading: "AI identification",
        blocks: [
          "The AI suggests team, season, version, manufacturer, country and league from the photo, and it can be wrong. Always check the suggestion before saving: what ends up in your collection is what you confirm.",
          "KitVault does not value shirts or verify their authenticity, and the information it shows is not official. We have no relationship with any club, federation or manufacturer; their names and trademarks belong to their owners and appear only to describe your collection.",
        ],
      },
      {
        heading: "Limits and acceptable use",
        blocks: [
          "Each plan has limits — for example how many shirts you can store or how many AI identifications you can run per day — and the app shows them to you. We may adjust them; if a change affects you meaningfully, we will tell you in advance.",
          "You may not:",
          [
            "Get around the limits, for example with several accounts or by automating requests.",
            "Extract data from the service in bulk or interfere with how it runs.",
            "Use KitVault for anything unlawful.",
          ],
        ],
      },
      {
        heading: "Availability",
        blocks: [
          "KitVault is under active development: features may change and the service may have interruptions. We do what is reasonable to keep it working and not to lose your data, but we cannot promise it will never fail. That is why “Download my data” is always there for you to keep your own copy.",
        ],
      },
      {
        heading: "Liability",
        blocks: [
          "To the extent the law allows, we are not liable for indirect losses or for decisions you take based on the AI's identifications. Nothing here limits your rights under consumer law or our liability for wilful misconduct or gross negligence.",
        ],
      },
      {
        heading: "Leaving",
        blocks: [
          "You can delete your account whenever you like from your account menu, and your data with it, as the privacy policy explains. We may suspend or close accounts that seriously or repeatedly break these terms.",
        ],
      },
      {
        heading: "Changes and governing law",
        blocks: [
          "If we change these terms in a meaningful way, we will tell you by email before they apply. They are governed by Spanish law. If you are a consumer, you keep the rights the law of your country of residence gives you and may go to the courts where you live.",
        ],
      },
    ],
  },
};
