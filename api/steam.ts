import getSteamInfo from '../crawler/steam';
import renderSteamCard from '../render/steam';
import { cache, cacheTime } from '../common/cache';
import { processData } from '../common/utils';

import { SuccessMsg, ErrorMsg } from '../common/resMsg';
import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    let { theme, lang, raw } = req.query;
    let key = 's' + process.env['STEAM_ID'];
    let data = cache.get(key) as any;
    if (!data) {
      data = await getSteamInfo();
      cache.set(key, data);
    }
    if (raw) {
      return res.json(data);
    }
    data.theme = theme;
    processData(data);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', `public, max-age=${cacheTime}`);
    return res.send(renderSteamCard(data, lang));
  } catch (error) {
    return ErrorMsg(res, error, 'error');
  }
});

export default router;
