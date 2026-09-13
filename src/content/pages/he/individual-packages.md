---
title: מסגרות העבודה הפרטנית
navLabel: מסגרות ומחירים
description: ארבע חבילות העבודה הפרטנית — מה כל אחת כוללת וכמה היא עולה — ותנאי התשלום, ההפסקה, הביטול וההחזר הכספי שחלים על כולן.
order: 3.5
intro: >-
  האבחון הפרטני מתקיים בתיאום מראש בלבד ונמשך 2–3 מפגשים, בהתאם לצורכי הילד. על סמך תוצאות האבחון נבנית תוכנית טיפול אישית.
details:
  heading: מסלולי אבחון וטיפול
  items:
    - heading: אבחון
      body:
        - "עלות: 1,000 ₪"
        - כולל 2–3 פגישות.
    - heading: מפגש טיפולי פעם בשבוע
      body:
        - "עלות: 200 ₪ למפגש."
    - heading: מפגש טיפולי פעמיים בשבוע
      body:
        - "עלות: 150 ₪ למפגש."
    - heading: משך כל מפגש
      body:
        - 45 דקות.
    - heading: ליווי והדרכה באמצעות WhatsApp פעם בשבוע
      body:
        - "עלות: 300 ₪ לחודש."

terms:
  heading: תנאי ההשתתפות
  panels:
    - heading: אמצעי תשלום
      body:
        - >-
          התשלום עבור התוכניות הפרטניות מתבצע מראש, לפני תחילת התקופה המשולמת.
        - >-
          אמצעי התשלום הזמינים:
      items:
        - text: העברה בנקאית
        - text: Bit
        - text: מזומן

    - heading: הפסקה מוקדמת של התוכנית והחזר כספי
      body:
        - >-
          במקרה של הפסקה מוקדמת של התוכנית, יוחזר התשלום עבור החלק שלא נוצל מתוך התוכנית ששולמה.
        - >-
          במקרה של החזר כספי נשמר המחיר שבו נרכשה התוכנית: לא יבוצע חישוב מחדש רטרואקטיבי ולא תבוטל עלות החבילה שניתנה.
        - >-
          לצורך הפסקת התוכנית, על ההורה להודיע לאנה מילמן בכתב באמצעות WhatsApp.
        - >-
          מועד הפסקת התוכנית ייחשב למועד קבלת ההודעה הכתובה ב-WhatsApp. החזר התשלום עבור החלק שלא נוצל יחושב החל ממועד זה.
        - >-
          מפגשים ותקופות המתייחסים לזמן שלפני קבלת ההודעה הכתובה לא יחושבו מחדש רטרואקטיבית.

    - heading: ביטול והעברה של מפגשים בודדים
      body:
        - >-
          אם מפגש פרטני מבוטל ביוזמת המטפלת, הוא יועבר בהכרח ויתקיים במועד אחר שיתואם עם ההורים.
        - >-
          אם מפגש פרטני מבוטל ביוזמת ההורים, ללא קשר לסיבה, הוא אינו מתבטל. המפגש יועבר ויתקיים במועד אחר שיתואם.
        - >-
          כל המפגשים הפרטניים ששולמו נשמרים לזכות הילד וניתן להעבירם בתיאום בין הצדדים.

    - heading: הפסקה זמנית בתוכנית
      body:
        - >-
          במידת הצורך ניתן להשהות את התוכנית באופן זמני, בתיאום מראש עם המטפלת.
        - >-
          במקרה של הפסקה של עד שבועיים, לוח הזמנים הקודם נשמר, ככלל.
        - >-
          אם ההפסקה נמשכת יותר משבועיים, לא ניתן להבטיח את שמירת לוח הזמנים הקודם. עם החזרה לתוכנית יתואם עם ההורים לוח זמנים חדש, בהתאם לזמנים הפנויים.

---

<!--
  The individual track's offer page: the four packages with their prices,
  and the terms that govern all of them.

  It has a route but is NOT in the header nav — `siteConfig.nav` names
  the six nav destinations and this isn't one of them. It's reached from
  the "אבחון וטיפול פרטניים" card on the home page
  (sections/Programs.astro), which is the moment a parent is choosing a
  track. This is the same split the group program already has:
  "פעילות קבוצתית" explains, group-forms.md hands over the paperwork.

  WHY IT ISN'T ON individual.md. That page is the nav destination, and it
  ends by naming the four formats in a sentence each and saying the cost
  is quoted separately — which is the right amount for a parent who is
  still deciding whether individual work is for them. The prices, what
  each package includes month by month, and the payment / interruption /
  cancellation / refund rules are what they need AFTER that decision, and
  they're long enough to bury the explanation if they sit under it.

  `order: 3.5` puts it directly after "אבחון וטיפול פרטני" (3), next to
  the program it belongs to.

  TWO SECTIONS, ALL OF IT THE CLINIC'S OWN COPY, VERBATIM.

  "ארבע החבילות" is `disclosures` — four collapsed rows, because a parent
  is choosing exactly one of them and shouldn't have to scroll the other
  three to reach it.

  "תנאי ההשתתפות" is `terms` — the payment / interruption / cancellation
  / refund text, OPEN, as one panel per sub-heading, the way
  group-forms.md sets the group program's terms. It began as a fifth
  disclosure row and read as a fifth package: something to weigh against
  the other four and pick. There's nothing to choose here — these terms
  apply whichever package is taken — so the toggle is gone and the
  source's own five sub-headings become the five panels.

  Two presentation calls, both of them shape and not words:

  1. THE PRICES ARE STRUCTURED, not the two lines of prose the source
     writes them as. Every package quotes exactly two figures — an
     opening period and the months after it, or one session a week and
     two — and a parent comparing packages is comparing those numbers,
     so they're `label`/`amount` pairs the layout can set as a price line
     above the description. The source's own order is kept.
  2. THE BULLETS DROP THEIR TRAILING SEMICOLONS. The source punctuates
     its lists as one run-on sentence; the page sets them as a list,
     which is the same thing said with layout.

  Package 4 repeats its two prices as sub-headings further down, where
  each one is broken into a session count and a per-session cost. That
  repetition is the clinic's, and it's deliberate there: the table at
  the top is the choice, the headings below are the arithmetic.

  COPY NOTE: `title` and `intro` are the clinic's own — the heading and
  opening sentence of the "מסגרות העבודה הפרטנית" section on
  individual.md, which is where these packages were summarized.
  `navLabel`, `description`, the two block headings ("ארבע החבילות",
  "תנאי ההשתתפות") and the terms block's one-line intro are NEW COPY and
  still await sign-off.
-->
