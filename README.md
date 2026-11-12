# cyberinfospace.github.io

Official GitHub Pages portal and project directory for **Cyber Info Space (CIS)**.

- Live site: [https://cyberinfospace.github.io](https://cyberinfospace.github.io)
- Project catalog: [`data/projects.json`](data/projects.json) (synced from `cis-core/projects/dist/public-projects.json`)

---

## Reference

Repository design assets, specifications, and implementation references live under [`docs/design/`](docs/design/):

| Resource | Path | Purpose |
|---|---|---|
| **Design Specification** | [`docs/design/design-spec.md`](docs/design/design-spec.md) | 2027 Premium Hybrid architecture, color/type tokens, copy rules, trust guardrails, and WCAG 2.2 AA acceptance criteria |
| **Visual Concept Preview** | [`docs/design/design-preview.png`](docs/design/design-preview.png) | Desktop and mobile layout reference for the hybrid light editorial + dark AI systems theme |
| **Brand & Hero Assets** | [`assets/`](assets/) | Scalable CIS orbital mark (`cis-mark.svg`) and responsive hero orbital renders (`hero-orbital-*.webp` / `.jpg`) |
| **Security Policy** | [`SECURITY.md`](SECURITY.md) | Responsible vulnerability disclosure policy and official security contact route |
| **Contributor Rules** | [`AGENTS.md`](AGENTS.md) | Repository hygiene, Conventional Commits, and CI pinning guidelines |

### Official External Links

- **Official Website:** [cyberinfospace.com](https://www.cyberinfospace.com)
- **GitHub Organisation:** [github.com/cyberinfospace](https://github.com/cyberinfospace)
- **Public Repositories:** [github.com/cyberinfospace?tab=repositories](https://github.com/cyberinfospace?tab=repositories)

### Updating Styles or Scripts

GitHub Pages serves static assets with `cache-control: max-age=600`. When updating `styles.css` or `app.js`, increment the `?v=...` query parameter in [`index.html`](index.html) and [`404.html`](404.html) so returning browsers fetch the latest assets immediately.
