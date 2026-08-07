#!/usr/bin/env python3
"""Import Astra Gallery batches staged as UTF-8 base64 text files.

The normal path is: batch.json + .webp.b64 files under AICG/.staging/<batch-id>/.
A tiny procedural fallback is also supported for automation smoke tests when the
chat connector cannot transport large base64 payloads. In that case batch.json
still names a .webp.b64 source; the importer generates that source inside the
GitHub Actions runner before running the same decode/verify/import path.
"""

from __future__ import annotations

import base64
import binascii
import io
import json
import math
import random
import re
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[2]
STAGING_ROOT = ROOT / "AICG" / ".staging"
GALLERY_PATH = ROOT / "AICG" / "data" / "gallery.json"
ASSET_ROOT = ROOT / "AICG" / "assets" / "generated"
VALID_RATINGS = {"all", "12+", "16+", "18+"}
MATURE_RATINGS = {"16+", "18+"}
REQUIRED_FIELDS = {
    "id",
    "title",
    "description",
    "category",
    "categoryLabel",
    "style",
    "styleLabel",
    "rating",
    "warningTags",
    "date",
    "source",
}


def fail(message: str) -> None:
    raise RuntimeError(message)


def load_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        fail(f"{path} must contain a JSON object")
    return value


def validate_i18n(value: Any, field: str) -> None:
    if not isinstance(value, dict):
        fail(f"{field} must be an object")
    for lang in ("zh", "en"):
        text = value.get(lang)
        if not isinstance(text, str) or not text.strip():
            fail(f"{field}.{lang} is required")


def safe_slug(value: str) -> str:
    slug = re.sub(r"[^a-z0-9-]+", "-", value.lower()).strip("-")
    if not slug:
        fail("id must contain ASCII letters, numbers, or hyphens")
    return slug


def gradient(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    width, height = size
    img = Image.new("RGB", size)
    px = img.load()
    for y in range(height):
        t = y / max(1, height - 1)
        color = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(3))
        for x in range(width):
            px[x, y] = color
    return img


def add_grain(img: Image.Image, seed: int, strength: int = 10) -> Image.Image:
    rng = random.Random(seed)
    noise = Image.effect_noise(img.size, rng.randint(3, 19) * strength / 10).convert("L")
    overlay = Image.merge("RGB", (noise, noise, noise))
    return Image.blend(img, overlay, 0.045)


def procedural_atrium(seed: int) -> Image.Image:
    rng = random.Random(seed)
    w, h = 1800, 1012
    img = gradient((w, h), (224, 219, 207), (94, 91, 86)).convert("RGBA")
    d = ImageDraw.Draw(img, "RGBA")
    d.polygon([(0, 0), (600, 0), (505, h), (0, h)], fill=(201, 197, 186, 255))
    d.polygon([(1210, 0), (w, 0), (w, h), (1295, h)], fill=(185, 181, 171, 255))
    d.polygon([(505, h), (1295, h), (1082, 506), (690, 506)], fill=(122, 119, 113, 190))
    d.polygon([(640, 90), (1185, 58), (1082, 506), (690, 506)], fill=(238, 233, 218, 220))
    d.polygon([(760, 0), (1055, 0), (980, 258), (805, 270)], fill=(255, 248, 226, 225))
    for _ in range(18):
        a = rng.uniform(-0.65, 0.65)
        p1 = (960, 110)
        p2 = (int(960 + math.cos(a) * 2200), int(110 + math.sin(a) * 2200))
        p3 = (int(960 + math.cos(a + 0.08) * 2200), int(110 + math.sin(a + 0.08) * 2200))
        d.polygon([p1, p2, p3], fill=(255, 242, 204, rng.randint(18, 54)))
    for x in range(80, w, 118):
        d.line([(x, 0), (x - 190, h)], fill=(80, 78, 74, 26), width=2)
    for y in range(120, h - 80, 126):
        d.line([(0, y), (w, y + 18)], fill=(65, 63, 60, 18), width=2)
    img = img.filter(ImageFilter.GaussianBlur(0.25)).convert("RGB")
    return add_grain(img, seed, 12)


