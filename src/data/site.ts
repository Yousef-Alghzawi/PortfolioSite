const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (path: string): string =>
  `${base}${path.startsWith('/') ? '' : '/'}${path}`;

export const site = {
  name: 'Yousef Alghzawi',
  role: 'Clinical Biostatistician',
  tagline: 'Biostatistics for high-impact clinical research.',
  email: 'yaalghzawi23@med.just.edu.jo',
  linkedin: 'https://www.linkedin.com/in/yousef-alghzawi/',
  researchgate: 'https://www.researchgate.net/profile/Yousef-Alghzawi-2/research',
  location: 'Amman, Jordan',
};

export const navLinks = [
  { label: 'Work', href: `${base}/#work` },
  { label: 'Services', href: `${base}/services` },
  { label: 'Publications', href: `${base}/publications` },
  { label: 'About', href: `${base}/about` },
];

// --- Case studies (work) -------------------------------------------------
export interface Project {
  slug: string;
  field: string;
  title: string;
  blurb: string;
  status: string;
  metric: string;
  img: string;
}

export const projects: Project[] = [
  {
    slug: 'cns-hematology',
    field: 'Hematologic Oncology · Survival',
    title: 'Second Transplant Survival Outcomes',
    blurb:
      'Competing-risks survival analysis of second hematopoietic cell transplantation, with stratified Cox models that separate relapse from non-relapse mortality.',
    status: 'Published · Blood (ASH)',
    metric: 'HR · KM · Fine-Gray',
    img: '/assets/projects/stratified-cox/plots/os-adjusted.png',
  },
  {
    slug: 'tevar-zone-ma',
    field: 'Vascular Surgery · Meta-Analysis',
    title: 'Multi-Outcome Binary Meta-Analysis',
    blurb:
      'Six binary outcomes pooled with DerSimonian-Laird random effects, plus leave-one-out sensitivity, Baujat influence diagnostics, and country subgroups.',
    status: 'Under Review',
    metric: '6 outcomes · I² · LOO',
    img: '/assets/projects/meta-analysis-binary/plots/forest-mortality.png',
  },
  {
    slug: 'fet-article',
    field: 'Thoracic Surgery · Proportions',
    title: 'Stent vs. Frozen Elephant Trunk',
    blurb:
      'Proportion meta-analysis using the Freeman-Tukey double-arcsine transformation for mortality and thrombosis across surgical techniques in Type A dissection.',
    status: 'Published · Thoracic & CV Surgeon',
    metric: 'Freeman-Tukey · pooled %',
    img: '/assets/projects/meta-analysis-proportions/plots/forest-mortality-Technique%20A.jpg',
  },
  {
    slug: 'network-meta-analysis',
    field: 'Evidence Synthesis · NMA',
    title: 'Bayesian Network Meta-Analysis',
    blurb:
      'Dual-framework (frequentist and Bayesian) network meta-analysis with MCMC estimation, SUCRA treatment ranking, and consistency checks.',
    status: 'Methods Showcase',
    metric: 'MCMC · SUCRA · ranking',
    img: '/assets/projects/meta-analysis-continuous/plots/forest-plot-1.png',
  },
  {
    slug: 'survey-analysis',
    field: 'Epidemiology · Survey',
    title: 'Complex Survey Prevalence',
    blurb:
      'Design-weighted prevalence estimation across multiple exposure groups, with survey-adjusted variance and subgroup summaries.',
    status: 'Methods Showcase',
    metric: 'weighted · design-adjusted',
    img: '/assets/projects/cross-sectional-prevalence/plots/chart-women.png',
  },
];

// --- Publications --------------------------------------------------------
export interface Publication {
  venue: string;
  kind: string;
  title: string;
  authors: string;
  href: string;
  impact?: string;
  year: string;
}

