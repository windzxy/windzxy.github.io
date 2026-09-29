;(function(){
const S=window.CHAT_SCENARIOS=window.CHAT_SCENARIOS||[];
window.CHAT_REVIEWED_SCENES=window.CHAT_REVIEWED_SCENES||{};
const id='new15';if(S.some(s=>s.id===id))throw Error('Duplicate '+id);
const s={id,domain:'service',domainLabel:{hant:'服務',hans:'服务',en:'Service'},relation:{hant:'快遞客服',hans:'快递客服',en:'Delivery support'},goal:{hant:'追查未收到的包裹',hans:'追查没收到的包裹',en:'Trace a missing delivery'},title:{hant:'物流顯示包裹已送達，但你沒有收到，也找不到投遞照片',hans:'物流显示包裹已送达，但你没收到，也找不到投递照片',en:'Tracking says a parcel was delivered, but you did not receive it and there is no delivery photo'},replies:{zh:{},en:{},yue:{}}};
const rows=[
["物流顯示已送達，但我沒有收到包裹。請幫我查投遞位置。","物流显示已送达，但我没收到包裹。请帮我查一下投递位置。","Tracking says delivered, but I don't have the parcel. Please check where it was left.","物流顯示已送達，但我冇收到包裹。麻煩查下投遞位置。"],
["訂單號是 XX，系統在 X 點標記完成；當時家門口沒有包裹。","订单号是 XX，系统在 X 点标记完成；当时家门口没有包裹。","The order is XX and it was marked delivered at X. Nothing was at my door then.","訂單號係 XX，系統喺 X 點標記完成；當時門口冇包裹。"],
["頁面沒有投遞照片，能否提供快遞員的送達證明？","页面没有投递照片，能提供快递员的投递证明吗？","There is no delivery photo. Can you provide the courier's proof of delivery?","頁面冇投遞相，可唔可以提供快遞員嘅送達證明？"],
["請確認是交給本人、門衛，還是放在其他位置。","请确认是交给本人、门卫，还是放在了别的地方。","Please confirm whether it was handed to someone, left with reception, or placed elsewhere.","請確認係交俾本人、管理處，定放咗喺其他位置。"],
["我已查過門口、信箱和管理處，都沒有收到。下一步怎麼處理？","我已经查过门口、信箱和物业，都没有。下一步怎么处理？","I've checked my door, mailbox and reception. The parcel isn't there. What's the next step?","我查過門口、信箱同管理處，都冇收到。下一步點處理？"],
["地址在訂單上是正確的，請核對快遞員實際掃描的位置。","订单上的地址是对的，请核对快递员实际扫描的位置。","The address on the order is correct. Please check the courier's actual scan location.","訂單地址係啱嘅，請核對快遞員實際掃描位置。"],
["我沒有簽收，也沒有授權放在無人看管的位置。","我没有签收，也没有授权放在无人看管的地方。","I didn't sign for it or authorize it to be left unattended.","我冇簽收，亦冇授權放喺冇人睇住嘅地方。"],
["先不要關閉案件；目前只有送達狀態，沒有實物。","先别关闭工单；现在只有已送达状态，没有实际包裹。","Please keep the case open. I have a delivery status, not a parcel.","先唔好關案件；依家得送達狀態，冇實物。"],
["麻煩聯絡當值快遞員，讓他回想具體放在哪一戶。","麻烦联系当班快递员，请他确认具体放到了哪一户。","Please contact the courier on that route and ask which address they actually used.","麻煩聯絡當值快遞員，請佢確認實際放咗去邊一戶。"],
["可以把本案的查詢編號發給我嗎？我需要追蹤進度。","能把这次查询的工单编号发给我吗？我需要跟进。","Could you send me the case number so I can track the investigation?","可唔可以發個查詢編號俾我？我要跟進。"],
["請告訴我調查需要多久，以及甚麼時候會有第一次回覆。","请告诉我调查需要多久，以及什么时候会有第一次回复。","How long will the investigation take, and when should I expect the first update?","請話我知調查要幾耐，同幾時有第一次回覆。"],
["包裹內是急用物品，能否先安排補發，同時繼續追查？","包裹里是急用的东西，能先补发并继续调查吗？","The contents are urgent. Can you send a replacement while tracing the original?","包裹入面係急用物品，可唔可以先補發，同時繼續追查？"],
["如果無法找回，請說明補發或退款流程。","如果找不回来，请说明补发或退款流程。","If it can't be recovered, explain the replacement or refund process.","如果搵唔返，請講清楚補發或者退款流程。"],
["請不要只讓我再等等；我需要知道現在由哪個部門處理。","请别只让我继续等；我需要知道现在由哪个部门处理。","Please don't simply ask me to wait. Which team owns the investigation now?","請唔好淨係叫我再等；我要知依家邊個部門處理。"],
["狀態寫著「本人簽收」，但我沒有簽名。請核對簽收紀錄。","状态写着“本人签收”，但我没有签名。请核对签收记录。","It says 'signed by recipient,' but I didn't sign. Please check the signature record.","狀態寫『本人簽收』，但我冇簽名。請核對簽收紀錄。"],
["若是鄰居代收，請提供門牌或聯絡方式，不要只寫「他人」。","如果是邻居代收，请提供门牌或联系方式，别只写“他人”。","If a neighbor took it, I need the unit or contact—not simply 'other person.'","如果係鄰居代收，請提供門牌或者聯絡方式，唔好淨係寫『其他人』。"],
["我已查看監控，在標記送達的時間沒有快遞員到門口。","我看了监控，在标记送达的时间没有快递员到门口。","I've checked the camera footage. No courier came to my door at the recorded time.","我睇過閉路電視，標記送達嗰段時間冇快遞員到門口。"],
["請把 GPS 掃描位置和我的收貨地址作比對。","请把 GPS 扫描位置和我的收货地址做个比对。","Please compare the GPS delivery scan with my actual address.","請將 GPS 掃描位置同我收貨地址對一對。"],
["這棟樓有多個相似門牌，請確認是否投遞到隔壁樓座。","这栋楼有多个相似门牌，请确认有没有送到旁边楼栋。","There are similar unit numbers nearby. Please check whether it went to the adjacent building.","呢棟樓有幾個相似門牌，請確認係咪送咗去隔離座。"],
["快遞員若把包裹取回，也請更新狀態，不要繼續顯示已完成。","如果快递员把包裹带回去了，也请更新状态，别继续显示已完成。","If the courier took it back, update the status rather than leaving it as delivered.","如果快遞員攞返件包裹，都請更新狀態，唔好繼續顯示已完成。"],
["我會再問管理處一次，但也請你們同步啟動查件。","我会再问一次物业，但也请你们同时开始查件。","I'll check with reception once more, but please start the trace at the same time.","我會再問管理處一次，但你哋都請同步開始查件。"],
["貨物顯示抵達，現實裡卻沒有抵達；麻煩查的是後半句。","系统说到了，现实里却没到；麻烦查清后半句。","The system says it arrived; reality says otherwise. Please investigate that gap.","系統話到咗，現實就冇到；麻煩查清楚後半句。"],
["這個包裹好像只送達了物流頁面，還沒送達我手上。","这个包裹好像只送到了物流页面，还没送到我手上。","The parcel seems to have reached the tracking page, but not me.","件包裹好似淨係送達咗物流頁，未送到我手。"],
["「已送達」三個字我看到了，包裹本人還沒看到。","“已送达”三个字我看到了，包裹本身还没看到。","I've seen the words 'delivered.' I haven't seen the parcel.","『已送達』三個字我見到，包裹本人就未見到。"],
["能否請快遞員回到投遞點一起確認？我現在在地址上。","能请快递员回到投递点一起确认吗？我现在就在收货地址。","Can the courier return to the drop point? I'm at the address now.","可唔可以請快遞員返投遞點一齊確認？我依家喺地址度。"],
["如果今天沒有調查結果，請先書面確認包裹仍屬遺失狀態。","如果今天没有调查结果，请先书面确认包裹仍处于丢失状态。","If there is no answer today, confirm in writing that the parcel remains missing.","如果今日冇調查結果，請先書面確認包裹仍然係遺失狀態。"],
["我不會點擊外部連結或提供驗證碼；查件請留在官方平台。","我不会点外部链接或提供验证码；查件请留在官方平台。","I won't use outside links or share codes. Keep the investigation on the official platform.","我唔會撳外部連結或者俾驗證碼；查件請留喺官方平台。"],
["請保留快遞員的投遞紀錄，不要在案件查清前刪除。","请保留快递员的投递记录，在查清之前不要删除。","Please preserve the courier's delivery record while this is investigated.","請保留快遞員投遞紀錄，案件查清之前唔好刪。"],
["我需要的是查找、補發或退款其中一個明確結果。","我需要的是查找、补发或退款中的一个明确结果。","I need a definite outcome: locate it, replace it, or refund it.","我要嘅係搵返、補發或者退款其中一個明確結果。"],
["包裹未收到。請立案查件，並回覆案件編號和處理時限。","包裹没收到。请立案查询，并回复工单编号和处理时限。","Parcel not received. Open a trace and send me the case number and deadline.","包裹未收到。請立案查件，並回覆案件編號同處理時限。"]
];
rows.forEach((r,i)=>{const k='r'+String(i+1).padStart(2,'0');s.replies.zh[k]={hant:r[0],hans:r[1]};s.replies.en[k]=r[2];s.replies.yue[k]=r[3]});
S.push(s);window.CHAT_REVIEWED_SCENES[id]=true;
})();
