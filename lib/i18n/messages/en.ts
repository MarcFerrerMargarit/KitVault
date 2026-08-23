/**
 * English is the source of truth: every other language is typed against it,
 * so a missing or misspelled key is a build error rather than a blank on the
 * page. Add here first.
 *
 * Shirt data itself is never translated: team, country and league names are
 * stored as the user (or Gemini) entered them.
 */
export const en = {
  nav: {
    pricing: "Pricing",
    login: "Login",
    signup: "Sign up",
  },

  hero: {
    eyebrow: "Collect · Organize · Share",
    titleLine1: "Your football shirt",
    titleLine2: "collection,",
    titleAccent: "finally organized",
    body: "KitVault is the home for your kits. Catalogue every shirt with AI, keep your archive perfectly organised, and share your collection with fellow collectors around the world.",
    ctaPrimary: "Get started free",
    ctaSecondary: "Log in",
  },

  features: {
    title: "Built for collectors",
    subtitle:
      "Everything you need to catalogue — and show off — a serious shirt collection.",
    identify: {
      title: "AI identification",
      body: "Snap a photo and KitVault recognises the team, season, version and manufacturer automatically — no manual data entry.",
    },
    filter: {
      title: "Filter & search",
      body: "Slice your collection by country, league, season or version in real time. Find any shirt in seconds.",
    },
    share: {
      title: "Share your collection",
      body: "Show off your vault. Share your collection with friends and discover the kits other collectors are hunting down.",
    },
  },

  pricing: {
    title: "Simple pricing",
    subtitle: "Start free. Upgrade when your collection outgrows it.",
    perMonth: "/ month",
    free: "Free",
    mostComplete: "Most complete",
    comingSoon: "Coming soon",
    ctaStartFree: "Start free",
    ctaGet: "Get {plan}",
    ctaNotify: "Notify me when it's ready",
    footnoteOpen:
      "Every plan starts on Free — upgrading is a one-click change.",
    footnoteClosed:
      "Paid plans aren't open yet. Everything on Free works today, and nothing is charged to anyone.",
    perks: {
      shirtsLimited: "Up to {count} shirts",
      shirtsUnlimited: "Unlimited shirts",
      identifications: "{count} AI identifications a day",
      bulkYes: "Bulk upload — add a whole batch at once",
      bulkNo: "Add shirts one at a time",
      map: "Interactive collection map",
      filters: "Filters, search and collection stats",
    },
  },

  cta: {
    title: "Start your vault today",
    body: "Free to start. Add your first shirt in under a minute.",
    button: "Get started free",
  },

  footer: {
    tagline: "A prototype for football shirt collectors.",
    github: "View on GitHub",
    language: "Language",
  },

  auth: {
    login: {
      title: "Welcome back",
      subtitle: "Log in to reach your collection.",
      cta: "Log in",
      altText: "Don't have an account?",
      altLink: "Sign up",
    },
    signup: {
      title: "Create your vault",
      subtitle: "Start cataloguing your shirts in seconds.",
      cta: "Sign up",
      altText: "Already have an account?",
      altLink: "Log in",
    },
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    forgot: "Forgot it?",
    checkEmail: {
      title: "Check your email",
      body: "We sent a confirmation link to {email}. Click it to activate your vault.",
      spam: "Nothing after a minute or two? Check your spam folder.",
      resend: "Resend the email",
      resent: "Sent again — have another look.",
    },
    linkInvalid: "That link is no longer valid. Request a new one below.",
    errors: {
      invalidCredentials: "Wrong email or password.",
      emailNotConfirmed:
        "Confirm your email first — check the link we sent you.",
      userExists: "There is already an account with that email.",
      weakPassword: "That password is too short.",
    },
  },

  forgotPassword: {
    title: "Forgot your password?",
    subtitle: "We'll email you a link to set a new one.",
    cta: "Send reset link",
    remembered: "Remembered it?",
    login: "Log in",
    sentTitle: "Check your email",
    sentBody:
      "If {email} has an account, a link to set a new password is on its way. It expires in an hour.",
    backToLogin: "Back to login",
  },

  collection: {
    title: "Your collection",
    countAll: {
      one: "{shown} of {total} shirt",
      other: "{shown} of {total} shirts",
    },
    countFiltered: {
      one: "{shown} of {total} shirt matches your filters",
      other: "{shown} of {total} shirts match your filters",
    },
    onTheMap: {
      one: "{count} shirt on the map",
      other: "{count} shirts on the map",
    },
    addShirt: "Add shirt",
    bulkAdd: "Bulk add",
    bulkBusy: "Analyzing…",
    bulkTooltip: "Add several shirts at once",
    bulkTooltipBusy: "A batch is being analyzed",
    viewLabel: "Collection view",
    viewGrid: "Grid",
    viewMap: "Map",
    viewGridTitle: "Grid view",
    viewMapTitle: "Map view",
    planFullTooltip: "Your {plan} plan holds {max} shirts",
    planUsage: "{used} of {max} shirts used on the {plan} plan.",
    planFull:
      "Your collection is full — {max} shirts on the {plan} plan. Upgrade to keep adding, or delete one to make room.",
    empty: {
      title: "Your vault is empty",
      body: "Add your first shirt to get started.",
      cta: "Add shirt",
    },
    noResults: {
      title: "No shirts found",
      body: "Try adjusting or resetting your filters.",
      cta: "Reset filters",
    },
    bulkSaved: {
      partial: "Saved {saved}, but {failed} could not be added. {reason}",
    },
  },

  filters: {
    search: "Search by team…",
    searchLabel: "Search by team",
    country: "Filter by country",
    league: "Filter by league",
    season: "Filter by season",
    version: "Filter by version",
    allCountries: "All countries",
    allLeagues: "All leagues",
    allSeasons: "All seasons",
    allVersions: "All versions",
    reset: "Reset",
  },

  stats: {
    shirts: "Shirts",
    countries: "Countries",
    leagues: "Leagues",
    lastAdded: "Last added",
  },

  card: {
    view: "View details",
  },

  fields: {
    team: "Team name",
    teamPlaceholder: "e.g. FC Barcelona",
    season: "Season",
    seasonPlaceholder: "e.g. 2019-20",
    version: "Version",
    country: "Country",
    countryPlaceholder: "e.g. Spain",
    league: "League",
    leaguePlaceholder: "e.g. LaLiga (empty if none)",
    manufacturer: "Manufacturer",
    manufacturerPlaceholder: "e.g. Nike",
    notes: "Notes (optional)",
    notesPlaceholder: "Anything memorable about this shirt…",
  },

  addShirt: {
    titleAdd: "Add new shirt",
    titleEdit: "Edit shirt",
    descUpload: "Upload a photo and let AI identify it for you.",
    descForm: "Review the details and save to your collection.",
    dropTitle: "Drag & drop a photo here",
    dropBody: "or click to browse — PNG, JPG up to 10MB",
    quotaLeft: "{remaining} of {limit} AI identifications left today.",
    quotaNoneTitle:
      "No AI identifications left today ({limit}/day on the {plan} plan). Pick a photo anyway — you can fill the details in yourself.",
    quotaNoneError:
      "You've used all {limit} AI identifications for today — fill the details in manually.",
    analyzing: "Analyzing with AI…",
    analyzingBody: "Identifying team, season, version and manufacturer.",
    changePhoto: "Change photo",
    addPhoto: "Add photo",
    photoHint: "PNG or JPG, up to 10MB.",
    aiSuggested:
      "AI suggested these details ({confidence}% confidence) — correct anything that's wrong to help improve future identifications.",
    cancel: "Cancel",
    save: "Save to collection",
    saveEdit: "Save changes",
    uploadFailed: "Photo upload failed: {error}",
    identifyFailed: "AI identification failed — enter the details manually.",
  },

  detail: {
    season: "Season",
    version: "Version",
    country: "Country",
    league: "League",
    manufacturer: "Manufacturer",
    aiTitle: "AI Identification",
    identifiedAs: "Identified as",
    confidence: "(confidence: {value}%)",
    edit: "Edit details",
    delete: "Delete",
  },

  bulk: {
    title: "Add several shirts",
    descPick: "Upload a batch of photos and let AI identify them all.",
    descBackground: "You can close this — it keeps going in the background.",
    descReview: "Review each shirt before saving — {current} of {total}.",
    dropTitle: "Drag & drop up to {max} photos",
    dropBody: "or click to browse — one shirt per photo",
    quotaLeft:
      "{remaining} AI identifications left today — photos beyond that can still be filled in by hand.",
    tooMany: "Up to {max} photos at a time — using the first {max}.",
    analyzing: "Analyzing {current} of {total}…",
    analyzingBody:
      "Photos are identified one at a time to stay inside the AI rate limit.",
    keepWorking: "Keep working",
    cancelBatch: "Cancel batch",
    removePhoto: "Remove this photo",
    later: "Later",
    save: { one: "Save {count} shirt", other: "Save {count} shirts" },
    incomplete: "{count} shirt(s) still need a team and season",
    emptyBatch: "No photos left in this batch.",
    startOver: "Start over",
    noCreditLeft: "No AI identifications left — fill this one in by hand.",
    photoLabel: "Photo {number}",
    badge: {
      analyzing: "Analyzing {current} of {total}",
      analyzingBody: "Carry on — this runs in the background.",
      saving: "Saving your shirts…",
      savingBody: "Uploading photos and saving.",
      ready: { one: "{count} shirt ready", other: "{count} shirts ready" },
      readyBody: "Review them before they join your collection.",
      show: "Show progress",
      review: "Review now",
      cancel: "Cancel this batch",
      discard: "Discard this batch",
    },
  },

  map: {
    label: "World map of your collection",
    loading: "Unrolling the world…",
    failed:
      "The map could not be loaded. Your shirts are all still in the grid.",
    summary: {
      one: "{shirts} shirt across {countries} country — click one to see it",
      other:
        "{shirts} shirts across {countries} countries — click one to see it",
    },
    countryShirts: { one: "{count} shirt", other: "{count} shirts" },
    legendUnit: "shirts",
    more: {
      one: "+ {count} more country on the map — hover or click them there.",
      other: "+ {count} more countries on the map — hover or click them there.",
    },
    notOnMap: "Not on the map: {list}",
  },

  quota: {
    left: "AI left today",
    tooltip:
      "{remaining} of {limit} AI identifications left today ({plan} plan). Resets at {time}.",
    tooltipEmpty:
      "No AI identifications left. Your quota resets at {time}. You can still add shirts manually.",
    denial: {
      userQuota:
        "You've used all {limit} AI identifications for today. Fill the details in manually, or come back tomorrow.",
      globalQuota:
        "KitVault has reached today's shared AI limit. Fill the details in manually, or try again tomorrow.",
      burst:
        "Too many identifications happening at once. Wait a minute and try again, or fill the details in manually.",
    },
  },

  account: {
    signedInAs: "Signed in as",
    planSuffix: "plan",
    upgrade: "Upgrade to Pro",
    profile: "Profile",
    settings: "Settings",
    logout: "Log out",
    deleteAccount: "Delete account",
    planFreeTooltip: "You are on the free plan — see what Pro adds",
    planProTooltip: "You are on the {plan} plan",
    upgradeShort: "Upgrade",
    delete: {
      title: "Delete your account",
      description: "This cannot be undone.",
      warning:
        "Every shirt in your collection, every photo you have uploaded and your account itself will be permanently deleted. There is no way to recover them.",
      confirmLabel: "Type {email} to confirm",
      cancel: "Cancel",
      confirm: "Delete my account",
    },
  },

  upgrade: {
    back: "Back to my collection",
    proTitle: "You're on Pro",
    proBody:
      "Unlimited shirts, bulk upload and the highest AI allowance. There is nothing else to buy.",
    title: "Room for every shirt",
    onFree: "You're on the free plan",
    usage: " — {used} of {max} shirts used",
    notOpen:
      "Payments aren't open yet. Put your name down and you'll be first to know.",
    notify: "Notify me when Pro is available",
    noCard: "No card, no charge — just a heads-up when payments open.",
    onListTitle: "You're on the list",
    onListBody:
      "We'll email you the moment Pro can be paid for. Nothing is charged until then.",
  },

  errors: {
    notSignedIn: "You are not signed in.",
    collectionFull:
      "Your {plan} plan holds {max} shirts and you have {used}. Upgrade to add more.",
    collectionFullGeneric:
      "Your collection is full. Upgrade your plan to add more shirts.",
    notSavedFull: "Not saved — your collection is full.",
    listPhotos: "Could not list your photos: {error}",
    deletePhotos: "Could not delete your photos: {error}",
    deleteAccount: "Could not delete your account: {error}",
    quotaCheck: "Could not check your AI quota. Please try again.",
    geminiMissing: "GEMINI_API_KEY is not configured on the server.",
    noImage: "No image provided",
    imageTooLarge: "Image too large",
    emptyModel: "Empty response from the model",
    identifyFailed: "Identification failed: {error}",
  },

  updatePassword: {
    title: "Set a new password",
    subtitle: "At least {min} characters.",
    newPassword: "New password",
    repeat: "Repeat new password",
    cta: "Update password",
    mismatch: "The two passwords do not match.",
    expiredTitle: "Link expired",
    expiredBody:
      "This reset link is no longer valid — they can only be used once, and they expire after an hour.",
    sendNew: "Send a new one",
    doneTitle: "Password updated",
    doneBody: "You are signed in with your new password.",
    goToCollection: "Go to my collection",
  },
};

/**
 * The shape every translation must satisfy.
 *
 * Deliberately not `as const`: literal types would make each value its own
 * type, and "Precios" would then fail to satisfy "Pricing". Without it the
 * values are plain strings and what gets enforced is the structure — which is
 * exactly the guarantee worth having.
 */
export type Messages = typeof en;
