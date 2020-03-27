export enum EventTypes {
  /**
   * 签到事件
   */
  CHECK_IN = 'CHECK_IN',

  /**
   * 请假事件
   */
  ASK_FOR_LEAVE = 'ASK_FOR_LEAVE',

  /**
   * 检测今天用户签到记录
   */
  CHECK_TODAY_USER_CHECK_IN = 'CHECK_TODAY_USER_CHECK_IN',

  /**
   * 机器人开始在房间发布提醒成员未打卡情况
   */
  DO_BOT_NOTICE = 'DO_BOT_NOTICE',

  /**
   * 检测三天内未打卡成员
   */
  CHECK_THREE_DAY_NOT_CHECK_IN = 'CHECK_THREE_DAY_NOT_CHECK_IN',
}