import type { Messages } from "./en";

/**
 * Spanish. Typed against the English source, so leaving a key out is a build
 * error rather than an English string leaking onto a Spanish page.
 */
export const es: Messages = {
  nav: {
    pricing: "Precios",
    login: "Entrar",
    signup: "Crear cuenta",
  },

  hero: {
    eyebrow: "Colecciona · Organiza · Comparte",
    titleLine1: "Tu colección de",
    titleLine2: "camisetas,",
    titleAccent: "por fin ordenada",
    body: "KitVault es el hogar de tus camisetas. Cataloga cada una con IA, mantén tu archivo impecable y comparte tu colección con coleccionistas de todo el mundo.",
    ctaPrimary: "Empezar gratis",
    ctaSecondary: "Entrar",
  },

  features: {
    title: "Hecho para coleccionistas",
    subtitle:
      "Todo lo que necesitas para catalogar — y lucir — una colección en condiciones.",
    identify: {
      title: "Identificación con IA",
      body: "Haz una foto y KitVault reconoce solo el equipo, la temporada, la versión y la marca. Sin teclear nada.",
    },
    filter: {
      title: "Filtros y búsqueda",
      body: "Filtra tu colección por país, liga, temporada o versión al instante. Encuentra cualquier camiseta en segundos.",
    },
    share: {
      title: "Comparte tu colección",
      body: "Enseña tu vitrina. Comparte tu colección con amigos y descubre las camisetas que persiguen otros coleccionistas.",
    },
  },

  pricing: {
    title: "Precios claros",
    subtitle:
      "Empieza gratis. Pasa a Pro cuando tu colección se te quede corta.",
    perMonth: "/ mes",
    free: "Gratis",
    mostComplete: "Más completo",
    comingSoon: "Muy pronto",
    ctaStartFree: "Empezar gratis",
    ctaGet: "Quiero {plan}",
    ctaNotify: "Avísame cuando esté listo",
    footnoteOpen:
      "Todo el mundo empieza en Gratis — subir de plan es un solo clic.",
    footnoteClosed:
      "Los planes de pago aún no están abiertos. Todo lo del plan Gratis funciona hoy, y no se cobra nada a nadie.",
    perks: {
      shirtsLimited: "Hasta {count} camisetas",
      shirtsUnlimited: "Camisetas ilimitadas",
      identifications: "{count} identificaciones con IA al día",
      bulkYes: "Subida múltiple — un lote entero de una vez",
      bulkNo: "Camisetas de una en una",
      map: "Mapa interactivo de la colección",
      filters: "Filtros, búsqueda y estadísticas",
    },
  },

  cta: {
    title: "Empieza tu vitrina hoy",
    body: "Gratis para empezar. Añade tu primera camiseta en menos de un minuto.",
    button: "Empezar gratis",
  },

  footer: {
    tagline: "Un proyecto para coleccionistas de camisetas de fútbol.",
    github: "Ver en GitHub",
    language: "Idioma",
  },

  auth: {
    login: {
      title: "Bienvenido de nuevo",
      subtitle: "Entra para ver tu colección.",
      cta: "Entrar",
      altText: "¿Aún no tienes cuenta?",
      altLink: "Crear cuenta",
    },
    signup: {
      title: "Crea tu vitrina",
      subtitle: "Empieza a catalogar tus camisetas en segundos.",
      cta: "Crear cuenta",
      altText: "¿Ya tienes cuenta?",
      altLink: "Entrar",
    },
    email: "Correo",
    emailPlaceholder: "tu@ejemplo.com",
    password: "Contraseña",
    forgot: "¿La olvidaste?",
    checkEmail: {
      title: "Revisa tu correo",
      body: "Hemos enviado un enlace de confirmación a {email}. Haz clic para activar tu vitrina.",
      spam: "¿No llega en un par de minutos? Mira la carpeta de spam.",
      resend: "Reenviar el correo",
      resent: "Enviado de nuevo — vuelve a mirar.",
    },
    linkInvalid: "Ese enlace ya no es válido. Pide uno nuevo aquí abajo.",
    errors: {
      invalidCredentials: "Correo o contraseña incorrectos.",
      emailNotConfirmed:
        "Confirma tu correo primero — busca el enlace que te enviamos.",
      userExists: "Ya existe una cuenta con ese correo.",
      weakPassword: "Esa contraseña es demasiado corta.",
    },
  },

  forgotPassword: {
    title: "¿Olvidaste la contraseña?",
    subtitle: "Te enviamos un enlace para poner una nueva.",
    cta: "Enviar enlace",
    remembered: "¿Ya te acuerdas?",
    login: "Entrar",
    sentTitle: "Revisa tu correo",
    sentBody:
      "Si {email} tiene cuenta, va de camino un enlace para poner una contraseña nueva. Caduca en una hora.",
    backToLogin: "Volver a entrar",
  },

  updatePassword: {
    title: "Pon una contraseña nueva",
    subtitle: "Mínimo {min} caracteres.",
    newPassword: "Contraseña nueva",
    repeat: "Repite la contraseña",
    cta: "Actualizar contraseña",
    mismatch: "Las dos contraseñas no coinciden.",
    expiredTitle: "Enlace caducado",
    expiredBody:
      "Este enlace ya no vale — solo se pueden usar una vez y caducan al cabo de una hora.",
    sendNew: "Pedir uno nuevo",
    doneTitle: "Contraseña actualizada",
    doneBody: "Ya has entrado con tu contraseña nueva.",
    goToCollection: "Ir a mi colección",
  },
};
