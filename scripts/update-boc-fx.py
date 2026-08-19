#!/usr/bin/env python3
"""Fetch Bank of China FX rates and write a static JSON snapshot for GitHub Pages."""
from __future__ import annotations

import datetime as _dt
import html
import json
import re
import sys
import urllib.request
from pathlib import Path

BOC_URL = "https://www.boc.cn/sourcedb/whpj/"
OUT = Path("data/boc-fx.json")
WATCH = {
    "港币": "HKD",
    "美元": "USD",
    "日元": "JPY",
    "韩国元": "KRW",
    "土耳其里拉": "TRY",
}


def fetch_html(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windzxy WebDesk FX updater)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = resp.read()
        content_type = resp.headers.get("content-type", "")
    charset = ""
    m = re.search(r"charset=([\w-]+)", content_type, re.I)
    if m:
        charset = m.group(1)
    for enc in [charset, "utf-8", "gb18030", "gbk"]:
        if not enc:
            continue
        try:
            text = raw.decode(enc)
            if "中国银行外汇牌价" in text or "港币" in text:
                return text
        except Exception:
            pass
    return raw.decode("utf-8", "ignore")


def clean_cell(value: str) -> str:
    value = re.sub(r"<script[\s\S]*?</script>", " ", value, flags=re.I)
    value = re.sub(r"<style[\s\S]*?</style>", " ", value, flags=re.I)
    value = re.sub(r"<[^>]+>", " ", value)
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def parse_rows(text: str) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    trs = re.findall(r"<tr[\s\S]*?</tr>", text, flags=re.I)
    for tr in trs:
        cells = [clean_cell(c) for c in re.findall(r"<t[dh][^>]*>[\s\S]*?</t[dh]>", tr, flags=re.I)]
        if len(cells) < 8:
            continue
        name = cells[0]
        if name not in WATCH:
            continue
        rows.append(
            {
                "name": name,
                "code": WATCH[name],
                "buy": cells[1],
                "cashBuy": cells[2],
                "sell": cells[3],
                "cashSell": cells[4],
                "mid": cells[5],
                "date": cells[6],
                "time": cells[7],
            }
        )
    rows.sort(key=lambda r: list(WATCH).index(r["name"]))
    return rows


def main() -> int:
    text = fetch_html(BOC_URL)
    rows = parse_rows(text)
    if len(rows) < len(WATCH):
        raise RuntimeError(f"Expected {len(WATCH)} target rows, got {len(rows)}")
    first = rows[0]
    payload = {
        "source": "中國銀行外匯牌價",
        "sourceUrl": BOC_URL,
        "unit": "100 外幣兌人民幣",
        "fetchedAt": _dt.datetime.now(_dt.timezone.utc).isoformat(),
        "date": first.get("date") or "--",
        "time": first.get("time") or "--",
        "rows": rows,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} with {len(rows)} rows from {payload['date']} {payload['time']}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"BOC FX updater failed: {exc}", file=sys.stderr)
        raise
