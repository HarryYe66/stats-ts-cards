import express from 'express';
import http from 'http';
import serveStatic from 'serve-static';
import path from 'path';

import zhihu from './api/zhihu';
import bilibili from './api/bilibili';
import leetcode from './api/leetcode';
import juejin from './api/juejin';
import csdn from './api/csdn';
import nowcoder from './api/nowcoder';
import github from './api/github';
import mycard from './api/mycard';
import steam from './api/steam';
import codeforces from './api/codeforces';
import website from './api/website';
import { cacheTime } from './common/cache';

const app = express();

app.use('/api/zhihu', zhihu);
app.use('/api/bilibili', bilibili);
app.use('/api/leetcode', leetcode);
app.use('/api/juejin', juejin);
app.use('/api/csdn', csdn);
app.use('/api/nowcoder', nowcoder);
app.use('/api/github', github);
app.use('/api/website', website);
app.use('/api/mycard', mycard);
app.use('/api/steam', steam);
app.use('/api/codeforces', codeforces);

app.use(
  serveStatic(path.join(__dirname, 'public'), {
    maxAge: cacheTime * 1000,
  })
);

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running at http://localhost:${process.env.PORT || 3000}`
  );
});

export default app;
