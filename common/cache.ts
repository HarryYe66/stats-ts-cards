import LRU, { LRUCache } from 'lru-cache';

const cacheTime: number = process.env.CACHE_TIME
  ? Number(process.env.CACHE_TIME)
  : 100 * 60; // 100 min
const maxCacheItems = process.env.MAX_CACHE_ITEMS
  ? Number(process.env.MAX_CACHE_ITEMS)
  : 1024;

const options = {
  max: maxCacheItems,
  ttl: cacheTime * 1000,
  allowStale: true,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
};

const cache = new LRUCache(options as any);

export { cache, cacheTime };
