# Segal Build — Builder Quote & Variation App
## Complete Project Handover Document

---

## 1. Overview

Segal Build is a professional construction quoting and variation management application for Australian domestic builders. It enables builders to create projects, generate AI-assisted multi-scope quotes with Rawlinsons/Cordell-aligned pricing, manage variations, track progress, and communicate with customers.

- **Framework:** React 19 + Vite 7 + Tailwind CSS v4
- **Language:** TypeScript (strict)
- **Build:** vite-plugin-singlefile (everything inlined into one HTML file)
- **Hosting:** Firebase Hosting — https://segal-build-app.web.app
- **State:** localStorage with version-checked persistence (v2.0)
- **AI:** Google Gemini API for scope recognition (optional — keyword fallback)
- **Icons:** lucide-react
- **Repo:** https://github.com/hersvami/segal-build-app

---

## 2. Complete File Structure
project-root/
├── index.html # Entry HTML with cache-busting meta tags
├── package.json # Dependencies and scripts
├── vite.config.ts # Vite config with singlefile plugin
├── tsconfig.json # TypeScript configuration
├── firebase.json # Firebase hosting config with no-cache headers
├── .gitignore # Excludes node_modules, dist, .firebase
├── HANDOVER.md # This file
│
├── public/
│ └── logos/
│ ├── segal-build.png # Segal Build company logo
│ └── segval.png # Segval company logo
│
└── src/
├── main.tsx # React DOM entry point
├── index.css # Tailwind CSS v4 import (@import "tailwindcss")
├── App.tsx # Main app — routing, state, project/variation management
│
├── types/
│ ├── domain.ts # All data types (Project, Variation, QuoteScope, PCItem, etc.)
│ └── appState.ts # Application state shape (AppState interface)
│
├── constants/
│ └── companies.ts # Company configs (Segal Build + Segval) with ABN, logo, OH%, Profit%
│
├── logic/
│ ├── usePersistedAppState.ts # localStorage persistence with version check (v2.0)
│ ├── useProjectWorkspace.ts # Project CRUD helpers (create, select, delete, variations)
│ ├── projectService.ts # Project creation factory
│ └── stateService.ts # Initial state factory
│
├── components/
│ ├── Sidebar.tsx # Left panel — company logo, switcher, project list, delete, export
│ ├── WelcomeScreen.tsx # Landing page with company branding and feature list
│ ├── ProjectForm.tsx # New project creation form (name, address, customer details)
│ ├── SendWelcomeEmailModal.tsx # Post-creation modal — Gmail, Mail app, Copy clipboard, Skip
│ ├── VariationBuilder.tsx # Multi-scope quote/variation creator (4-step wizard)
│ ├── ProjectChat.tsx # Notes (internal) + Contact Customer tabs
│ ├── LoadingSpinner.tsx # Reusable spinner component
│ └── report/
│ ├── VariationReport.tsx # 3-tab container (Builder View / Customer Preview / Progress)
│ ├── BuilderView.tsx # Full cost transparency — OH, Profit, Margin, trade breakdown
│ ├── CustomerView.tsx # Clean professional quote — client price only, signature, T&Cs
│ ├── ProgressHub.tsx # Progress photos, stage tracker, customer update sender
│ └── ReportSendModal.tsx # Multi-channel sender (SMS, WhatsApp, Email, Copy)
│
└── utils/
├── id.ts # UUID generator (crypto.randomUUID)
├── cn.ts # Tailwind className merge utility
├── firebase.ts # Firebase configuration
├── gemini.ts # Gemini API client for AI features
├── variationGuards.ts # Type guards for variation status checks
├── exportProject.ts # Project export/download as JSON
│
└── pricing/
├── index.ts # Barrel exports for all pricing modules
├── engine.ts # Solution generator (legacy room-based + new multi-scope)
├── scopeRecogniser.ts # AI/keyword scope classification using 43 categories
├── quoteCalculator.ts # Full pricing: Trade Cost → OH → Profit → Contingency → GST
├── quoteDefaults.ts # Pre-filled PC items, inclusions, exclusions per category
├── categoryRelations.ts # Cross-category linking (bathroom → waterproofing, plumbing, etc.)
├── constants.ts # Trade markers, overhead rates, fixed cost trades
├── answerRules.ts # Legacy question-to-stage rules
├── types.ts # StageTemplate, SolutionTemplate types (with linear/item units)
│
├── categories/ # 43 individual category files
│ ├── index.ts # Master registry — ALL_CATEGORIES, CATEGORY_MAP, searchCategories()
│ ├── types.ts # WorkCategory, ScopeQuestion, CategoryRelation types
│ ├── wetAreas.ts # Bathroom / Ensuite
│ ├── kitchen.ts # Kitchen renovation/new
│ ├── laundry.ts # Laundry
│ ├── toilet.ts # Toilet / WC
│ ├── flooring.ts # Timber, tiles, carpet, vinyl, polished concrete
│ ├── painting.ts # Interior/exterior painting
│ ├── windowsDoors.ts # Window & door replacement, new openings
│ ├── brickwork.ts # Brick repair, repointing, block walls
│ ├── cabinetry.ts # Built-in robes, shelving, custom joinery
│ ├── ceilings.ts # Plasterboard, bulkheads, raking ceilings
│ ├── internalWalls.ts # Stud walls, plasterboard, niches
│ ├── demolition.ts # Internal/partial/full demolition
│ ├── structural.ts # Wall removal, beam install, lintels
│ ├── underpinning.ts # Restumping, underpinning, slab repair
│ ├── retainingWalls.ts # Timber, concrete, block retaining
│ ├── steelFraming.ts # Steel beams, timber/steel framing
│ ├── extensions.ts # Ground floor extensions, room additions
│ ├── secondStorey.ts # Second storey additions
│ ├── newHomeBuild.ts # Full new house construction
│ ├── multiUnit.ts # Dual occ, townhouses, triplexes
│ ├── grannyFlat.ts # Granny flat / DPU
│ ├── decking.ts # Timber, composite, Merbau decking
│ ├── pergola.ts # Pergola, verandah, alfresco, carport
│ ├── paving.ts # Concrete, paver, exposed aggregate driveways
│ ├── concreting.ts # Slabs, paths, footings, crossovers
│ ├── fencing.ts # Timber, Colorbond, pool fencing
│ ├── landscaping.ts # Turf, garden beds, drainage, irrigation
│ ├── pools.ts # Pool build, renovation, compliance fencing
│ ├── roofing.ts # Full re-roof, tile to Colorbond
│ ├── roofRepairs.ts # Leak repair, flashing, ridge capping
│ ├── guttersFascia.ts # Gutter replace, fascia, downpipes
│ ├── electrical.ts # Switchboard, rewire, lighting, power points
│ ├── plumbing.ts # Hot water, sewer, stormwater, gas
│ ├── hvac.ts # Split system, ducted, ventilation
│ ├── waterproofing.ts # Membranes, shower, balcony compliance
│ ├── insulation.ts # Wall, ceiling, underfloor, acoustic
│ ├── fireSafety.ts # Smoke alarms, fire doors, BAL rating
│ ├── accessibility.ts # Ramps, grab rails, NDIS modifications
│ ├── heritage.ts # Period features, heritage compliance
│ ├── rendering.ts # Cement render, texture coat, acrylic
│ ├── cladding.ts # Weatherboard, fibre cement, metal cladding
│ ├── acoustic.ts # Soundproofing, party walls, acoustic ceilings
│ ├── smartHome.ts # CCTV, intercom, network, automation
│ └── external.ts # Legacy combined external (superseded by individual files)
│
└── templates/ # Legacy room-based templates (original system)
├── index.ts # Template registry
├── types.ts # Template types
├── bathroom.ts # Legacy bathroom template
├── kitchen.ts # Legacy kitchen template
├── laundry.ts # Legacy laundry template
├── bedroom.ts # Legacy bedroom template
├── living.ts # Legacy living room template
├── outdoor.ts # Legacy outdoor template
├── flooring.ts # Legacy flooring template
├── general.ts # Legacy general template
├── painting.ts # Legacy painting template
├── roofing.ts # Legacy roofing template
├── structural.ts # Legacy structural template
└── windows.ts # Legacy windows template

