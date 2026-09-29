// Curated original entries from data/scenarios-*.js; only distinct situations are active.
window.CHAT_SCENARIOS=(window.CHAT_SCENARIOS||[]).concat([
 {
  "id": "archive-j001",
  "domain": "job",
  "domainLabel": {
   "hant": "求職",
   "hans": "求职",
   "en": "Job Search"
  },
  "relation": {
   "hant": "面試官",
   "hans": "面试官",
   "en": "Interviewer"
  },
  "goal": {
   "hant": "回答離職原因",
   "hans": "回答离职原因",
   "en": "Explain leaving"
  },
  "title": {
   "hant": "面試被問為什麼離開上一家公司",
   "hans": "面试被问为什么离开上一家公司",
   "en": "An interviewer asks why you left your previous company"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "上一份工作讓我累積了很多 XX 經驗，但目前我希望往 YY 方向發展，而這個職位和我的下一階段目標更一致。",
     "hans": "上一份工作让我积累了很多 XX 经验，但目前我希望往 YY 方向发展，而这个职位和我的下一阶段目标更一致。"
    },
    "dark": {
     "hant": "上一家公司教會我很多，尤其讓我很清楚下一份工作希望有哪些條件。",
     "hans": "上一家公司教会我很多，尤其让我很清楚下一份工作希望有哪些条件。"
    },
    "roast": {
     "hant": "上一份工作完成了它最大的職涯教育功能：讓我非常確定下一站想去哪裡。",
     "hans": "上一份工作完成了它最大的职业教育功能：让我非常确定下一站想去哪里。"
    }
   },
   "en": {
    "formal": "I gained valuable XX experience in my previous role, but I'm now looking to grow in YY, and this position aligns more closely with that next step.",
    "dark": "My previous company taught me a lot, including a very clear understanding of what I want in my next role.",
    "roast": "My last role delivered one extremely useful career lesson: it made my next destination very clear."
   },
   "yue": {
    "formal": "上一份工俾我累積咗好多 XX 經驗，不過我而家想向 YY 發展，而呢個職位同我下一步方向更加一致。",
    "dark": "上一間公司教識我好多，尤其令我好清楚下一份工想要咩條件。",
    "roast": "上一份工完成咗一個好重要嘅職涯教育功能：令我非常確定下一站想去邊。"
   }
  }
 },
 {
  "id": "archive-b002",
  "domain": "business",
  "domainLabel": {
   "hant": "商務",
   "hans": "商务",
   "en": "Business"
  },
  "relation": {
   "hant": "供應商",
   "hans": "供应商",
   "en": "Vendor"
  },
  "goal": {
   "hant": "壓交期",
   "hans": "压交期",
   "en": "Improve delivery date"
  },
  "title": {
   "hant": "供應商給的交期太晚",
   "hans": "供应商给的交期太晚",
   "en": "A vendor's proposed delivery date is too late"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "目前交期 X 日會影響我們後續節點。請協助確認是否有辦法提前至 Y 日；如無法全部提前，也可以先分批交付最關鍵的部分。",
     "hans": "目前交期 X 日会影响我们后续节点。请协助确认是否有办法提前至 Y 日；如无法全部提前，也可以先分批交付最关键的部分。"
    },
    "dark": {
     "hant": "X 日對我們來說基本等於『問題已經發生之後到貨』，想看看能不能把它拉回 Y 日。",
     "hans": "X 日对我们来说基本等于“问题已经发生之后到货”，想看看能不能把它拉回 Y 日。"
    },
    "roast": {
     "hant": "如果 X 日才到，它比較像事故報告附件，不太像解決方案。能不能想辦法提前到 Y 日？",
     "hans": "如果 X 日才到，它比较像事故报告附件，不太像解决方案。能不能想办法提前到 Y 日？"
    }
   },
   "en": {
    "formal": "The current X delivery date will affect our downstream milestones. Could you check whether delivery can be brought forward to Y, or whether the critical items can be shipped in stages?",
    "dark": "For us, X is basically 'after the problem has already happened'. We'd like to see if we can bring it back to Y.",
    "roast": "If it arrives on X, it may function better as an attachment to the incident report than as a solution. Can we bring it forward to Y?"
   },
   "yue": {
    "formal": "而家 X 日嘅交期會影響我哋後面節點。可唔可以幫手睇下提早到 Y 日？如果全部做唔到，最關鍵部分分批先到都可以。",
    "dark": "X 日對我哋嚟講基本等於『件事出咗先到貨』，想睇下可唔可以拉返去 Y 日。",
    "roast": "如果 X 日先到，佢比較似事故報告附件，唔太似解決方案。可唔可以諗辦法提早到 Y 日？"
   }
  }
 },
 {
  "id": "archive-b003",
  "domain": "business",
  "domainLabel": {
   "hant": "商務",
   "hans": "商务",
   "en": "Business"
  },
  "relation": {
   "hant": "合作方",
   "hans": "合作方",
   "en": "Partner"
  },
  "goal": {
   "hant": "拒絕不合理條款",
   "hans": "拒绝不合理条款",
   "en": "Reject a term"
  },
  "title": {
   "hant": "合作條款裡有一項你不能接受",
   "hans": "合作条款里有一项你不能接受",
   "en": "A contract term is unacceptable to you"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "其他條款我們基本沒有問題，但第 X 條目前無法接受，主要原因是 XX。建議改為 YY，這樣雙方責任會更清晰。",
     "hans": "其他条款我们基本没有问题，但第 X 条目前无法接受，主要原因是 XX。建议改为 YY，这样双方责任会更清晰。"
    },
    "dark": {
     "hant": "其他部分可以往下走，第 X 條如果不調整，等於把風險單向打包給我們，這一點沒辦法簽。",
     "hans": "其他部分可以往下走，第 X 条如果不调整，等于把风险单向打包给我们，这一点没办法签。"
    },
    "roast": {
     "hant": "第 X 條目前比較像『合作由雙方進行，風險由我方獨享』，這部分需要改一下。",
     "hans": "第 X 条目前比较像“合作由双方进行，风险由我方独享”，这部分需要改一下。"
    }
   },
   "en": {
    "formal": "We're broadly comfortable with the other terms, but clause X is not acceptable in its current form due to XX. We suggest revising it to YY so responsibilities are clearer for both sides.",
    "dark": "The rest can move forward, but clause X currently packages the risk almost entirely on our side, so we can't sign it as written.",
    "roast": "Clause X currently reads a little like 'collaboration by both parties, risk exclusively enjoyed by us'. We'll need to revise that part."
   },
   "yue": {
    "formal": "其他條款我哋基本冇問題，但第 X 條而家接受唔到，主要原因係 XX。建議改做 YY，雙方責任會清楚啲。",
    "dark": "其他部分可以繼續，但第 X 條如果唔改，基本等於單向將風險打包俾我哋，呢點簽唔到。",
    "roast": "第 X 條而家有少少似『合作雙方一齊做，風險我方獨家享用』，呢部分要改一改。"
   }
  }
 },
 {
  "id": "archive-f003",
  "domain": "family",
  "domainLabel": {
   "hant": "家庭",
   "hans": "家庭",
   "en": "Family"
  },
  "relation": {
   "hant": "兄弟姐妹",
   "hans": "兄弟姐妹",
   "en": "Sibling"
  },
  "goal": {
   "hant": "拒絕借名義",
   "hans": "拒绝借名义",
   "en": "Decline use of your name"
  },
  "title": {
   "hant": "家人想借你的名字辦貸款或做擔保",
   "hans": "家人想借你的名字办贷款或做担保",
   "en": "A family member asks to use your name for a loan or guarantee"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "這件事涉及我個人的信用和法律責任，所以我不能用自己的名義辦，也不能做擔保。其他我能幫的方式我們可以再一起想。",
     "hans": "这件事涉及我个人的信用和法律责任，所以我不能用自己的名义办，也不能做担保。其他我能帮的方式我们可以再一起想。"
    },
    "dark": {
     "hant": "感情可以共享，法律責任就不共享了。這個名字我不能借。",
     "hans": "感情可以共享，法律责任就不共享了。这个名字我不能借。"
    },
    "roast": {
     "hant": "我的名字目前沒有出租、轉借和聯名擔保服務，這件事我不能答應。",
     "hans": "我的名字目前没有出租、转借和联名担保服务，这件事我不能答应。"
    }
   },
   "en": {
    "formal": "This would create personal credit and legal obligations for me, so I can't put the loan in my name or act as guarantor. I'm happy to think through other ways I can help.",
    "dark": "Family ties can be shared; legal liability doesn't need to be. I can't lend my name for this.",
    "roast": "My name currently doesn't offer rental, lending or co-branded guarantee services, so I can't agree to this."
   },
   "yue": {
    "formal": "呢件事會涉及我個人信用同法律責任，所以我唔可以用自己名義辦，亦唔可以做擔保。其他可以幫嘅方法我哋再一齊諗。",
    "dark": "感情可以 share，法律責任就唔 share 喇。個名我借唔到。",
    "roast": "我個名目前冇出租、轉借同聯名擔保服務，呢件事我答應唔到。"
   }
  }
 },
 {
  "id": "archive-p005",
  "domain": "parenting",
  "domainLabel": {
   "hant": "育兒",
   "hans": "育儿",
   "en": "Parenting"
  },
  "relation": {
   "hant": "孩子",
   "hans": "孩子",
   "en": "Child"
  },
  "goal": {
   "hant": "面對考差",
   "hans": "面对考差",
   "en": "Handle poor grade"
  },
  "title": {
   "hant": "孩子考得很差，自己也很沮喪",
   "hans": "孩子考得很差，自己也很沮丧",
   "en": "Your child gets a poor grade and feels discouraged"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "這次成績不理想，但它只告訴我們哪些地方還沒掌握，不代表你不行。我們先看錯題，再決定下一步怎麼補。",
     "hans": "这次成绩不理想，但它只告诉我们哪些地方还没掌握，不代表你不行。我们先看错题，再决定下一步怎么补。"
    },
    "dark": {
     "hant": "這張卷子可以評分這次準備，不能替你整個人打分。",
     "hans": "这张卷子可以评分这次准备，不能替你整个人打分。"
    },
    "roast": {
     "hant": "這次分數只是今天比較有戲，不代表它拿到你人生的永久主演合約。",
     "hans": "这次分数只是今天比较有戏，不代表它拿到你人生的永久主演合同。"
    }
   },
   "en": {
    "formal": "This result isn't what you wanted, but it only shows what hasn't been mastered yet; it doesn't define your ability. Let's look at the mistakes and plan the next step.",
    "dark": "This paper can grade this round of preparation. It doesn't get to grade you as a person.",
    "roast": "This score gets a dramatic scene today, not a permanent starring contract in your life."
   },
   "yue": {
    "formal": "今次成績唔理想，但佢只係話我哋知邊啲位未掌握，唔代表你唔得。我哋先睇錯題，再諗點補。",
    "dark": "呢張卷可以評今次準備，唔可以幫你成個人打分。",
    "roast": "今次個分數今日比較搶戲啫，唔代表佢攞到你人生永久主角合約。"
   }
  }
 },
 {
  "id": "archive-r002",
  "domain": "relationship",
  "domainLabel": {
   "hant": "感情",
   "hans": "感情",
   "en": "Relationship"
  },
  "relation": {
   "hant": "伴侶",
   "hans": "伴侣",
   "en": "Partner"
  },
  "goal": {
   "hant": "表達被忽略",
   "hans": "表达被忽略",
   "en": "Express feeling ignored"
  },
  "title": {
   "hant": "伴侶最近總在看手機，你覺得被忽略",
   "hans": "伴侣最近总在看手机，你觉得被忽略",
   "en": "Your partner is constantly on the phone and you feel ignored"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "最近我們在一起時，你常常在看手機，我會有一點被放在旁邊的感覺。我希望我們每天能有一段不看手機、只聊天的時間。",
     "hans": "最近我们在一起时，你常常在看手机，我会有一点被放在旁边的感觉。我希望我们每天能有一段不看手机、只聊天的时间。"
    },
    "dark": {
     "hant": "我知道手機很有魅力，但我希望這段關係裡我至少能偶爾贏一次通知欄。",
     "hans": "我知道手机很有魅力，但我希望这段关系里我至少能偶尔赢一次通知栏。"
    },
    "roast": {
     "hant": "我最近好像在跟你的手機談三角戀，想申請一點單獨相處時間。",
     "hans": "我最近好像在跟你的手机谈三角恋，想申请一点单独相处时间。"
    }
   },
   "en": {
    "formal": "Lately, when we're together, you're often on your phone and I end up feeling pushed to the side. I'd like us to have some phone-free time each day just to talk.",
    "dark": "I know the phone is very charming, but I'd like to beat the notification bar at least occasionally in this relationship.",
    "roast": "I feel like I've accidentally entered a love triangle with your phone. Can I request some one-on-one time?"
   },
   "yue": {
    "formal": "最近我哋一齊嗰陣你好多時都睇手機，我會有少少被擺埋一邊嘅感覺。我想每日有一段時間大家唔睇手機，淨係傾下計。",
    "dark": "我知部手機好有魅力，不過我都想喺呢段關係入面間中贏一次 notification bar。",
    "roast": "我最近好似同你部手機拍緊三角戀，想申請少少二人世界。"
   }
  }
 },
 {
  "id": "archive-r003",
  "domain": "relationship",
  "domainLabel": {
   "hant": "感情",
   "hans": "感情",
   "en": "Relationship"
  },
  "relation": {
   "hant": "伴侶",
   "hans": "伴侣",
   "en": "Partner"
  },
  "goal": {
   "hant": "道歉",
   "hans": "道歉",
   "en": "Apologise"
  },
  "title": {
   "hant": "你說了很傷人的話，想認真道歉",
   "hans": "你说了很伤人的话，想认真道歉",
   "en": "You said something hurtful and want to apologise properly"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "剛才那句話是我說錯了，不只是語氣不好，而是內容本身就傷人。我不替自己找理由。對不起，我會處理好自己的情緒，不再用這種方式說話。",
     "hans": "刚才那句话是我说错了，不只是语气不好，而是内容本身就伤人。我不替自己找理由。对不起，我会处理好自己的情绪，不再用这种方式说话。"
    },
    "dark": {
     "hant": "這次不是「如果你覺得受傷我很抱歉」，是我確實說了傷人的話，我道歉。",
     "hans": "这次不是“如果你觉得受伤我很抱歉”，是我确实说了伤人的话，我道歉。"
    },
    "roast": {
     "hant": "剛才我的嘴比腦快，而且還選了最差的路線。我不甩鍋給情緒，對不起。",
     "hans": "刚才我的嘴比脑快，而且还选了最差的路线。我不甩锅给情绪，对不起。"
    }
   },
   "en": {
    "formal": "What I said was wrong. It wasn't just my tone; the words themselves were hurtful. I'm not going to excuse it. I'm sorry, and I'll handle my emotions without speaking to you that way.",
    "dark": "This isn't an 'I'm sorry if you were hurt' apology. I said something hurtful, and I'm apologising for that.",
    "roast": "My mouth outran my brain and somehow picked the worst possible route. I'm not blaming my mood. I'm sorry."
   },
   "yue": {
    "formal": "頭先嗰句係我講錯咗，唔止係語氣問題，內容本身都傷人。我唔搵理由。對唔住，我會處理好自己情緒，唔再用呢種方式講。",
    "dark": "今次唔係『如果你覺得受傷我就 sorry』，係我真係講咗傷人嘅說話，我道歉。",
    "roast": "頭先我把口快過個腦，仲要揀咗最差路線。我唔甩鍋俾情緒，對唔住。"
   }
  }
 },
 {
  "id": "archive-so004",
  "domain": "social",
  "domainLabel": {
   "hant": "社交",
   "hans": "社交",
   "en": "Social"
  },
  "relation": {
   "hant": "熟人",
   "hans": "熟人",
   "en": "Acquaintance"
  },
  "goal": {
   "hant": "回應外貌評論",
   "hans": "回应外貌评论",
   "en": "Respond to appearance comment"
  },
  "title": {
   "hant": "別人當面評論你胖了或瘦了",
   "hans": "别人当面评论你胖了或瘦了",
   "en": "Someone comments on your weight or appearance"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "謝謝關心，不過我不太想聊身材或體重，我們換個話題吧。",
     "hans": "谢谢关心，不过我不太想聊身材或体重，我们换个话题吧。"
    },
    "dark": {
     "hant": "我的體重目前沒有開放公共評審功能。",
     "hans": "我的体重目前没有开放公共评审功能。"
    },
    "roast": {
     "hant": "今日外貌評論區先關閉，我們聊點不用量體重的內容吧。",
     "hans": "今日外貌评论区先关闭，我们聊点不用量体重的内容吧。"
    }
   },
   "en": {
    "formal": "Thanks for your concern, but I'd rather not discuss my body or weight. Let's talk about something else.",
    "dark": "My weight isn't currently open for public review.",
    "roast": "The appearance comment section is closed today. Let's discuss something that doesn't require a scale."
   },
   "yue": {
    "formal": "多謝關心，不過我唔太想傾身形或者體重，不如轉個話題啦。",
    "dark": "我個體重暫時未開放公共評審功能。",
    "roast": "今日外貌評論區先關閉，不如傾啲唔使用磅嘅內容。"
   }
  }
 },
 {
  "id": "archive-sv002",
  "domain": "service",
  "domainLabel": {
   "hant": "服務",
   "hans": "服务",
   "en": "Service"
  },
  "relation": {
   "hant": "餐廳",
   "hans": "餐厅",
   "en": "Restaurant"
  },
  "goal": {
   "hant": "反映上錯菜",
   "hans": "反映上错菜",
   "en": "Wrong order"
  },
  "title": {
   "hant": "餐廳上錯了你的菜",
   "hans": "餐厅上错了你的菜",
   "en": "A restaurant serves you the wrong dish"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "不好意思，我點的是 A，現在上的是 B。麻煩幫我確認一下訂單並更換，謝謝。",
     "hans": "不好意思，我点的是 A，现在上的是 B。麻烦帮我确认一下订单并更换，谢谢。"
    },
    "dark": {
     "hant": "這道菜看起來很好，只是它不是我和菜單之間約好的那一道。",
     "hans": "这道菜看起来很好，只是它不是我和菜单之间约好的那一道。"
    },
    "roast": {
     "hant": "B 很熱情地來了，但我其實約的是 A。麻煩幫我們重新配對一下。",
     "hans": "B 很热情地来了，但我其实约的是 A。麻烦帮我们重新配对一下。"
    }
   },
   "en": {
    "formal": "Excuse me, I ordered A, but this is B. Could you please check the order and replace it? Thank you.",
    "dark": "This dish looks perfectly nice; it just isn't the one the menu and I agreed on.",
    "roast": "B arrived very enthusiastically, but my actual date was A. Could you help us rematch the order?"
   },
   "yue": {
    "formal": "唔好意思，我叫嘅係 A，而家上咗 B。麻煩幫我睇返張單同換返，唔該。",
    "dark": "呢碟睇落幾好，只不過唔係我同 menu 約好嗰碟。",
    "roast": "B 好熱情咁嚟咗，但我其實約咗 A。麻煩幫我哋重新配對一下。"
   }
  }
 },
 {
  "id": "archive-d002",
  "domain": "online",
  "domainLabel": {
   "hant": "網絡",
   "hans": "网络",
   "en": "Online"
  },
  "relation": {
   "hant": "網友",
   "hans": "网友",
   "en": "Online contact"
  },
  "goal": {
   "hant": "拒絕私人資料",
   "hans": "拒绝私人资料",
   "en": "Protect privacy"
  },
  "title": {
   "hant": "剛認識的網友一直問你的住址或公司",
   "hans": "刚认识的网友一直问你的住址或公司",
   "en": "A new online contact keeps asking where you live or work"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "這些屬於比較私人的資訊，我暫時不會分享。等彼此更熟悉之後再說吧。",
     "hans": "这些属于比较私人的信息，我暂时不会分享。等彼此更熟悉之后再说吧。"
    },
    "dark": {
     "hant": "聊天可以繼續，定位權限先不開。",
     "hans": "聊天可以继续，定位权限先不开。"
    },
    "roast": {
     "hant": "我們目前還在試用期，住址和公司屬於付費進階權限，暫時未解鎖。",
     "hans": "我们目前还在试用期，住址和公司属于付费进阶权限，暂时未解锁。"
    }
   },
   "en": {
    "formal": "That's fairly private information, so I'm not going to share it at this stage. We can revisit it once we know each other better.",
    "dark": "The conversation can continue. Location permission is staying off.",
    "roast": "We're still in the trial period. Home and workplace details are premium permissions and haven't been unlocked."
   },
   "yue": {
    "formal": "呢啲係比較私人嘅資料，我暫時唔會 share。等大家熟啲先再講啦。",
    "dark": "傾計可以繼續，定位權限就暫時唔開。",
    "roast": "我哋而家仲係試用期，住址同公司屬於進階權限，暫時未解鎖。"
   }
  }
 },
 {
  "id": "archive-m002",
  "domain": "medical",
  "domainLabel": {
   "hant": "醫療",
   "hans": "医疗",
   "en": "Healthcare"
  },
  "relation": {
   "hant": "醫護人員",
   "hans": "医护人员",
   "en": "Clinician"
  },
  "goal": {
   "hant": "描述疼痛",
   "hans": "描述疼痛",
   "en": "Describe pain"
  },
  "title": {
   "hant": "你想把疼痛情況說得更清楚",
   "hans": "你想把疼痛情况说得更清楚",
   "en": "You want to describe your pain clearly"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "疼痛從 X 時開始，位置在 XX，程度大約 7/10。平時是悶痛，做 YY 時會變成刺痛，休息後會稍微減輕，還伴有 ZZ。",
     "hans": "疼痛从 X 时开始，位置在 XX，程度大约 7/10。平时是闷痛，做 YY 时会变成刺痛，休息后会稍微减轻，还伴有 ZZ。"
    },
    "dark": {
     "hant": "我不想只說「很痛」，我按時間、位置、程度、誘因和伴隨症狀說一遍。",
     "hans": "我不想只说“很痛”，我按时间、位置、程度、诱因和伴随症状说一遍。"
    },
    "roast": {
     "hant": "我的痛目前很有存在感，我把它的履歷按時間、位置和觸發條件報一下。",
     "hans": "我的痛目前很有存在感，我把它的履历按时间、位置和触发条件报一下。"
    }
   },
   "en": {
    "formal": "The pain started at X, is located at XX, and is about 7/10. It's usually a dull ache, becomes sharp with YY, improves somewhat with rest, and is accompanied by ZZ.",
    "dark": "Rather than just saying 'it hurts a lot', I'll describe the timing, location, severity, triggers and associated symptoms.",
    "roast": "The pain is currently making a strong case for its existence, so here's its résumé: timing, location and triggers."
   },
   "yue": {
    "formal": "個痛由 X 開始，位置喺 XX，大概 7/10。平時係悶痛，做 YY 會變刺痛，休息會好少少，仲有 ZZ。",
    "dark": "我唔想淨係講『好痛』，我按時間、位置、程度、誘因同伴隨症狀講一次。",
    "roast": "個痛而家存在感幾強，我按時間、位置同觸發條件報一報佢份履歷。"
   }
  }
 },
 {
  "id": "archive-m003",
  "domain": "medical",
  "domainLabel": {
   "hant": "醫療",
   "hans": "医疗",
   "en": "Healthcare"
  },
  "relation": {
   "hant": "家人",
   "hans": "家人",
   "en": "Family member"
  },
  "goal": {
   "hant": "陪診溝通",
   "hans": "陪诊沟通",
   "en": "Support appointment"
  },
  "title": {
   "hant": "陪長輩看醫生，長輩一直說「沒事」",
   "hans": "陪长辈看医生，长辈一直说“没事”",
   "en": "You're accompanying an elder who keeps telling the doctor everything is fine"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "我補充一下家裡觀察到的情況：最近 XX 天，他其實有 YY，而且頻率比以前高。可能本人覺得不嚴重，但我們想請醫生一起評估。",
     "hans": "我补充一下家里观察到的情况：最近 XX 天，他其实有 YY，而且频率比以前高。可能本人觉得不严重，但我们想请医生一起评估。"
    },
    "dark": {
     "hant": "他口中的「沒事」和我們在家看到的版本有一點差異，我補充幾個具體情況。",
     "hans": "他口中的“没事”和我们在家看到的版本有一点差异，我补充几个具体情况。"
    },
    "roast": {
     "hant": "本人版本是「完全沒事」，家庭觀察版有幾條更新，我補一下 changelog。",
     "hans": "本人版本是“完全没事”，家庭观察版有几条更新，我补一下 changelog。"
    }
   },
   "en": {
    "formal": "I'd like to add what we've observed at home. Over the last XX days, there has actually been YY and it's happening more often than before. It may not feel serious to them, but we'd like your assessment.",
    "dark": "Their version of 'nothing is wrong' differs slightly from what we're seeing at home, so I'd like to add a few specific observations.",
    "roast": "The patient version says 'everything is fine'. The household version has a few updates, so let me add the changelog."
   },
   "yue": {
    "formal": "我補充下屋企觀察到嘅情況：最近 XX 日，其實有 YY，而且次數比以前多。本人可能覺得唔嚴重，但我哋想俾醫生一齊評估。",
    "dark": "佢口中嘅『冇事』同我哋屋企見到嘅版本有少少差異，我補充幾個具體情況。",
    "roast": "本人版本係『完全冇事』，家庭觀察版有幾條 update，我補返個 changelog。"
   }
  }
 },
 {
  "id": "archive-t001",
  "domain": "travel",
  "domainLabel": {
   "hant": "旅行",
   "hans": "旅行",
   "en": "Travel"
  },
  "relation": {
   "hant": "酒店",
   "hans": "酒店",
   "en": "Hotel"
  },
  "goal": {
   "hant": "要求延遲退房",
   "hans": "要求延迟退房",
   "en": "Request late checkout"
  },
  "title": {
   "hant": "你想申請延遲退房",
   "hans": "你想申请延迟退房",
   "en": "You want to request a late checkout"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "您好，想請問今天是否可以延遲退房到下午 X 點？如果有額外費用也麻煩告知，謝謝。",
     "hans": "您好，想请问今天是否可以延迟退房到下午 X 点？如果有额外费用也麻烦告知，谢谢。"
    },
    "dark": {
     "hant": "想問房間今天能不能多續命到下午 X 點，費用規則也可以一起告訴我。",
     "hans": "想问房间今天能不能多续命到下午 X 点，费用规则也可以一起告诉我。"
    },
    "roast": {
     "hant": "我和這間房的緣分想多延長幾個小時，請問可以 late checkout 到 X 點嗎？",
     "hans": "我和这间房的缘分想多延长几个小时，请问可以 late checkout 到 X 点吗？"
    }
   },
   "en": {
    "formal": "Hello, would it be possible to arrange a late checkout until X pm today? Please also let me know if there is an additional charge. Thank you.",
    "dark": "Could the room get a few extra hours of life until X pm today? Please let me know the fee as well.",
    "roast": "I'd like to extend my relationship with this room for a few more hours. Is late checkout until X pm possible?"
   },
   "yue": {
    "formal": "你好，想問今日可唔可以 late checkout 到下晝 X 點？如果有額外費用都麻煩話我知，多謝。",
    "dark": "想問間房今日可唔可以續命多幾個鐘到下晝 X 點，費用規則都可以一齊話我知。",
    "roast": "我同呢間房嘅緣分想延長多幾個鐘，請問可唔可以 late checkout 到 X 點？"
   }
  }
 },
 {
  "id": "archive-t004",
  "domain": "travel",
  "domainLabel": {
   "hant": "旅行",
   "hans": "旅行",
   "en": "Travel"
  },
  "relation": {
   "hant": "司機",
   "hans": "司机",
   "en": "Driver"
  },
  "goal": {
   "hant": "確認路線",
   "hans": "确认路线",
   "en": "Confirm route"
  },
  "title": {
   "hant": "你懷疑司機正在繞路",
   "hans": "你怀疑司机正在绕路",
   "en": "You suspect the driver is taking an unnecessary detour"
  },
  "replies": {
   "zh": {
    "formal": {
     "hant": "不好意思，我看地圖顯示還有一條比較直接的路線。請問現在走這條路是因為交通狀況或其他原因嗎？",
     "hans": "不好意思，我看地图显示还有一条比较直接的路线。请问现在走这条路是因为交通状况或其他原因吗？"
    },
    "dark": {
     "hant": "我想確認一下，現在這條路線是避塞車，還是我們順便在做城市導覽？",
     "hans": "我想确认一下，现在这条路线是避堵车，还是我们顺便在做城市导览？"
    },
    "roast": {
     "hant": "地圖和我們的車目前像在玩異地戀，想問這條路線有什麼特別原因嗎？",
     "hans": "地图和我们的车目前像在玩异地恋，想问这条路线有什么特别原因吗？"
    }
   },
   "en": {
    "formal": "Excuse me, the map shows a more direct route. Are we taking this way because of traffic or another reason?",
    "dark": "Just checking: is this route avoiding traffic, or are we getting an unexpected city tour?",
    "roast": "The map and our car currently appear to be in a long-distance relationship. Is there a particular reason for this route?"
   },
   "yue": {
    "formal": "唔好意思，我睇地圖仲有條直接啲嘅路。想問而家行呢條係因為塞車定其他原因？",
    "dark": "想確認下，而家呢條路線係避塞車，定我哋順便做緊城市導覽？",
    "roast": "個地圖同架車而家好似拍緊異地戀，想問行呢條路有咩特別原因？"
   }
  }
 }
]);
