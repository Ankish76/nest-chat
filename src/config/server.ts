const disableRedis = `${process.env.REDIS_DISABLE}` === 'true';
export const serverConfig = {
  redis: {
    host: `${process.env.REDIS_HOST || 'localhost'}`,
    port: parseInt(`${process.env.REDIS_PORT || '6379'}`, 10),
    pw: `${process.env.REDIS_PASSWORD || ''}`,
    disable: disableRedis,
    defaultTimeout: 86400, // 24 hours
    defaultMaxCacheSize: parseInt(
      `${process.env.REDIS_MAX_CACHE_SIZE || '500000'} `,
      10,
    ),
  },
  defaultRoomId: `${
    process.env.DEFAULT_CHAT_ROOM_ID || 'clnz0bwlk0000sxovhc3qzqgy'
  }`,
  session: {
    secret: `${
      process.env.SESSION_SECRET ||
      'uFKtW3BrEPH3VQFWcF/LKdbptWnRA60qW9vHtZYRMXU='
    }`,
  },
};
