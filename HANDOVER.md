# Segal Build - Builder Quote & Variation App

## Project Handover Document

---

## 1. Overview

Segal Build is a professional construction quoting and variation management app for Australian domestic builders.

- **Framework:** React + Vite + Tailwind CSS v4
- **Language:** TypeScript
- **Hosting:** Firebase Hosting (segal-build-app.web.app)
- **State:** localStorage with version-checked persistence
- **AI:** Gemini API for scope recognition (optional - falls back to keyword matching)

---

## 2. Core Features

### Project Management
- Create projects with customer details
- Send welcome email via native apps (Gmail, Mail app, Copy)
- Export project data as JSON before deletion
- Company switching (Segal Build / Segval)

### Quote & Variation Builder
- Free-text scope input with AI/keyword category recognition
- Cross-category linking (bathroom auto-suggests waterproofing, plumbing, electrical)
- Multi-scope quotes (multiple rooms/scopes in one quote)
- Dynamic questions per category affecting pricing
- Pre-filled PC Items, Inclusions, Exclusions (editable)
- Edit quotes after creation

### Pricing Engine (Rawlinsons/Cordell Aligned)
- Trade Cost: base rates per m2, lm, item, allowance
- Overhead: builder business costs (default 12%)
- Profit: builder margin (default 15%)
- Contingency: risk buffer (5-15% based on work type)
- GST: 10% automatic
- Formula: Trade Cost + Overhead = True Cost + Profit = Client Price + GST = Total

### Report Views
- Builder View: full cost transparency (trade cost, overhead, profit, margin %)
- Customer View: clean professional quote (client price only)
- Progress Hub: site photos, stage tracker, customer updates (when approved)

---

## 3. 43 Pricing Categories

Wet Areas & Kitchen: wetAreas, kitchen, laundry, toilet
Internal Renovations: flooring, painting, windowsDoors, brickwork, cabinetry, ceilings, internalWalls, demolition
Structural: structural, underpinning, retainingWalls, steelFraming
Extensions & New Builds: extensions, secondStorey, newHomeBuild, multiUnit, grannyFlat
External & Outdoor: decking, pergola, paving, concreting, fencing, landscaping, pools
Roofing: roofing, roofRepairs, guttersFascia
Services & Trades: electrical, plumbing, hvac, waterproofing, insulation
Specialty: fireSafety, accessibility, heritage, rendering, cladding, acoustic, smartHome

---

## 4. Key Data Types (src/types/domain.ts)

- Project: Job site with customer info
- Variation: Quote or variation with scopes, pricing, status
- QuoteScope: Individual scope within a quote
- QuotePricing: Full pricing breakdown (OH, profit, contingency, GST)
- PCItem: Prime Cost allowance
- InclusionItem / ExclusionItem: What is/isn't included
- JobStage: Individual trade stage with cost/duration

---

## 5. Important Rules

1. No Firebase database - all state in localStorage
2. No "Decline" button - always "Request Revised Quote"
3. Tailwind CSS v4 - use @import "tailwindcss" only
4. Single-file build - vite-plugin-singlefile
5. Gemini API is optional - app works without it
6. Company logos from GitHub raw URLs
7. Version-checked localStorage - old data auto-clears on version bump

---

## 6. Deployment

npm run build
firebase deploy --only hosting
Live at: https://segal-build-app.web.app

---

## 7. Next Steps (Planned)

- Quote vs Variation separation (different document types and reports)
- CPI auto-escalation (ABS construction index)
- Builder rate overrides (save custom rates per company)
- Gemini rate check (AI market rate validation)
- Firebase database migration (localStorage to Firestore)
- PDF export (downloadable PDF quotes)

---

Last updated: April 2026
Maintainer: James Segal
Repo: https://github.com/hersvami/segal-build-app