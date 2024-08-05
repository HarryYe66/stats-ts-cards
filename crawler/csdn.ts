import axios from 'axios';
import cheerio from 'cheerio';
const axiosConfig = require('../common/utils').mobileConfig;

export default async function getCSDNInfo(name: any) {
  let result: any = {
    name: 'username',
    articles: 0,
    fans: 0,
    likes: 0,
    replies: 0,
    views: 0,
    credit: 0,
  };
  try {
    let res: any = await axios.get(
      `https://blog.csdn.net/${name}`,
      axiosConfig
    );
    let $ = cheerio.load(res.data);
    let list = $('.personal-reward-box .num');
    result.articles = $(list[0]).text();
    result.fans = $(list[1]).text();
    result.likes = $(list[2]).text();
    result.replies = $(list[3]).text();
    let tagList = $('.personal-tag-box div .num');
    result.views = $(tagList[0]).text();
    result.credit = $(tagList[1]).text();
    result.name = $('.personal-massage-name').text();

    for (const [key, value] of Object.entries(result)) {
      const values = value as any;
      if (values.endsWith('万+')) {
        result[key] = values.replace('万+', '0k+');
      }
    }
  } catch (e) {
    console.error(e);
  }
  return result;
}