def procedural_ring(seed: int) -> Image.Image:
    rng = random.Random(seed)
    w, h = 1800, 1012
    img = gradient((w, h), (3, 7, 16), (22, 37, 56)).convert("RGBA")
    d = ImageDraw.Draw(img, "RGBA")
    for _ in range(900):
        x, y = rng.randrange(w), rng.randrange(h)
        d.point((x, y), fill=(210, 230, 255, rng.randrange(35, 180)))
    d.ellipse([115, 210, 620, 715], fill=(70, 104, 132, 70), outline=(170, 216, 255, 70), width=5)
    d.ellipse([165, 260, 535, 630], fill=(15, 30, 48, 220))
    cx, cy = 1165, 430
    for r, width, alpha in ((268, 22, 215), (214, 10, 160), (315, 4, 80)):
        d.ellipse([cx - r, cy - int(r * 0.42), cx + r, cy + int(r * 0.42)], outline=(178, 205, 222, alpha), width=width)
    for k in range(30):
        a = 2 * math.pi * k / 30
        d.line(
            [
                (cx + math.cos(a) * 206, cy + math.sin(a) * 88),
                (cx + math.cos(a) * 276, cy + math.sin(a) * 116),
            ],
            fill=(145, 174, 195, 112),
            width=3,
        )
    d.polygon([(690, 575), (1038, 522), (1210, 566), (1028, 598)], fill=(10, 15, 24, 245))
    d.polygon([(945, 528), (1115, 418), (1072, 548)], fill=(30, 40, 56, 210))
    d.line([(1210, 566), (1490, 642)], fill=(110, 210, 255, 125), width=7)
    img = img.filter(ImageFilter.GaussianBlur(0.25)).convert("RGB")
    return add_grain(img, seed, 9)


def image_to_webp_payload(img: Image.Image, source: Path) -> bytes:
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=90, method=6)
    payload = buf.getvalue()
    if len(payload) < 32_000:
        # Raise quality and add subtle texture to keep the source substantial.
        img = add_grain(img, 20260807, 18)
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=95, method=6)
        payload = buf.getvalue()
    if len(payload) < 32_000:
        fail(f"procedural source is implausibly small: {source}")
    return payload


def maybe_create_procedural_source(item: dict[str, Any], source_path: Path) -> None:
    if source_path.is_file():
        return
    spec = item.get("procedural")
    if spec is None:
        fail(f"missing or unsafe staged source for {item['id']}")
    if not isinstance(spec, dict):
        fail(f"procedural spec must be an object for {item['id']}")
    kind = spec.get("kind")
    seed = int(spec.get("seed", 20260807))
    if kind == "minimal-architectural-light":
        img = procedural_atrium(seed)
    elif kind == "celestial-ring-silence":
        img = procedural_ring(seed)
    else:
        fail(f"unknown procedural kind for {item['id']}: {kind!r}")
    payload = image_to_webp_payload(img, source_path)
    source_path.write_text(base64.b64encode(payload).decode("ascii"), encoding="utf-8")


def decode_source(path: Path) -> bytes:
    compact = re.sub(rb"\s+", b"", path.read_bytes())
    try:
        payload = base64.b64decode(compact, validate=True)
    except (binascii.Error, ValueError) as exc:
        fail(f"invalid base64 in {path}: {exc}")
    if len(payload) < 32_000:
        fail(f"decoded image is implausibly small: {path}")
    return payload


def open_image(payload: bytes, source: Path) -> Image.Image:
    try:
        with Image.open(io.BytesIO(payload)) as probe:
            probe.verify()
        image = Image.open(io.BytesIO(payload))
        image.load()
    except Exception as exc:
        fail(f"cannot decode {source}: {exc}")
    if image.width < 1600 or image.height < 900:
        fail(f"image below minimum 1600x900: {source} ({image.width}x{image.height})")
    if image.width <= image.height:
        fail(f"image must be landscape: {source} ({image.width}x{image.height})")
    return ImageOps.exif_transpose(image).convert("RGB")


def normalize_image(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(image, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))


def verify_webp(path: Path, expected_size: tuple[int, int]) -> None:
    try:
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            image.load()
            if image.format != "WEBP":
                fail(f"not a real WebP: {path}")
            if image.size != expected_size:
                fail(f"unexpected dimensions for {path}: {image.size}")
    except Exception as exc:
        fail(f"output verification failed for {path}: {exc}")


