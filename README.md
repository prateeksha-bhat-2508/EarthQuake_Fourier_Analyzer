# QuakeWatch

QuakeWatch is a real-world seismic intelligence platform that combines earthquake event data, waveform analysis, Fourier Transform based signal processing, and interactive geospatial visualization.

The application allows users to explore historical earthquake events, inspect their locations on an interactive map, analyze associated seismic waveforms, and study their frequency-domain characteristics using Fast Fourier Transform (FFT).

---

## Features

### Earthquake Event Visualization

- Displays earthquake events retrieved from MongoDB
- Interactive map using Leaflet
- Earthquake markers plotted using latitude and longitude
- Event metadata display:
  - Location
  - Magnitude
  - Depth
  - Timestamp
  - Tsunami indicator

---

### Real Seismic Waveform Analysis

Each earthquake is associated with a MiniSEED waveform file.

For every selected earthquake:

- Loads corresponding seismic waveform
- Displays time-domain signal
- Computes waveform statistics
- Calculates signal energy
- Calculates peak amplitude

---

### Fourier Transform Analysis

Performs real FFT analysis on seismic waveforms.

Analysis includes:

- Frequency spectrum generation
- Dominant frequency extraction
- Low-frequency energy analysis
- Mid-frequency energy analysis
- High-frequency energy analysis
- Hazard score estimation

---

### Hazard Assessment

Custom hazard score computed using:

- Earthquake magnitude
- Peak signal amplitude
- Signal energy

Outputs:

- Hazard score
- Frequency band distribution
- Dominant frequencies

---

### Interactive Dashboard

Users can:

- Browse earthquake events
- Select an earthquake
- View event metadata
- Inspect waveform
- Analyze FFT spectrum
- Compare frequency distributions

---

## Screenshots

### Earthquake Map and Event Selection

![Earthquake Map](SS/list_map.png.png)

---

### Fourier Analysis Dashboard

![Fourier Analysis](SS/f_analysis.png.png)

---

# System Architecture

```text
┌───────────────────────────┐
│       Next.js Frontend    │
└─────────────┬─────────────┘
              │ REST API
              ▼
┌───────────────────────────┐
│       FastAPI Backend     │
└─────────────┬─────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
MongoDB           MiniSEED Files
(Earthquakes)     (Waveforms)

              │
              ▼

      Signal Processing

              │

              ▼

          FFT Analysis

              │

              ▼

     Interactive Dashboard
```

---

# Tech Stack

## Frontend

| Technology | Purpose |
|------------|----------|
| Next.js | Frontend Framework |
| React | UI Library |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Leaflet | Interactive Maps |
| React Leaflet | React Map Integration |
| Plotly.js | Scientific Visualization |
| React Plotly | Plotly React Wrapper |

---

## Backend

| Technology | Purpose |
|------------|----------|
| FastAPI | REST API |
| Python | Core Backend |
| NumPy | Numerical Computation |
| SciPy | FFT and Signal Processing |
| ObsPy | Seismic Data Handling |
| PyMongo | MongoDB Integration |

---

## Database

| Technology | Purpose |
|------------|----------|
| MongoDB | Earthquake Storage |
| MongoDB Compass | Local Database Management |

---

## Data Sources

### Earthquake Metadata

Source:

- USGS Earthquake Catalog

Contains:

- Magnitude
- Depth
- Latitude
- Longitude
- Timestamp
- Tsunami Information

---

### Waveform Data

Source:

- EarthScope / IRIS
- ObsPy FDSN Client

Format:

```text
MiniSEED (.mseed)
```

---

# Project Structure

```text
QuakeWatch
│
├── backend
│   │
│   ├── main.py
│   ├── seismic.py
│   ├── database.py
│   ├── requirements.txt
│   │
│   ├── scripts
│   │   └── download_waveforms.py
│   │
│   └── waveforms
│       ├── quake_1.mseed
│       ├── quake_2.mseed
│       ├── quake_3.mseed
│       └── ...
│
├── frontend
│   │
│   ├── app
│   │   └── page.tsx
│   │
│   ├── components
│   │   ├── EarthquakeMap.tsx
│   │   ├── FFTChart.tsx
│   │   └── SeismicChart.tsx
│   │
│   ├── lib
│   │   └── api.ts
│   │
│   ├── public
│   │
│   ├── package.json
│   │
│   └── next.config.ts
│
├── screenshots
│   ├── list_map.png
│   └── f_analysis.png
│
└── README.md
```

---

# Database Schema

```json
{
  "_id": "...",
  "usgsId": "usp000jkyu",
  "place": "Bonin Islands, Japan Region",
  "magnitude": 6.0,
  "depth": 487.4,
  "latitude": 26.91,
  "longitude": 140.05,
  "timestamp": 1338068890120,
  "tsunami": false,
  "waveformFile": "waveforms/quake_1.mseed"
}
```

---

# API Endpoints

## Get Earthquakes

```http
GET /earthquakes
```

Returns:

```json
[
  {
    "id": "...",
    "place": "...",
    "magnitude": 7.2
  }
]
```

---

## Get Single Earthquake

```http
GET /earthquake/{id}
```

---

## Analyze Earthquake

```http
GET /analyze-earthquake/{id}
```

Returns:

```json
{
  "signal_energy": 12562,
  "peak_amplitude": 18.4,
  "hazard_score": 78.2,
  "dominant_frequencies": [],
  "frequency_bands": {},
  "waveform": {},
  "fft": {}
}
```

---

# Running Locally

## Clone Repository

```bash
git clone https://github.com/<username>/QuakeWatch.git

cd QuakeWatch
```

---

# Backend Setup

## Create Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Start Backend

```bash
cd backend

uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

---

## Run Frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# FFT Analysis Workflow

```text
Waveform File (.mseed)
          │
          ▼

Time Domain Signal

          │
          ▼

Signal Conditioning

          │
          ▼

Fast Fourier Transform

          │
          ▼

Frequency Spectrum

          │
          ▼

Dominant Frequencies

          │
          ▼

Frequency Band Analysis

          │
          ▼

Hazard Assessment
```

---

# Future Enhancements

- Real-time waveform retrieval from EarthScope
- Earthquake-specific station selection
- Machine Learning based hazard prediction
- Seismic anomaly detection
- Wave arrival detection using deep learning
- Multi-station waveform comparison
- Real-time earthquake monitoring dashboard
- Deployment on cloud infrastructure

---

# Author

Prateeksha Bhat

Computer Science Engineering

Signal Processing • Data Engineering • Earthquake Analytics

---

# License

This project is intended for educational and research purposes.