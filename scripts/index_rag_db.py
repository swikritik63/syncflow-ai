import os
import json
import glob
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "video_rag", "videos.db")
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")

def index_memes():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("DROP TABLE IF EXISTS memes_fts")
    cursor.execute("DROP TABLE IF EXISTS memes")

    cursor.execute("""
    CREATE TABLE memes (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        category TEXT NOT NULL,
        duration TEXT,
        mood_and_vibe TEXT,
        objects TEXT,            -- JSON string array
        actions TEXT,            -- JSON string array
        keywords TEXT,           -- JSON string array
        description TEXT,
        source_url TEXT
    );
    """)

    cursor.execute("""
    CREATE VIRTUAL TABLE memes_fts USING fts5(
        id UNINDEXED,
        filename,
        category,
        mood_and_vibe,
        description,
        actions,
        keywords,
        tokenize = 'porter unicode61'
    );
    """)

    json_files = sorted(glob.glob(os.path.join(SCRIPTS_DIR, "*.json")))
    print(f"Found {len(json_files)} script files to index.")

    count = 0
    for file_path in json_files:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        meme_id = os.path.basename(file_path).replace(".json", "")
        filename = data.get("video_id", "")
        category = data.get("category", "")
        duration = data.get("duration", "")
        mood_and_vibe = data.get("mood_and_vibe", "")
        objects_str = json.dumps(data.get("objects_and_elements", []))
        actions_str = json.dumps(data.get("actions", []))
        keywords_str = json.dumps(data.get("search_keywords", []))
        description = data.get("detailed_description", "")
        source_url = data.get("source_url", "")

        cursor.execute("""
        INSERT INTO memes (id, filename, category, duration, mood_and_vibe, objects, actions, keywords, description, source_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (meme_id, filename, category, duration, mood_and_vibe, objects_str, actions_str, keywords_str, description, source_url))

        # Populate FTS5
        actions_plain = " ".join(data.get("actions", []))
        keywords_plain = " ".join(data.get("search_keywords", []))
        cursor.execute("""
        INSERT INTO memes_fts (id, filename, category, mood_and_vibe, description, actions, keywords)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (meme_id, filename, category, mood_and_vibe, description, actions_plain, keywords_plain))

        count += 1

    conn.commit()
    conn.close()
    print(f"Successfully indexed {count} memes into {DB_PATH}.")

if __name__ == "__main__":
    index_memes()
