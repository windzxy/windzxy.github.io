import asyncio
import hashlib
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'test' / 'Study' / 'assets' / 'audio' / 'cantonese' / 'tea-restaurant'
ITEMS = [
    ('01-customer.mp3', '顧客：唔該，我想要一個菠蘿包同一杯凍奶茶。', 'zh-HK-HiuMaanNeural'),
    ('02-staff.mp3', '店員：凍奶茶要少甜定正常甜？', 'zh-HK-WanLungNeural'),
    ('03-customer.mp3', '顧客：少甜，唔該。請問一共幾多錢？', 'zh-HK-HiuMaanNeural'),
    ('04-staff.mp3', '店員：四十二蚊。多謝。', 'zh-HK-WanLungNeural'),
    ('05-customer.mp3', '顧客：唔該晒。', 'zh-HK-HiuMaanNeural'),
]

async def generate_one(filename: str, text: str, voice: str) -> dict:
    target = OUT / filename
    for attempt in range(3):
        try:
            communicate = edge_tts.Communicate(text, voice, rate='-8%', volume='+0%', pitch='+0Hz')
            await communicate.save(str(target))
            if target.stat().st_size < 2048:
                raise RuntimeError(f'{filename} is too small')
            return {
                'file': filename,
                'text': text,
                'voice': voice,
                'bytes': target.stat().st_size,
                'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
            }
        except Exception:
            target.unlink(missing_ok=True)
            if attempt == 2:
                raise
            await asyncio.sleep(2 + attempt * 2)
    raise RuntimeError(filename)

async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    records = []
    for item in ITEMS:
        records.append(await generate_one(*item))
    manifest = {
        'language': 'yue-HK',
        'course': 'tea-restaurant',
        'engine': 'edge-tts 7.2.8',
        'items': records,
    }
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

if __name__ == '__main__':
    asyncio.run(main())
