/**
 * Schema.org structured data (JSON-LD) — the clinic described in a form
 * search engines and AI answer tools read as facts rather than prose:
 * what it is, where it is, who runs it, how to reach it.
 *
 * NOTHING HERE IS NEW INFORMATION. Every value is read from site.ts
 * (phone, socials, map), i18n.ts (names, address) or the page content,
 * so the structured data can't drift from what the page says.
 *
 * DELIBERATELY `LocalBusiness`, not `MedicalClinic` or `MedicalBusiness`.
 * The medical types assert a kind of licensed practice; the clinic
 * describes itself as diagnosis and treatment in sensory regulation and
 * NDFA, and the markup should claim exactly that and no more.
 *
 * Every entity has a stable `@id` under the site origin, so the
 * LocalBusiness on one page and the one on the next are recognisably the
 * same clinic, and the WebSite and Person can point at it.
 */
import { getEntry } from 'astro:content';

import { localeMeta, localizedHref, locales, ui, type Locale } from './i18n';
import { siteConfig } from './site';

type JsonLd = Record<string, unknown>;

const ids = (origin: URL) => ({
  clinic: new URL('/#clinic', origin).href,
  website: new URL('/#website', origin).href,
  founder: new URL('/#founder', origin).href,
});

/** The brand in every language it's written in, Latin first. */
function brandNames(): string[] {
  return [siteConfig.name, ...locales.map((locale) => ui(locale).siteName)];
}

/**
 * The entities every page carries: the clinic, the site and the person
 * behind it, in the reader's language.
 */
export async function siteGraph(locale: Locale, origin: URL): Promise<JsonLd[]> {
  const t = ui(locale);
  const id = ids(origin);
  const home = new URL(localizedHref(locale, '/'), origin).href;
  const about = new URL(localizedHref(locale, '/about'), origin).href;
  const homeEntry = await getEntry('pages', `${locale}/home`);
  const alternateName = brandNames().filter((name) => name !== t.siteName);

  return [
    {
      '@type': 'LocalBusiness',
      '@id': id.clinic,
      name: t.siteName,
      alternateName,
      description: homeEntry?.data.description,
      url: home,
      telephone: `+${siteConfig.contact.phone}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: t.addressStreet,
        addressLocality: t.addressLocality,
        addressCountry: 'IL',
      },
      areaServed: { '@type': 'City', name: t.addressLocality },
      hasMap: siteConfig.location.mapHref,
      sameAs: Object.values(siteConfig.social).filter(Boolean),
      knowsAbout: [t.expertise, 'NDFA'],
      founder: { '@id': id.founder },
    },
    {
      '@type': 'Person',
      '@id': id.founder,
      name: t.founderName,
      jobTitle: t.founderJobTitle,
      knowsAbout: [t.expertise, 'NDFA'],
      url: about,
      worksFor: { '@id': id.clinic },
    },
    {
      '@type': 'WebSite',
      '@id': id.website,
      name: t.siteName,
      alternateName,
      url: home,
      inLanguage: localeMeta[locale].lang,
      publisher: { '@id': id.clinic },
    },
  ];
}

/**
 * Markdown in an FAQ answer, as the plain text structured data wants:
 * a link keeps its words, emphasis loses its asterisks.
 */
function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/(\*\*|\*)(.+?)\1/g, '$2')
    .trim();
}

/** An FAQPage for a page whose frontmatter carries an `faq` list. */
export function faqPage(faq: { question: string; answer: string }[]): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: plainText(answer) },
    })),
  };
}
