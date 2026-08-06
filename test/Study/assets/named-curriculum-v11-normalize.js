(() => {
  'use strict';
  const curricula=window.WIND_NAMED_SYLLABI_V11;
  if(!curricula)return;
  const pairs='總总複复習习與与個个數数顏颜課课創创聲声濁浊長长撥拨問问購购價价動动場场體体過过經经驗验詞词較较條条園园讀读綜综請请許许連连接接終终來来見见點点話话韓韩語语輔辅雙双複复寫写將将畫画間间禮礼義义務务間间報报圖图觀观點点電电郵邮聽听記记錄录則则選选擇择進进階阶態态學学術术會会議议譯译選选讀读發发表表級级題题簡简單单進进認认識识這这開开關关專专業业現现代代實实際际應应用用說说標标題题對对比比郵邮件件論论證证資资料庫库頻频質质疑疑應应答答溝沟通通誤误解解修复復复禮礼貌貌間间接接語语尾尾圖图表表聽听力力書书面面體体讀读策策略略商商务務务會会議议報报告告寫写作作高高级級级';
  const map={};
  for(let i=0;i+1<pairs.length;i+=2)map[pairs[i]]=pairs[i+1];
  const simplify=value=>String(value).replace(/[\s\S]/g,char=>map[char]||char);
  for(const subject of ['japanese','korean']){
    const stages=curricula[subject];
    if(!stages)continue;
    for(const [stage,lessons] of Object.entries(stages)){
      stages[stage]=lessons.map(simplify);
    }
  }
})();
