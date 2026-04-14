# Segal Build — Builder Variation App
## Handover Document (Updated: April 2026 — Session 7)

---

## ⚠️ CRITICAL RULES FOR NEXT AI/DEVELOPER

1. **ALL FILES EXIST** — never assume a file is empty or missing
2. **ALWAYS ASK FOR FILES** before editing — read them first, never guess content
3. **ALWAYS UPDATE THIS HANDOVER** after every major change
4. **Tailwind v4** — use `@import "tailwindcss"` NEVER `@tailwind base/components/utilities`
5. **No "Decline" button** — always use "Request Revised Quote" to keep the job alive
6. **viewMode** is in `AppState` — NOT local component state
7. **activeVariationId** is in `AppState` — NOT local component state
8. **Firebase Storage NOT active** — on Spark (free) plan, Storage requires Blaze upgrade
9. **Cloudinary** is used for photo/video storage — Cloud Name: `446179`, Preset: `segal_build_uploads`
10. **No authentication yet** — app is builder-only, customer portal planned for Session 8
11. **`setVariationStatus`** aliased as `setVariationStatusInProjects` in useProjectWorkspace.ts

---

## Live URL
**https://segal-build-app.web.app**

---

## Tech Stack

| Layer | Tech | Notes |
|-------|------|-------|
| Framework | React 18 + TypeScript | |
| Build | Vite | |
| Styling | Tailwind CSS v4 | Use `@import "tailwindcss"` only |
| AI | Google Gemini API | `@google/generative-ai` — multi-model fallback |
| Photo/Video Storage | Cloudinary | Cloud: `446179`, Preset: `segal_build_uploads` |
| File Hosting | Firebase Hosting | `segal-build-app.web.app` |
| Database | localStorage | Firestore migration planned |
| PDF | Native `window.print()` | |
| Communication | Native SMS/Email/WhatsApp | `mailto:`, `sms:`, `wa.me` — no backend |

---

## Current File Map

```text
appB/
├── public/
│   └── logos/
│       ├── segal-build.png
│       └── segval.png
│
├── src/
│   ├── App.tsx                          ✅ S5 — passes activeVariationId + setActiveVariationId + companyId
│   ├── gemini.ts                        ✅ Stable — multi-model fallback chain
│   ├── firebase.ts                      ✅ Stable — Firestore db + Storage exports
│   │
│   ├── types/
│   │   ├── domain.ts                    ✅ S6 — ChangeLogEntry, ProgressPhoto, ProgressUpdate, StageProgressStatus
│   │   └── appState.ts                  ✅ S5 — selectedProjectId + activeVariationId + activeViewMode
│   │
│   ├── constants/
│   │   └── companies.ts                 ✅ Stable — Segal Build + Segval profiles
│   │
│   ├── logic/
│   │   ├── usePersistedAppState.ts      ✅ S5 — Firestore primary + localStorage fallback
│   │   ├── useProjectWorkspace.ts       ✅ S5 — setVariationStatus aliased, updateVariation, createVariationRevision
│   │   ├── stateService.ts              ✅ S1 — createEmptyState + safe migration
│   │   ├── projectService.ts            ✅ Stable
│   │   ├── photoService.ts              ✅ S5 — compressImageToDataUrl + uploadPhotoToFirebase
│   │   └── firestoreService.ts          ✅ S5 — NEW — Firestore load/save/subscribe
│   │
│   ├── utils/
│   │   ├── id.ts                        ✅ Stable
│   │   ├── smartQuestions.ts            ✅ Stable — 12 room types
│   │   ├── variationGuards.ts           ✅ Stable — isVariationLocked + createRevision
│   │   └── pricing/
│   │       ├── index.ts                 ✅ Stable
│   │       ├── constants.ts             ✅ Stable — VICTORIAN_TRADE_RATES, getAutoPrice
│   │       ├── engine.ts                ✅ Stable — generateSolutions (Essential/Standard/Premium)
│   │       ├── answerRules.ts           ✅ Stable — 50+ answer→stage rules
│   │       └── templates/
│   │           ├── types.ts             ✅ Stable
│   │           ├── index.ts             ✅ Stable — ROOM_STAGE_MAP
│   │           ├── bathroom.ts          ✅ Stable
│   │           ├── kitchen.ts           ✅ Stable
│   │           ├── laundry.ts           ✅ Stable
│   │           ├── flooring.ts          ✅ Stable
│   │           ├── bedroom.ts           ✅ Stable
│   │           ├── living.ts            ✅ Stable
│   │           ├── structural.ts        ✅ Stable
│   │           ├── windows.ts           ✅ Stable
│   │           ├── outdoor.ts           ✅ Stable
│   │           ├── roofing.ts           ✅ Stable
│   │           ├── painting.ts          ✅ Stable
│   │           └── general.ts           ✅ Stable
│   │
│   └── components/
│       ├── AppHeader.tsx                ✅ Stable — company switcher + Gemini API key
│       ├── NewProjectForm.tsx           ✅ Stable — create project + welcome email modal
│       ├── ProjectBoard.tsx             ✅ S5 — activeVariationId as prop, status badges
│       ├── ProjectList.tsx              ✅ Stable — project selector + delete
│       ├── VariationWizard.tsx          ✅ S5 — draft auto-save + photo AI analysis
│       ├── LoadingSpinner.tsx           ✅ Stable
│       ├── ProjectChat.tsx              ✅ S4 — 2 tabs: Notes + Contact Customer
│       ├── OverviewStep.tsx             ✅ Stable
│       ├── DimensionsStep.tsx           ✅ Stable
│       ├── QuestionsStep.tsx            ✅ Stable
│       ├── ReviewStep.tsx               ✅ Stable
│       │
│       └── report/
│           ├── VariationReport.tsx      ✅ S6 — 4 tabs: Builder/Customer/Progress/PDF
│           ├── BuilderView.tsx          ✅ S3 — change log panel
│           ├── CustomerView.tsx         ✅ S4 — full report, canvas signature, contact buttons
│           ├── ReportSendModal.tsx      ✅ S4 — SMS + WhatsApp + Outlook + Email
│           ├── ReportLetterhead.tsx     ✅ Stable
│           ├── ProgressHub.tsx          ✅ S6 — NEW — Photos/Stages/Updates tabs
│           │
│           └── builder-modules/
│               ├── DocumentEditor.tsx   ✅ Stable — AI scope generation + text editing
│               ├── QuoteOptions.tsx     ✅ Stable — Option 1/2/3 selector
│               ├── PricingHeader.tsx    ✅ Stable — Builder Cost / Client Price / Margin
│               ├── TradeToggles.tsx     ✅ Stable — trade filter buttons
│               └── StageManager.tsx     ✅ S5 — cascading trades mini-wizard
```

