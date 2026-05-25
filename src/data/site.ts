const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (path: string): string => `${base}${path.startsWith('/') ? '' : '/'}${path}`;

export const navLinks = [
  { label: 'Home', href: `${base}/#home` },
  { label: 'Services', href: `${base}/services` },
  { label: 'Work', href: `${base}/#work` },
  { label: 'Publications', href: `${base}/publications` },
  { label: 'About', href: `${base}/about` },
  { label: 'Apply', href: `${base}/apply` },
];

export const site = {
  name: 'Yousef Alghzawi',
  role: 'Clinical Biostatistician',
  tagline: 'Clinical trials • Evidence synthesis • Publication-grade reporting',
  email: 'yaalghzawi23@med.just.edu.jo',
  linkedin: 'https://www.linkedin.com/in/yousef-alghzawi/',
};
