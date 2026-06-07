"""
Train the brand voice transformation model.

This model learns vocabulary mappings and style features for each persona
based on sample text data. It can be retrained with more examples.

Usage:
    python train_voice.py
"""
import json
import joblib
import numpy as np
import re
from pathlib import Path
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer

DATA_DIR = Path(__file__).parent / "data"
MODEL_DIR = Path(__file__).parent.parent / "models"


# Sample training data per persona
PERSONA_SAMPLES = {
    "Professional": [
        "We are pleased to announce our strategic partnership that will leverage synergies across our portfolio.",
        "Our quarterly analysis demonstrates significant improvement in key performance indicators.",
        "The implementation roadmap has been finalized, with measurable milestones established for Q2.",
        "We recommend a comprehensive approach to facilitate stakeholder alignment and optimize outcomes.",
        "Our team endeavors to deliver exceptional value through data-driven decision making.",
    ],
    "Friendly": [
        "Hey everyone! 😊 Super excited to share this with you all! Can't wait to hear your thoughts!",
        "Just had the best experience! You guys need to check this out! 💕",
        "OMG this is amazing! 🎉 Who else is loving this? Drop a comment below!",
        "Happy Monday friends! 👋 Hope you're having an awesome start to the week!",
        "Love seeing all your responses! You all are the best! 💬❤️",
    ],
    "Gen-Z": [
        "no bc this is literally giving 💀 like bestie you need to see this fr fr",
        "the way this hits different tho 🔥 lowkey the best thing I've seen all week",
        "not me being obsessed with this rn 😭 iykyk ✨",
        "okay but why is nobody talking about this?? it's bussin fr 🤌",
        "main character energy tbh 💅 this is a whole mood",
    ],
    "Corporate": [
        "Executive Summary: Our Q3 performance exceeded projections by 12%. Key drivers included strategic market positioning and operational efficiency improvements.",
        "Action Item: Review the attached analysis and provide feedback by EOD Friday. Cross-functional alignment is critical for the next milestone.",
        "Key Takeaways: 1) Market expansion on track 2) ROI positive 3) Stakeholder engagement improving. Next Steps: Schedule quarterly review.",
        "This initiative aligns with our corporate strategy and represents a significant opportunity for value creation across multiple business units.",
    ],
    "Storyteller": [
        "Picture this... It's 3 AM, and I'm staring at my screen, wondering if this will ever work. But then something magical happened.",
        "I still remember the day everything changed. We were just a small team with a big dream, and the odds were against us.",
        "Let me take you back to where it all began. The journey wasn't easy, but every step taught us something invaluable.",
        "There's a moment in every journey where you face a crossroads. For us, that moment came when we least expected it.",
    ],
    "Motivational": [
        "🚀 LISTEN UP! Success isn't given, it's EARNED. Every single day is an opportunity to become BETTER than yesterday!",
        "💪 Stop making excuses. Start making PROGRESS. The only person standing between you and your goals is YOU!",
        "🔥 Champions don't quit! If you're reading this, you already have what it takes. NOW GO CRUSH IT!",
        "⚡ Every setback is a SETUP for a comeback! Rise, grind, and DOMINATE. Your future self will thank you!",
    ],
}


def extract_style_features(text: str) -> dict:
    """Extract style features from text."""
    words = text.split()
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]

    return {
        "avg_sentence_length": np.mean([len(s.split()) for s in sentences]) if sentences else 0,
        "avg_word_length": np.mean([len(w) for w in words]) if words else 0,
        "exclamation_rate": text.count('!') / max(len(sentences), 1),
        "question_rate": text.count('?') / max(len(sentences), 1),
        "emoji_density": len(re.findall(r'[\U0001F600-\U0001F9FF\u2600-\u26FF\u2700-\u27BF]', text)) / max(len(words), 1),
        "uppercase_rate": sum(1 for c in text if c.isupper()) / max(len(text), 1),
        "hashtag_density": len(re.findall(r'#\w+', text)) / max(len(words), 1),
        "formality_score": sum(1 for w in words if w.lower() in {
            'leverage', 'facilitate', 'strategic', 'implement', 'optimize',
            'stakeholder', 'synergy', 'initiative', 'comprehensive', 'endeavor'
        }) / max(len(words), 1),
    }


def train():
    print("🚀 Training Voice Model...")

    all_features = {}
    vocab_maps = {}

    for persona, samples in PERSONA_SAMPLES.items():
        # Extract style features
        features = [extract_style_features(s) for s in samples]
        avg_features = {}
        for key in features[0]:
            avg_features[key] = np.mean([f[key] for f in features])

        all_features[persona] = avg_features

        # Build vocabulary map (most common words per persona)
        all_words = " ".join(samples).lower().split()
        word_freq = Counter(all_words)
        # Filter out common stop words
        stop_words = {'the', 'a', 'an', 'is', 'it', 'to', 'and', 'of', 'in', 'for', 'on', 'at', 'by', 'with'}
        vocab = {w: c for w, c in word_freq.most_common(50) if w not in stop_words and len(w) > 2}
        vocab_maps[persona] = vocab

        print(f"  📝 {persona}: avg_sentence_len={avg_features['avg_sentence_length']:.1f}, "
              f"emoji_density={avg_features['emoji_density']:.3f}, "
              f"formality={avg_features['formality_score']:.3f}")

    # TF-IDF vectorizer for each persona
    vectorizer = TfidfVectorizer(max_features=200, stop_words="english")
    all_texts = [" ".join(samples) for samples in PERSONA_SAMPLES.values()]
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    model = {
        "style_features": all_features,
        "vocab_maps": vocab_maps,
        "vectorizer": vectorizer,
        "tfidf_matrix": tfidf_matrix,
        "personas": list(PERSONA_SAMPLES.keys()),
    }

    return model


def save_model(model):
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    path = MODEL_DIR / "voice_model.pkl"
    joblib.dump(model, path)
    print(f"\n✅ Voice model saved to {path}")
    print(f"   Personas: {', '.join(model['personas'])}")


def test_model(model):
    print("\n📊 Style Features Per Persona:")
    for persona, features in model["style_features"].items():
        print(f"\n  {persona}:")
        for key, val in features.items():
            print(f"    {key}: {val:.4f}")


if __name__ == "__main__":
    model = train()
    save_model(model)
    test_model(model)
    print("\n✅ Training complete!")
