# AI Evaluation Platform - BeSimple AI Take-Home Challenge

## Overview

Web app for evaluating annotation quality at scale.
Upload submissions, configure AI judges, assign them to questions, and run automated evaluations using OpenAI or Anthropic models.

## Features

### Core Requirements

- **Data Ingestion**: Upload submissions via JSON file with validation
- **Submission Display**: View all submissions organized by queue with metadata
- **AI Judge CRUD**: Create, view, edit, and deactivate AI judges with custom criteria
- **Judge Assignment**: Assign multiple judges to evaluate specific questions
- **Evaluation Runner**: Execute evaluations with real-time progress tracking
- **Results View**: Display all evaluations with verdicts and detailed reasoning
- **Filtering**: Filter results by judge, question, and verdict

### Bonus Features

- **Data Visualization**: Interactive charts showing pass rates by judge and verdict distribution
- **CSV Export**: Export filtered evaluations with all metadata for reporting

## Tech Stack

### Frontend
- **Frontend**: React 18, TypeScript, Vite, Tailwind, Recharts
- **Backend**: Firebase Firestore + Cloud Functions
- **APIs**: OpenAI, Anthropic


## Architecture


**Data Flow**

```
User uploads JSON → Firebase stores submissions
↓
User creates AI judges → Firebase stores judge configs
↓
User assigns judges → Firebase stores assignments
↓
User runs evaluations → Cloud Function calls LLM APIs
↓
Results saved → Firebase stores evaluations
↓
User views results → Real-time display with filtering/charts
```


**Architecture Decisions**
- Cloud Functions proxy LLM calls (secure keys, avoid CORS)
- Firestore stores submissions, judges, assignments, evaluations
- Custom React hooks manage data logic

## Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm
- **Firebase CLI**: `npm install -g firebase-tools`
- **Firebase Account**: [firebase.google.com](https://firebase.google.com)
- **OpenAI API Key**: [platform.openai.com](https://platform.openai.com)
- **Anthropic API Key**: [console.anthropic.com](https://console.anthropic.com)

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd besimpleai

# Install dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### 2. Firebase Project Setup

```bash
# Login to Firebase
firebase login

# Create a new Firebase project (or use existing)
firebase projects:create besimpleai-challenge

# Select your project
firebase use besimpleai-challenge

# Initialize Firebase (if needed)
firebase init
# Select: Firestore, Functions, Hosting (optional)
# Choose JavaScript for Functions
# Install dependencies: Yes
```

### 3. Configure Firebase

Update `src/lib/firebase/config.ts` with your Firebase project credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Get these credentials from: Firebase Console → Project Settings → General → Your apps

### 4. Create Firestore Database

1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Choose production mode (or test mode for development)
4. Select a location

### 5. Configure API Keys for Cloud Functions

**Option A: Using Environment Variables (Recommended)**

Create a `.env` file in the `functions` directory:

```bash
cd functions
echo "OPENAI_API_KEY=sk-your-openai-key" > .env
echo "ANTHROPIC_API_KEY=sk-ant-your-anthropic-key" >> .env
cd ..
```

**Option B: Using Firebase Config (Production)**

```bash
firebase functions:config:set openai.key="sk-your-openai-key"
firebase functions:config:set anthropic.key="sk-ant-your-anthropic-key"
```

### 6. Deploy Cloud Functions

```bash
# Deploy Firebase Functions
firebase deploy --only functions

# Verify deployment
firebase functions:list
# Should show: evaluateAnswer(us-central1)
```

### 7. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
besimpleai/
├── src/
│   ├── components/          
│   │   ├── evaluations/     # Evaluation runner
│   │   ├── judges/          # Judge CRUD and assignment
│   │   ├── results/         # Results display with charts/filters
│   │   ├── submissions/     # Data ingestion and display
│   │   └── ui/              # Reusable UI components
│   ├── hooks/               
│   │   ├── useEvaluations.ts
│   │   ├── useEvaluationRunner.ts
│   │   ├── useJudges.ts
│   │   └── useSubmissions.ts
│   ├── lib/
│   │   ├── firebase/        # Firebase operations
│   │   │   ├── config.ts
│   │   │   ├── submissions.ts
│   │   │   ├── judges.ts
│   │   │   ├── assignments.ts
│   │   │   └── evaluations.ts
│   │   ├── llm/
│   │   │   └── evaluator.ts # LLM evaluation orchestrator
│   │   └── types.ts         # TS interfaces
│   ├── utils/               # Utility functions
│   │   ├── constants.ts
│   │   ├── csvExport.ts
│   │   ├── formatters.ts
│   │   └── validation.ts
│   └── App.tsx              # Main app component
├── functions/               # Firebase Cloud Functions
│   └── src/
│       └── index.ts         # LLM API proxy function
├── public/
│   └── logo.svg
├── sample_input.json                    # Simple sample data
├── sample_annotation_realistic.json     # Realistic sample data
└── README.md               
```

## Future Improvements

1. **Multimodal Support**
   - Allow file uploads (screenshots, PDFs, images) alongside submissions
   - Store files in Firebase Storage with references in Firestore
   - Forward attachments to LLM APIs when provider supports vision (GPT-4o, Claude 3.5 Sonnet)

2. **User Authentication**: Can use Firebase Auth for multi-user support and role-based access control (admin, QA manager, annotator)

3. **Additional LLM Providers**: Google Gemini, Mistral AI, Local models (Ollama)

4. **Pagination**: Currently loads large lists at once from firestore which can be slow over time
