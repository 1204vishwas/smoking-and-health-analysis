# Smoking and Health Analysis Dashboard
### Sapphire IQ | Healthcare Analytics
**Brilliant Minds Intelligent Solutions &bull; Project Presentation**

A full-stack, enterprise-grade healthcare analytics dashboard developed according to the Sapphire IQ specification and 10,000-record patient dataset (`Smoking_Health_Analysis.csv`).

---

## Quick Start & Running Commands

### 1. Backend Server
```bash
cd backend
npm run dev
```
- **Port:** `http://localhost:5000`
- **Watch Mode:** `node --watch server.js`
- **Environment:** Configured via `backend/.env`

### 2. Frontend Dashboard
```bash
cd frontend
npm run dev
```
- **Port:** `http://localhost:5173`
- **Vite Dev Server:** Hot Module Replacement (HMR) enabled
- **Environment:** Configured via `frontend/.env`

---

## Environment Variables (`.env`)

### `backend/.env`
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
CSV_PATH=./data/Smoking_Health_Analysis.csv
```

### `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Project Structure
```
smoke and health analysis/
├── backend/
│   ├── data/
│   │   └── Smoking_Health_Analysis.csv   # 10,000-record patient dataset
│   ├── .env                              # Backend environment variables
│   ├── package.json                      # Dependencies & dev scripts
│   └── server.js                         # Express API, DAX calculations & analytics
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx                # Sapphire IQ branding & actions
│   │   │   ├── FilterBar.jsx             # Power BI multi-dimensional slicers
│   │   │   ├── TabNavigation.jsx         # Report page navigation
│   │   │   ├── TabOverview.jsx           # Objectives 1 & 2: KPIs & calculated columns
│   │   │   ├── TabSmokingPatterns.jsx    # Objective 3: Smoking patterns & indicators
│   │   │   ├── TabDemographics.jsx       # Objective 4: Demographics & exposure analysis
│   │   │   ├── TabPatientExplorer.jsx    # 10k patient search, grid & pagination
│   │   │   ├── TabDAXReference.jsx       # DAX formulas & printable brief
│   │   │   └── PatientDetailModal.jsx    # Full diagnostic profile modal
│   │   ├── App.jsx                       # Root application state & API client
│   │   ├── index.css                     # TailwindCSS & typography styling
│   │   └── main.jsx                      # React 18 bootstrap
│   ├── .env                              # Frontend API URL configuration
│   ├── index.html                        # HTML entry point
│   ├── package.json                      # Dependencies & scripts
│   ├── tailwind.config.js                # Sapphire IQ custom color tokens
│   └── vite.config.js                    # Vite bundler configuration
└── README.md                             # Project documentation
```

---

## Project Objectives Implemented

### Objective 1: Analyze Overall Patient Health Using KPIs
1. **Total number of patients:** `10,000`
2. **Total number of current smokers:** `3,015` (`30.15%`)
3. **Patients with a recorded organ category:** `7,227` (`72.27%`)
4. **Patients with a recorded health condition:** `5,772` (`57.72%`)

### Objective 2: Create Calculated Columns Using DAX
1. **Age Group:**
   ```dax
   Age Group = 
   SWITCH(
       TRUE(),
       'PatientData'[Age] >= 18 && 'PatientData'[Age] <= 29, "18–29",
       'PatientData'[Age] >= 30 && 'PatientData'[Age] <= 44, "30–44",
       'PatientData'[Age] >= 45 && 'PatientData'[Age] <= 59, "45–59",
       'PatientData'[Age] >= 60, "60+",
       "Unknown"
   )
   ```
2. **BP Risk Category:**
   ```dax
   BP Risk Category = 
   SWITCH(
       TRUE(),
       'PatientData'[Systolic_BP_mmHg] < 120 && 'PatientData'[Diastolic_BP_mmHg] < 80, "Lower Range",
       'PatientData'[Systolic_BP_mmHg] >= 120 && 'PatientData'[Systolic_BP_mmHg] <= 129 && 'PatientData'[Diastolic_BP_mmHg] < 80, "Elevated",
       'PatientData'[Systolic_BP_mmHg] >= 130 || 'PatientData'[Diastolic_BP_mmHg] >= 80, "High",
       "Unclassified"
   )
   ```
3. **Estimated Smoking Exposure (Pack-Years):**
   ```dax
   Pack Years = ('PatientData'[Cigarettes_Per_Day] / 20) * 'PatientData'[Years_Smoking]
   ```

### Objective 3: Analyze Smoking Patterns and Health Indicators
1. Average cigarettes consumed per day by smoking status (`Current Smoker`: ~17.5 cigs/day; `Former Smoker`: 0; `Never Smoked`: 0).
2. Organ-wise health condition distribution (`Heart`, `Lungs`, `Liver`, `Kidneys`, `No Recorded Organ Condition`).
3. Smoking status distribution (`Never Smoked`: 42.6%, `Current Smoker`: 30.2%, `Former Smoker`: 27.2%).
4. Average cholesterol levels across blood pressure risk categories (`Lower Range`: 196.7 mg/dL, `Elevated`: 197.3 mg/dL, `High`: 196.9 mg/dL).

### Objective 4: Analyze Patient Demographics and Health Patterns
1. Number of current smokers across age groups (`18–29`: 508, `30–44`: 668, `45–59`: 715, `60+`: 1,124).
2. Distribution of recorded health conditions across estimated smoking exposure levels (`Non-Smoker`, `Past Exposure`, `Low`, `Moderate`, `Heavy Exposure`).
3. Regional and gender epidemiology breakdowns across North, South, East, West, and Central territories.

---

## Disclaimer
*This project is designed for educational and exploratory healthcare analytics. It does not establish medical diagnoses or prove direct causation between smoking and specific conditions.*
