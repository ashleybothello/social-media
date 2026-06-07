"""
Train the performance scoring model.

This model uses a Random Forest classifier to predict content performance
based on text features (readability, emoji count, hashtag density, CTA presence, etc.)

You can retrain by adding more labeled data to training/data/performance_data.json
and running this script again.

Usage:
    python train_performance.py
"""
import json
import joblib
import numpy as np
import re
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

DATA_DIR = Path(__file__).parent / "data"
MODEL_DIR = Path(__file__).parent.parent / "models"


def extract_features(content: str) -> list:
    """Extract NLP features from post content."""
    word_count = len(content.split())
    char_count = len(content)
    sentence_count = len(re.split(r'[.!?]+', content))
    avg_word_length = np.mean([len(w) for w in content.split()]) if content.split() else 0

    has_emoji = 1 if re.search(r'[\U0001F600-\U0001F9FF]', content) else 0
    emoji_count = len(re.findall(r'[\U0001F600-\U0001F9FF]', content))
    hashtag_count = len(re.findall(r'#\w+', content))
    mention_count = len(re.findall(r'@\w+', content))

    has_question = 1 if '?' in content else 0
    has_exclamation = 1 if '!' in content else 0
    has_numbers = 1 if re.search(r'\d+', content) else 0
    has_url = 1 if re.search(r'https?://', content) else 0

    has_cta = 1 if re.search(
        r'\b(comment|share|follow|tag|link|dm|save|click|subscribe|check|swipe|tap)\b',
        content, re.I
    ) else 0

    first_line = content.split('\n')[0] if content else ""
    hook_length = len(first_line)
    has_hook = 1 if hook_length < 80 and re.search(r'[?!]', first_line) else 0

    line_count = len(content.split('\n'))
    paragraph_count = len([p for p in content.split('\n\n') if p.strip()])

    # Readability score (simplified Flesch-Kincaid approximation)
    syllable_count = sum(max(1, len(re.findall(r'[aeiouy]+', w, re.I))) for w in content.split())
    readability = 206.835 - 1.015 * (word_count / max(sentence_count, 1)) - 84.6 * (syllable_count / max(word_count, 1))

    return [
        word_count, char_count, sentence_count, avg_word_length,
        has_emoji, emoji_count, hashtag_count, mention_count,
        has_question, has_exclamation, has_numbers, has_url,
        has_cta, hook_length, has_hook, line_count, paragraph_count,
        readability, syllable_count,
    ]


def generate_training_data(n_samples: int = 1000):
    """Generate synthetic training data for the performance model."""
    np.random.seed(42)

    samples = []
    labels = []

    # High-performing posts (label=2)
    high_templates = [
        "Stop scrolling! 🔥 Here are 5 proven strategies to grow:\n\n1. Consistency\n2. Value-first\n3. Engage daily\n4. Use hashtags\n5. Track metrics\n\nSave this for later! #Growth #ContentStrategy #Marketing",
        "The truth nobody tells you about building a brand? 🤔\n\nIt takes time. It takes patience. But most importantly, it takes authenticity.\n\nHere's what worked for us:\n\n• Show behind-the-scenes\n• Share failures, not just wins\n• Ask questions, not just post\n\nComment your biggest lesson below! 👇",
        "POV: You just discovered the secret to viral content 📱\n\n1. Hook them in 3 seconds\n2. Deliver massive value\n3. End with a CTA\n\nSimple? Yes. Easy? No.\n\nFollow for more tips like this! #ContentCreation #SocialMedia",
    ]

    # Medium-performing posts (label=1)
    mid_templates = [
        "Here's our latest update on the project. We've been working hard on new features and improvements. Check out what's coming soon.",
        "Great insights from our team today. We discussed growth strategies and planning for next quarter. Exciting times ahead!",
        "Just published a new article on our blog about industry trends. Take a look and let us know your thoughts.",
    ]

    # Low-performing posts (label=0)
    low_templates = [
        "Update.",
        "New post on our blog.",
        "Check this out",
        "Interesting article shared by our team member about recent developments in the industry.",
    ]

    for _ in range(n_samples):
        r = np.random.random()
        if r < 0.33:
            template = np.random.choice(high_templates)
            # Add some variation
            if np.random.random() > 0.5:
                template += f"\n\n#{np.random.choice(['Marketing', 'Growth', 'Business', 'Success'])}"
            labels.append(2)
        elif r < 0.66:
            template = np.random.choice(mid_templates)
            labels.append(1)
        else:
            template = np.random.choice(low_templates)
            labels.append(0)

        # Add noise
        words = template.split()
        if np.random.random() > 0.7 and len(words) > 3:
            idx = np.random.randint(0, len(words))
            words.insert(idx, np.random.choice(["absolutely", "definitely", "truly", "really"]))
        template = " ".join(words)

        samples.append(extract_features(template))

    return np.array(samples), np.array(labels)


def train():
    print("🚀 Training Performance Model...")

    X, y = generate_training_data(2000)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train ensemble model
    model = GradientBoostingClassifier(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.1,
        random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"\n📊 Model Performance:")
    print(f"   Accuracy: {accuracy:.2%}")
    print(f"   Samples: {len(X)} (train: {len(X_train)}, test: {len(X_test)})")
    print(f"\n{classification_report(y_test, y_pred, target_names=['Low', 'Medium', 'High'])}")

    # Feature importance
    feature_names = [
        "word_count", "char_count", "sentence_count", "avg_word_len",
        "has_emoji", "emoji_count", "hashtag_count", "mention_count",
        "has_question", "has_exclamation", "has_numbers", "has_url",
        "has_cta", "hook_length", "has_hook", "line_count", "paragraph_count",
        "readability", "syllable_count",
    ]
    importances = model.feature_importances_
    sorted_idx = np.argsort(importances)[::-1]

    print("🔑 Top 10 Features:")
    for i in range(min(10, len(feature_names))):
        idx = sorted_idx[i]
        print(f"   {i+1}. {feature_names[idx]}: {importances[idx]:.4f}")

    return model


def save_model(model):
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    path = MODEL_DIR / "performance_model.pkl"
    joblib.dump({"model": model, "extract_features": extract_features}, path)
    print(f"\n✅ Performance model saved to {path}")


if __name__ == "__main__":
    model = train()
    save_model(model)
    print("\n✅ Training complete!")
