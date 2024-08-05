import getLeetCodeInfo from '../crawler/leetcode';
import getLeetCodeCnInfo from '../crawler/leetcode-cn';
import renderLeetCodeCard from '../render/leetcode';
import { cache, cacheTime } from '../common/cache';
import { SuccessMsg, ErrorMsg } from '../common/resMsg';
import express, { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, cn, theme, cn_username, lang, raw } = req.query;
    let data: any;
    if (!cn_username) {
      if (cn) {
        const key = 'lcn' + username;
        data = cache.get(key);
        if (!data) {
          data = await getLeetCodeCnInfo(username as string);
          cache.set(key, data);
        }
      } else {
        const key = 'l' + username;
        data = cache.get(key);
        if (!data) {
          data = await getLeetCodeInfo(username as string);
          cache.set(key, data);
        }
      }
    } else {
      const key = 'l' + username;
      data = cache.get(key);
      if (!data) {
        data = await getLeetCodeInfo(username as string);
        cache.set(key, data);
      }
      data = { ...data };
      const cn_key = 'lcn' + cn_username;
      let cn_data: any = cache.get(cn_key);
      if (!cn_data) {
        cn_data = await getLeetCodeCnInfo(cn_username as string);
        cache.set(cn_key, cn_data);
      }
      data.total_solved += cn_data.total_solved;
      data.easy_solved += cn_data.easy_solved;
      data.medium_solved += cn_data.medium_solved;
      data.hard_solved += cn_data.hard_solved;
    }
    if (raw) {
      return res.json(data);
    }
    data.theme = theme;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', `public, max-age=${cacheTime}`);
    return res.send(renderLeetCodeCard(data, lang as string));
  } catch (error) {
    return next(error); // 使用 next(error) 传递错误
  }
};
