# Yousef Alghzawi – Portfolio Site

This project is a professional portfolio website for Yousef Alghzawi, a Clinical Biostatistician. It showcases expertise in clinical trials, evidence synthesis, and publication-grade reporting.

## Project Overview

- **Type:** Static Website
- **Primary Stack:** HTML5, CSS3, Tailwind CSS (via CDN), Vanilla JavaScript.
- **Design Aesthetic:** Professional dark theme, utilizing "Space Mono" for display and "Inter" for sans-serif typography.
- **Key Features:**
    - Responsive landing page with custom canvas background animation.
    - Specialized case study (project) pages with structured methodological descriptions.
    - Seamless page transitions using the View Transitions API (with fallback).
    - Interactive elements: Reveal-on-scroll animations, number counting, and table of contents for long-form content.

## Project Structure

- `index.html`: Main landing page and entry point.
- `about.html`, `services.html`, `publications.html`, `apply.html`: Core informational pages.
- `[ProjectName].html`: Individual case study pages (e.g., `Anemia_Project.html`, `LVOT_TMVR.html`).
- `styles.css`: Main stylesheet containing global variables, layout rules, and core component styles.
- `Project.css`: Specific styles for case study pages (ToC, figure cards, code blocks).
- `script.js`: Global JavaScript for transitions, mobile menu, and scroll-based animations.
- `Project.js`: Logic for case studies, including image path resolution, table of contents generation, and "copy to clipboard" functionality.
- `assets/`: Contains logos (`UJ.png`, `KHCC.png`, etc.) and the personal portrait.
- `assets/projects/`: Subdirectories for each project containing figures and plots (e.g., `assets/projects/stratified-cox/plots/`).

## Development Guidelines

### Styling
- **Tailwind CSS:** The project uses Tailwind via CDN. Configuration is embedded in the `<head>` of HTML files.
- **Custom CSS:** Avoid inline styles. Use classes defined in `styles.css` or `Project.css` for consistent branding (e.g., `primary-btn`, `project-card`).
- **Color Palette:** 
    - `slateDeep` (#2A282B) / `slatebase` (#524E53) for backgrounds.
    - `brandGreen` (#CEDC57) for accents and success states.
    - `brandOrange` (#7A5B92 / #8650AB) for primary buttons and highlights.

### Adding New Project Pages
1. Use an existing project file (e.g., `Anemia_Project.html`) as a template.
2. Place project-specific plots in `assets/projects/[your-project-slug]/plots/`.
3. In the project's HTML, set the slug in `Project.js` (or use the `data-slug` attribute on images) to ensure paths are resolved correctly.
4. Update `index.html` or `publications.html` to link to the new case study.

### JavaScript Logic
- Use `script.js` for logic that applies to the entire site.
- Use `Project.js` for logic specific to case study layouts.
- Prefer vanilla JS and standard Web APIs (IntersectionObserver, View Transitions).

## Building and Running
Since this is a static site, no build step is required.
- **Local Development:** Serve the directory using any static file server:
  - `npx serve .`
  - `python -m http.server 8000`
- **Deployment:** Can be hosted on GitHub Pages, Vercel, Netlify, or any static hosting provider.
