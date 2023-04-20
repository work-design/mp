const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async(event, context) => {
  try {
    return await cloud.openapi.security.msgSecCheck({
      openid: cloud.getWXContext().OPENID,
      scene: 1,
      version: 2,
      content: event.content
    })
  } catch(err) {
    // 错误处理
    // err.errCode !== 0
    throw err
  }
}