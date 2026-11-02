<div align="center">

# P. Salmanul Faris

### Security Engineer · Penetration Tester · AI Developer · Full-Stack

[![Portfolio](https://img.shields.io/badge/🌐_Live_Portfolio-salman2610.github.io-3b82f6?style=for-the-badge)](https://salman2610.github.io)
[![Resume](https://img.shields.io/badge/📄_Resume-Download_PDF-10b981?style=for-the-badge)](./Salmanul_Faris_Cybersecurity_Resume%20.pdf)

<br/>

> *"Security is not a product, but a process."* — Bruce Schneier

</div>

---

## 👾 About This Repository

This repo powers my **personal portfolio**: a hand-built, interactive site with no framework and no build step. It is designed to show three complementary capabilities:

1. **Design & Creative Engineering**: visual storytelling, typography, motion design, interactive interfaces, WebGL, CSS and creative frontend engineering.
2. **Cybersecurity Engineering**: VAPT, application security, infrastructure security, penetration testing and security research.
3. **Software & Product Development**: SiteReliant, ProofLayer, RedScribe, AI tooling, full-stack development and product architecture.

The page is one continuous story. A heap of glass padlocks and keys falls into the hero and can be shoved around with the cursor. On scroll the pile unlocks and dissolves into particles, and one padlock and key stay with you, acting out each section until they become the particle **S** in the footer.

---

## 🔐 Who Am I?

```
Name      : P. Salmanul Faris
Role      : Security Engineer · Penetration Tester · AI Developer · Full-Stack
Focus     : Creative engineering · Web / API / Android VAPT (OWASP Top 10) · Secure product development
Based in  : Kozhikode, Kerala, India
Status    : [ OPEN TO OPPORTUNITIES ]
```

---

## ✨ Site Features

- 🌫️ **Vapour headline**: four titles (Security engineer, Pentester, AI developer, Full-stack) take turns, each dissolving left-to-right into drifting particles before the next one condenses.
- 🔒 **Physical padlock pile**: translucent glass-plastic padlocks, keys and cubes with a small custom physics engine. Move the cursor to push them, click or tap to make them pop.
- 🗝️ **A padlock that travels with you**: one lock and key follow the scroll, switching sides, then open, rattle, snap shut and react to each section (process steps, attack story, project cards) until they vanish into the footer.
- 🧭 **"How I work"**: a pinned, six-step process (Recon → Map → Test → Exploit → Report → Remediate), each step with a mini terminal showing what it looks like.
- 🕸️ **Attack story**: a scroll-driven network graph that walks through recon, enumeration, discovery, exploitation and remediation.
- 🔍 **Glass lens on projects**: project cards tilt, light up under the cursor and show a magnifying glass lens on hover.
- 🏅 **Certifications carousel**: the seven real certificates float in 3D, with the front card sharp and the rest tilted and blurred. The section pins while you scroll, so every certificate gets its turn before the page moves on. Arrow keys also work, and clicking the front card opens it in full.
- 🧰 **Toolkit**: the tools I actually work with, shown as an interactive grid.
- 🌍 **Dotted globe**: a draggable globe with a marker on Kozhikode and arcs to other cities.
- ⌨️ **Command palette**: press `⌘K` / `Ctrl+K` to jump anywhere.
- 🔊 **Sound toggle**, custom cursor, magnetic links and smooth scrolling.
- ⚡ **Adaptive quality**: lighter settings on phones and weaker devices, an automatic fallback if the frame rate drops, and support for `prefers-reduced-motion`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | HTML5, one page; styles in `assets/styles.css`, logic in `assets/app.js` |
| **3D** | Three.js r158, **self-hosted** in `vendor/` and loaded with a Subresource Integrity hash |
| **2D effects** | Canvas 2D (vapour text, particle field, globe) |
| **Motion** | `requestAnimationFrame`, custom smooth scroll and physics |
| **Fonts** | Syne · Inter, **self-hosted** (`fonts/`), no Google Fonts requests |
| **Hosting** | GitHub Pages |

If the 3D library fails to load, the page still works and simply skips the padlocks.

---

## 🚀 Selected Work

| Project | What it is | Links |
|---------|-----------|-------|
| **RedScribe** | Self-hosted, AI-powered pentest report generation platform (FastAPI, Next.js). In development. | [Live](https://redscribe-2291.vercel.app/) · [Repo](https://github.com/salman2610/redscribe) |
| **SiteReliant** | Website operations platform for agencies: HTTP, TLS, DNS and TCP monitoring, synthetic browser journeys with an evidence vault, root-cause hints, and fix verification before an incident can close. White-label client portals and SLA reports. | [Live](https://site-reliant.vercel.app/) · [Repo](https://github.com/salman2610/SiteReliant) |
| **Purple Agent** | Server monitoring agent with centralised telemetry and JWT-authenticated communication. | [Live](https://purple-agent-omega.vercel.app/) · [Repo](https://github.com/salman2610/purple-agent) |
| **ProofLayer** | Verifies that a security fix really worked: replays the attack and alternate routes, returns one of five verdicts, and issues a sealed proof record anyone can check offline. | [Live](https://proof-layer-zeta.vercel.app) · [Repo](https://github.com/salman2610/ProofLayer) |
| **AI Vulnerability Scanner** | ML-assisted scanner that maps findings to CVSS v3.1 and prioritises the fixes. | [Repo](https://github.com/salman2610/ai-vuln-scanner) |
| **OWASP Security Framework** | Modular Python pipeline (Nmap, Nikto, Nuclei, API fuzzing) with OWASP Top 10 mapping and HTML reports. | [Repo](https://github.com/salman2610/OWASP-Framework) |
| **Purple Team Framework** | Real-time threat-hunting dashboard mapped to MITRE ATT&CK (FastAPI + React). | [Repo](https://github.com/salman2610/PurpleTeam-Project) |

---

## 🗂️ Repository Structure

```
salman2610.github.io/
│
├── 📄  index.html                    # Page markup, metadata and Content-Security-Policy
├── 🎨  assets/
│   ├── styles.css                    # All styles (incl. self-hosted @font-face)
│   └── app.js                        # All behaviour (no inline scripts)
├── 🔤  fonts/                        # Syne and Inter, woff2
├── 🧊  vendor/three.min.js           # Three.js r158, SRI-pinned
├── 🖼️  og.png                        # Social preview image
├── 🔐  .well-known/security.txt      # How to report a vulnerability
├── 🤖  robots.txt · sitemap.xml
├── ⚙️  _headers                      # Real security headers (Netlify / Cloudflare Pages only)
├── 🖼️  Assets/                       # Images & media files (existing)
├── 📋  Salmanul_Faris_Cybersecurity_Resume.pdf
└── 🔍  Redacted Report.pdf
```

---

## ▶️ Run Locally

The page loads its script and styles as separate files, so serve the folder instead of opening `index.html` directly:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## 🔒 Security

A security engineer's site should be hard to attack. What is in place, and what isn't:

- **Strict Content-Security-Policy** (meta tag): `script-src 'self'`, no inline scripts, no `eval`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`, `frame-src 'none'`, `upgrade-insecure-requests`. Tested: injected inline scripts and inline event handlers are blocked.
- **Zero third-party requests**: fonts and Three.js are self-hosted, so there is nothing to tamper with and no visitor data goes to a CDN. Three.js is loaded with a **Subresource Integrity** hash.
- **No XSS sinks fed by users**: the hero terminal prints with `textContent`, and its command lookup only accepts its own commands (no prototype lookups).
- **Clickjacking guard**: the page refuses to render inside someone else's frame.
- **Link hygiene**: every external link uses `rel="noopener noreferrer"`; a `Referrer-Policy` is set.
- **No cookies, no storage, no tracking, no network calls from the page.**
- **Accessibility as security hygiene**: dialogs trap focus, restore it on close, and make the page behind inert; the global arrow-key shortcut never fires while typing.
- **`security.txt`** at `/.well-known/security.txt` for responsible disclosure.

Limits: GitHub Pages cannot send HTTP response headers, so `frame-ancestors`, HSTS and `X-Frame-Options` can't be set there. The `_headers` file contains the full set for Netlify or Cloudflare Pages. `style-src` still allows inline styles because the page sets some styles per element.

---

## 🏅 Certifications

| | Certification | Issuer | Year |
|--|--------------|--------|------|
| 🛡️ | Certified Penetration Tester (CPT v3) | RedTeam Hacker Academy | 2025 |
| 🎯 | Ethical Hacker | Cisco Networking Academy | 2025 |
| 🌐 | Fortinet Certified Associate in Cybersecurity | Fortinet | 2025 |
| 🔗 | Cyber Threat Management | Cisco Networking Academy | 2025 |
| 🔧 | FortiGate 7.6 Operator (NSE 3) | Fortinet | 2025 |
| 🕵️ | Advent of Cyber 2024 | TryHackMe | 2025 |
| 💻 | Advanced Program in Full Stack Software Engineering | NIIT | 2021 |

---

## 🙏 Credits

The vapour text effect is adapted from the *VaporizeTextCycle* component on [21st.dev](https://21st.dev). The glass-material and DOM-plus-WebGL approach was inspired by the write-ups of other portfolios, rebuilt here from scratch.

---

## 📊 GitHub Stats

<div align="center">

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=salman2610&show_icons=true&theme=tokyonight&hide_border=true&bg_color=0a0a0f&title_color=3b82f6&icon_color=f59e0b&text_color=a0a0b0)

</div>

---

<div align="center">

*Built with 🖤 · © 2026 P. Salmanul Faris*

</div>
