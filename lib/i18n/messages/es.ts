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

  collection: {
    title: "Tu colección",
    countAll: {
      one: "{shown} de {total} camiseta",
      other: "{shown} de {total} camisetas",
    },
    countFiltered: {
      one: "{shown} de {total} camiseta coincide con tus filtros",
      other: "{shown} de {total} camisetas coinciden con tus filtros",
    },
    onTheMap: {
      one: "{count} camiseta en el mapa",
      other: "{count} camisetas en el mapa",
    },
    addShirt: "Añadir camiseta",
    bulkAdd: "Subida múltiple",
    bulkBusy: "Analizando…",
    bulkTooltip: "Añade varias camisetas a la vez",
    bulkTooltipBusy: "Hay un lote analizándose",
    viewLabel: "Vista de la colección",
    viewGrid: "Cuadrícula",
    viewMap: "Mapa",
    viewGridTitle: "Vista de cuadrícula",
    viewMapTitle: "Vista de mapa",
    planFullTooltip: "Tu plan {plan} admite {max} camisetas",
    planUsage: "{used} de {max} camisetas usadas en el plan {plan}.",
    planFull:
      "Tu colección está llena — {max} camisetas en el plan {plan}. Pasa a Pro para seguir añadiendo, o borra una para hacer sitio.",
    empty: {
      title: "Tu vitrina está vacía",
      body: "Añade tu primera camiseta para empezar.",
      cta: "Añadir camiseta",
    },
    noResults: {
      title: "No hay camisetas",
      body: "Prueba a cambiar o quitar los filtros.",
      cta: "Quitar filtros",
    },
    bulkSaved: {
      partial:
        "Guardadas {saved}, pero {failed} no se pudieron añadir. {reason}",
    },
  },

  filters: {
    search: "Buscar por equipo…",
    searchLabel: "Buscar por equipo",
    country: "Filtrar por país",
    league: "Filtrar por liga",
    season: "Filtrar por temporada",
    version: "Filtrar por versión",
    // El neutro del desplegable, no una traducción literal de "All ...":
    // "Todas las temporadas" no cabe en la fila de cuatro filtros, y el plural
    // a secas es como se resuelve habitualmente en castellano.
    allCountries: "Países",
    allLeagues: "Ligas",
    allSeasons: "Temporadas",
    allVersions: "Versiones",
    reset: "Quitar",
  },

  stats: {
    shirts: "Camisetas",
    countries: "Países",
    leagues: "Ligas",
    lastAdded: "Última añadida",
  },

  card: {
    view: "Ver detalles",
  },

  fields: {
    team: "Equipo",
    teamPlaceholder: "p. ej. FC Barcelona",
    season: "Temporada",
    seasonPlaceholder: "p. ej. 2019-20",
    version: "Versión",
    country: "País",
    countryPlaceholder: "p. ej. España",
    league: "Liga",
    leaguePlaceholder: "p. ej. LaLiga (vacío si no tiene)",
    manufacturer: "Marca",
    manufacturerPlaceholder: "p. ej. Nike",
    notes: "Notas (opcional)",
    notesPlaceholder: "Algo memorable sobre esta camiseta…",
  },

  addShirt: {
    titleAdd: "Añadir camiseta",
    titleEdit: "Editar camiseta",
    descUpload: "Sube una foto y deja que la IA la identifique.",
    descForm: "Revisa los datos y guárdala en tu colección.",
    dropTitle: "Arrastra una foto aquí",
    dropBody: "o haz clic para buscarla — PNG o JPG, hasta 10MB",
    quotaLeft: "Te quedan {remaining} de {limit} identificaciones con IA hoy.",
    quotaNoneTitle:
      "Hoy ya no te quedan identificaciones con IA ({limit}/día en el plan {plan}). Elige la foto igualmente — puedes rellenar los datos tú.",
    quotaNoneError:
      "Has gastado las {limit} identificaciones con IA de hoy — rellena los datos a mano.",
    analyzing: "Analizando con IA…",
    analyzingBody: "Identificando equipo, temporada, versión y marca.",
    changePhoto: "Cambiar foto",
    addPhoto: "Añadir foto",
    photoHint: "PNG o JPG, hasta 10MB.",
    aiSuggested:
      "La IA ha propuesto estos datos ({confidence}% de confianza) — corrige lo que esté mal y ayudarás a mejorar futuras identificaciones.",
    cancel: "Cancelar",
    save: "Guardar en la colección",
    saveEdit: "Guardar cambios",
    uploadFailed: "No se pudo subir la foto: {error}",
    identifyFailed:
      "La IA no ha podido identificarla — rellena los datos a mano.",
  },

  detail: {
    season: "Temporada",
    version: "Versión",
    country: "País",
    league: "Liga",
    manufacturer: "Marca",
    aiTitle: "Identificación con IA",
    identifiedAs: "Identificada como",
    confidence: "(confianza: {value}%)",
    edit: "Editar datos",
    delete: "Borrar",
  },

  bulk: {
    title: "Añadir varias camisetas",
    descPick: "Sube un lote de fotos y deja que la IA las identifique todas.",
    descBackground: "Puedes cerrar esto — sigue trabajando en segundo plano.",
    descReview: "Revisa cada camiseta antes de guardar — {current} de {total}.",
    dropTitle: "Arrastra hasta {max} fotos",
    dropBody: "o haz clic para buscarlas — una camiseta por foto",
    quotaLeft:
      "Te quedan {remaining} identificaciones con IA hoy — el resto de fotos las puedes rellenar a mano.",
    tooMany:
      "Máximo {max} fotos a la vez — nos quedamos con las primeras {max}.",
    analyzing: "Analizando {current} de {total}…",
    analyzingBody:
      "Las fotos se identifican de una en una para no superar el límite de la IA.",
    keepWorking: "Seguir a lo mío",
    cancelBatch: "Cancelar el lote",
    removePhoto: "Quitar esta foto",
    later: "Luego",
    save: {
      one: "Guardar {count} camiseta",
      other: "Guardar {count} camisetas",
    },
    incomplete: "A {count} camiseta(s) les falta equipo y temporada",
    emptyBatch: "No queda ninguna foto en el lote.",
    startOver: "Empezar de nuevo",
    noCreditLeft: "Sin identificaciones con IA — rellena esta a mano.",
    photoLabel: "Foto {number}",
    badge: {
      analyzing: "Analizando {current} de {total}",
      analyzingBody: "Sigue a lo tuyo — esto va en segundo plano.",
      saving: "Guardando tus camisetas…",
      savingBody: "Subiendo las fotos y guardando.",
      ready: {
        one: "{count} camiseta lista",
        other: "{count} camisetas listas",
      },
      readyBody: "Revísalas antes de que entren en tu colección.",
      show: "Ver progreso",
      review: "Revisar ahora",
      cancel: "Cancelar este lote",
      discard: "Descartar este lote",
    },
  },

  map: {
    label: "Mapa mundial de tu colección",
    loading: "Desplegando el mundo…",
    failed:
      "No se ha podido cargar el mapa. Tus camisetas siguen todas en la cuadrícula.",
    summary: {
      one: "{shirts} camiseta en {countries} país — haz clic para verla",
      other:
        "{shirts} camisetas en {countries} países — haz clic en uno para verlas",
    },
    countryShirts: { one: "{count} camiseta", other: "{count} camisetas" },
    legendUnit: "camisetas",
    more: {
      one: "+ {count} país más en el mapa — pásale el ratón o haz clic allí.",
      other:
        "+ {count} países más en el mapa — pásales el ratón o haz clic allí.",
    },
    notOnMap: "Fuera del mapa: {list}",
  },

  quota: {
    left: "IA hoy",
    tooltip:
      "Te quedan {remaining} de {limit} identificaciones con IA hoy (plan {plan}). Se renueva a las {time}.",
    tooltipEmpty:
      "No te quedan identificaciones con IA. Tu cuota se renueva a las {time}. Puedes seguir añadiendo camisetas a mano.",
    denial: {
      userQuota:
        "Has gastado las {limit} identificaciones con IA de hoy. Rellena los datos a mano, o vuelve mañana.",
      globalQuota:
        "KitVault ha alcanzado el límite de IA compartido de hoy. Rellena los datos a mano, o inténtalo mañana.",
      burst:
        "Hay demasiadas identificaciones a la vez. Espera un minuto y reinténtalo, o rellena los datos a mano.",
    },
  },

  account: {
    signedInAs: "Sesión iniciada como",
    planSuffix: "plan",
    upgrade: "Pasar a Pro",
    profile: "Perfil",
    settings: "Ajustes",
    logout: "Cerrar sesión",
    deleteAccount: "Borrar cuenta",
    planFreeTooltip: "Estás en el plan gratuito — mira qué añade Pro",
    planProTooltip: "Estás en el plan {plan}",
    upgradeShort: "Mejorar",
    delete: {
      title: "Borrar tu cuenta",
      description: "Esto no se puede deshacer.",
      warning:
        "Se borrarán para siempre todas las camisetas de tu colección, todas las fotos que hayas subido y tu propia cuenta. No hay forma de recuperarlas.",
      confirmLabel: "Escribe {email} para confirmar",
      cancel: "Cancelar",
      confirm: "Borrar mi cuenta",
    },
  },

  upgrade: {
    back: "Volver a mi colección",
    proTitle: "Estás en Pro",
    proBody:
      "Camisetas ilimitadas, subida múltiple y la mayor cuota de IA. No hay nada más que comprar.",
    title: "Sitio para todas tus camisetas",
    onFree: "Estás en el plan gratuito",
    usage: " — {used} de {max} camisetas usadas",
    notOpen:
      "Los pagos aún no están abiertos. Apúntate y serás de los primeros en saberlo.",
    notify: "Avísame cuando Pro esté disponible",
    noCard:
      "Sin tarjeta y sin cobros — solo un aviso cuando se abran los pagos.",
    onListTitle: "Estás en la lista",
    onListBody:
      "Te escribiremos en cuanto se pueda pagar Pro. Hasta entonces no se cobra nada.",
  },

  errors: {
    notSignedIn: "No has iniciado sesión.",
    collectionFull:
      "Tu plan {plan} admite {max} camisetas y tienes {used}. Pasa a Pro para añadir más.",
    collectionFullGeneric:
      "Tu colección está llena. Mejora tu plan para añadir más camisetas.",
    notSavedFull: "No guardada — tu colección está llena.",
    listPhotos: "No se han podido listar tus fotos: {error}",
    deletePhotos: "No se han podido borrar tus fotos: {error}",
    deleteAccount: "No se ha podido borrar tu cuenta: {error}",
    quotaCheck: "No se ha podido comprobar tu cuota de IA. Inténtalo de nuevo.",
    geminiMissing: "GEMINI_API_KEY no está configurada en el servidor.",
    noImage: "No se ha enviado ninguna imagen",
    imageTooLarge: "La imagen es demasiado grande",
    emptyModel: "El modelo ha devuelto una respuesta vacía",
    identifyFailed: "La identificación ha fallado: {error}",
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