text


---

## 3. Component Details

### App.tsx (Main Entry Point)
- Manages global state via usePersistedAppState hook
- Project CRUD via useProjectWorkspace hook
- Routes between: Welcome → Project Form → Project Board → Variation Builder → Report
- Handles variation creation, status changes, signatures, change logs
- Passes Gemini API key to VariationBuilder for AI recognition
- Export project to JSON download
- Edit existing quotes (re-opens VariationBuilder with pre-loaded data)

### Sidebar.tsx
- Company logo display (fetched from GitHub raw URLs)
- Company switcher dropdown (Segal Build / Segval)
- Project list with click-to-select
- Per-project: export (JSON download) and delete buttons
- "+ New" button to create projects

### WelcomeScreen.tsx
- Displays when no project is selected
- Company logo, tagline, feature highlights
- "Create Your First Project" CTA button

### ProjectForm.tsx
- Fields: project name, address, customer name, customer email
- Creates project via projectService
- Triggers SendWelcomeEmailModal on success

### SendWelcomeEmailModal.tsx
- Shows after project creation
- Pre-filled email template with project details and portal URL
- 4 actions: Open in Email App (mailto:), Open in Gmail (web), Copy to Clipboard, Skip
- Matches the exact design from the reference screenshot

### VariationBuilder.tsx (4-Step Wizard)
- **Step 1 — Scope Input:**
  - Free-text description input ("bathroom reno 3x2.5m")
  - AI Analyze button (Gemini API when key available)
  - Keyword-based fallback recognition (instant)
  - Category browser with all 43 categories in 8 groups
  - Multi-scope support — add unlimited scopes
  - Cross-category suggestions (auto-recommended + suggested with reasons)
  - Accept individual / Accept All Recommended / Dismiss
