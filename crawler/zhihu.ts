import axios from 'axios';
import { mobileConfig as axiosConfig } from '../common/utils';
import cheerio from 'cheerio';

export async function getZhihuInfo(username: any) {
  let result: any = {
    name: username,
    description: 'No description',
    follower_count: 0,
    answer_count: 0,
    voteup_count: 0,
    thanked_count: 0,
    question_count: 0,
    articles_count: 0,
    favorited_count: 0,
    liked_count: 0,
  };
  try {
    let res: any = await axios.get(
      `https://www.zhihu.com/api/v4/members/${username}`,
      axiosConfig
    );
    result.name = res.data.name;
    result.description = res.data.headline;
    res = await axios.get(
      `https://www.zhihu.com/people/${username}`,
      axiosConfig
    );
    let $: any = cheerio.load(res.data);
    let list = $('.Profile-badgeText');
    let temp = list[2].children[0].data;
    let tempList = temp.split(' ');
    result.voteup_count = tempList[0];
    result.liked_count = tempList[3];
    result.favorited_count = tempList[6];
    result.follower_count =
      $('.Profile-follows')[0].children[0].children[0].data;
    result.follower_count = result.follower_count.trim();
  } catch (e) {
    console.error(e);
  }
  return result;
}
