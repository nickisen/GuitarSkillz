# GuitarSkillz.com - Random Guitar Tab Generator

GuitarSkillz.com ist ein client-seitiges Webprojekt, das zufällige, spielbare Gitarren-Tabs generiert. Es dient als Übungswerkzeug für Gitarristen, um ihre Fähigkeiten im Blattlesen und ihre Fingerfertigkeit zu verbessern. Die Anwendung wird als Static Site (SSG) mit Astro erstellt und nutzt eine interaktive React-Insel für das Generator-Widget.



## Features

* **Random Tab Generator:** Erzeugt rhythmisch und melodisch plausible Tabs.
* **Spielbarkeits-Algorithmus:** Stellt sicher, dass Tabs "hand-reachable" sind (berücksichtigt maximalen Fingerspreiz).
* **Interaktives UI:** Parameter wie Takte, Komplexität und Tempo einstellbar.
* **Animierter Playhead:** Eine rote Linie läuft synchron zum eingestellten Tempo über die Tabs.
* **Export-Funktionen:** Tabs als SVG, PNG oder ASCII-Text exportieren.
* **Metronom:** Integriertes WebAudio-Metronom.
* **SEO & Performance:** Optimiert für hohe Lighthouse-Scores und gute Auffindbarkeit.

## Tech-Stack

* **Framework:** [Astro](https://astro.build/) (Static Site Generation)
* **UI-Komponente:** [React](https://reactjs.org/) (via Astro Islands)
* **Sprache:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Testing:** [Vitest](https://vitest.dev/) (Unit Tests), [Playwright](https://playwright.dev/) (E2E Tests - *geplant*)
* **Linting/Formatting:** ESLint + Prettier
* **CI/CD:** GitHub Actions

## Projekt-Setup & Entwicklung

### Voraussetzungen

* Node.js (v18 oder neuer)
* npm (oder pnpm/yarn)

### 1. Klonen & Installieren

```bash
git clone [https://github.com/your-user/guitarskillz.com.git](https://github.com/your-user/guitarskillz.com.git)
cd guitarskillz.com
npm install