export const publications: Publication[] = [
  {
    venue: 'JACC',
    kind: 'Statistical Analysis & Methods',
    title: 'TCT-30 Comparative Meta-Analysis of LVOTO Prevention Techniques in TMVR',
    authors: 'Yousef Alghzawi, Hasan Matar, Osama Hammad, Abdallah Aletaywi',
    href: 'https://www.jacc.org/doi/10.1016/j.jacc.2025.09.079',
    impact: 'IF 21.7',
    year: '2025',
  },
  {
    venue: 'Blood (ASH)',
    kind: 'Statistical Analysis',
    title: 'Survival Outcomes Following Second Hematopoietic Cell Transplantation',
    authors: 'Yousef Alghzawi, Bara Hammadeh, Nesreen Alhamwi, et al.',
    href: 'https://ashpublications.org/blood/article/146/Supplement%201/7802/555052',
    impact: 'IF 20.3',
    year: '2025',
  },
  {
    venue: 'J. Clinical Neurology',
    kind: 'Brief Communication',
    title: 'Cerebrolysin and Risk of Hemorrhagic Transformation: A Pooled Analysis of Recent Studies',
    authors: 'Bassel Alrabadi, Yousef Alghzawi, Natalie Bandak',
    href: 'https://doi.org/10.3988/jcn.2025.0547',
    year: '2025',
  },
  {
    venue: 'Clin. Neurology & Neurosurgery',
    kind: 'Statistical Analysis',
    title: 'Changing Mortality Trends in Encephalitis, Myelitis, and Encephalomyelitis',
    authors: 'Bassel Alrabadi, et al., Yousef Alghzawi, Ahmed Z. Obeidat',
    href: 'https://www.sciencedirect.com/science/article/abs/pii/S0303846725004536',
    impact: 'IF 2.1',
    year: '2025',
  },
  {
    venue: 'Thoracic & CV Surgeon',
    kind: 'Meta-Analysis',
    title: 'Stent versus Trunk in Type A Dissection: Systematic Review and Meta-Analysis',
    authors: 'Noor Abu Hantash, Abdullah Alzubaidi, Yousef Alghzawi, et al.',
    href: 'https://www.thieme-connect.de/products/ejournals/abstract/10.1055/a-2737-6653',
    year: '2025',
  },
  {
    venue: 'J. Cardiology & Heart Failure',
    kind: 'Statistical Analysis',
    title: 'Prevalence and Factors of Vasovagal Syncope among Medical Trainees in Jordan',
    authors: 'Noor Abu Hantash, Yousef Alghzawi, et al.',
    href: 'https://www.researchgate.net/publication/397785597',
    year: '2025',
  },
];

// --- Services ------------------------------------------------------------
export interface Service {
  code: string;
  title: string;
  tagline: string;
  summary: string;
  deliverables: string[];
  timeline: string;
  idealFor: string[];
}

export const services: Service[] = [
  {
    code: 'S/01',
    title: 'Publication-Grade Analysis',
    tagline: 'Raw data to a submission-ready paper.',
    summary:
      'From raw data to a submission-ready manuscript. I run the full statistical pipeline and document every step, so your methods section is airtight and your results hold up under review.',
    deliverables: [
      'Statistical Analysis Plan aligned with your design',
      'Primary and secondary endpoint analysis',
      'Publication-ready tables and high-resolution figures',
      'Reproducible R code and methods text',
    ],
    timeline: '2 to 4 weeks',
    idealFor: ['RCTs', 'Cohort', 'Cross-Sectional'],
  },
  {
    code: 'S/02',
    title: 'Systematic Review & Meta-Analysis',
    tagline: 'PRISMA-compliant evidence synthesis.',
    summary:
      'Rigorous evidence synthesis that follows PRISMA 2020 to the letter. I handle the pooling, heterogeneity, and bias analysis; you get a result reviewers trust.',
    deliverables: [
      'PROSPERO-ready protocol and search strategy',
      'Random-effects analysis (I², Q, τ²)',
      'Publication-quality forest and funnel plots',
      'Subgroup, sensitivity, and bias analysis',
    ],
    timeline: '1 to 3 weeks',
    idealFor: ['Systematic Review', 'Meta-Analysis', 'NMA'],
  },
  {
    code: 'S/03',
    title: 'Trial Statistical Strategy',
    tagline: 'Power and plan before you enroll.',
    summary:
      'Get the statistics right before you enroll a single patient. Proper power, clean endpoints, and an analysis plan that satisfies grant reviewers and journals alike.',
    deliverables: [
      'Sample-size and power calculations',
      'Statistical Analysis Plan',
      'Endpoint definitions and randomization scheme',
      'Mock tables for grant applications',
    ],
    timeline: '1 to 2 weeks',
    idealFor: ['RCTs', 'Grants', 'Protocol'],
  },
  {
    code: 'S/04',
    title: 'Methods Audit & Risk Assessment',
    tagline: 'An independent check before you submit.',
    summary:
      'An independent statistical review before you submit. I find the methodological weaknesses that trigger desk rejection and tell you exactly how to fix them.',
    deliverables: [
      'Line-by-line methods review',
      'Reviewer risk-assessment report',
      'Specific, actionable recommendations',
      'Pre-written responses to likely objections',
    ],
    timeline: '2 to 3 weeks',
    idealFor: ['Pre-Submission', 'Resubmission'],
  },
];

