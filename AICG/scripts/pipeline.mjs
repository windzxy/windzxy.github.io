import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import OpenAI from "openai";
import sharp from "sharp";

const repoRoot = process.cwd();
const siteRoot = path.join(repoRoot, "AICG");
const dataPath = path.join(siteRoot, "data", "gallery.json");
const briefsPath = path.join(siteRoot, "data", "briefs.json");
const latestRunPath = path.join(siteRoot, "data", "runs", "latest.json");
const generatedRoot = path.join(siteRoot, "assets", "generated");
const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "wind-aicg-"));

const apiKey = process.env.OPENAI_API_KEY?.trim();
const imageModel = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-1";
const reviewModel = process.env.OPENAI_REVIEW_MODEL?.trim() || "gpt-5-mini";
const candidateCount = clampNumber(process.env.AICG_CANDIDATES, 1, 8, 4);
const publishCount = clampNumber(process.env.AICG_PUBLISH_COUNT, 1, 4, 2);
const minReviewScore = clampNumber(process.env.AICG_MIN_SCORE, 70, 98, 84);

if (!apiKey) {
  console.log("OPENAI_API_KEY is not configured. The scheduled AICG pipeline is installed but generation is skipped.");
  process.exit(0);
}

const client = new OpenAI({ apiKey });
const gallery = JSON.parse(await fs.readFile(dataPath, "utf8"));
const briefs = JSON.parse(await fs.readFile(briefsPath, "utf8"));
const existingWorks = Array.isArray(gallery) ? gallery : gallery.works;
const startedAt = new Date().toISOString();
const runId = startedAt.replace(/[:.]/g, "-");
const selectedBriefs = chooseBriefs(briefs.briefs, existingWorks, candidateCount);
const candidates = [];

await fs.mkdir(generatedRoot, { recursive: true });
await fs.mkdir(path.dirname(latestRunPath), { recursive: true });

for (let index = 0; index < selectedBriefs.length; index += 1) {
  const brief = selectedBriefs[index];
  const prompt = buildPrompt(brief, briefs.principles);
  console.log(`Generating candidate ${index + 1}/${selectedBriefs.length}: ${brief.id}`);

  try {
    const response = await client.images.generate({
      model: imageModel,
      prompt,
      size: "1536x1024",
      quality: "high"
    });
    const encoded = response.data?.[0]?.b64_json;
    if (!encoded) throw new Error("Image API returned no base64 image.");

    const sourceBuffer = Buffer.from(encoded, "base64");
    const technical = await inspectImage(sourceBuffer);
    if (!technical.ok) {
      candidates.push(rejectedRecord(brief, prompt, "technical", technical.reason));
      continue;
    }

    const dataUrl = `data:image/png;base64,${encoded}`;
    const moderation = await moderateCandidate(prompt, dataUrl);
    if (!moderation.ok) {
      candidates.push(rejectedRecord(brief, prompt, "moderation", moderation.reason));
      continue;
    }

    const review = await reviewCandidate(brief, prompt, dataUrl);
    if (review.score < minReviewScore || review.reject) {
      candidates.push(rejectedRecord(brief, prompt, "visual-review", review.summary, review));
      continue;
    }

    const slug = `${dateStamp()}-${slugify(brief.id)}-${crypto.randomBytes(3).toString("hex")}`;
    const imageRelative = `assets/generated/${slug}.webp`;
    const thumbRelative = `assets/generated/${slug}-thumb.webp`;
    const imageAbsolute = path.join(siteRoot, imageRelative);
    const thumbAbsolute = path.join(siteRoot, thumbRelative);

    await sharp(sourceBuffer)
      .resize(2560, 1440, { fit: "cover", position: sharp.strategy.attention })
      .webp({ quality: 88, effort: 5 })
      .toFile(imageAbsolute);

    await sharp(sourceBuffer)
      .resize(960, 540, { fit: "cover", position: sharp.strategy.attention })
      .webp({ quality: 82, effort: 4 })
      .toFile(thumbAbsolute);

    candidates.push({
      status: "approved",
      id: slug,
      brief,
      prompt,
      review,
      moderation,
      technical,
      work: {
        id: slug,
        title: {
          zh: review.titleZh || brief.labelZh,
          en: review.titleEn || brief.labelEn
        },
        description: {
          zh: review.descriptionZh || "經自動生成與策展審核通過的原創視覺作品。",
          en: review.descriptionEn || "An original visual work approved by the automated generation and curation pipeline."
        },
        category: brief.category,
        categoryLabel: { zh: brief.labelZh, en: brief.labelEn },
        direction: {
          zh: review.directionZh || `${brief.composition}；${brief.light}`,
          en: review.directionEn || `${brief.composition}; ${brief.light}`
        },
        date: new Date().toISOString().slice(0, 10),
        image: `./${imageRelative}`,
        thumb: `./${thumbRelative}`,
        score: review.score,
        featured: false,
        status: "curated",
        source: "scheduled-openai-pipeline",
        generation: {
          runId,
          model: imageModel,
          reviewModel,
          briefId: brief.id,
          promptHash: crypto.createHash("sha256").update(prompt).digest("hex").slice(0, 16)
        }
      }
    });
  } catch (error) {
    console.error(`Candidate ${brief.id} failed:`, error);
    candidates.push(rejectedRecord(brief, prompt, "runtime", String(error?.message || error)));
  }
}

