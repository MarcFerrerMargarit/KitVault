/**
 * English is the source of truth: every other language is typed against it,
 * so a missing or misspelled key is a build error rather than a blank on the
 * page. Add here first.
 *
 * Only the public surface is translated so far — landing, pricing and auth.
 * The collection itself is still English-only.
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
