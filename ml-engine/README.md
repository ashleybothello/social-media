# Pulse AI — ML Engine

Separate ML backend powering the Pulse AI content strategy platform.

## Quick Start

```bash
# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Train models (optional — server works without trained models)
cd training
python train_strategy.py
python train_voice.py
python train_performance.py
cd ..

# 4. Start the API server
python api/server.py
# Server runs at http://localhost:8000
```

## Architecture

```
ml-engine/
├── api/
│   └── server.py          ← FastAPI server (4 endpoints + health)
├── models/                ← Trained model files (.pkl) — git-ignored
├── training/
│   ├── data/              ← Training data (JSON)
│   │   ├── themes.json    ← Content themes by industry
│   │   ├── topics.json    ← Post topics
│   │   └── hooks.json     ← Hook templates
│   ├── train_strategy.py  ← TF-IDF strategy recommender
│   ├── train_voice.py     ← Voice style feature extractor
│   └── train_performance.py ← GradientBoosting post scorer
└── requirements.txt
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/generate-strategy` | POST | Generate content roadmap + calendar |
| `/transform-voice` | POST | Transform post into different personas |
| `/analyze-performance` | POST | Score and analyze post engagement |
| `/regenerate-post` | POST | Generate a new version of a calendar post |
| `/health` | GET | Check server + model status |

## Retraining Models

To retrain with your own data:

1. **Strategy Model**: Update `training/data/themes.json` with your industries/themes
   ```bash
   python training/train_strategy.py
   ```

2. **Voice Model**: Add more persona samples in `training/train_voice.py`
   ```bash
   python training/train_voice.py
   ```

3. **Performance Model**: The model uses synthetic data. You can add real labeled data:
   ```bash
   python training/train_performance.py
   ```

Models are saved to `models/` and automatically loaded by the API server on startup.

## Tech Stack

- **FastAPI** — async web framework
- **scikit-learn** — ML models (TF-IDF, GradientBoosting, RandomForest)
- **NLTK** — NLP text processing
- **joblib** — model persistence