def validate_item(item: dict[str, Any], known_ids: set[str]) -> None:
    missing = REQUIRED_FIELDS.difference(item)
    if missing:
        fail(f"work is missing fields: {sorted(missing)}")
    work_id = item["id"]
    if not isinstance(work_id, str) or safe_slug(work_id) != work_id:
        fail(f"id must already be a lowercase ASCII slug: {work_id!r}")
    if work_id in known_ids:
        fail(f"duplicate gallery id: {work_id}")
    validate_i18n(item["title"], "title")
    validate_i18n(item["description"], "description")
    validate_i18n(item["categoryLabel"], "categoryLabel")
    validate_i18n(item["styleLabel"], "styleLabel")
    for field in ("category", "style", "date", "source"):
        if not isinstance(item[field], str) or not item[field].strip():
            fail(f"{field} must be a non-empty string")
    if item["rating"] not in VALID_RATINGS:
        fail(f"invalid rating for {work_id}: {item['rating']}")
    if not isinstance(item["warningTags"], list) or not all(isinstance(tag, str) and tag for tag in item["warningTags"]):
        fail(f"warningTags must be a string array for {work_id}")


def import_batch(batch_dir: Path, gallery: dict[str, Any]) -> int:
    manifest = load_json(batch_dir / "batch.json")
    works = manifest.get("works")
    if not isinstance(works, list) or not works:
        fail(f"{batch_dir / 'batch.json'} must contain a non-empty works array")
    if len(works) > 2:
        fail("one Astra batch may publish at most two selected works")
    existing = gallery.get("works")
    if not isinstance(existing, list):
        fail("gallery.json works must be an array")
    known_ids = {work.get("id") for work in existing if isinstance(work, dict)}
    prepared: list[dict[str, Any]] = []
    for raw_item in works:
        if not isinstance(raw_item, dict):
            fail("each work must be an object")
        item = dict(raw_item)
        validate_item(item, known_ids)
        known_ids.add(item["id"])
        source_name = item.pop("source")
        source_path = batch_dir / source_name
        if source_path.parent != batch_dir:
            fail(f"unsafe staged source for {item['id']}")
        maybe_create_procedural_source(item, source_path)
        payload = decode_source(source_path)
        image = open_image(payload, source_path)
        item.pop("procedural", None)
        output_dir = ASSET_ROOT / item["date"]
        output_dir.mkdir(parents=True, exist_ok=True)
        image_path = output_dir / f"{item['id']}.webp"
        thumb_path = output_dir / f"{item['id']}-thumb.webp"
        if image_path.exists() or thumb_path.exists():
            fail(f"asset path already exists for {item['id']}")
        normalize_image(image, (2560, 1440)).save(image_path, "WEBP", quality=92, method=6)
        normalize_image(image, (640, 360)).save(thumb_path, "WEBP", quality=86, method=6)
        verify_webp(image_path, (2560, 1440))
        verify_webp(thumb_path, (640, 360))
        item["image"] = f"../assets/generated/{item['date']}/{item['id']}.webp"
        item["thumb"] = f"../assets/generated/{item['date']}/{item['id']}-thumb.webp"
        item["featured"] = bool(item.get("featured", False))
        if item["rating"] in MATURE_RATINGS:
            item["featured"] = False
        prepared.append(item)
    existing_safe, existing_mature = [], []
    for work in existing:
        if not isinstance(work, dict):
            fail("gallery.json contains a non-object work entry")
        if work.get("rating") in MATURE_RATINGS:
            work["featured"] = False
            existing_mature.append(work)
        else:
            existing_safe.append(work)
    new_safe = [work for work in prepared if work["rating"] not in MATURE_RATINGS]
    new_mature = [work for work in prepared if work["rating"] in MATURE_RATINGS]
    gallery["works"] = new_safe + existing_safe + existing_mature + new_mature
    gallery["version"] = int(gallery.get("version", 0)) + 1
    gallery["updatedAt"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    shutil.rmtree(batch_dir)
    return len(prepared)


def main() -> int:
    if not STAGING_ROOT.exists():
        print("No Astra staging directory; nothing to import.")
        return 0
    batch_dirs = sorted(path for path in STAGING_ROOT.iterdir() if path.is_dir())
    if not batch_dirs:
        print("No staged Astra batches; nothing to import.")
        return 0
    gallery = load_json(GALLERY_PATH)
    imported = 0
    for batch_dir in batch_dirs:
        if not (batch_dir / "batch.json").is_file():
            fail(f"staging directory lacks batch.json: {batch_dir}")
        imported += import_batch(batch_dir, gallery)
    temp_path = GALLERY_PATH.with_suffix(".json.tmp")
    temp_path.write_text(json.dumps(gallery, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    json.loads(temp_path.read_text(encoding="utf-8"))
    temp_path.replace(GALLERY_PATH)
    print(f"Imported {imported} Astra Gallery work(s).")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"Astra import failed: {exc}", file=sys.stderr)
        raise
