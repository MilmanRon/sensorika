---
title: Бланки и условия участия
navLabel: Бланки
description: Два бланка, которые нужно заполнить перед началом групповых развивающих занятий, и полные условия участия — оплата, пропуски, отмена занятия и страхование.
order: 4.5
intro: >-
  Перед началом участия в групповых занятиях нужно заполнить и подписать два приведённых ниже бланка. Их можно скачать, распечатать и принести на первую встречу. Полные условия участия приведены ниже на этой странице; они совпадают с приложением к бланку 2.
documents:
  heading: Бланки для скачивания
  items:
    - title: Бланк 1 · Декларация родителя о состоянии ребёнка
      meta: PDF · 2 страницы · на иврите
      description: >-
        Состояние здоровья, поведенческие особенности и то, что помогает ребёнку успокоиться и вернуться к взаимодействию.
      file: /forms/sensorika-form-1-health-declaration.pdf
    - title: Бланк 2 · Основные условия участия в программе
      meta: PDF · 2 страницы · на иврите
      description: >-
        Информация о ребёнке и формат участия, а также приложение с условиями: оплата, пропуски, отмена занятия и страхование.
      file: /forms/sensorika-form-2-participation-terms.pdf
panels:
  - heading: Оплата
    body:
      - >-
        Участие оплачивается за цикл.
      - >-
        При прекращении участия по инициативе родителей возврат осуществляется только за полные не начавшиеся месяцы. Оплата уже начавшегося месяца не возвращается и не переносится.
      - >-
        Если по профессиональной оценке руководителя программы дальнейшее участие ребёнка в групповом формате временно не соответствует его потребностям, руководитель может рекомендовать индивидуальный формат. В этом случае родителям предоставляется выбор: зачесть стоимость всех неиспользованных занятий текущего месяца в счёт диагностики или индивидуальных занятий либо получить возврат за неиспользованные занятия текущего месяца.
    pullout: >-
      Такое решение не рассматривается как отказ ребёнку в участии: после индивидуальной подготовки возможен возврат в группу.

  - heading: Пропуски
    body:
      - >-
        Если ребёнок пропускает занятия по болезни, семейным обстоятельствам или из-за поездки, пропущенное занятие может быть компенсировано в соответствующей группе при наличии свободного места.
      - >-
        Если свободного места нет, отдельное занятие специально для одного ребёнка не организуется, стоимость пропущенного занятия не возвращается.

  - heading: Отмена занятия
    body:
      - >-
        Занятие, отменённое по инициативе студии по техническим или организационным причинам, переносится или компенсируется.
      - >-
        Занятия, не проводимые в официальные израильские праздники, заранее включённые в календарь студии, не компенсируются.

  - heading: Страхование и ответственность
    body:
      - >-
        Студия обеспечивает страховое покрытие ответственности перед третьими лицами (צד ג׳) и отвечает за безопасность помещения и среды в пределах своей ответственности.
      - >-
        Руководитель программы проводит занятия при действующей страховке профессиональной ответственности (אחריות מקצועית).
      - >-
        Родитель несёт ответственность за своевременное и полное предоставление информации о здоровье и существенных особенностях ребёнка.
---

<!--
  The Russian group program's registration page, from the clinic's
  «Инструкция для разработчика — кнопка Групповые занятия». The four
  panels are that document's closing block —
  «Отдельный блок: оплата, отмена, компенсации и страхование» — verbatim,
  and they are the same text that prints as page 2 of form 2.

  That duplication is the clinic's own instruction, stated in the source:
  the block "должен быть доступен родителям на странице групповых
  занятий" and not only inside a PDF they have already downloaded. It
  does mean the terms now exist in FOUR places — this page,
  src/content/pages/he/group-forms.md, and both forms/*.html — so a
  change to any of them has to be made in all four.

  ⚠ THE TWO PDFs ARE HEBREW, AND THIS RUSSIAN PAGE LINKS TO THEM.
  `file:` points at the same two documents the Hebrew page serves,
  because those are the only ones that exist: the forms are built from
  forms/form-1-health-declaration.html and form-2-participation-terms.html
  (see forms/README.md), and there is no Russian source for either.

  The clinic has supplied the full Russian text of both — it is the body
  of the same instruction document this page's terms came from — so the
  Russian PDFs are a matter of writing two more HTML sources and running
  `npm run forms`, not of asking for more copy. Until that happens the
  `meta` line says "на иврите" out loud rather than letting a parent
  discover it after the download. That admission is a stopgap and should
  be deleted along with it.

  It has a route but is NOT in the header nav; it's reached from the
  "Групповые развивающие занятия" card on the home page.

  ALSO IN THE SOURCE AND NOT ON THIS PAGE: the group timetable (day, age
  group, time), the venue, and a "Регистрация и оплата" link. The Hebrew
  page carries none of them either — the timetable lives in the
  `schedule` collection, which nothing renders yet, and the source itself
  says the registration URL is to be wired up "после получения готового
  URL". Both languages are waiting on the same two things.

  NEW COPY, needing sign-off: `title`, `description`, `intro`, the
  download heading, the two one-line descriptions and the "на иврите"
  note. Everything in the panels and the two form titles is the
  clinic's own. The Hebrew page's equivalents are flagged as unapproved
  too.
-->
