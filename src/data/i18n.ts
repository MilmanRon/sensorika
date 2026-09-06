/**
 * THE TWO LANGUAGES THE SITE SPEAKS, and every string the chrome says in
 * each of them.
 *
 * This is the locale sibling of site.ts: same rule, same reason. site.ts
 * holds the facts that don't change with the language (the phone number,
 * the nav's six slugs, where home is); this holds the ones that do.
 * Neither is allowed to be inlined in a component.
 *
 * WHAT IS *NOT* HERE: page copy. All nine pages' text lives in the
 * `pages` collection, one directory per locale (src/content/pages/he,
 * src/content/pages/ru), because that's prose and prose belongs in
 * content. What's here is the chrome's own vocabulary — "skip to main
 * content", "menu", the 404, the footer's copyright line — which has no
 * page to belong to.
 *
 * HEBREW IS THE DEFAULT AND CARRIES NO PREFIX. `/faq` is the Hebrew FAQ
 * and `/ru/faq` is the Russian one; there is no `/he/faq`. That's
 * `prefixDefaultLocale: false` in astro.config.mjs, and it matters
 * beyond tidiness: the site has been live at the unprefixed paths, and
 * moving Hebrew under a prefix would 404 or redirect every link and
 * every indexed URL that already exists.
 */

export const locales = ['he', 'ru'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'he';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * The locale of the page being rendered.
 *
 * `Astro.currentLocale` is derived from the URL by the i18n config in
 * astro.config.mjs, which is the whole reason that config exists: without
 * it the locale would have to be threaded as a prop from every route
 * through Header → Nav → NavItem and through every section, and the one
 * component that forgot would silently render the wrong language.
 *
 * The fallback is not decoration. `Astro.currentLocale` is `undefined`
 * on a path that matches no locale — 404s, most importantly, which are
 * served for URLs that were never routed. Hebrew is the right answer
 * there: it's the default locale and the unprefixed paths are its own.
 *
 * Typed against `Astro` structurally rather than importing AstroGlobal,
 * so this file stays plain TypeScript that a .ts test could call.
 */
export function currentLocale(astro: { currentLocale?: string }): Locale {
  return isLocale(astro.currentLocale) ? astro.currentLocale : defaultLocale;
}

/**
 * The facts about a locale that <html> and <head> need.
 *
 * `dir` is the load-bearing one. Hebrew is RTL and Russian is LTR, and
 * every component on the site is written with logical properties
 * (ms-/me-/text-start, inset-inline) precisely so that this one field is
 * what flips the layout — there is no second, mirrored stylesheet. The
 * handful of places that genuinely need to know are gated on
 * `[dir='rtl']` and simply don't apply under Russian.
 *
 * `switchLabel` is what the language switcher prints. Each language
 * names ITSELF, in its own script — "עב" and "Рус" — rather than both
 * being named in the language you're currently reading. That's the point
 * of a language switcher: a Russian speaker landing on the Hebrew site
 * has to be able to find their way out of it, and "רוסית" would not help
 * them do that.
 *
 * WHY "Рус" AND NOT "RU". The Latin "RU" is what a locale picker usually
 * shows, and it was what this one showed first — but it broke the rule
 * above: the Hebrew half was in Hebrew script and the Russian half was
 * in the alphabet of neither language, which makes it a code rather than
 * a name. "Рус" is the ordinary Russian short form of "Русский".
 *
 * NOT "РУ", the letter-for-letter transliteration, for a reason specific
 * to Cyrillic: Р and У are homoglyphs of the Latin P and Y, so "РУ" is
 * read as "PY" by anyone who doesn't already read Cyrillic — precisely
 * the visitor this label exists for. The third letter is what makes it
 * unmistakably a Russian word rather than two Latin letters.
 */
export const localeMeta: Record<
  Locale,
  { lang: string; dir: 'rtl' | 'ltr'; ogLocale: string; switchLabel: string; name: string }
> = {
  he: { lang: 'he', dir: 'rtl', ogLocale: 'he_IL', switchLabel: 'עב', name: 'עברית' },
  ru: { lang: 'ru', dir: 'ltr', ogLocale: 'ru_RU', switchLabel: 'Рус', name: 'Русский' },
};

/**
 * THE WEEK, IN ORDER, AND WHAT EACH DAY IS CALLED IN EACH LANGUAGE.
 *
 * The `schedule` collection says a class is on `tuesday`; it does not
 * say "שלישי" or "Вторник", because a timetable is data and the two
 * languages share it. This is where that enum becomes a word, so the
 * one Russian file that has to exist for the schedule is this table
 * rather than a second copy of the timetable itself.
 *
 * SUNDAY FIRST, because the clinic's week starts there — the classes
 * run Tuesday and Thursday, and a Sunday-first list is what puts them
 * in the order a parent in Israel reads them. `weekdays` is also the
 * order the schedule grid renders its columns in, and the source of the
 * `dayOfWeek` enum in content.config.ts, so the two can't disagree.
 *
 * Russian doesn't capitalize weekday names mid-sentence; these are
 * standing labels on their own pill, which is a position where it does.
 */
export const weekdays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export type Weekday = (typeof weekdays)[number];

const dayNames: Record<Locale, Record<Weekday, string>> = {
  he: {
    sunday: 'ראשון',
    monday: 'שני',
    tuesday: 'שלישי',
    wednesday: 'רביעי',
    thursday: 'חמישי',
    friday: 'שישי',
    saturday: 'שבת',
  },
  ru: {
    sunday: 'Воскресенье',
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
  },
};

/** What one day of the week is called in one language. */
export function dayName(locale: Locale, day: Weekday): string {
  return dayNames[locale][day];
}

/**
 * The URL prefix a locale's pages live under — '' for Hebrew, '/ru' for
 * Russian. Every href the chrome builds goes through `localizedHref()`
 * rather than concatenating this by hand.
 */
export function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? '' : `/${locale}`;
}

