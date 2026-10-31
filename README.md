# PitchPerfect AI

A speech coaching workspace for students, speakers and competition entrants. Draft a speech, choose who it is for and what it should do, then get a structured scorecard, an improved revision, and an optional email report.

**Every score, note and revision in this project is demo feedback produced by a fixed, deterministic rubric — no AI model or API is called anywhere in the app.**

---

## Features

- **Landing page** — product overview, feature tour, three-step workflow and honest demo disclosure.
- **Workspace** — speech title and body, live word counter and speaking-time estimate, 50-word minimum, audience (General / Students / Professionals / Judges) and goal (Inform / Persuade / Inspire / Entertain) selectors, and a built-in sample speech.
- **Analysis** — five scored dimensions out of 100: Opening Hook, Clarity, Structure, Audience Engagement and Conclusion. Includes an overall score, strengths, weaknesses, an improvement plan and delivery tips.
- **Revision** — the original draft beside a sample rewrite, plus suggested improvements and one-click copy of the revised speech.
- **Email reports** — sends title, scores, strengths and improvements to a Make.com webhook, which can forward the report by email. Never includes the speech body.

Drafts and results live in `sessionStorage` for the current tab only. There is no login, database or payment flow.

## Tech stack

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · React Router 6

## Quick start

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Vite prints the local URL (usually `http://localhost:5173`).

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Type-check with TypeScript, then build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Email reports (Make.com)

Email reports are optional. Without a webhook the app still works; the analysis page shows a setup notice and the send button reports that it is not configured.

### 1. Create the Make.com scenario

1. Create a new scenario and add a **Webhooks → Custom webhook** module. Create a webhook and copy its URL.
2. Add an **Email → Send an email** module after the webhook.
3. Map fields from the webhook payload into the email:
   - **To:** `recipientEmail` (fall back to a fixed address if the visitor left it blank)
   - **Subject:** e.g. `Speech report: {{speechTitle}} — {{overallScore}}/100`
   - **Content:** scores, strengths and improvements from the payload.
4. Turn the scenario **on**.

The first request must be sent to a fresh Make webhook before the scenario can be tested; run the app once, or use Make's "Run once" with the webhook URL.

### 2. Configure the app

Create `.env.local` in the project root (it is git-ignored):

```bash
VITE_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/your-webhook-id
```

Only an `https://` webhook endpoint belongs here — the app rejects placeholder or `http://` URLs. Restart `npm run dev` after changing the file. For a production build, set the same environment variable in your host (see Vercel below) and rebuild.

`.env.example` documents the variable with an empty value.

### Payload

`POST` as `application/json`, 15-second timeout. Example:

```json
{
  "source": "PitchPerfect AI",
  "reportType": "speech-analysis-demo",
  "generatedAt": "2026-10-30T12:00:00.000Z",
  "recipientEmail": "reader@example.com",
  "speechTitle": "The Quiet Kid in the Back Row",
  "audience": "Students",
  "goal": "Inspire",
  "wordCount": 259,
  "overallScore": 64,
  "scores": [
    { "dimension": "Opening Hook", "score": 52 },
    { "dimension": "Clarity", "score": 66 },
    { "dimension": "Structure", "score": 88 },
    { "dimension": "Audience Engagement", "score": 72 },
    { "dimension": "Conclusion", "score": 43 }
  ],
  "strengths": ["The paragraph order earns its build."],
  "improvements": ["Rewrite the first sentence as a scene, not an announcement."],
  "disclaimer": "Demo analysis produced by a fixed rubric; no AI was used. The speech text is intentionally not included in this report."
}
```

`recipientEmail` is `null` when the visitor does not enter an address. These are the only fields sent: the speech body never leaves the browser. Error states cover a missing/invalid configuration, an invalid email, HTTP failures, network/CORS failures and timeouts.

## Deployment

### Vercel

1. Push the project to a Git repository (GitHub, GitLab or Bitbucket).
2. In Vercel, **Add New → Project** and import the repository.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Add `VITE_MAKE_WEBHOOK_URL` under **Settings → Environment Variables** (optional).
5. Deploy.

`vercel.json` rewrites all paths to `index.html`, so deep links such as `/analysis` or `/revision` work on refresh. Any static host with SPA rewrites will work the same way; serve the `dist/` folder.

### GitHub

The included `.gitignore` excludes `node_modules`, `dist`, `.env*` and `.vercel`, so no local build output or secrets are committed.

```bash
npm install
npm run build
```

## Project structure

```
├── index.html
├── public/favicon.svg
├── src/
│   ├── components/     # Navbar, Footer, Layout, Logo, ScoreRing, CopyButton, EmailReport
│   ├── context/        # SpeechContext — draft + result state, sessionStorage persistence
│   ├── lib/
│   │   ├── analysis.ts # Deterministic scoring rubric and feedback
│   │   ├── revision.ts # Sample rewrite and template-based revision
│   │   ├── sampleSpeech.ts
│   │   ├── email.ts    # Webhook payload, validation, send with timeout
│   │   ├── text.ts     # Word counting, sentence splitting, fillers, formatting
│   │   ├── validation.ts
│   │   └── ui.ts       # Button class helpers and score tone mapping
│   ├── pages/          # Landing, Workspace, Analysis, Revision, NotFound
│   ├── App.tsx         # Routes
│   └── index.css       # Tailwind layers and component styles
├── tailwind.config.cjs
├── vercel.json
└── .env.example
```

## Demo limitations

- **No AI.** Scores come from text statistics (length, sentence variety, paragraphing, filler phrases, opening/closing patterns) plus a hash-seeded offset, so the same draft always produces the same result. They are illustrative, not an assessment of speaking ability.
- **Revision is a template.** The built-in sample gets a hand-written revision; other drafts get rule-based polish (filler removal, stronger opening/closing, transitions). Both are labelled as sample content.
- **Session only.** Speech text and results clear when the tab closes, unless you analyse again after a reload (the draft is restored from `sessionStorage`).
- **Email needs Make.com.** No mail is sent by this repository itself; delivery depends on an active Make.com scenario. The webhook URL is a public endpoint by nature, so keep the Make scenario scoped to report emails.
