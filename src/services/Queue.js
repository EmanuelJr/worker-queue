import uuid from '../helpers/uuid';

const queueKv = QUEUE;
const queueTtl = TTL;

const buildUserIndex = (queue, user) => `queue:${queue}:user:${user}`;

const buildDataIndex = (queue, index) => `queue:${queue}:data:${index}`;

const getIndexFromKey = (key) => key.split(':').slice(-1)[0];

export const put = async (queue, data) => {
  const options = {};

  if (queueTtl) {
    options.expirationTtl = queueTtl;
  }

  await queueKv.put(
    buildDataIndex(queue, uuid()),
    JSON.stringify(data),
    options,
  );
};

const getIndex = async (queue, index) =>
  queueKv.get(buildDataIndex(queue, index), { type: 'json' });

const getIndexData = async (queue, index) => {
  if (!index) {
    return null;
  }

  return {
    index,
    data: await getIndex(queue, index),
  };
};

const getFirstIndex = async (queue, nextPageCursor = null) => {
  const { list_complete, keys, cursor } = await queueKv.list({
    prefix: buildDataIndex(queue, ''),
    cursor: nextPageCursor,
  });

  if (!list_complete) {
    return getFirstIndex(queue, cursor);
  }

  if (keys.length === 0) {
    return null;
  }

  return getIndexFromKey(keys[keys.length - 1].name);
};

export const getFirst = async (queue) => {
  const index = await getFirstIndex(queue);

  return getIndexData(queue, index);
};

const getLastIndex = async (queue) => {
  const { keys } = await queueKv.list({
    prefix: buildDataIndex(queue, ''),
    limit: 1,
  });

  if (keys.length === 0) {
    return null;
  }

  return getIndexFromKey(keys[0].name);
};

export const getLast = async (queue) => {
  const index = await getLastIndex(queue);

  return getIndexData(queue, index);
};

const getNextIndex = async (queue, actualIndex, nextPageCursor = null) => {
  const { list_complete, keys, cursor } = await queueKv.list({
    prefix: buildDataIndex(queue, ''),
    cursor: nextPageCursor,
  });

  const findKey = keys.findIndex(
    (key) => key.name === buildDataIndex(queue, actualIndex),
  );

  if (findKey === 0) {
    return {
      index: null,
    };
  }

  if (findKey > 0) {
    return {
      index: getIndexFromKey(keys[findKey - 1].name),
    };
  }

  if (findKey === -1 && !list_complete) {
    return getNextIndex(queue, actualIndex, cursor);
  }

  return null;
};

export const getNext = async (queue, actualIndex) => {
  const nextIndex = await getNextIndex(queue, actualIndex);

  if (!nextIndex) {
    return null;
  }

  if (nextIndex.index === null) {
    return {
      index: null,
      data: null,
    };
  }

  return getIndexData(queue, nextIndex.index);
};

export const getUserIndex = async (queue, user) =>
  queueKv.get(buildUserIndex(queue, user), { type: 'text' });

export const updateUserIndex = async (queue, user, index) =>
  queueKv.put(buildUserIndex(queue, user), index);
