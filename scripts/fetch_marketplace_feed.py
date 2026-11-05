#!/usr/bin/env python3
"""Fetch public FL.ru RSS projects and write the normalized unified feed."""
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape
from pathlib import Path

FEEDS = [
    ("fl_ru", "https://www.fl.ru/rss/all.xml", "FL.ru", "https://www.fl.ru/"),
]
OUT = Path("public/data/jobs.json")


def clean(value):
    value = re.sub(r"<[^>]+>", " ", value or "")
    return re.sub(r"\s+", " ", unescape(value)).strip()


def parse_date(value):
    if not value:
        return None
    try:
        return parsedate_to_datetime(value).astimezone(timezone.utc).isoformat()
    except (TypeError, ValueError, OverflowError):
        return None


def fetch_feed(source_id, url, label, home):
    request = urllib.request.Request(url, headers={"User-Agent": "ChatAI-FreelanceFeed/1.0 (+https://github.com/bahmetevdanil2005-dev/ChatAI)"})
    with urllib.request.urlopen(request, timeout=25) as response:
        root = ET.fromstring(response.read())
    items = root.findall(".//item")
    jobs = []
    for item in items:
        title = clean(item.findtext("title"))
        link = (item.findtext("link") or "").strip()
        description = clean(item.findtext("description"))
        guid = (item.findtext("guid") or link or title).strip()
        if not title or not link:
            continue
        jobs.append({
            "id": source_id + ":" + guid,
            "source": source_id,
            "sourceLabel": label,
            "title": title,
            "company": label,
            "description": description[:1200],
            "budget": "Не указан",
            "low": 0,
            "type": "Не указан",
            "level": "Любой",
            "category": "Другое",
            "posted": item.findtext("pubDate") or "Недавно",
            "publishedAt": parse_date(item.findtext("pubDate")),
            "duration": "Не указан",
            "skills": [],
            "url": link,
        })
    return jobs


def main():
    all_jobs, sources = [], []
    for source_id, url, label, home in FEEDS:
        try:
            jobs = fetch_feed(source_id, url, label, home)
            all_jobs.extend(jobs)
            sources.append({"id": source_id, "name": label, "status": "ok", "count": len(jobs), "feed": url})
        except Exception as error:
            sources.append({"id": source_id, "name": label, "status": "error", "count": 0, "error": str(error)[:240], "feed": url})
    unique, seen = [], set()
    for job in all_jobs:
        key = job["url"].rstrip("/").lower()
        if key not in seen:
            seen.add(key)
            unique.append(job)
    unique.sort(key=lambda job: job.get("publishedAt") or "", reverse=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "sources": sources,
        "jobs": unique,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Fetched", len(unique), "unique projects; sources:", sources)


if __name__ == "__main__":
    main()
