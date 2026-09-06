---
title: טפסים ותנאי ההשתתפות
navLabel: טפסים
description: שני הטפסים שיש למלא לפני ההצטרפות לפעילויות הקבוצתיות ההתפתחותיות, ותנאי ההשתתפות המלאים — תשלום, היעדרויות, ביטול פעילות וביטוח.
order: 4.5
intro: >-
  לפני תחילת ההשתתפות בפעילויות הקבוצתיות יש למלא ולחתום על שני הטפסים שלהלן. אפשר להוריד אותם, להדפיס ולהביא למפגש הראשון. תנאי ההשתתפות המלאים מופיעים בהמשך העמוד, והם זהים לנספח המצורף לטופס 2.
schedule:
  heading: לוח הפעילויות הקבוצתיות
  note: על בסיס שיעור אחד בשבוע, לבחירתכם
venue: true
documents:
  heading: הטפסים להורדה
  items:
    - title: טופס 1 · הצהרת הורה על מצבו של הילד
      meta: PDF · 2 עמודים
      description: >-
        מצב בריאותי, מאפיינים התנהגותיים, ומה עוזר לילד להירגע ולחזור לפעילות.
      file: /forms/sensorika-form-1-health-declaration.pdf
    - title: טופס 2 · התנאים הבסיסיים להשתתפות בתוכנית
      meta: PDF · 2 עמודים
      description: >-
        מידע על הילד ומתכונת ההשתתפות, ונספח התנאים: תשלום, היעדרויות, ביטול פעילות וביטוח.
      file: /forms/sensorika-form-2-participation-terms.pdf
panels:
  - heading: תשלום
    body:
      - >-
        ההשתתפות משולמת עבור מחזור.
      - >-
        במקרה של הפסקת השתתפות ביוזמת ההורים, יינתן החזר רק עבור חודשים מלאים שטרם החלו. תשלום עבור חודש שכבר החל אינו מוחזר ואינו מועבר.
      - >-
        אם לפי הערכתה המקצועית של מנהלת התוכנית המשך השתתפותו של הילד במסגרת הקבוצתית אינו מתאים באופן זמני לצרכיו, מנהלת התוכנית רשאית להמליץ על מסגרת פרטנית. במקרה כזה ניתנת להורים אפשרות בחירה: לזקוף את עלות כל המפגשים שלא נוצלו בחודש הנוכחי לטובת אבחון או מפגשים פרטניים, או לקבל החזר עבור המפגשים שלא נוצלו בחודש הנוכחי.
    pullout: >-
      החלטה כזו אינה נחשבת לסירוב להשתתפות הילד: לאחר הכנה פרטנית ניתן לחזור לקבוצה.

  - heading: היעדרויות
    body:
      - >-
        אם הילד נעדר מפעילות בשל מחלה, נסיבות משפחתיות או נסיעה, ניתן להשלים את הפעילות שהוחמצה בקבוצה המתאימה, בכפוף למקום פנוי.
      - >-
        אם אין מקום פנוי, לא יתקיים מפגש נפרד במיוחד עבור ילד אחד, ועלות המפגש שהוחמץ לא תוחזר.

  - heading: ביטול פעילות
    body:
      - >-
        פעילות שבוטלה ביוזמת הסטודיו מסיבות טכניות או ארגוניות תועבר למועד אחר או תושלם.
      - >-
        פעילויות שאינן מתקיימות בחגים הרשמיים בישראל, אשר נכללו מראש בלוח השנה של הסטודיו, אינן מזכות בהשלמה.

  - heading: ביטוח ואחריות
    body:
      - >-
        הסטודיו מספק כיסוי ביטוחי לאחריות כלפי צד שלישי (צד ג׳) ואחראי לבטיחות המקום והסביבה במסגרת תחומי אחריותו.
      - >-
        מנהלת התוכנית מקיימת את הפעילויות כאשר ברשותה ביטוח אחריות מקצועית (אחריות מקצועית) בתוקף.
      - >-
        ההורה אחראי למסירה מלאה ובמועד של מידע על מצבו הבריאותי של הילד ועל מאפיינים משמעותיים שלו.
---

<!--
  The group program's registration page: the two PDFs, and the terms
  that come with them.

  It has a route but is NOT in the header nav — `siteConfig.nav` names
  the six nav destinations and this isn't one of them. It's reached from
  the "פעילויות קבוצתיות התפתחותיות" card on the home page
  (sections/Programs.astro), which is the moment a parent is choosing a
  track.

  THE FOUR PANELS ARE FORM 2's ANNEX, VERBATIM — the same block that
  prints as page 2 of sensorika-form-2-participation-terms.pdf. That
  duplication is the clinic's own instruction: the payment / absences /
  cancellation / insurance terms are to be readable by a parent on the
  web, not only inside a PDF they've already downloaded. It does mean
  two copies of one text, so a change to either has to be made in both:
  here and in forms/form-2-participation-terms.html (then `npm run
  forms`).

  `order: 4.5` puts it directly after "פעילות קבוצתית" (4), next to the
  program it belongs to.

  THE TIMETABLE AND THE VENUE OPEN THE PAGE, above the two forms. Both
  come from the clinic's own schedule graphic (שלישי / חמישי, three age
  groups, רח. הגליל 6 — סטודיו טבסקו), rebuilt in the site's own
  materials rather than posted as an image: `schedule:` here is only the
  heading and the footnote, the five classes are data in
  src/content/schedule/, and the address is in i18n.ts because it's
  written differently in each language. See sections/ScheduleGrid.astro.

  STILL MISSING from that graphic: the phone number it prints for
  registration (054-4548600), which belongs in `contact.phone` in
  site.ts — it's the one field standing between the header's CTA and a
  working WhatsApp link — and the registration URL, which the clinic's
  own instructions say is to be wired up once it exists.

  COPY NOTE: everything in the panels and the two form titles is the
  clinic's own, as is the schedule footnote. `title`, `description`,
  `intro`, the schedule and download headings and the two one-line
  descriptions under the form titles are NEW COPY and still await
  sign-off.
-->
