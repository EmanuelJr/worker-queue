import * as uuid from 'uuid';

const v4 = () => uuid.v4(null, Buffer.alloc(16)).toString('hex');

const buildDateFormat = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millisecond = date.getMilliseconds();

  return `${year}${month}${day}${hour}${minute}${second}${millisecond}`;
};

/**
 * @returns {string}
 * @description Generates a unique id, based on the current date and time to keep lexical order.
 */
const uuidGenerator = () => buildDateFormat() + v4();

export default uuidGenerator;