// --- Process -------------------------------------------------------------
export const process = [
  { n: '01', t: 'Submit Inquiry', d: 'Tell me your study and target journal.' },
  { n: '02', t: 'Scoping Call', d: 'We align on endpoints and a plan.' },
  { n: '03', t: 'Analysis', d: 'Full analysis, figures, and reproducible code.' },
  { n: '04', t: 'Revisions', d: 'You review; I refine for submission.' },
  { n: '05', t: 'Reviewer Support', d: 'I answer the statistical queries.' },
];

// --- FAQ -----------------------------------------------------------------
export const faqs = [
  { q: 'How do you protect my data and confidentiality?', a: 'I sign an NDA and a data-handling agreement before any data is transferred. Datasets are stored encrypted and deleted on completion unless we agree otherwise. I am equally comfortable working with fully de-identified data.' },
  { q: 'What if reviewers question the statistical methods?', a: 'Post-submission support is included. I draft point-by-point statistical responses and run any additional sensitivity or subgroup analyses reviewers request. My standard is simple: the statistics will not be why your paper is rejected.' },
  { q: 'How do you handle authorship and acknowledgment?', a: 'My role is acknowledged in the methods section or the author list depending on the level of contribution. We agree on this in writing, upfront, during scoping. No surprises.' },
  { q: 'Can you work with my existing dataset and analysis?', a: 'Yes. I can audit an existing analysis, clean and restructure your dataset, or start from raw data. I work with SPSS (.sav), Excel, CSV, REDCap exports, and SQL databases.' },
  { q: 'What is the typical timeline for a project?', a: 'Most original-research projects take 2 to 4 weeks and meta-analyses 1 to 3 weeks. The estimate depends on dataset complexity, number of endpoints, and revision cycles. You get a specific timeline during scoping.' },
  { q: 'Do you help with study design, or only the analysis?', a: 'Both. I offer pre-study consultation including sample-size calculations, endpoint definitions, and design review, and I can join at any stage from protocol development to post-hoc analysis.' },
];

// --- Tooling / methods (about) ------------------------------------------
export const tools = [
  'R / RStudio', 'SPSS', 'PostgreSQL', 'tidyverse', 'survival', 'meta / metafor',
  'ggplot2', 'lme4', 'tableone', 'cmprsk', 'R Markdown', 'Joinpoint', 'RevMan',
];

export const methodGroups = [
  { label: 'Survival & Time-to-Event', items: ['Kaplan-Meier', 'Cox Proportional Hazards', 'Stratified Cox', 'Competing Risks (Fine-Gray)', 'Joinpoint Regression', 'Log-Rank'] },
  { label: 'Meta-Analysis & Synthesis', items: ['Random-Effects (DerSimonian-Laird)', 'Fixed-Effects (Mantel-Haenszel)', 'Network Meta-Analysis', 'Subgroup & Sensitivity', 'Publication Bias (Egger, Begg)', 'Rare Events (Peto OR)', 'Leave-One-Out', 'Heterogeneity (I², Q)'] },
  { label: 'Regression & Modeling', items: ['Logistic Regression', 'Linear Regression', 'Mixed-Effects Models', 'Ordinal Regression', 'Multivariable Adjustment', 'Bootstrap Validation'] },
  { label: 'Descriptive & Epidemiological', items: ['Cross-Sectional', 'Survey-Weighted', 'Prevalence Estimation', 'Chi-Square / Fisher', 't-test / Mann-Whitney', 'ANOVA / Kruskal-Wallis'] },
];

export const reportingStandards = ['CONSORT', 'STROBE', 'PRISMA', 'TRIPOD', 'MOOSE', 'RECORD'];

export const affiliations = [
  { name: 'University of Jordan', img: '/assets/UJ.png' },
  { name: 'Jordan University of Science and Technology', img: '/assets/JUST.png' },
  { name: 'King Hussein Cancer Center', img: '/assets/KHCC.png' },
  { name: 'King Abdullah University Hospital', img: '/assets/KAUH.png' },
];
