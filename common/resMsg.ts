import { Response } from 'express'

export function SuccessMsg(res: Response, dataT: any, msg: string) {
  const expiredTime = Date.now() + 3600 * 1000 // Token 过期时间设定为当前时间加上一个小时
  res.json({
    success: true,
    code: 200,
    msg: msg,
    data: dataT,
  })
}

export function ErrorMsg(res: Response, dataT: any, msg: string) {
  const expiredTime = Date.now() + 3600 * 1000 // Token 过期时间设定为当前时间加上一个小时
  res.json({
    success: false,
    code: 400,
    msg: msg,
    data: dataT,
  })
}
