import getNowCoderInfo from '../crawler/nowcoder';
import renderNowCoderCard from '../render/nowcoder';
import { cache, cacheTime } from '../common/cache';
import { processData } from '../common/utils';

import { SuccessMsg, ErrorMsg } from '../common/resMsg';
import express, { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  try {
    const { id, theme, lang, raw } = req.query;
    let key = 'n' + id;
    let data = cache.get(key) as any;
    if (!data) {
      data = await getNowCoderInfo(id);
      cache.set(key, data);
    }
    if (raw) {
      return res.json(data);
    }
    data.theme = theme;
    processData(data);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', `public, max-age=${cacheTime}`);
    return res.send(renderNowCoderCard(data, lang));
  } catch (error) {
    return ErrorMsg(res, error, 'error');
  }
};
