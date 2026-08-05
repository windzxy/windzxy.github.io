import asyncio
import hashlib
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'test' / 'Study' / 'assets' / 'audio' / 'east-asian'

LESSONS = {
    'japanese/convenience-store': [
        ('staff', '店員：いらっしゃいませ。', 'ja-JP-NanamiNeural'),
        ('customer', '客：このおにぎりを二つください。', 'ja-JP-KeitaNeural'),
        ('staff', '店員：温めますか。', 'ja-JP-NanamiNeural'),
        ('customer', '客：はい、お願いします。それから、水も一本ください。', 'ja-JP-KeitaNeural'),
        ('staff', '店員：全部で五百円です。', 'ja-JP-NanamiNeural'),
    ],
    'japanese/station-directions': [
        ('traveller', '旅行者：すみません。東京駅へはどう行きますか。', 'ja-JP-NanamiNeural'),
        ('staff', '駅員：この電車で二つ目の駅まで行ってください。', 'ja-JP-KeitaNeural'),
        ('traveller', '旅行者：乗り換えは必要ですか。', 'ja-JP-NanamiNeural'),
        ('staff', '駅員：いいえ、乗り換えなくても大丈夫です。', 'ja-JP-KeitaNeural'),
        ('traveller', '旅行者：分かりました。ありがとうございます。', 'ja-JP-NanamiNeural'),
    ],
    'japanese/restaurant': [
        ('staff', '店員：いらっしゃいませ。何名様ですか。', 'ja-JP-NanamiNeural'),
        ('customer', '客：二人です。窓側の席は空いていますか。', 'ja-JP-KeitaNeural'),
        ('staff', '店員：はい、こちらへどうぞ。', 'ja-JP-NanamiNeural'),
        ('customer', '客：おすすめの料理は何ですか。', 'ja-JP-KeitaNeural'),
        ('staff', '店員：今日は焼き魚定食がおすすめです。', 'ja-JP-NanamiNeural'),
    ],
    'japanese/school-introduction': [
        ('teacher', '先生：はじめまして。お名前を教えてください。', 'ja-JP-NanamiNeural'),
        ('student', '学生：リンです。シンガポールから来ました。', 'ja-JP-KeitaNeural'),
        ('teacher', '先生：日本語をどのくらい勉強しましたか。', 'ja-JP-NanamiNeural'),
        ('student', '学生：半年ぐらいです。会話をもっと練習したいです。', 'ja-JP-KeitaNeural'),
        ('teacher', '先生：一緒に頑張りましょう。', 'ja-JP-NanamiNeural'),
    ],
    'korean/cafe-order': [
        ('staff', '직원: 어서 오세요. 무엇을 드릴까요?', 'ko-KR-SunHiNeural'),
        ('customer', '손님: 아메리카노 한 잔하고 샌드위치 하나 주세요.', 'ko-KR-InJoonNeural'),
        ('staff', '직원: 커피는 따뜻한 것으로 드릴까요?', 'ko-KR-SunHiNeural'),
        ('customer', '손님: 네, 따뜻하게 주세요.', 'ko-KR-InJoonNeural'),
        ('staff', '직원: 모두 만 이천 원입니다.', 'ko-KR-SunHiNeural'),
    ],
    'korean/subway-directions': [
        ('traveller', '여행자: 실례합니다. 서울역에 어떻게 가요?', 'ko-KR-SunHiNeural'),
        ('staff', '직원: 이 지하철을 타고 세 정거장 가세요.', 'ko-KR-InJoonNeural'),
        ('traveller', '여행자: 갈아타야 해요?', 'ko-KR-SunHiNeural'),
        ('staff', '직원: 아니요, 갈아타지 않아도 돼요.', 'ko-KR-InJoonNeural'),
        ('traveller', '여행자: 알겠습니다. 감사합니다.', 'ko-KR-SunHiNeural'),
    ],
    'korean/clothes-shopping': [
        ('customer', '손님: 이 셔츠 다른 색도 있어요?', 'ko-KR-SunHiNeural'),
        ('staff', '직원: 네, 파란색하고 검은색이 있어요.', 'ko-KR-InJoonNeural'),
        ('customer', '손님: 파란색을 입어 봐도 돼요?', 'ko-KR-SunHiNeural'),
        ('staff', '직원: 네, 탈의실은 오른쪽에 있습니다.', 'ko-KR-InJoonNeural'),
        ('customer', '손님: 감사합니다. 이걸로 살게요.', 'ko-KR-SunHiNeural'),
    ],
    'korean/school-introduction': [
        ('teacher', '선생님: 처음 뵙겠습니다. 이름이 뭐예요?', 'ko-KR-SunHiNeural'),
        ('student', '학생: 민수예요. 싱가포르에서 왔어요.', 'ko-KR-InJoonNeural'),
        ('teacher', '선생님: 한국어를 얼마나 공부했어요?', 'ko-KR-SunHiNeural'),
        ('student', '학생: 여섯 달 정도 공부했어요. 말하기를 더 연습하고 싶어요.', 'ko-KR-InJoonNeural'),
        ('teacher', '선생님: 좋아요. 같이 열심히 공부해요.', 'ko-KR-SunHiNeural'),
    ],
}

async def generate_one(path: Path, text: str, voice: str) -> dict:
    path.parent.mkdir(parents=True, exist_ok=True)
    for attempt in range(3):
        try:
            await edge_tts.Communicate(text, voice, rate='-8%').save(str(path))
            if path.stat().st_size < 2048:
                raise RuntimeError(f'{path} is too small')
            return {'bytes': path.stat().st_size, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}
        except Exception:
            path.unlink(missing_ok=True)
            if attempt == 2:
                raise
            await asyncio.sleep(2 + attempt * 2)
    raise RuntimeError(str(path))

async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    items = []
    sequences = {}
    for lesson, lines in LESSONS.items():
        keys = []
        for index, (role, text, voice) in enumerate(lines, start=1):
            key = f'{lesson}/{index:02d}'
            file = f'{lesson}/{index:02d}-{role}.mp3'
            meta = await generate_one(OUT / file, text, voice)
            items.append({'key': key, 'language': lesson.split('/')[0], 'text': text, 'file': file, 'voice': voice, **meta})
            keys.append(key)
        sequences[lesson] = keys
    manifest = {'version': '20260805-1', 'engine': 'edge-tts 7.2.8', 'items': items, 'sequences': sequences}
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

if __name__ == '__main__':
    asyncio.run(main())