const approved = candidates
  .filter(candidate => candidate.status === "approved")
  .sort((a, b) => b.review.score - a.review.score)
  .slice(0, publishCount);

if (approved.length) {
  const newWorks = approved.map(candidate => candidate.work);
  const nextWorks = [...newWorks, ...existingWorks]
    .filter((work, index, array) => array.findIndex(item => item.id === work.id) === index)
    .slice(0, 80);

  nextWorks.forEach((work, index) => {
    if (index < 5 && newWorks.some(item => item.id === work.id)) work.featured = true;
    if (index >= 5 && work.source === "scheduled-openai-pipeline") work.featured = false;
  });

  const nextGallery = {
    version: Number(gallery.version || 1) + 1,
    updatedAt: new Date().toISOString(),
    works: nextWorks
  };
  await fs.writeFile(dataPath, `${JSON.stringify(nextGallery, null, 2)}\n`, "utf8");
}

const report = {
  runId,
  startedAt,
  finishedAt: new Date().toISOString(),
  imageModel,
  reviewModel,
  candidateCount,
  publishCountRequested: publishCount,
  minReviewScore,
  approved: approved.map(item => ({ id: item.work.id, score: item.review.score, briefId: item.brief.id })),
  rejected: candidates.filter(item => item.status !== "approved").map(item => ({
    briefId: item.brief.id,
    gate: item.gate,
    reason: item.reason
  }))
};
await fs.writeFile(latestRunPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
await fs.rm(tempRoot, { recursive: true, force: true });

console.log(`AICG pipeline finished: ${approved.length} work(s) approved for publishing.`);

function chooseBriefs(allBriefs, works, count) {
  const recentCategories = works.slice(0, 12).map(work => work.category);
  const weighted = allBriefs.map(brief => ({
    brief,
    weight: 1 + Math.max(0, 4 - recentCategories.filter(category => category === brief.category).length)
  }));
  const result = [];
  const pool = [...weighted];
  while (result.length < Math.min(count, pool.length)) {
    const total = pool.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    let selectedIndex = 0;
    for (let index = 0; index < pool.length; index += 1) {
      roll -= pool[index].weight;
      if (roll <= 0) { selectedIndex = index; break; }
    }
    result.push(pool.splice(selectedIndex, 1)[0].brief);
  }
  return result;
}

function buildPrompt(brief, principles) {
  return [
    "Create one original, premium editorial wallpaper image.",
    ...principles,
    `Subject: ${brief.subject}.`,
    `Composition: ${brief.composition}.`,
    `Lighting: ${brief.light}.`,
    `Palette: ${brief.palette}.`,
    `Mood: ${brief.mood}.`,
    `Explicitly avoid: ${brief.avoid}.`,
    "The final image must work as a sophisticated desktop wallpaper: coherent at full resolution, readable as a thumbnail, with useful negative space and no embedded typography.",
    "Photorealistic or illustration-like rendering is allowed only when it follows the brief; do not copy any existing visual property or named style."
  ].join("\n");
}

async function inspectImage(buffer) {
  try {
    const metadata = await sharp(buffer, { failOn: "error" }).metadata();
    if (!metadata.width || !metadata.height) return { ok: false, reason: "Missing dimensions." };
    if (metadata.width < 1000 || metadata.height < 700) return { ok: false, reason: `Resolution too small: ${metadata.width}x${metadata.height}.` };
    if (!["png", "jpeg", "webp"].includes(metadata.format)) return { ok: false, reason: `Unsupported source format: ${metadata.format}.` };
    const ratio = metadata.width / metadata.height;
    if (ratio < 1.25 || ratio > 1.8) return { ok: false, reason: `Unsuitable aspect ratio: ${ratio.toFixed(2)}.` };
    return { ok: true, width: metadata.width, height: metadata.height, format: metadata.format };
  } catch (error) {
    return { ok: false, reason: `Image decode failed: ${error.message}` };
  }
}

async function moderateCandidate(prompt, dataUrl) {
  const response = await client.moderations.create({
    model: "omni-moderation-latest",
    input: [
      { type: "text", text: prompt },
      { type: "image_url", image_url: { url: dataUrl } }
    ]
  });
  const result = response.results?.[0];
  if (!result) return { ok: false, reason: "Moderation returned no result." };
  return {
    ok: !result.flagged,
    flagged: result.flagged,
    reason: result.flagged ? "OpenAI moderation flagged the prompt or image." : "passed",
    categories: result.categories
  };
}

async function reviewCandidate(brief, prompt, dataUrl) {
  const instruction = `You are the senior visual director and quality reviewer for an original AICG editorial gallery.
Review the candidate image against this brief:
${JSON.stringify(brief, null, 2)}

Return ONLY valid JSON with these keys:
score (integer 0-100),
reject (boolean),
summary (short English reason),
composition (0-25),
detailIntegrity (0-20),
lightingAndColor (0-20),
originalityRisk (0-20, higher means safer/more original),
wallpaperUsability (0-15),
titleZh, titleEn,
descriptionZh, descriptionEn,
directionZh, directionEn.

Reject if there are malformed subjects, unreadable fake text, watermarks, signatures, logos, recognizable copyrighted characters, celebrity likeness, imitation of a named artist, incoherent lighting, obvious duplicate objects, or weak composition.`;

  const response = await client.responses.create({
    model: reviewModel,
    input: [{
      role: "user",
      content: [
        { type: "input_text", text: instruction },
        { type: "input_image", image_url: dataUrl, detail: "high" }
      ]
    }]
  });
  const raw = response.output_text?.trim() || "{}";
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/,"").trim();
  try {
    const parsed = JSON.parse(cleaned);
    return {
      ...parsed,
      score: Math.max(0, Math.min(100, Number(parsed.score || 0))),
      reject: Boolean(parsed.reject),
      summary: String(parsed.summary || "No summary.")
    };
  } catch {
    return { score: 0, reject: true, summary: `Review JSON parse failed: ${raw.slice(0, 240)}` };
  }
}

function rejectedRecord(brief, prompt, gate, reason, review = null) {
  return { status: "rejected", brief, prompt, gate, reason, review };
}
function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, Math.round(number))) : fallback;
}
function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}
function dateStamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-").toLowerCase();
}
