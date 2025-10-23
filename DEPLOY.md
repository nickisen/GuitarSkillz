---

### `DEPLOY.md`

```markdown
# Deployment-Anleitung

Dieses Projekt ist eine statische Website (SSG), die mit Astro erstellt wurde. Es kann auf jedem statischen Hosting-Dienst bereitgestellt werden.

## Vercel

1.  **Repo importieren:** Verbinden Sie Ihr Git-Repository (GitHub, GitLab, Bitbucket) mit Vercel.
2.  **Projekt-Setup:** Vercel erkennt Astro automatisch.
3.  **Build-Einstellungen:**
    * **Framework Preset:** `Astro`
    * **Build Command:** `npm run build` (oder `astro build`)
    * **Output Directory:** `dist`
4.  **Deploy:** Klicken Sie auf "Deploy". Es sind keine Umgebungsvariablen erforderlich.