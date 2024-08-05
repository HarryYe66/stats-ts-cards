import axios from 'axios';
import crypto from 'crypto';
import FormData from 'form-data';

function generateRandomString(length: number): string {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

function aesEncrypt(text: string, key: string): string {
  const iv = Buffer.from('0102030405060708');
  const cipher = crypto.createCipheriv(
    'aes-128-cbc',
    Buffer.from(key, 'utf8'),
    iv
  );
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function rsaEncrypt(text: string, pubKey: string, modulus: string): string {
  text = text.split('').reverse().join('');
  const buffer = Buffer.from(text, 'utf8');
  const bigIntText = BigInt(`0x${buffer.toString('hex')}`);
  const bigIntPubKey = BigInt(`0x${pubKey}`);
  const bigIntModulus = BigInt(`0x${modulus}`);
  const encrypted = bigIntText ** bigIntPubKey % bigIntModulus;
  return encrypted.toString(16).padStart(256, '0');
}

function getParams(uid: string) {
  const msg = `{"offset":"0 ","total":"True","limit":"1000","uid":${uid},"type":"0"}`;
  const key = '0CoJUm6Qyw8W8jud';
  const pubKey = '010001';
  const modulus =
    '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';

  const encryptedMsg = aesEncrypt(msg, key);
  const randomKey = generateRandomString(16);
  const params = aesEncrypt(encryptedMsg, randomKey);
  const encSecKey = rsaEncrypt(randomKey, pubKey, modulus);

  return { params, encSecKey };
}

export default async function getNeteaseMusicInfo(id: any) {
  let result = {
    name: id,
    description: '',
    follower_count: 0,
    answer_count: 0,
    voteup_count: 0,
    thanked_count: 0,
    question_count: 0,
    articles_count: 0,
  };

  try {
    const { params, encSecKey } = getParams(id);
    console.log('params:', params);
    console.log('encSecKey:', encSecKey);

    const formData = new FormData();
    formData.append('params', params);
    formData.append('encSecKey', encSecKey);

    const res = await axios({
      method: 'post',
      url: `https://music.163.com/weapi/v1/play/record?csrf_token=`,
      data: formData,
      headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip,deflate,sdch',
        'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
        Connection: 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Host: 'music.163.com',
        Referer: 'https://music.163.com/',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        Cookie:
          'os=pc; osver=Microsoft-Windows-10-Professional-build-10586-64bit; appver=2.0.3.131777; ',
      },
    });

    console.log('response status:', res.status);
    console.log('response data:', res.data);

    const responseJson = res.data;
    const leaderBoard: { weekData: any[]; allData: any[] } = {
      weekData: [],
      allData: [],
    };

    if (responseJson.code === 200) {
      console.log('responseJson:', responseJson); // 打印完整的响应数据
      const allData = responseJson.allData;
      if (allData) {
        for (const item of allData) {
          const songname = item.song.name;
          const songid = item.song.id;
          const play_count = item.playCount;
          leaderBoard.allData.push({ songid, songname, play_count });
        }
      }
      const weekData = responseJson.weekData;
      if (weekData) {
        for (const item of weekData) {
          const songname = item.song.name;
          const songid = item.song.id;
          const play_count = item.playCount;
          leaderBoard.weekData.push({ songid, songname, play_count });
        }
      }
    } else {
      throw new Error(`Fail to get leaderboard for ${id}`);
    }

    result.description = `Week Data: ${leaderBoard.weekData.length} songs, All Time Data: ${leaderBoard.allData.length} songs`;
  } catch (e) {
    console.error('Error:', e);
  }

  return result;
}