---

## All Confirmed Working Features

### 1. ✅ State Persistence & Navigation (S1)
- `selectedProjectId`, `activeVariationId`, `activeViewMode` in `AppState`
- `ProjectBoard` receives `activeVariationId` as prop — not local state
- Auto-defaults to first variation when switching projects

### 2. ✅ Wizard Draft Auto-Save (S1)
- Saves to `wizard_draft_{projectId}_{mode}` on every keystroke
- Restores: title, description, roomType, dimensions, answers, step
- Shows "📝 Draft restored" banner with "Clear Draft" button
- Clears automatically on successful generate

### 3. ✅ Tailwind CSS on Deployed Site (S2)
- ⚠️ CRITICAL: `@import "tailwindcss"` only — never `@tailwind base`
- Tailwind v4 installed — v3 syntax silently breaks deployed build

### 4. ✅ Customer View — Full Report (S2+S3)
- Letterhead, project details, scope, schedule table, trade summary, GST totals
- Terms & conditions, canvas signature pad, contact buttons

### 5. ✅ Canvas Signature Pad (S4)
- HTML5 canvas — mouse + touch support
- Saved as PNG base64 to `variation.customerSignature`
- Triggers `isVariationLocked()` → green lock banner in builder view

### 6. ✅ Customer Actions — No Decline (S3+S4)
| Button | Status Set | What Happens |
|--------|-----------|--------------|
| ✅ Approve & Sign | `approved` | Canvas signature saved, document locked |
| 💬 Request Changes | `pending` | Comment saved, contact buttons shown |
| 🔄 Request Revised Quote | `pending` | Revision request, builder gets second chance |

**"Decline" permanently removed** — always give builder a second chance.

### 7. ✅ Change Log (S3)
- Every action recorded: actor, timestamp, comment, status
- Visible in both Builder View and Customer View
- `ChangeLogEntry[]` on every `Variation`

### 8. ✅ Native Communication (S4)
**Builder → Customer:** Email App, Gmail, Outlook, SMS, WhatsApp, Clipboard
**Customer → Builder:** Call, SMS, Email, WhatsApp — all pre-filled with project name
**ProjectChat:** Notes tab (internal) + Contact Customer tab (native device links)

