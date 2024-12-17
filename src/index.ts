// 禁用 SSL 验证
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { Context, Schema, h } from 'koishi'

export const name = 'smmcat-genshintts'

export interface Config {
  key: string,
  debug: boolean
}
export const inject = {
  optional: ['slik']
};
export const Config: Schema<Config> = Schema.object({
  key: Schema.string().required().description('使用密钥，可[加群申请](https://qm.qq.com/q/Ghom0pXQYK)'),
  debug: Schema.boolean().default(false).description('控制台查看更多信息')
})

export function apply(ctx: Context, config: Config) {
  ctx
    .command('tts语音.发送 <umsg:text>')
    .action(async ({ session }, umsg) => {
      const temp = userMap.getUserInfo(session.userId)
      const msg = umsg?.trim()
      console.log(umsg);

      if (!msg) {
        await session.send('请输入需要发送的内容，字数不要短也不要太长')
        return
      }
      if (temp.checkUse(session.userId)) {
        await session.send('请等待上一个请求')
        return
      }

      try {
        temp.startUse()
        // 编织参数
        const params = {
          key: config.key,
          name: temp.ttsName,
          gs: 1,
          txt: msg
        }
        config.debug && console.log(params);
        // 发起请求
        const result = JSON.parse(await ctx.http.get('https://frp-box.top:28154/aihua', {
          params
        }))
        userMap.baseUseTime = result.cishu
        await session.send(h.audio(result.url))
        temp.clearUse()
      } catch (error) {
        console.log(error);
        error?.erro && await session.send(error.erro)
        temp.clearUse()
      }
    })

  ctx
    .command('tts语音.切换 <ttsName>')
    .action(async ({ session }, ttsName) => {
      const temp = userMap.getUserInfo(session.userId)
      let selectTTS = ttsName

      if (/^[1-9]\d*$/.test(selectTTS)) {
        if (Number(ttsName) > userMap.dict.length) {
          await session.send('[×] 下标过大，最大下标为' + (userMap.dict.length))
          return
        }
        selectTTS = userMap.dict[Number(ttsName) - 1]
      }
      config.debug && console.log(`选中的角色 ${selectTTS}`);
      const result = temp.changeUserTTSName(selectTTS)
      const dict = result.code ? '[√] ' : '[×] '
      await session.send(dict + result.msg)
    })

  ctx
    .command('tts语音.查询')
    .action(async ({ session }) => {
      if (userMap.baseUseTime == -1) {
        await session.send('请先发送一次语音请求后查询')
      }
      await session.send('全局剩余调用次数 ' + userMap.baseUseTime + ' 次')
    })

  const userMap = {
    userList: {},
    baseUseTime: -1,
    // 原始数据对象
    dict: [
      "信使",
      "公子",
      "博士",
      "大肉丸",
      "女士",
      "散兵",
      "白老先生",
      "七七",
      "三月七",
      "上杉",
      "丹吉尔",
      "丹恒",
      "丹枢",
      "丽莎",
      "久利须",
      "久岐忍",
      "九条裟罗",
      "九条镰治",
      "云堇",
      "五郎",
      "伊利亚斯",
      "伊迪娅",
      "优菈",
      "伦纳德",
      "佐西摩斯",
      "佩拉",
      "停云",
      "元太",
      "克列门特",
      "克拉拉",
      "克罗索",
      "八重神子",
      "公输师傅",
      "凝光",
      "凯亚",
      "凯瑟琳",
      "刃",
      "刻晴",
      "北斗",
      "半夏",
      "博易",
      "博来",
      "卡波特",
      "卡维",
      "卡芙卡",
      "卢卡",
      "可可利亚",
      "可莉",
      "史瓦罗",
      "吴船长",
      "哲平",
      "嘉玛",
      "嘉良",
      "回声海螺",
      "坎蒂丝",
      "埃勒曼",
      "埃尔欣根",
      "埃德",
      "埃泽",
      "埃洛伊",
      "埃舍尔",
      "塔杰·拉德卡尼",
      "塞塔蕾",
      "塞琉斯",
      "夏洛蒂",
      "多莉",
      "夜兰",
      "大慈树王",
      "大毫",
      "天叔",
      "天目十五",
      "奥兹",
      "奥列格",
      "女士",
      "妮露",
      "姬子",
      "娜塔莎",
      "娜维娅",
      "安柏",
      "安西",
      "宛烟",
      "宵宫",
      "岩明",
      "巴达维",
      "布洛妮娅",
      "希儿",
      "希露瓦",
      "帕姆",
      "帕斯卡",
      "常九爷",
      "康纳",
      "开拓者(女)",
      "开拓者(男)",
      "式大将",
      "彦卿",
      "影",
      "德沃沙克",
      "恕筠",
      "恶龙",
      "悦",
      "慧心",
      "戴因斯雷布",
      "托克",
      "托马",
      "拉赫曼",
      "拉齐",
      "掇星攫辰天君",
      "提纳里",
      "斯坦利",
      "斯科特",
      "旁白",
      "早柚",
      "昆钧",
      "明曦",
      "景元",
      "晴霓",
      "杜拉夫",
      "杰帕德",
      "松浦",
      "林尼",
      "枫原万叶",
      "柊千里",
      "查尔斯",
      "柯莱",
      "桑博",
      "欧菲妮",
      "毗伽尔",
      "沙扎曼",
      "派蒙",
      "流浪者",
      "浣溪",
      "浮游水蕈兽·元素生命",
      "海妮耶",
      "海芭夏",
      "深渊使徒",
      "深渊法师",
      "温迪",
      "烟绯",
      "爱德琳",
      "爱贝尔",
      "玛乔丽",
      "玛塞勒",
      "玛格丽特",
      "玲可",
      "珊瑚",
      "珊瑚宫心海",
      "珐露珊",
      "班尼特",
      "琳妮特",
      "琴",
      "瑶瑶",
      "瓦尔特",
      "甘雨",
      "田铁嘴",
      "申鹤",
      "留云借风真君",
      "白术",
      "白露",
      "百闻",
      "知易",
      "石头",
      "砂糖",
      "神里绫人",
      "神里绫华",
      "空",
      "符玄",
      "笼钓瓶一心",
      "米卡",
      "素裳",
      "纯水精灵？",
      "纳比尔",
      "纳西妲",
      "绮良良",
      "绿芙蓉",
      "罗刹",
      "罗莎莉亚",
      "羽生田千鹤",
      "老孟",
      "胡桃",
      "舒伯特",
      "艾丝妲",
      "艾伯特",
      "艾尔海森",
      "艾文",
      "艾莉丝",
      "芙宁娜",
      "芭芭拉",
      "荒泷一斗",
      "荧",
      "莎拉",
      "莫塞伊思",
      "莫娜",
      "莱依拉",
      "莺儿",
      "菲米尼",
      "菲谢尔",
      "萍姥姥",
      "萨赫哈蒂",
      "萨齐因",
      "蒂玛乌斯",
      "虎克",
      "螺丝咕姆",
      "行秋",
      "西拉杰",
      "言笑",
      "诺艾尔",
      "费斯曼",
      "赛诺",
      "辛焱",
      "达达利亚",
      "迈勒斯",
      "迈蒙",
      "迪卢克",
      "迪奥娜",
      "迪娜泽黛",
      "迪希雅",
      "那维莱特",
      "重云",
      "金人会长",
      "钟离",
      "银狼",
      "镜流",
      "长生",
      "阿佩普",
      "阿兰",
      "阿圆",
      "阿娜耶",
      "阿守",
      "阿尔卡米",
      "阿巴图伊",
      "阿扎尔",
      "阿拉夫",
      "阿晃",
      "阿洛瓦",
      "阿祇",
      "阿贝多",
      "陆行岩本真蕈·元素生命",
      "雷泽",
      "雷电将军",
      "霄翰",
      "霍夫曼",
      "青镞",
      "青雀",
      "香菱",
      "驭空",
      "魈",
      "鹿野奈奈",
      "鹿野院平藏",
      "黑塔",
      "龙二",
      "多人对话"
    ],
    // 查询字典
    dictMap: [],
    getUserInfo(userId: string | number) {
      if (!this.userList[userId]) {
        this.userList[userId] = {
          ttsName: '派蒙',
          lastTime: +new Date(),
          isUse: false,
          changeUserTTSName(ttsName: string) {
            if (!ttsName) return { code: false, msg: '请插入名字' }
            if (!userMap.dict.includes(ttsName)) {
              const contain = userMap.dictMap.filter(item => item.name.includes(ttsName)).map(item => `${item.index}. ${item.name}`).join('\n')
              const result = { code: false, msg: '未在人物列表中找到该角色或对应下标；' + (contain ? `\n你可能想搜：\n${contain}` : '') }
              return result
            }
            this.ttsName = ttsName
            const moreMsg = (ttsName == '多人对话') ? '\n(恭喜！您似乎发现了一个很新的东西)\n[示例输入格式]\n荧：派蒙，你是应急食品吗？\\n 派蒙：才、才不是呢！' : ''

            return { code: true, msg: `切换成功，已使用${ttsName}作为tts语音输出人物${moreMsg}` }

          },
          checkUse() {
            return this.isUse
          },
          startUse() {
            this.isUse = true
          },
          clearUse() {
            this.isUse = false
          }
        }
      }
      return this.userList[userId]
    }
  }

  // 生成查询对象
  userMap.dictMap = userMap.dict.map((item, index) => {
    return {
      index: index + 1,
      name: item
    }
  })
}
