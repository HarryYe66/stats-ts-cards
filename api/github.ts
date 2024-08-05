import getGitHubInfo from '../crawler/github';
import renderGitHubCard from '../render/github';
import { cacheTime, cache } from '../common/cache';
import { processData } from '../common/utils';
import { SuccessMsg, ErrorMsg } from '../common/resMsg';
import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    let { username, theme, lang, id, raw } = req.query;
    if (username === undefined) {
      username = id;
    }
    let key = 'g' + username;
    let data = cache.get(key) as any;
    if (!data) {
      data = await getGitHubInfo(username);
      cache.set(key, data);
    }
    if (raw) {
      return res.json(data);
    }
    data.theme = theme;
    processData(data);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', `public, max-age=${cacheTime}`);
    return res.send(renderGitHubCard(data, lang));
  } catch (error) {
    return ErrorMsg(res, error, 'error');
  }
});

export default router;
