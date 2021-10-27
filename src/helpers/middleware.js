import { error } from 'itty-router-extras';

export const authorization = (request) => {
  const authorization = request.headers.get('authorization');

  if (!authorization) {
    return error(401, 'Unauthorized');
  }

  const [type, token] = authorization.split(' ');

  if (type !== 'Basic') {
    return error(401, 'Unauthorized');
  }

  const [username, password] = Buffer.from(token, 'base64')
    .toString()
    .split(':');

  if (password !== PASSWORD) {
    return error(401, 'Unauthorized');
  }

  request.user = username;
};
