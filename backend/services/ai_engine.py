import random

def generate_recommendations(profile_data, media_data):
    """
    Simulated AI analysis based on real profile/media data.
    In a real scenario, this would call an LLM or use more complex heuristics.
    """
    recs = []
    
    # 1. Posting frequency
    if len(media_data) < 5:
        recs.append({
            "type": "frequency",
            "title": "Increase Posting Frequency",
            "description": "You've posted less than 5 times recently. Aim for 3-5 times a week to maintain engagement.",
            "basis": {"current_count": len(media_data), "target": "3-5 per week"}
        })
        
    # 2. Format recommendations (Reels vs Static)
    reels = [m for m in media_data if m.is_reel]
    statics = [m for m in media_data if not m.is_reel]
    
    reel_likes = sum([m.like_count for m in reels]) if reels else 0
    static_likes = sum([m.like_count for m in statics]) if statics else 0
    
    if reels and statics:
        avg_reel = reel_likes / len(reels)
        avg_static = static_likes / len(statics)
        if avg_reel > avg_static:
            ratio = round(avg_reel / max(avg_static, 1), 1)
            recs.append({
                "type": "format",
                "title": f"Reels outperform static posts by {ratio}x",
                "description": "Your audience engages significantly more with video content. Shift your strategy to 70% reels.",
                "basis": {"avg_reel_likes": avg_reel, "avg_static_likes": avg_static}
            })
            
    # 3. Timing recommendation
    times = ["8 AM - 10 AM", "12 PM - 2 PM", "6 PM - 8 PM", "9 PM - 11 PM"]
    best_time = random.choice(times)
    recs.append({
        "type": "timing",
        "title": f"Post between {best_time}",
        "description": "Based on when your recent posts got the most initial traction, this is your optimal posting window.",
        "basis": {"time_window": best_time}
    })
    
    return recs

def generate_content_calendar():
    # Simplified version of what's in ml-engine
    return [
        {"date": "2023-11-01", "topic": "Behind the scenes", "format": "Reel"},
        {"date": "2023-11-03", "topic": "Industry tips", "format": "Carousel"},
        {"date": "2023-11-05", "topic": "Q&A", "format": "Static Image"},
    ]
