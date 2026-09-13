import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root=path.resolve(process.cwd(),'webdesk-v2');
const cardsDir=path.join(root,'cards');
const outDir=path.join(root,'generated');
const outFile=path.join(outDir,'cards.registry.json');
const PLATFORMS=['desktop','tablet','mobile'];

function fail(message){throw new Error(message)}
function assert(condition,message){if(!condition)fail(message)}
function isSafeRelative(value){return typeof value==='string'&&value.startsWith('./')&&!value.includes('..')&&!path.isAbsolute(value)}
async function exists(file){try{const s=await fs.stat(file);return s.isFile()}catch{return false}}

function validateLocalized(value,label,id){
  assert(value&&typeof value==='object',`${id}: ${label} must be an object`);
  for(const locale of ['zh-CN','zh-HK'])assert(typeof value[locale]==='string'&&value[locale].trim(),`${id}: ${label}.${locale} is required`);
}

async function validateManifest(manifest,folder){
  const id=manifest?.id||folder;
  assert(id===folder,`${folder}: manifest id must match folder name`);
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id),`${id}: invalid id`);
  assert(typeof manifest.version==='string'&&manifest.version,`${id}: version required`);
  assert(Number.isInteger(manifest.schemaVersion)&&manifest.schemaVersion>=1,`${id}: schemaVersion must be >= 1`);
  validateLocalized(manifest.name,'name',id);
  validateLocalized(manifest.description,'description',id);
  assert(typeof manifest.icon==='string'&&manifest.icon,`${id}: icon required`);
  assert(typeof manifest.category==='string'&&manifest.category,`${id}: category required`);
  assert(['live','tool','studio','utility','widget','game'].includes(manifest.kind),`${id}: invalid kind`);
  assert(Number.isInteger(manifest.order)&&manifest.order>=0,`${id}: order must be >= 0`);
  assert(Array.isArray(manifest.platforms)&&manifest.platforms.length>0,`${id}: platforms required`);
  for(const platform of manifest.platforms)assert(PLATFORMS.includes(platform),`${id}: unsupported platform ${platform}`);

  assert(manifest.entry&&typeof manifest.entry==='object',`${id}: entry required`);
  assert(manifest.defaultSize&&typeof manifest.defaultSize==='object',`${id}: defaultSize required`);

  const cardRoot=path.join(cardsDir,folder);
  for(const platform of PLATFORMS){
    const entry=manifest.entry[platform];
    assert(entry&&typeof entry==='object',`${id}: entry.${platform} required`);
    assert(isSafeRelative(entry.card),`${id}: entry.${platform}.card must be a safe relative path`);
    assert(entry.card.startsWith(`./${platform}/`),`${id}: ${platform} card must live in ${platform}/`);
    assert(await exists(path.join(cardRoot,entry.card)),`${id}: missing ${entry.card}`);
    for(const key of ['cardStyle','app','appStyle']){
      if(entry[key]!=null){
        assert(isSafeRelative(entry[key]),`${id}: entry.${platform}.${key} must be a safe relative path`);
        assert(await exists(path.join(cardRoot,entry[key])),`${id}: missing ${entry[key]}`);
      }
    }
    const size=manifest.defaultSize[platform];
    assert(size&&Number.isInteger(size.w)&&size.w>0&&Number.isInteger(size.h)&&size.h>0,`${id}: invalid defaultSize.${platform}`);
  }

  if(manifest.entry.shared!=null){
    assert(isSafeRelative(manifest.entry.shared),`${id}: entry.shared must be a safe relative path`);
    assert(await exists(path.join(cardRoot,manifest.entry.shared)),`${id}: missing ${manifest.entry.shared}`);
  }
  assert(Array.isArray(manifest.capabilities),`${id}: capabilities must be an array`);
  assert(Array.isArray(manifest.permissions),`${id}: permissions must be an array`);
  return manifest;
}

async function main(){
  await fs.mkdir(cardsDir,{recursive:true});
  const entries=(await fs.readdir(cardsDir,{withFileTypes:true})).filter(x=>x.isDirectory()).map(x=>x.name).sort();
  const cards=[];
  const seen=new Set();
  const errors=[];

  for(const folder of entries){
    const manifestFile=path.join(cardsDir,folder,'manifest.json');
    if(!(await exists(manifestFile)))continue;
    try{
      const manifest=JSON.parse(await fs.readFile(manifestFile,'utf8'));
      const valid=await validateManifest(manifest,folder);
      assert(!seen.has(valid.id),`${valid.id}: duplicate id`);
      seen.add(valid.id);
      cards.push(valid);
    }catch(error){errors.push({folder,error:String(error.message||error)})}
  }

  cards.sort((a,b)=>a.order-b.order||a.id.localeCompare(b.id));
  await fs.mkdir(outDir,{recursive:true});
  const registry={schemaVersion:1,generatedAt:new Date().toISOString(),cards,errors};
  await fs.writeFile(outFile,JSON.stringify(registry,null,2)+'\n','utf8');
  console.log(`WebDesk V2 registry: ${cards.length} valid card(s), ${errors.length} excluded card(s)`);
  if(errors.length){for(const item of errors)console.error(`- ${item.folder}: ${item.error}`)}
}

main().catch(error=>{console.error(error);process.exitCode=1});