### 9. ✅ Progress Hub (S6)
Three tabs on every variation:
- **📸 Photos** — upload, tag to stage, caption, AI analyse, Firebase Storage upload
- **📊 Stages** — tap to cycle Not Started → In Progress → Complete, progress bar
- **📢 Updates** — compose message, attach photo, send via SMS/WhatsApp/Email/Copy

### 10. ✅ Approval Locking (S1)
- `isVariationLocked()` → `status === "approved" && !!customerSignature`
- `createRevision()` clears signature, resets to draft, appends "(Revision)", new ID

### 11. ✅ Modular Report Architecture (S1)
- `BuilderView` composes 5 modules: DocumentEditor, QuoteOptions, PricingHeader, TradeToggles, StageManager
- `CustomerView` isolated presentation layer (print-optimised)
- `VariationReport` orchestrates 4 view modes

### 12. ✅ PDF Export (S1)
- `window.print()` → switches to CustomerView → prints after 500ms delay
- Buttons hidden via `.print:hidden`

### 13. ✅ AI Integration (S1)
- Chain: `gemini-2.5-flash → 2.0-flash → 2.0-flash-lite → 1.5-flash`
- `elaborateWithAI()` — full scope from notes + Q&A + photos
- `enhanceTextWithAI()` — polish raw builder notes
- `analyzePhotoWithAI()` — site photo defect analysis
- `generateSummaryWithAI()` — client-friendly summary
- Key stored in localStorage via AppHeader

### 14. ✅ Pricing Engine (S1+S5)
- 12 room templates, 3 solutions (Essential ×0.9 / Standard ×1.0 / Premium ×1.2)
- 50+ answer→stage rules, 50+ Victorian trade rates (2024/25)
- `getAutoPrice()` — auto-prices manually added stages
- Cascading trades: adding a stage suggests related trades with dimensions

### 15. ✅ Company Branding (S1)
- `COMPANIES` registry — Segal Build Pty Ltd + Segval
- Switchable via dropdown in AppHeader
- Letterhead in ReportLetterhead.tsx

---

## Planned Features — Session 8+ (Priority Order)

### 🔴 1. Cloudinary Integration (Next — Session 8)
**Status:** Credentials ready, NOT yet implemented in code
- **Cloud Name:** `446179`
- **Upload Preset:** `segal_build_uploads`
- Replace Firebase Storage (not active — requires Blaze plan)
- Supports photos AND videos
- Free: 25GB storage, 25GB bandwidth/month
- Folder structure: `segal-build/projects/{projectId}/{photoId}`

### 🔴 2. Google Drive PDF Save (Session 8)
**Status:** Planned
- Save generated quotes/variations as PDF to Google Drive
- No backend needed — Google Drive API or direct download
- Triggered from "Save PDF" button with "Save to Drive" option

### 🔴 3. Multiple Customers Per Project (Session 8)
**Status:** Planned — simple change to domain types
- Add `customers[]` array to `Project` type
- Currently only `customerName` + `customerEmail` (single customer)
- Each customer gets separate portal access
- UI: Add/remove customers in ProjectBoard

### 🔴 4. Delete Project → Google Drive Backup → Cloudinary Cleanup (Session 8)
**Status:** Planned
- Delete button shows warning modal
- Step 1: "Save to Google Drive?" → exports full project PDF/ZIP
- Step 2: Deletes Cloudinary photos for that project
- Step 3: Deletes from localStorage/Firestore
- ⚠️ Cloudinary delete needs API Secret — handle server-side or gracefully skip

### 🟡 5. Firebase Authentication + Customer Portal (Session 8-9)
**Status:** Planned — significant feature
**What's needed:**
- Firebase Auth (email/password or magic link) — free tier
- Each customer gets unique login
- Customer sees ONLY their assigned project
- Separate route: `/customer/:projectId`
- Customer emailed a magic link → clicks → sees their project only
- Currently app is builder-only — NO authentication exists

### 🟡 6. Firestore Migration (Session 9)
**Status:** Partially implemented in code (firestoreService.ts exists)
- Need to enable Firestore in Firebase Console
- All data currently in localStorage — lost if cache cleared
- Firebase project: `segal-build-app`
- Region: `australia-southeast1`

### 🟢 7. Photo AI Analysis in Wizard (Low)
- `aiAnalysis` field exists but not auto-populated during wizard
- Call `analyzePhotoWithAI()` after each photo upload

