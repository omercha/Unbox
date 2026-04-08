# Unbox

Unbox ([https://unbox-omercha.vercel.app/](https://unbox-omercha.vercel.app/)) is a frontend-only web app designed to make it easier to prepare for difficult conversations regarding mental health, developed for and in collaboration with [The Black Box Approach](https://theblackboxapproach.com/). User data is stored locally on their own device and there is no requirement to register/create an account before using the app's services.

## Project Structure

```text
Unbox/
├─ src/
│  ├─ app/
│  │  └─ App.jsx                    # App routing/state
│  ├─ components/
│  │  └─ layout/
│  │     ├─ Layout.jsx              # Page layout structure
│  │     └─ Layout.css
│  ├─ features/
│  │  ├─ landing/
│  │  │  ├─ LandingPage.jsx         # Landing page shown when accessing the app
│  │  │  └─ LandingPage.css
│  │  ├─ conversation/
│  │  │  ├─ ConversationWizard.jsx  # Wizard for checklist generation
│  │  │  ├─ ConversationWizard.css
│  │  │  ├─ components/
│  │  │  │  ├─ AudienceSelector.jsx
│  │  │  │  ├─ AudienceSelector.css
│  │  │  │  ├─ SelectionGroup.jsx
│  │  │  │  ├─ SelectionGroup.css
│  │  │  │  ├─ ChecklistSummary.jsx # Final generated message and actions
│  │  │  │  └─ ChecklistSummary.css
│  │  │  ├─ data/
│  │  │  │  ├─ conversationOptions.js
│  │  │  │  └─ feelingsCatalog.js
│  │  │  └─ hooks/
│  │  │     ├─ useConversationState.js
│  │  │     ├─ useDrafts.js
│  │  │     └─ useSavedMessages.js
│  │  ├─ feelings/
│  │  │  ├─ FeelingsExplorer.jsx    # Separate “How am I feeling?” tool
│  │  │  ├─ FeelingsExplorer.css
│  │  │  └─ hooks/
│  │  │     └─ useFeelingsState.js
│  │  ├─ drafts/
│  │  │  ├─ DraftsPage.jsx           # View/manage saved drafts
│  │  │  └─ DraftsPage.css
│  │  └─ messages/
│  │     ├─ SavedMessagesPage.jsx    # View/manage saved final messages
│  │     └─ SavedMessagesPage.css
│  │
│  ├─ index.css                      # Global styles/theme variables
│  └─ main.jsx                       # React entry point
├─ index.html
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.js
└─ package.json
```

## Installation

### Prerequisites

- Node.js 18+
- npm (comes with Node)

### Steps

1. Open a terminal in the project root:
   ```bash
   cd /path/to/Unbox
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Run the App (Development)

```bash
npm run dev
```

- Vite will print a local URL (normally `http://localhost:5173`).
- Open that URL in your browser.

## Build for Production

```bash
npm run build
```

- Outputs production files to `dist/`.

To preview the built version locally:

```bash
npm run preview
```


### Testing the core features

There are currently no sets of unit or integration tests, so testing is manual i.e. browser flows.

1. Landing page loads and `Get Started` opens the wizard.
2. Wizard Step 1: choose an audience (e.g. manager/parent/etc).
3. Wizard Step 2: choose one or more topic statements and/or type a custom topic.
4. Wizard Step 3: select objectives/needs/understandings.
5. Final summary page generates a message and checklist.
6. Copy/share actions work (clipboard, WhatsApp, SMS, email links).
7. Save draft and save message actions work.
8. `View saved drafts` and `View saved messages` show local saved items.
9. Night mode toggle works across major screens.
10. Feelings tool (`How am I feeling?`) works as a separate flow.

### Additional checks and notes

- Saved drafts/messages should persist after page refresh.
- Wizard steps are based on the session and reset when leaving and re-entering the wizard flow.
- This project is intentionally frontend-only (as per client requirements).
- No user account system or backend database is used.
- Sensitive data handling is minimised by storing only local browser data.

