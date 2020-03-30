import { Message } from 'wechaty'
import { MessageType } from 'wechaty-puppet'
import Config from '../config'
import event from '../shared/events'
import { EventTypes } from '../constants/eventTypes'
import shared from '../shared/utils'
import adminHandler from './handleAdminMsg'

let userDataInited: boolean = shared.checkUserDataIsInit()
const checkInMap = new Map<string, Date>()

export async function onMessage(msg: Message) {
  // skip self
  if (msg.self()) {
    return
  }

  if (msg.age() > 3 * 60) {
    console.log('🌟[Notice]: 消息太旧(3分钟前)已被跳过解析', msg)
    return
  }

  const room = msg.room()
  const from = msg.from()

  if (!from) {
    return
  }

  if (await adminHandler.checkIsAdmin(from.id)) {
    adminHandler.handleAdminMsg(msg)
    return
  }

  try {
    // 监控目标房间
    if (room && (await room.topic()).includes(Config.getInstance().ROOM_NAME)) {
      if (!userDataInited) {
        userDataInited = shared.checkUserDataIsInit()
        event.emit(EventTypes.FIRST_IN_TARGET_ROOM, room)
      }

      const msgText = msg.text()

      // 判定打卡成功
      if (msgText.includes('打卡') || msg.type() === MessageType.Image) {
        const wechat = from.id
        const name = from.name()
        const time = new Date()

        // 过滤三秒内重复打卡信息
        const lastCheckIn = checkInMap.get(wechat)
        if (lastCheckIn && +time - +lastCheckIn < 3000) {
          return
        }
        checkInMap.set(wechat, time)

        console.log(`📌[Check In]: 检测到打卡 - 用户「${wechat}」-「${name}」`)
        event.emit(EventTypes.CHECK_IN, {
          name,
          wechat,
          time,
        })
      }

      // 判定请假
      if (msgText.includes('请假')) {
        const wechat = from.id
        const name = from.name()
        const time = new Date()
        console.log(
          `✂️[Ask For Leave]: 检测到请假 - 用户「${wechat}」-「${name}」`,
        )
        event.emit(EventTypes.ASK_FOR_LEAVE, {
          name,
          wechat,
          time,
        })
        await room.say(`@${name} 请假成功✅`)
      }
    }
  } catch (error) {
    console.error('📡[Message]: 解析消息失败', msg, error)
  }
}