- **Step 2 — Details:**
  - Per-scope dimensions (width, length, height)
  - Dynamic questions from matched category
  - Scope-by-scope navigation tabs
- **Step 3 — Pricing & Items:**
  - Overhead % control (default from company)
  - Profit % control
  - Contingency % control (auto-suggested by work type)
  - Editable PC Items (pre-filled per category, add/delete)
  - Editable Inclusions (pre-filled, add/delete custom)
  - Editable Exclusions (pre-filled, add/delete custom)
- **Step 4 — Review:**
  - All scopes with categories, dimensions, stage counts
  - Full pricing summary (subtotal, contingency, GST, total)
  - Save variation button

### ProjectChat.tsx
- Two tabs: Notes (internal builder notes) and Contact Customer
- Timestamped message history
- Add new notes with text input

### Report Components

#### VariationReport.tsx
- 3-tab container: Builder View | Customer Preview | Progress
- Progress tab only visible when variation status is "approved"
- Passes company branding (logo, name) to child views

#### BuilderView.tsx
- Pricing control sliders: Overhead %, Profit %, Contingency %
- 5 summary cards: Trade Cost → Overheads → Profit → GST → Client Total
- Profit analysis panel: true cost, your profit, effective margin %
- Trade breakdown table: Stage, Qty, Unit, Rate, Trade Cost, OH%, True Cost, Profit%, Client Price
- Multi-scope collapsible sections
- PC Items display
- Inclusions & Exclusions panels
- Scope description editor
- Internal action log with add note
- Save pricing button

#### CustomerView.tsx
- Clean white professional quote document
- Company letterhead with logo, name, ABN, licence
- Client & project info section
- Multi-scope pricing tables (clean item + amount columns)
- PC Items table with allowance notes
- Pricing totals: Subtotal, Contingency, GST, Total Inc GST
- Inclusions (green panel) and Exclusions (red panel)
- Terms & Conditions section
- Workmanship guarantee (6yr structural / 2yr non-structural)
- Approve & Sign button (no "Decline" — only "Request Changes")
- Signature display when signed

#### ProgressHub.tsx
- **Section 1 — Progress Photos:** Upload with date stamp, stage tag, caption, AI analysis button, grid view
- **Section 2 — Stage Progress Tracker:** All stages listed, status cycling (Not Started → In Progress → Complete), overall progress bar
- **Section 3 — Progress Updates:** Pre-filled customer message, photo attachment, send via SMS/WhatsApp/Email

