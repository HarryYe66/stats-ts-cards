import getCSDNInfo from '../crawler/csdn';
import renderCSDNCard from '../render/csdn';
import { cacheTime, cache } from '../common/cache';
import { processData } from '../common/utils';

import { SuccessMsg, ErrorMsg } from '../common/resMsg';
import express, { Request, Response } from 'express';
export default async (req: Request, res: Response) => {
  try {
    const { id, theme, lang, raw } = req.query;
    let key = 'c' + id;
    let data = cache.get(key) as any;
    if (!data) {
      data = await getCSDNInfo(id);
      cache.set(key, data);
    }
    if (raw) {
      return res.json(data);
    }
    data.theme = theme;
    processData(data);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', `public, max-age=${cacheTime}`);
    return res.send(renderCSDNCard(data, lang));
  } catch (error) {
    return ErrorMsg(res, error, 'error');
  }
};
