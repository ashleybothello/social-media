"""
Train the strategy recommendation model.

This model uses TF-IDF + cosine similarity to recommend content themes
based on industry input. You can retrain it by adding more data to
training/data/themes.json and running this script again.

Usage:
    python train_strategy.py
    python train_strategy.py --data data/themes.json
"""
import json
import argparse
import joblib
import numpy as np
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

DATA_DIR = Path(__file__).parent / "data"
MODEL_DIR = Path(__file__).parent.parent / "models"


def load_data(data_path: str = None):
    path = Path(data_path) if data_path else DATA_DIR / "themes.json"
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def train(data: dict):
    """
    Train a TF-IDF model that maps industry names to the best content themes.
    The model stores:
    - vectorizer: fitted TF-IDF vectorizer
    - industry_vectors: TF-IDF vectors for each industry
    - theme_map: mapping from industry key to list of themes
    """
    # Create training corpus: each industry name + its themes as a document
    industries = []
    documents = []
    theme_map = {}

    for industry, themes in data.items():
        industries.append(industry)
        documents.append(f"{industry} {' '.join(themes)}")
        theme_map[industry] = themes

    # Fit TF-IDF vectorizer
    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        max_features=500,
    )
    industry_vectors = vectorizer.fit_transform(documents)

    model = {
        "vectorizer": vectorizer,
        "industry_vectors": industry_vectors,
        "industries": industries,
        "theme_map": theme_map,
    }

    return model


def save_model(model, output_path: str = None):
    path = Path(output_path) if output_path else MODEL_DIR / "strategy_model.pkl"
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, path)
    print(f"✅ Strategy model saved to {path}")
    print(f"   Industries: {len(model['industries'])}")
    print(f"   Features: {model['vectorizer'].max_features}")


def test_model(model):
    """Quick test: find best industry match for sample queries."""
    test_queries = ["software as a service", "gym workout", "online store", "cooking recipes", "artificial intelligence"]
    vectorizer = model["vectorizer"]
    industry_vectors = model["industry_vectors"]

    print("\n📊 Test Results:")
    for query in test_queries:
        query_vec = vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, industry_vectors)[0]
        best_idx = np.argmax(similarities)
        best_industry = model["industries"][best_idx]
        confidence = similarities[best_idx]
        themes = model["theme_map"][best_industry][:3]
        print(f"  '{query}' → {best_industry} ({confidence:.2f}) | Themes: {', '.join(themes)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train strategy recommendation model")
    parser.add_argument("--data", type=str, help="Path to themes JSON file")
    parser.add_argument("--output", type=str, help="Path to save model")
    args = parser.parse_args()

    print("🚀 Training Strategy Model...")
    data = load_data(args.data)
    model = train(data)
    save_model(model, args.output)
    test_model(model)
    print("\n✅ Training complete!")