#### ReportSendModal.tsx
- Multi-channel sending: SMS, WhatsApp, Outlook, Email
- Uses native app URLs (sms:, https://wa.me/, mailto:)
- Pre-filled message with project and quote details

---

## 4. Data Types (src/types/domain.ts)

| Type | Purpose |
|---|---|
| `Company` | Company config — name, ABN, logo, phone, email, defaultOverheadPercent, defaultProfitPercent |
| `Project` | Job site — id, name, address, customer, companyId, createdAt |
| `ProjectCustomer` | Customer — name, email |
| `Variation` | Quote or variation — title, description, status, roomType, dimensions, solutions, scopes, pricing, signature, changeLog |
| `QuoteScope` | Individual scope — categoryId, categoryLabel, description, stages, dimensions, answers, pcItems |
| `QuotePricing` | Full breakdown — overheadPercent, profitPercent, contingencyPercent, gstPercent, tradeCost, overhead, profit, contingency, gst, clientTotal, totalIncGst |
| `PCItem` | Prime Cost — description, allowance, unit, actualCost, suppliedBy |
| `InclusionItem` | What's included — text, isDefault |
| `ExclusionItem` | What's excluded — text, isDefault |
| `JobStage` | Trade stage — name, trade, cost, duration, description, status, quantity, unit, unitRate |
| `Solution` | Pricing tier — name, totalCost, duration, stages, description |
| `SmartAnswer` | Question answer — questionId, label, value |
| `Signature` | Customer signature — name, date, dataUrl |
| `ChangeLogEntry` | Audit trail — action, timestamp, user, details |

---

## 5. Pricing Engine

### Architecture
Builder types scope → AI/keyword recognition → Category matched
→ Dynamic questions → Dimension inputs → Stages generated
→ Trade Cost (Rawlinsons rates) → + Overhead % → True Cost
→ + Profit % → Client Price → + Contingency % → + GST 10%
→ Total Inc GST

text


### Rate Sources
All rates aligned with Rawlinsons Australian Construction Handbook and Cordell Cost Guides:
- $/m² for area-based work (tiling, painting, waterproofing)
- $/lm for linear work (cornices, skirting, gutters)
- $/item for individual items (power points, taps, doors)
- $/allow for allowance-based work (plumbing rough-in, electrical)

### Category Recognition Flow
1. Builder types description (e.g., "bathroom renovation 3x2.5m")
2. scopeRecogniser searches all 43 categories by keyword
3. Best match returned with confidence score
4. Related categories suggested via categoryRelations
5. If Gemini API key available, AI validates/enhances recognition

### Cross-Category Linking (categoryRelations.ts)
Each category has defined relationships:
- **Auto (priority):** Must-have related scopes (bathroom → waterproofing, plumbing)
- **Suggested:** Nice-to-have related scopes (bathroom → cabinetry, flooring)
- Full chain builder prevents duplicate suggestions

### Default Quote Items (quoteDefaults.ts)
Every category has pre-filled:
- **PC Items:** Category-specific allowances (bathroom: tiles $80/m², tapware $800)
- **Inclusions:** Standard items (waterproofing to AS3740, all labour & materials)
- **Exclusions:** Standard exclusions (asbestos, engineer fees, council fees)
- Common items shared across all categories

### Pricing Calculator (quoteCalculator.ts)
- `calculateStage()` — Per-stage: trade cost → + OH → true cost → + profit → client price
- `calculateScope()` — Per-scope: aggregates all stages + PC items
- `calculateQuote()` — Full quote: all scopes + contingency + GST
- `suggestContingency()` — Auto-suggests % based on work type (5-15%)
- `formatCurrency()` — Australian dollar formatting

---

## 6. State Management

### usePersistedAppState.ts
- Saves to localStorage key `segal-build-v2.0`
- Version check on load — if version mismatch, clears old data automatically
- Prevents stale state issues on app upgrades
- Debounced save (saves on every state change)

### useProjectWorkspace.ts
- Derived state helpers from AppState
- `createProject()` — Creates and adds new project
- `selectProject()` — Sets active project
- `deleteProject()` — Removes project and all its variations
- `createVariation()` — Adds variation to active project
- `selectVariation()` — Sets active variation for viewing
- `setVariationStatus()` — Updates variation status (draft/sent/approved/rejected)
- `addSignature()` — Saves customer signature to variation
- `addChangeLog()` — Appends audit entry to variation

---

## 7. Companies Configuration (src/constants/companies.ts)

### Segal Build Pty Ltd
- ABN: 83 671 632 230
- Phone: 0416 460 164
- Email: james@thesegals.com.au
- Logo: GitHub raw URL
- Default Overhead: 12%
- Default Profit: 15%
- Licence: DB-L 12345 (VBA)

### Segval
- ABN: 22 334 455 667
- Phone: 0416 460 164
- Email: info@segval.com.au
- Logo: GitHub raw URL
- Default Overhead: 12%
- Default Profit: 15%

---

## 8. Important Rules

1. **No Firebase database** — all state in localStorage (Firestore migration planned)
2. **No "Decline" button** — always "Request Revised Quote" (keeps job alive)
3. **Tailwind CSS v4** — use `@import "tailwindcss"` only in index.css
4. **Single-file build** — vite-plugin-singlefile inlines JS/CSS into one HTML
5. **Gemini API is optional** — app works fully without it via keyword matching
6. **Company logos** — loaded from GitHub raw URLs (not local files)
7. **Version-checked localStorage** — bump APP_VERSION in usePersistedAppState.ts to clear old data
8. **No cache on deploy** — firebase.json has no-cache headers for HTML/JS/CSS
9. **Mobile-friendly** — responsive design, mobile meta tags in index.html

---

## 9. Deployment

```bash
npm run build          # Builds to dist/index.html (single file)
firebase deploy --only hosting
# Live at: https://segal-build-app.web.app
Firebase console: https://console.firebase.google.com/project/segal-build-app/overview

10. Development History
Session 1 — Initial Build
Project scaffolding (React + Vite + Tailwind)
Sidebar, WelcomeScreen, ProjectForm components
usePersistedAppState, useProjectWorkspace hooks
Basic variation builder with room-type dropdown
Legacy pricing templates (bathroom, kitchen, laundry, etc.)
Solution generator with Essential/Standard/Premium tiers
Session 2 — Reports & Progress
VariationReport with Builder/Customer/Progress tabs
BuilderView with cost breakdown
CustomerView with professional quote layout
ProgressHub with photos, stage tracker, updates
ReportSendModal for multi-channel sending
SendWelcomeEmailModal matching reference design
Company logos from GitHub raw URLs
Session 3 — Pricing Categories (Rawlinsons/Cordell)
Created 43 individual category files with industry-standard rates
Each category has: questions, stages, base rates, unit types
Category type system (WorkCategory, ScopeQuestion, StageTemplate)
Master category index with search and grouping
Session 4 — AI Recognition & Multi-Scope
scopeRecogniser with keyword + Gemini AI matching
categoryRelations for cross-category linking
quoteCalculator with full pricing pipeline (OH → Profit → Contingency → GST)
quoteDefaults for pre-filled PC items, inclusions, exclusions
Rebuilt VariationBuilder with 4-step multi-scope wizard
Rebuilt App.tsx with VariationReport integration
Rebuilt BuilderView with full cost transparency
Rebuilt CustomerView with PC items, inclusions, exclusions
Export project to JSON download
Edit quotes after creation
Version-checked localStorage persistence
11. Git History
Commit	Description
dccfaf8	Initial commit
696fa2d	Add all project files
138d88b	43 pricing categories + backup restore point
dc731a7	Mobile meta tag fix
47a848c	Add .gitignore
a534122	Full rebuild — multi-scope AI, pricing engine, reports
12. Known Issues & Technical Debt
Legacy templates co-exist with new categories — templates/ folder is superseded by categories/ but still imported by legacy engine.ts code
external.ts orphan — Old combined external category file in categories/ not imported anywhere
No PDF export — Customer view is HTML only, no downloadable PDF yet
No Firebase database — All data in localStorage, lost if browser data cleared
Gemini API key stored in component state — Not persisted across sessions
No authentication — Anyone with the URL can access the app
Quote vs Variation not separated — Both use same Variation type, need distinct document types
13. Planned Features
Feature	Priority	Description
Quote vs Variation separation	High	Different document types, numbering (Q-001 vs V-001), different reports
CPI auto-escalation	Medium	ABS quarterly construction index for automatic rate updates
Builder rate overrides	Medium	Save custom rates per company, per trade
Gemini rate check	Low	AI button to validate current market rates
Firebase Firestore	High	Migrate from localStorage to cloud database
PDF export	Medium	Generate downloadable PDF quotes and variations
Authentication	High	User login, role-based access (builder vs customer)
Customer portal	Medium	Separate view for customers to view/approve quotes online
Photo storage	Medium	Cloudinary or Firebase Storage for progress photos
Multi-user	Low	Multiple builders per company