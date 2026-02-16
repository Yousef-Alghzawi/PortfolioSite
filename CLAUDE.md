# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static portfolio website for a Clinical Biostatistician showcasing publications, case studies, and services. The site is built with vanilla HTML, CSS, and JavaScript, using Tailwind CSS via CDN for styling and custom canvas animations for visual interest.

## Architecture

### Core Pages Structure
- **Landing page** (`index.html`): Main entry point with hero animation, services preview, work samples, publications list, and FAQ
- **Informational pages**: `about.html`, `services.html`, `publications.html`, `apply.html`
- **Project case studies**: Individual HTML files (e.g., `LVOT_TMVR.html`, `CNS_Hematology.html`) that follow a template structure with detailed methodology breakdowns

### JavaScript Architecture
The site uses two main JavaScript files with distinct responsibilities:

- **`script.js`**: Global site functionality
  - Page transitions using View Transitions API with fallback overlay animation
  - Mobile menu toggle and state management
  - Smooth scrolling for anchor links with offset calculation
  - Active navigation state tracking using IntersectionObserver
  - Reveal-on-scroll animations for content sections
  - Number counting animations for statistics
  - Back-to-top button visibility control

- **`Project.js`** (case study pages only): Project-specific features
  - Automatic image path resolution using project slugs
  - Table of contents generation from heading structure
  - Copy-to-clipboard functionality for code blocks
  - Figure card interactions

### Styling System
The site uses a three-layer styling approach:

1. **Tailwind CSS** (via CDN): Utility-first styling embedded in `<script>` blocks in each HTML file with consistent theme configuration
2. **`styles.css`**: Global custom styles including CSS variables, glass morphism effects, navigation states, mobile menu, transitions, and accessibility features
3. **`Project.css`**: Case study-specific styles for tables of contents, figure cards, and code blocks

### Color System
CSS variables defined in `:root`:
- Backgrounds: `--slate` (#524E53), `--slate-deep` (#2A282B)
- UI: `--ui` (#D6CBDA - text), `--white` (#FFFFFF)
- Accents: `--orange` (#8650AB - primary CTA), `--green` (#CEDC57 - links/highlights)

Tailwind theme extension mirrors these as `slatebase`, `slateDeep`, `uiGray`, `brandOrange`, `brandGreen`.

### Hero Animation System
The landing page features a custom canvas-based animation system (`index.html`, lines 1503-1763):
- **FloatingItem class**: Manages particles (equations, Greek symbols, numbers) with depth-based scaling and opacity
- **GraphLine class**: Creates animated sine wave patterns in the background
- **HeroAnimation class**: Orchestrates rendering, handles responsive particle counts, uses IntersectionObserver for performance optimization
- Configuration in `CONFIG` object includes particle counts (20 mobile, 50 desktop), speed, colors, and content arrays

### Navigation Pattern
The site uses a dual navigation system:
- **Desktop**: Fixed sidebar (`.glass-sidebar`) with vertical navigation at 280px width
- **Mobile**: Sticky header with hamburger menu that expands to full-screen overlay with slide-in animation and staggered link transitions

## Development Commands

### Local Development
```bash
# Serve the static site locally (choose one):
npx serve .
python -m http.server 8000
```

Then open `http://localhost:8000` (or appropriate port) in your browser.

### Deployment
The site auto-deploys to GitHub Pages on push to `main` branch via `.github/workflows/deploy.yml`. No build step required.

## Key Implementation Patterns

### Adding New Project Case Studies
1. Duplicate an existing project HTML file (e.g., `LVOT_TMVR.html`) as a template
2. Create directory structure: `assets/projects/[project-slug]/plots/` for project images
3. Update the project slug in the HTML (used by `Project.js` for image path resolution)
4. Follow the existing section structure: Overview, Methods, Results, Code, Conclusion
5. Add project card to `index.html` in the `#work` section with SVG placeholder
6. Update `publications.html` if associated with a peer-reviewed publication

### Hero Animation Modifications
The hero animation is self-contained in `index.html`. Key modification points:
- **CONFIG object** (line 1504): Adjust particle count, speed, colors, content arrays
- **Equations/symbols**: Modify `CONFIG.equations`, `CONFIG.greek`, `CONFIG.numbers` arrays
- **Performance**: Particle counts are responsive (20 mobile, 50 desktop) and animation pauses when out of view

### Page Transitions
The site uses progressive enhancement for page transitions:
1. View Transitions API (Chromium browsers)
2. Fallback to CSS overlay fade (300ms)
3. Respects `prefers-reduced-motion` (disables all transitions)

### Responsive Behavior
- Mobile breakpoint: 1024px (lg: in Tailwind) switches from sidebar to header+mobile menu
- Content offset: 280px left margin on desktop (`lg:ml-[280px]`)
- Mobile header: 72px fixed height with backdrop blur
- Touch targets: Minimum 44px tap targets for accessibility

### Glass Morphism Effects
Glass card components use:
- `backdrop-filter: blur()` with `-webkit-` prefix for Safari
- Semi-transparent backgrounds: `rgba(42, 40, 43, 0.6)`
- Subtle borders: `rgba(255, 255, 255, 0.05)`
- Hover states with increased background opacity and translateY transforms

### Animation System
Uses IntersectionObserver for:
- Reveal-on-scroll: `.reveal-on-scroll` class with opacity/transform transitions
- Number counting: `[data-target]` attribute triggers counting animation
- Active navigation: Sections trigger nav link highlighting with 20% top / 70% bottom margins
- Lazy animations: Hero animation pauses when container not in viewport

## Important Notes

- **No build process**: Site is deployed as-is to GitHub Pages
- **Asset paths**: All paths are relative; works from any subdirectory
- **External dependencies**: Tailwind CSS and Prism.js loaded from CDN
- **GitHub Pages optimization**: `.nojekyll` file present to skip Jekyll processing
- **View Transitions API**: Feature detection with graceful fallback; not supported in Firefox/Safari as of 2024
- **Custom 404**: `404.html` matches site theme
- **Accessibility**: Proper ARIA labels, focus-visible states, keyboard navigation, reduced-motion preferences respected

## File Organization

```
/
├── index.html                    # Landing page with hero animation
├── about.html, services.html     # Info pages
├── publications.html, apply.html # Secondary pages
├── [ProjectName].html            # Case study pages
├── 404.html                      # Custom error page
├── script.js                     # Global JavaScript
├── Project.js                    # Case study JavaScript
├── styles.css                    # Global styles
├── Project.css                   # Case study styles
├── assets/
│   ├── PersonalPhoto.jpg         # Portrait (4:5 ratio)
│   ├── [logo].png                # Institution logos
│   └── projects/
│       └── [project-slug]/
│           └── plots/            # Project-specific images
├── .github/workflows/
│   └── deploy.yml                # GitHub Pages deployment
└── .nojekyll                     # Disable Jekyll processing
```
