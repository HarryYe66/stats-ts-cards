import axios from 'axios';
import cheerio from 'cheerio';
import { mobileConfig as axiosConfig } from '../common/utils';

export default async function getCodeforcesInfo(name: any) {
  let result: any = {
    name: name,
    Solved_for_all_time: 0,
    Solved_for_the_last_year: 0,
    In_a_row_for_the_last_year: 0,
    In_a_row_max: 0,
    Solved_for_the_last_month: 0,
    credit: 0,
  };
  try {
    let res: any = await axios.get(
      `https://codeforces.com/profile/${name}`,
      axiosConfig
    );
    let $ = cheerio.load(res.data);
    let list = $('.personal-reward-box .num');
    result.Solved_for_all_time = $(list[0]).text();
    result.Solved_for_the_last_year = $(list[1]).text();
    result.In_a_row_for_the_last_year = $(list[2]).text();
    result.In_a_row_max = $(list[3]).text();
    let tagList = $('.personal-tag-box div .num');
    result.Solved_for_the_last_month = $(tagList[0]).text();
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
