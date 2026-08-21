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
    "slug": "cns-hematology",
    "field": "Hematologic Oncology - Survival",
    "title": "Is a Second Transplant Worth It?",
    "blurb": "Relapsed leukemia and lymphoma. Survival modeling that separates what the procedure costs from what the disease takes.",
    "status": "Published - Blood (ASH), 1st Author",
    "metric": "Cox - VIF - Harrell's C",
    "img": "/assets/projects/second-hct/plots/km_simulated.png"
  },
  {
    "slug": "sbrt-nsclc",
    "field": "Thoracic Oncology - Meta-Regression",
    "title": "Radiation or Surgery for Early Lung Cancer?",
    "blurb": "Propensity-matched pooling, with the missing hazard ratios rebuilt from raw event counts.",
    "status": "ASCO 2026 - 1st Author",
    "metric": "Parmar HR - meta-regression",
    "img": "/assets/projects/sbrt-nsclc/plots/metareg_bubble.png"
  },
  {
    "slug": "lvoto-tmvr",
    "field": "Structural Cardiology - Proportions",
    "title": "Keeping the Outflow Open in TMVR",
    "blurb": "No head-to-head trials existed, so the comparison was built technique by technique.",
    "status": "Published - JACC, 1st Author",
    "metric": "PFT - technique subgroups",
    "img": "/assets/projects/lvoto-tmvr/plots/prop_forest.png"
  },
  {
    "slug": "network-meta-analysis",
    "field": "Stroke Neurology - NMA",
    "title": "Thrombolysis After the Window Closes",
    "blurb": "One evidence network, estimated in two statistical frameworks that agreed.",
    "status": "Published - Int J Neuroscience",
    "metric": "netmeta - MCMC - GRADE",
    "img": "/assets/projects/alteplase-late/plots/netgraph.png"
  },
  {
    "slug": "cerebrolysin",
    "field": "Stroke Neurology - Rare Events",
    "title": "Cerebrolysin and the Bleeding Question",
    "blurb": "A harm too rare for default models. Rare-event methods, plus a check that the evidence was even big enough.",
    "status": "Published - J Clinical Neurology",
    "metric": "HK - Peto - TSA",
    "img": "/assets/projects/cerebrolysin/plots/rare_event_forest.png"
  },
  {
    "slug": "fet-article",
    "field": "Cardiac Surgery - Proportions",
    "title": "Stent versus Trunk",
    "blurb": "Two repairs for a torn aorta, compared through auditable proportion pooling.",
    "status": "Published - Thorac Cardiovasc Surg",
    "metric": "Freeman-Tukey - ROBINS-I",
    "img": "/assets/projects/fet-amds/plots/device_forest.png"
  },
  {
    "slug": "aef-bayesian",
    "field": "Vascular Surgery - Bayesian",
    "title": "Pooling the Unpoolable",
    "blurb": "A Bayesian model that turns case reports into strategy-level survival odds.",
    "status": "Published - Ann Vasc Surg",
    "metric": "brms - one-stage binomial",
    "img": "/assets/projects/aef/plots/posterior_density.png"
  },
  {
    "slug": "seer-cns",
    "field": "Cancer Epidemiology - Registry",
    "title": "The Brain Tumor After the Blood Cancer",
    "blurb": "More than 830,000 registry patients, with death treated as the competing risk it is.",
    "status": "ASCO 2026 - Paper In Revision",
    "metric": "SIR - Cox - Fine-Gray",
    "img": "/assets/projects/seer-cns/plots/cuminc.png"
  },
  {
    "slug": "tevar-zone-ma",
    "field": "Vascular Surgery - Meta-Analysis",
    "title": "Six Outcomes, One Stable Answer",
    "blurb": "A sensitivity framework that demonstrates stability instead of assuming it.",
    "status": "Under Review",
    "metric": "HK - LOO - Baujat",
    "img": "/assets/projects/tevar/plots/baujat.png"
  },
  {
    "slug": "disconnected-nma",
    "field": "Methods Story - NMA",
    "title": "The Network That Wasn't Connected",
    "blurb": "Two evidence islands, and one bridge tested as a sensitivity rather than assumed as fact.",
    "status": "In Preparation - Masked",
    "metric": "components - tau2 rescue",
    "img": "/assets/projects/disconnected-nma/plots/components.png"
  },
  {
    "slug": "survey-analysis",
    "field": "Methods Story - Exact Inference",
    "title": "Thirty-Four Specialists, One Whitespace Bug",
    "blurb": "Exact inference at a small sample size, and the data-quality catch that changed the headline count.",
    "status": "Delivered - Masked",
    "metric": "Fisher - McNemar - exact CI",
    "img": "/assets/projects/exact-survey/plots/exact_ci.png"
  }
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
    "venue": "Immunotherapy",
    "kind": "Meta-Analysis",
    "title": "The Role of AI in Predicting Immunotherapy Outcomes Based on Gut Microbiota Composition",
    "authors": "Leen Alhassan, Bassel Alrabadi, et al., incl. Yousef Alghzawi",
    "href": "https://www.researchgate.net/profile/Yousef-Alghzawi-2/research",
    "year": "2026"
  },
  {
    "venue": "Annals of Vascular Surgery",
    "kind": "Bayesian Meta-Analysis",
    "title": "Aortoesophageal Fistula: Mending the Lethal Connection",
    "authors": "Noor Abu Hantash, Hazem El Beyrouti, Yousef Alghzawi, et al.",
    "href": "https://www.researchgate.net/profile/Yousef-Alghzawi-2/research",
    "year": "2026"
  },
  {
    "venue": "J Clin Oncol (ASCO 2026)",
    "kind": "Bayesian Network Meta-Analysis",
    "title": "Open, Laparoscopic, versus Robotic Surgery for Siewert Type II/III Adenocarcinoma",
    "authors": "Bara Hammadeh, Faizan Sheraz, Yousef Alghzawi, et al.",
    "href": "https://www.researchgate.net/profile/Yousef-Alghzawi-2/research",
    "year": "2026"
  },
  {
    "venue": "J Clin Oncol (ASCO 2026)",
    "kind": "Registry Epidemiology",
    "title": "Incidence, Risk Factors, and Survival of Secondary Primary CNS Tumors Following Hematologic Malignancies",
    "authors": "Bara Hammadeh, Yousef Alghzawi, Dana Tarawneh, et al.",
    "href": "https://www.researchgate.net/profile/Yousef-Alghzawi-2/research",
    "year": "2026"
  },
  {
    "venue": "J Clin Oncol (ASCO 2026)",
    "kind": "Meta-Analysis & Meta-Regression",
    "title": "SBRT versus Surgery for Early-Stage NSCLC: A Propensity-Matched Meta-Analysis",
    "authors": "Yousef Alghzawi, Bara Hammadeh, Abdulla Alzibdeh, et al.",
    "href": "https://www.researchgate.net/profile/Yousef-Alghzawi-2/research",
    "year": "2026"
  },
  {
    "venue": "Int J Neuroscience",
    "kind": "Network Meta-Analysis",
    "title": "Efficacy, Safety and Dosing of IV Alteplase Beyond 4.5 Hours for Ischemic Stroke",
    "authors": "Bassel Alrabadi, Yousef Alghzawi, Hasan Matar, et al.",
    "href": "https://www.researchgate.net/profile/Yousef-Alghzawi-2/research",
    "year": "2026"
  },
  {
    "venue": "J. Clinical Neurology",
    "kind": "Brief Communication",
    "title": "Cerebrolysin and Risk of Hemorrhagic Transformation: A Pooled Analysis of Recent Studies",
    "authors": "Bassel Alrabadi, Yousef Alghzawi, Natalie Bandak",
    "href": "https://doi.org/10.3988/jcn.2025.0547",
    "year": "2026"
  },
  {
    "venue": "ACIT 2025",
    "kind": "Systematic Review",
    "title": "Digital Health and the Internet of Things in Huntington's Disease Diagnosis and Management",
    "authors": "Leen Alhassan, Osama Hammad, et al., incl. Yousef Alghzawi",
    "href": "https://www.researchgate.net/profile/Yousef-Alghzawi-2/research",
    "year": "2025"
  },
  {
    "venue": "Thoracic & CV Surgeon",
    "kind": "Meta-Analysis",
    "title": "Stent versus Trunk in Type A Dissection: Systematic Review and Meta-Analysis",
    "authors": "Noor Abu Hantash, Abdullah Alzubaidi, Yousef Alghzawi, et al.",
    "href": "https://www.thieme-connect.de/products/ejournals/abstract/10.1055/a-2737-6653",
    "year": "2025"
  },
  {
    "venue": "JACC",
    "kind": "Statistical Analysis & Methods",
    "title": "TCT-30 Comparative Meta-Analysis of LVOTO Prevention Techniques in TMVR",
    "authors": "Yousef Alghzawi, Hasan Matar, Osama Hammad, Abdallah Aletaywi",
    "href": "https://www.jacc.org/doi/10.1016/j.jacc.2025.09.079",
    "year": "2025",
    "impact": "IF 21.7"
  },
  {
    "venue": "Blood (ASH)",
    "kind": "Statistical Analysis",
    "title": "Survival Outcomes Following Second Hematopoietic Cell Transplantation",
    "authors": "Yousef Alghzawi, Bara Hammadeh, Nesreen Alhamwi, et al.",
    "href": "https://ashpublications.org/blood/article/146/Supplement%201/7802/555052",
    "year": "2025",
    "impact": "IF 20.3"
  },
  {
    "venue": "Clin. Neurology & Neurosurgery",
    "kind": "Statistical Analysis",
    "title": "Changing Mortality Trends in Encephalitis, Myelitis, and Encephalomyelitis",
    "authors": "Bassel Alrabadi, et al., Yousef Alghzawi, Ahmed Z. Obeidat",
    "href": "https://www.sciencedirect.com/science/article/abs/pii/S0303846725004536",
    "year": "2025",
    "impact": "IF 2.1"
  },
  {
    "venue": "J. Cardiology & Heart Failure",
    "kind": "Statistical Analysis",
    "title": "Prevalence and Factors of Vasovagal Syncope among Medical Trainees in Jordan",
    "authors": "Noor Abu Hantash, Yousef Alghzawi, et al.",
    "href": "https://www.researchgate.net/publication/397785597",
    "year": "2025"
  }
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
