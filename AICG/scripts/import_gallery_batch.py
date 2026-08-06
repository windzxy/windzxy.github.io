#!/usr/bin/env python3
"""Import validated Astra Gallery batches staged as UTF-8 base64 text files."""

from __future__ import annotations

import base64
import binascii
import json
import re
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from PIL import Image, ImageOps

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
    with path.open("r", encoding="utf-8") as handle:
        value = json.load(handle)
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
    import io

    try:
        with Image.open(io.BytesIO(payload)) as probe:
            probe.verify()
        image = Image.open(io.BytesIO(payload))
        image.load()
    except Exception as exc:  # Pillow exposes format-specific exceptions
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

    rating = item["rating"]
    if rating not in VALID_RATINGS:
        fail(f"invalid rating for {work_id}: {rating}")
    if not isinstance(item["warningTags"], list) or not all(
        isinstance(tag, str) and tag for tag in item["warningTags"]
    ):
        fail(f"warningTags must be a string array for {work_id}")


def import_batch(batch_dir: Path, gallery: dict[str, Any]) -> int:
    manifest_path = batch_dir / "batch.json"
    manifest = load_json(manifest_path)
    works = manifest.get("works")
    if not isinstance(works, list) or not works:
        fail(f"{manifest_path} must contain a non-empty works array")
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
        work_id = item["id"]
        known_ids.add(work_id)

        source_path = batch_dir / item.pop("source")
        if source_path.parent != batch_dir or not source_path.is_file():
            fail(f"missing or unsafe staged source for {work_id}")

        payload = decode_source(source_path)
        image = open_image(payload, source_path)
        output_dir = ASSET_ROOT / item["date"]
        output_dir.mkdir(parents=True, exist_ok=True)
        image_path = output_dir / f"{work_id}.webp"
        thumb_path = output_dir / f"{work_id}-thumb.webp"
        if image_path.exists() or thumb_path.exists():
            fail(f"asset path already exists for {work_id}")

        full = normalize_image(image, (2560, 1440))
        thumb = normalize_image(image, (640, 360))
        full.save(image_path, "WEBP", quality=92, method=6)
        thumb.save(thumb_path, "WEBP", quality=86, method=6)
        verify_webp(image_path, (2560, 1440))
        verify_webp(thumb_path, (640, 360))

        item["image"] = f"../assets/generated/{item['date']}/{work_id}.webp"
        item["thumb"] = f"../assets/generated/{item['date']}/{work_id}-thumb.webp"
        item["featured"] = bool(item.get("featured", False))
        if item["rating"] in MATURE_RATINGS:
            item["featured"] = False
        prepared.append(item)

    existing_safe: list[dict[str, Any]] = []
    existing_mature: list[dict[str, Any]] = []
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
    temp_path.write_text(
        json.dumps(gallery, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
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
