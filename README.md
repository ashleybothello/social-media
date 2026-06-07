# Pulse AI — AI-Powered Content Strategy Platform

An AI-powered social media content strategy platform that generates complete strategies, calendars, and brand voice variations.

## Quick Start

```bash
# Install web dependencies
npm install

# Start the website (runs at http://localhost:8080)
npm run dev
```

### Optional: Start the ML Engine

```bash
cd ml-engine
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend/` directory by copying `.env.example`. Make sure to fill in your `INSTAGRAM_APP_ID` and `INSTAGRAM_APP_SECRET`.

**Run Migrations:**
(Note: Currently migrations are manual SQL; you can run the `database/migrations/001_initial.sql` directly against your local postgres DB via pgAdmin or psql).
```bash
psql -U aixmedia -h localhost -d aixmedia_db -f database/migrations/001_initial.sql
# password: aixmedia_password
```

**Start the Server:**
```bash
uvicorn main:app --reload --port 8001
```

### 3. Frontend Setup
Open a new terminal and navigate to the project root:
```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. 
1. Create an account via the Sign Up page.
2. Navigate to "Instagram" in the sidebar to connect your Facebook Developer App.

## Deployment
- **Backend:** Deploy the FastAPI app via Render, Railway, or AWS. Ensure `DATABASE_URL` is set to your production PostgreSQL connection string.
- **Frontend:** Build the static assets using `npm run build` and deploy to Vercel, Netlify, or Cloudflare Pages.
- **Instagram App:** Don't forget to add your production URL to the "Valid OAuth Redirect URIs" in your Facebook Developer Console!
