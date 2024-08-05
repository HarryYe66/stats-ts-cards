import getNeteaseMusicInfo from '../crawler/netease-music';
import renderZhihuCard from '../render/zhihu';
import { cache, cacheTime } from '../common/cache';
import { processData } from '../common/utils';
import { SuccessMsg, ErrorMsg } from '../common/resMsg';
import express, { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  try {
    let { username, theme, lang, id, raw } = req.query;
    if (username === undefined) {
      username = id;
    }
    let key = 'z' + username;
    let data = cache.get(key) as any;
    if (!data) {
      data = await getNeteaseMusicInfo(username);
      console.log(username, data);

      cache.set(key, data);
    }
    if (raw) {
      return res.json(data);
    }
    data.theme = theme;
    processData(data);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', `public, max-age=${cacheTime}`);
    return res.send(renderZhihuCard(data, lang));
  } catch (error) {
    return ErrorMsg(res, error, 'error');
  }
};
