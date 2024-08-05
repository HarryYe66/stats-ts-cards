import getBilibiliInfo from '../crawler/bilibili';
import renderBilibiliCard from '../render/bilibili';
import { cacheTime, cache } from '../common/cache';
import { processData } from '../common/utils';
import { SuccessMsg, ErrorMsg } from '../common/resMsg';
import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { id, theme, lang, raw } = req.query;
    let key = 'b' + id;
    let data = cache.get(key) as any;
    if (!data) {
      data = await getBilibiliInfo(id);
      cache.set(key, data);
    }
    if (raw) {
      return res.json(data);
    }
    data.theme = theme;
    processData(data);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', `public, max-age=${cacheTime}`);
    return res.send(renderBilibiliCard(data, lang));
  } catch (error) {
    return ErrorMsg(res, error, 'error');
  }
});

export default router;
