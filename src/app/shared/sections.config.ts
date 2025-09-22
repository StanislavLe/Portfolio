// sections.config.ts
export const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About Me' },
  { id: 'skills', label: 'Skills' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'references', label: 'References' },
  { id: 'contact', label: 'Contact' }
];

// Extra Konfiguration für Footer / Styles
export const FOOTER_VARIANTS: Record<string, 'contact' | 'impressum' | 'privacy' | 'default'> = {
  contact: 'contact',
  impressum: 'impressum',
  privacy: 'privacy'
};