/**
 * A locale-agnostic path ('/faq', or '/' for home) rendered as the real
 * href for one locale.
 *
 * Note the '/' special case: `localePrefix('ru') + '/'` would be '/ru/',
 * and the site's whole trailing-slash policy (astro.config.mjs) is that
 * there aren't any. The Russian home page is '/ru'.
 */
export function localizedHref(locale: Locale, path: string): string {
  const prefix = localePrefix(locale);
  if (path === '/' || path === '') return prefix || '/';
  return `${prefix}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * The other locale's URL for the page currently being rendered — what
 * the language switcher links to.
 *
 * It preserves the page rather than dropping the reader on the home
 * page, which is the single thing a language switcher has to get right:
 * someone reading the packages page in Hebrew wants the packages page in
 * Russian, not a fresh start.
 *
 * The slug is deliberately NOT translated. Every page id is already
 * Latin ('sensory-regulation', 'how-we-help'), the same in both
 * directories, so the mapping is `/faq` ⟷ `/ru/faq` with nothing to look
 * up and nothing that can fall out of sync. A page that existed in only
 * one language would break that assumption — see `hasTranslation` in
 * LangSwitcher for how the switcher is kept honest about it.
 */
export function alternatePath(pathname: string, from: Locale, to: Locale): string {
  const bare = stripLocale(pathname, from);
  return localizedHref(to, bare);
}

/** '/ru/faq' → '/faq'. The inverse of `localizedHref`. */
export function stripLocale(pathname: string, locale: Locale): string {
  const path = pathname.replace(/\/+$/, '') || '/';
  const prefix = localePrefix(locale);
  if (!prefix) return path;
  const bare = path.slice(prefix.length);
  return bare || '/';
}

/**
 * EVERY STRING THE CHROME SAYS, in both languages.
 *
 * A flat record per locale rather than nested namespaces: there are
 * about twenty of these and a component asking for `ui(locale).skipToMain`
 * should not have to know which namespace someone filed it under. If
 * this grows past a screenful, that's the moment to nest it — not
 * before.
 *
 * HEBREW IS THE SHAPE AND RUSSIAN IS CHECKED AGAINST IT. `UiStrings` is
 * derived from the Hebrew object's own keys, and `ru` is annotated with
 * it, so a string added to one language and forgotten in the other is a
 * compile error — a missing key and a mistyped one both — rather than an
 * `undefined` rendered into the page or a Hebrew word in the middle of a
 * Russian one. That only works if `ui()` returns the type honestly, so
 * it does no casting.
 *
 * SIGN-OFF STATUS. The Russian side of everything below is NEW COPY —
 * the clinic supplied nine pages of Russian prose, not a UI glossary, so
 * these are translations of the Hebrew chrome rather than text anyone
 * has approved. The page content is a different matter: that is the
 * clinic's own, verbatim, in both languages.
 */
const he = {
  /* Chrome */
  skipToMain: 'דלגו לתוכן הראשי',
  menu: 'תפריט',
  primaryNav: 'ניווט ראשי',
  homeAria: 'לעמוד הבית',
  languageNav: 'שפת האתר',

  /* Contact */
  whatsapp: 'וואטסאפ',
  contact: 'צרו קשר',
  contactNoun: 'יצירת קשר',
  facebook: 'פייסבוק',
  whatsappCta: 'שלחו הודעה בוואטסאפ',

  /* Footer */
  rightsReserved: 'כל הזכויות שמורות.',

  /* Programs (home page) */
  programsEyebrow: 'התוכניות שלנו',
  programsHeading: 'שתי דרכים להתחיל',
  programsLead:
    'שתי נקודות כניסה שוות ערך — פרטני או קבוצתי. אפשר להתחיל מכל אחת מהן, ואפשר גם לשלב.',
  programsMore: 'לפרטים נוספים',
  programsIndividualTitle: 'אבחון וטיפול פרטניים',
  programsIndividualBody:
    'מפגש אחד-על-אחד שמתחיל בהיכרות ובאבחון חושי-תפקודי, וממשיך בתוכנית טיפול שנבנית סביב הילד הזה — הקצב שלו, החוזקות שלו ומה שקשה לו.',
  programsIndividualCta: 'למסגרות, למחירים ולתנאים',
  programsGroupsTitle: 'פעילויות קבוצתיות התפתחותיות',
  programsGroupsBody:
    'קבוצות קטנות לפי גיל ורמה, שבהן ילדים מתנסים בתנועה, במשחק ובשיתוף פעולה — ולומדים יחד, בקבוצה, את מה שקשה להם לבד.',
  programsGroupsCta: 'לטפסים ולתנאי ההשתתפות',
  programsAskHeading: 'לא בטוחים איזו מסגרת מתאימה?',
  programsAskBody: 'כתבו לי מה קורה אצלכם בבית, ונחשוב יחד מאיפה נכון להתחיל.',

  /* Documents */
  downloadForm: 'הורדת הטופס',

  /* Schedule (the group timetable) */
  scheduleAges: 'גילאי',
  scheduleTime: 'שעה',

  /* Venue — see the note above the Russian side on why the address is
     here and not in site.ts. */
  venueLabel: 'המקום',
  venueName: 'סטודיו טבסקו',
  venueStreet: 'רח. הגליל 6',

  /* 404 */
  notFoundTitle: 'הדף לא נמצא',
  notFoundDescription: 'הדף שחיפשתם לא קיים. אפשר לחזור לעמוד הבית או לבחור מהתפריט.',
  notFoundHeading: 'הדף הזה לא נמצא',
  notFoundBody:
    'יכול להיות שהקישור השתנה או שנפלה טעות בכתובת. אפשר לחזור לעמוד הבית, או לבחור מה שחיפשתם מהתפריט למעלה.',
  notFoundCta: 'לעמוד הבית',
};

/**
 * Every key the chrome can ask for, mapped to a plain `string`.
 *
 * Derived from `he` rather than written out a third time: the keys are
 * the contract and Hebrew already states it. Widening the values to
 * `string` is deliberate — the Hebrew literals are data, not types, and
 * `typeof he` would demand Russian repeat them word for word.
 */
export type UiStrings = Record<keyof typeof he, string>;

/**
 * Russian. Annotated rather than inferred, which is the whole point:
 * the annotation is what makes a forgotten key fail the build here,
 * beside the string that's missing, instead of silently at the far end
 * in whichever component asked for it.
 */
const ru: UiStrings = {
  /* Chrome */
  skipToMain: 'Перейти к основному содержанию',
  menu: 'Меню',
  primaryNav: 'Основная навигация',
  homeAria: 'На главную',
  languageNav: 'Язык сайта',

  /* Contact */
  whatsapp: 'WhatsApp',
  contact: 'Связаться',
  contactNoun: 'Связаться',
  facebook: 'Facebook',
  whatsappCta: 'Написать в WhatsApp',

  /* Footer */
  rightsReserved: 'Все права защищены.',

  /* Programs (home page) */
  programsEyebrow: 'Наши программы',
  programsHeading: 'Два способа начать',
  programsLead:
    'Две равноценные точки входа — индивидуальная работа или группа. Можно начать с любой из них, а можно совмещать.',
  programsMore: 'Подробнее',
  programsIndividualTitle: 'Индивидуальная диагностика и терапия',
  programsIndividualBody:
    'Встречи один на один: сначала знакомство и сенсорно-функциональная диагностика, затем программа терапии, которая строится вокруг конкретного ребёнка — его темпа, его сильных сторон и того, что даётся ему трудно.',
  programsIndividualCta: 'Программы, цены и условия',
  programsGroupsTitle: 'Групповые развивающие занятия',
  programsGroupsBody:
    'Небольшие группы по возрасту и уровню, где дети пробуют себя в движении, игре и совместной работе — и осваивают вместе, в группе, то, что трудно даётся в одиночку.',
  programsGroupsCta: 'Бланки и условия участия',
  programsAskHeading: 'Не уверены, какой формат подходит?',
  programsAskBody:
    'Напишите мне, что происходит у вас дома, и мы вместе подумаем, с чего лучше начать.',

  /* Documents */
  downloadForm: 'Скачать бланк',

  /* Schedule (the group timetable) */
  scheduleAges: 'Возраст',
  scheduleTime: 'Время',

  /*
   * Venue. THE ADDRESS IS HERE AND NOT IN site.ts, which is where a
   * site-wide fact would normally go, because this one is written
   * differently in each language: the street and the studio's name are
   * Hebrew, and a Russian-reading parent gets them transliterated. That
   * makes it a string the chrome says, which is what this file holds.
   * site.ts keeps the facts that survive the switch — the phone number,
   * the nav's slugs.
   *
   * ⚠ NEW COPY. The Hebrew — "רח. הגליל 6, סטודיו טבסקו" — is the
   * clinic's own, from their schedule graphic. The Russian below is a
   * transliteration of it and nobody has approved it; a parent standing
   * on the street needs the Hebrew form as well, which is why the card
   * renders the street in both scripts under Russian.
   */
  venueLabel: 'Место',
  venueName: 'Студия «Табаско»',
  venueStreet: 'ул. ха-Галиль, 6',

  /* 404 */
  notFoundTitle: 'Страница не найдена',
  notFoundDescription:
    'Страница, которую вы искали, не существует. Можно вернуться на главную или выбрать раздел в меню.',
  notFoundHeading: 'Эта страница не найдена',
  notFoundBody:
    'Возможно, ссылка изменилась или в адресе опечатка. Можно вернуться на главную или выбрать нужный раздел в меню наверху.',
  notFoundCta: 'На главную',
};

const strings: Record<Locale, UiStrings> = { he, ru };

/**
 * The chrome's vocabulary for one locale.
 *
 * Components call this once at the top —`const t = ui(locale)` — and
 * then read `t.menu`. The indirection exists so that a missing key is a
 * type error at build time rather than `undefined` rendered into the
 * page.
 */
export function ui(locale: Locale): UiStrings {
  return strings[locale];
}
