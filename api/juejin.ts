import getJuejinInfo from '../crawler/juejin';
import renderJuejinCard from '../render/juejin';
import { cacheTime, cache } from '../common/cache';
import { processData } from '../common/utils';

import { SuccessMsg, ErrorMsg } from '../common/resMsg';
import express, { Request, Response } from 'express';
export default async (req: Request, res: Response) => {
  try {
    const { id, theme, lang, raw } = req.query;
    let key = 'j' + id;
    let data = cache.get(key) as any;
    if (!data) {
      data = await getJuejinInfo(id);
      cache.set(key, data);
    }
    data.theme = theme;
    if (raw) {
      return res.json(data);
    }
    processData(data);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', `public, max-age=${cacheTime}`);
    return res.send(renderJuejinCard(data, lang));
  } catch (error) {
    return ErrorMsg(res, error, 'error');
  }
};
