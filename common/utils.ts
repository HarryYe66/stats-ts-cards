export const mobileConfig = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Mobile Safari/537.36',
  },
};
export const desktopConfig = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36',
  },
};

export const processData = (data: any) => {
  for (let attr in data) {
    if (typeof data[attr] === 'number') {
      let num = data[attr];
      let numStr: any = num;
      if (num >= 1000000) {
        numStr = (num / 1000000).toFixed(1).toString();
        if (numStr.endsWith('.0')) {
          numStr = numStr.slice(0, -2);
        }
        numStr += 'M';
      } else if (num >= 10000) {
        numStr = (num / 1000).toFixed(1).toString();
        if (numStr.endsWith('.0')) {
          numStr = numStr.slice(0, -2);
        }
        numStr += 'k';
      }
      data[attr] = numStr;
    }
  }
};

export const isEndsWithASCII = (str: any) => {
  if (str.length === 0) return false;
  return str.charCodeAt(str.length - 1) <= 127;
};

export const encodeHTML = (str: any) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

module.exports = {
  mobileConfig,
  desktopConfig,
  processData,
  isEndsWithASCII,
  encodeHTML,
};
