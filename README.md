# Marketing CoPilot OS

A polished GenAI marketing operating system built with Next.js, Tailwind CSS, and Google Gemini. The app bundles brand setup, persona insights, a multi-channel content studio, experimentation planner, and an AI chat copilot into a single SaaS-style workspace.

## ✨ High-level architecture

- **Framework**: Next.js (Pages Router) with React 18, styled using Tailwind CSS for rapid yet consistent UI polish.
- **State management**: Lightweight React context (`BrandContext`) stores brand workspaces in `localStorage` so each module can reuse the same context. Module-specific data (personas, experiments) is lifted to the root page and passed as props.
- **AI integration**: A single API route (`/api/gemini`) receives requests from each module. It composes rich prompts (stored in `lib/prompts.js`) and calls the Google Gemini REST API via `lib/gemini.js`.
- **Modules**: Each module lives in `/components` and renders inside the shared layout with tab navigation. The chat module reuses persona/experiment output by passing the latest JSON as context in the prompt.

## 📂 Folder structure

```
.
├── components
│   ├── ChatCopilot.js          # AI chat interface aware of brand/persona/experiment context
│   ├── ContentStudio.js        # Multi-channel content generator with copy buttons
│   ├── ExperimentPlanner.js    # Experiment board with editable status/notes
│   ├── Layout.js               # Global shell with navigation and brand switcher
│   ├── PersonaGenerator.js     # Persona generator consuming Gemini output
│   └── SetupForm.js            # Brand & audience configuration saved to localStorage
├── context
│   └── BrandContext.js         # React context managing brand workspaces
├── lib
│   ├── gemini.js               # Fetch helper + prompt templating for Gemini API
│   └── prompts.js              # Prompt templates for personas, content, experiments, chat
├── pages
│   ├── _app.js                 # Wraps pages in BrandProvider and imports Tailwind styles
│   ├── api
│   │   └── gemini.js           # Serverless function proxying Gemini requests
│   └── index.js                # Landing dashboard coordinating module state/tabs
├── public                      # Static assets (add logos/screenshots here)
├── styles
│   └── globals.css             # Tailwind base + bespoke UI utilities
├── utils
│   └── helpers.js              # Small helpers (ID generator, date formatting)
├── jsconfig.json               # Absolute import aliases for cleaner imports
├── package.json                # Next.js project metadata and dependencies
├── postcss.config.js           # Tailwind/PostCSS configuration
├── tailwind.config.js          # Tailwind theme extension
└── README.md                   # Project documentation and setup steps
```

## 🔑 Environment variables

Create a `.env.local` file in the project root with:

```
GEMINI_API_KEY=your_google_gemini_api_key
```

> 🚫 Never commit your actual key. Vercel and Netlify let you configure this via their dashboard.

## 🛠️ Local development setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the dev server**
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## ☁️ Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, click **New Project** → import your repo.
3. Set `GEMINI_API_KEY` in the **Environment Variables** section.
4. Leave the default build command (`npm run build`) and output directory (`.next`).
5. Deploy. Vercel will handle installing dependencies, building, and provisioning the serverless Gemini proxy.

## 🧭 Usage walkthrough

1. **Setup**: Create a brand workspace with name, description, audience, geography, and goal. Multiple workspaces can be stored locally.
2. **Personas**: Paste qualitative insights (optional) and generate 3–5 personas. Cards display goals, pains, triggers, objections, preferred channels, and quotes.
3. **Content Studio**: Select persona, tone, and objective to produce LinkedIn posts, Instagram carousel, WhatsApp copy, and email assets. Use built-in copy buttons.
4. **Experiment Planner**: Generate campaign angles for a goal/channel, edit status, and jot down learnings for each hypothesis.
5. **Campaign Copilot**: Chat with Gemini-powered assistant that automatically references your brand setup, personas, and experiment board for deeply contextual answers.

## 🧩 Tech notes

- **Local persistence**: Brand workspaces are stored in `localStorage` (`marketing-copilot-brands`). Personas/experiments reset when you switch brands to avoid accidental reuse.
- **Gemini responses**: Prompts ask Gemini to return structured JSON. The API handler parses and gracefully handles malformed responses by surfacing the raw text.
- **Styling**: Tailwind theme extends a custom `brand` colour scale for consistent CTAs, pill badges, and gradients.
- **Accessibility**: Buttons and interactive elements use semantic HTML with clear focus states.

## 🚀 Future enhancements (optional)

- Swap `localStorage` for Supabase/Firebase to enable true multi-tenant persistence.
- Add analytics dashboards (web traffic, campaign KPIs) by integrating mock data or GA4 exports.
- Implement persona tagging, approvals, and collaboration features for team workflows.

---
Crafted for the IIM Ahmedabad “GenAI in Marketing” capstone to look investor-ready while remaining beginner-friendly to build and deploy.
