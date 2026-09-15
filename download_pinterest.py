#!/usr/bin/env python3
"""
download_pinterest.py
---------------------
Downloads Pinterest/TikTok/web videos using yt-dlp, saves to /videos/video_XXX.mp4,
and initializes /scripts/video_XXX.json ready for Antigravity multimodal cataloging.
"""

import os
import sys
import json
import glob
import subprocess
import argparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VIDEOS_DIR = os.path.join(BASE_DIR, "videos")
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")

os.makedirs(VIDEOS_DIR, exist_ok=True)
os.makedirs(SCRIPTS_DIR, exist_ok=True)

def get_next_video_id():
    """Finds the next video_XXX sequence number."""
    existing_videos = glob.glob(os.path.join(VIDEOS_DIR, "video_*.mp4"))
    existing_scripts = glob.glob(os.path.join(SCRIPTS_DIR, "video_*.json"))
    max_num = 0
    
    for path in existing_videos + existing_scripts:
        filename = os.path.basename(path)
        name_part = os.path.splitext(filename)[0]
        if name_part.startswith("video_"):
            num_str = name_part.replace("video_", "")
            if num_str.isdigit():
                max_num = max(max_num, int(num_str))
                
    next_num = max_num + 1
    return f"video_{next_num:03d}"

def get_video_duration(video_path):
    """Uses ffprobe to get exact video duration in seconds."""
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        video_path
    ]
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        dur = float(res.stdout.strip())
        return f"{int(round(dur))}s"
    except Exception:
        return "10s"

def download_video(url, video_id=None, category="Viral Reaction"):
    """Downloads a video from URL via yt-dlp."""
    if not video_id:
        video_id = get_next_video_id()
        
    video_filename = f"{video_id}.mp4"
    video_path = os.path.join(VIDEOS_DIR, video_filename)
    script_path = os.path.join(SCRIPTS_DIR, f"{video_id}.json")
    
    print(f"\n==========================================")
    print(f"📥 Downloading: {url}")
    print(f"🎯 Target File: {video_path}")
    print(f"==========================================")
    
    cmd = [
        "yt-dlp",
        "--no-playlist",
        "-f", "mp4/bestvideo+bestaudio/best",
        "-o", video_path,
        url
    ]
    
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error downloading {url}: {e}", file=sys.stderr)
        return None
        
    if not os.path.exists(video_path) or os.path.getsize(video_path) == 0:
        print(f"❌ Download failed or file is empty: {video_path}", file=sys.stderr)
        return None
        
    duration = get_video_duration(video_path)
    file_size_mb = os.path.getsize(video_path) / (1024 * 1024)
    
    # Initialize basic metadata placeholder
    starter_metadata = {
        "video_id": video_filename,
        "duration": duration,
        "category": category,
        "source_url": url,
        "detailed_description": "PENDING_ANTIGRAVITY_INSPECTION",
        "objects_and_elements": [],
        "actions": [],
        "mood_and_vibe": "",
        "search_keywords": []
    }
    
    with open(script_path, "w", encoding="utf-8") as f:
        json.dump(starter_metadata, f, indent=2)
        
    print(f"✅ Success: Downloaded {video_filename} ({file_size_mb:.2f} MB, {duration})")
    print(f"📝 Initialized Script: {script_path}")
    return {
        "video_id": video_id,
        "video_path": video_path,
        "script_path": script_path,
        "duration": duration
    }

def main():
    parser = argparse.ArgumentParser(description="Download Pinterest/TikTok videos into /videos/ and prep /scripts/")
    parser.add_argument("urls", nargs="*", help="One or more Pinterest/TikTok URLs")
    parser.add_argument("--file", "-f", help="Path to a text file containing one URL per line")
    parser.add_argument("--category", "-c", default="Viral Reaction", help="Category name")
    
    args = parser.parse_args()
    urls_to_process = list(args.urls)
    
    if args.file and os.path.exists(args.file):
        with open(args.file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    urls_to_process.append(line)
                    
    if not urls_to_process:
        print("Usage:")
        print("  python3 download_pinterest.py <PINTEREST_URL>")
        print("  python3 download_pinterest.py --file links.txt")
        sys.exit(1)
        
    results = []
    for url in urls_to_process:
        res = download_video(url, category=args.category)
        if res:
            results.append(res)
            
    print(f"\n✨ Completed: {len(results)}/{len(urls_to_process)} videos downloaded.")

if __name__ == "__main__":
    main()