### 🟢 8. Signature on PDF (Low)
- Canvas signature may not render in all print browsers
- Convert canvas to `<img>` tag before printing

### 🟢 9. Cascading Trades Improvement (Low)
- Currently suggests related trades when adding a stage
- Could be smarter — e.g. new wall → ask size → auto-price plastering + painting + electrical

---

## Data Flow

```
localStorage
    └── "segal_build_modular_state_v1"  (full AppState JSON)
            ├── projects[]              (all projects + variations + messages)
            ├── companyId               (active company)
            ├── selectedProjectId       (which project is open)
            ├── activeVariationId       (which variation tab is open)
            └── activeViewMode          (builder/customer/progress)

localStorage (separate keys)
    ├── "geminiApiKey"                  (AI key — set via AppHeader)
    └── "wizard_draft_{projectId}_{mode}" (in-progress wizard draft)

Cloudinary (PLANNED — not yet implemented)
    └── segal-build/
            └── projects/
                    └── {projectId}/
                            ├── {photoId}.jpg
                            └── {videoId}.mp4

Firebase (current)
    └── Hosting only — segal-build-app.web.app
        (Storage NOT active — requires Blaze plan upgrade)
```

---

## Communication Flow

```
Builder → Customer:
  ReportSendModal → Email App / Gmail / Outlook / SMS / WhatsApp / Clipboard

Customer → Builder (after action):
  CustomerView → Call / SMS / Email / WhatsApp (all pre-filled)

Internal (builder notes):
  ProjectChat → Notes tab → saved to project.messages[]

Progress Updates:
  ProgressHub → Updates tab → SMS / WhatsApp / Email / Copy
```

---

## Deployment

```bash
# Local development
npm run dev

# Build and deploy
npm run build
firebase deploy

# Firebase project
segal-build-app

# Live URL
https://segal-build-app.web.app
```

---

## Session 8 — Files Changed

| File | What Changed |
|------|-------------|
| `src/types/domain.ts` | Added `ProjectCustomer` interface + `customers[]` on `Project` |
| `src/logic/projectService.ts` | `buildProject()` now creates `customers[]` from payload |
| `src/logic/stateService.ts` | Migration for old projects without `customers[]` |
| `src/logic/cloudinaryService.ts` | **NEW** — Cloudinary upload (images + videos), scheduleDelete |
| `src/logic/photoService.ts` | Now uses Cloudinary instead of Firebase Storage |
| `src/components/ProjectList.tsx` | Enhanced delete modal — Google Drive backup + confirmation |
| `src/components/ProjectBoard.tsx` | Added **👥 Manage Customers** modal — add/remove/set primary/contact |
| `src/App.tsx` | Added `onUpdateProject` handler + `handleUpdateProject` |

## Sessions Log

| Session | Date | Key Changes |
|---------|------|-------------|
| Session 1 | Apr 2026 | State persistence fix, wizard draft auto-save, approval locking |
| Session 2 | Apr 2026 | Tailwind v4 fix, CustomerView rebuilt, white screen fix |
| Session 3 | Apr 2026 | Change log system, customer actions (approve/request), TS build fix |
| Session 4 | Apr 2026 | Canvas signature pad, native SMS/WhatsApp/Email, ProjectChat 2-tab |
| Session 5 | Apr 2026 | Cascading trades, photo AI analysis, Firestore service, Cloudinary planned |
| Session 6 | Apr 2026 | ProgressHub (photos/stages/updates), VariationReport 4-tab layout |
| Session 7 | Apr 2026 | Handover updated — Cloudinary credentials documented, customer portal planned, multiple customers planned, Google Drive planned |
| Session 8 | Apr 2026 | Cloudinary photos/videos, multiple customers per project, Google Drive backup on delete, enhanced delete modal |

---

## Important Notes For Next Developer

1. **Always update HANDOVER.md** after every major change
2. **Always ask for files** before editing — never assume content
3. **Tailwind v4** — `@import "tailwindcss"` only
4. **No "Decline" button** — use "Request Revised Quote"
5. **Communication is native** — no EmailJS, no backend required
6. **viewMode + activeVariationId** in AppState — not local state
7. **Firebase Storage NOT active** — use Cloudinary for photos/videos
8. **Cloudinary credentials:** Cloud Name `446179`, Preset `segal_build_uploads`
9. **No authentication** — customer portal is next major feature (Session 8-9)
10. **Multiple customers** — `Project` type needs `customers[]` array (currently single customer only)
