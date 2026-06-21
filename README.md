# PathAI - Vernacular AI Career Navigator

PathAI is a web application designed to provide voice-first, vernacular career guidance, skill gap analysis, and digital credentials for ITI and polytechnic graduates. The application is built using Next.js, Tailwind CSS, and Supabase.

---

## Key Features

- **Vernacular Language Support**
  Fully supported in English, Hindi (हिंदी), Tamil (தமிழ்), Telugu (తెలుగు), and Bengali (বাংলা) to make career counseling accessible.

- **Career Navigator & Skill Gap Analysis**
  Analyzes user background and target jobs to identify skill deficits and offer actionable curriculum paths.

- **Assessment & Scoring**
  Interactive skill assessments with automatic scoring to evaluate subject proficiency.

- **Verifiable Digital Credentials**
  Generates verifiable career credentials with integrated secure QR codes. Supports PDF downloads containing verification links.

---

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Database & Authentication**: Supabase (PostgreSQL, Row Level Security)
- **PDF Generation**: @react-pdf/renderer
- **Font System**: Google Manrope (antialiased)

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v18.x or later)
- npm (v9.x or later)

### Environment Setup

Create a `.env.local` file in the `pathai-mvp` directory and configure the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_api_key
```

### Installation

1. Navigate to the project directory:
   ```bash
   cd pathai-mvp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment Configuration

When deploying the application to Vercel or other platforms, configure the settings as follows:

### Vercel Deployment Settings

1. **Root Directory**:
   Set this value to `pathai-mvp`. This tells Vercel to run the build steps inside the nested project folder rather than the Git repository root.

2. **Build Command**:
   `next build`

3. **Install Command**:
   `npm install`

4. **Environment Variables**:
   Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under the project settings environment variables.
   
5. **Deployed URL**:
   [https://pathai-mvp.vercel.app/](https://pathai-mvp.vercel.app/)
