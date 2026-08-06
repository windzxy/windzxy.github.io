import json
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "test" / "Study" / "assets" / "open-resources-v10.json"
HEADERS = {"User-Agent": "WindStudyResourceUpdater/1.0 (https://github.com/windzxy/windzxy.github.io)"}
QUERIES = [
    ("chinese", "语文", "zh.wikisource.org", "唐诗 OR 宋词 OR 古文", "维基文库"),
    ("chinese", "语文", "zh.wikiversity.org", "汉语 阅读 写作", "维基学院"),
    ("math", "数学", "zh.wikiversity.org", "数学 代数 几何 概率", "维基学院"),
    ("english", "英语", "en.wikiversity.org", "English language phonics grammar writing", "Wikiversity"),
    ("cantonese", "粤语", "zh.wikiversity.org", "粤语 粤拼 广东话", "维基学院"),
    ("japanese", "日语", "en.wikiversity.org", "Japanese language grammar kana", "Wikiversity"),
    ("korean", "韩语", "en.wikiversity.org", "Korean language Hangul grammar", "Wikiversity"),
    ("science", "科学", "zh.wikiversity.org", "科学 探究 实验", "维基学院"),
    ("physics", "物理", "zh.wikiversity.org", "物理 力学 电学 光学", "维基学院"),
    ("chemistry", "化学", "zh.wikiversity.org", "化学 反应 酸碱 有机", "维基学院"),
    ("biology", "生物", "zh.wikiversity.org", "生物 细胞 遗传 生态", "维基学院"),
    ("history", "历史", "zh.wikiversity.org", "历史 中国史 世界史", "维基学院"),
    ("geography", "地理", "zh.wikiversity.org", "地理 气候 城市 地图", "维基学院"),
    ("computing", "信息科技", "en.wikiversity.org", "computer science programming algorithms data", "Wikiversity"),
    ("finance", "财商与生活", "en.wikiversity.org", "personal finance budgeting investing", "Wikiversity"),
    ("logic", "逻辑与思辨", "en.wikiversity.org", "critical thinking logic argument", "Wikiversity"),
]

def request_json(url: str) -> dict:
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=25) as response:
        return json.load(response)

def search_wiki(subject: str, subject_name: str, domain: str, query: str, source: str) -> list[dict]:
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": 0,
        "gsrlimit": 6,
        "prop": "info|extracts",
        "inprop": "url",
        "exintro": 1,
        "explaintext": 1,
        "exsentences": 3,
        "format": "json",
        "formatversion": 2,
    }
    url = f"https://{domain}/w/api.php?{urllib.parse.urlencode(params)}"
    data = request_json(url)
    items = []
    for page in data.get("query", {}).get("pages", []):
        title = str(page.get("title", "")).strip()
        fullurl = str(page.get("fullurl", "")).strip()
        if not title or not fullurl:
            continue
        extract = " ".join(str(page.get("extract", "")).split())
        items.append({
            "id": f"auto-{subject}-{page.get('pageid', abs(hash(fullurl)))}",
            "title": title,
            "url": fullurl,
            "description": extract[:420],
            "subject": subject,
            "subjectName": subject_name,
            "source": source,
            "license": "Wikimedia项目许可；具体作品状态需逐项核对",
            "kind": "live-index",
            "fetchedAt": datetime.now(timezone.utc).isoformat(),
        })
    return items

def main() -> None:
    existing = json.loads(TARGET.read_text(encoding="utf-8")) if TARGET.exists() else {"items": []}
    manual = [item for item in existing.get("items", []) if not str(item.get("id", "")).startswith("auto-")]
    automatic = []
    failures = []
    for entry in QUERIES:
        try:
            automatic.extend(search_wiki(*entry))
        except Exception as exc:
            failures.append({"query": entry[3], "error": str(exc)[:180]})
        time.sleep(0.35)
    unique = {}
    for item in automatic:
        unique[item["url"]] = item
    result = {
        "version": "20260806-1",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "manualCount": len(manual),
        "automaticCount": len(unique),
        "failures": failures,
        "items": manual + sorted(unique.values(), key=lambda item: (item["subject"], item["title"])),
    }
    if len(result["items"]) < 20:
        raise RuntimeError("resource catalog unexpectedly small")
    TARGET.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
