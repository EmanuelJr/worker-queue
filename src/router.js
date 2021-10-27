import { Router } from 'itty-router';
import { json } from 'itty-router-extras';

import * as queue from './services/Queue';
import * as middleware from './helpers/middleware';

const router = Router();

router
  .get('*', middleware.authorization)
  .post('*', middleware.authorization)
  .put('*', middleware.authorization);

router.put('/queue/:queueName', async (request) => {
  const content = await request.json();
  const { params } = request;

  await queue.put(params.queueName, content);

  return json({ status: 'ok' });
});

router.get('/queue/:queueName', async (request) => {
  const { queueName } = request.params;

  const userIndex = await queue.getUserIndex(queueName, request.user);

  let data = await queue.getNext(queueName, userIndex);

  if (!data) {
    data = await queue.getFirst(queueName);
  }

  if (!data.index) {
    return json(data);
  }

  await queue.updateUserIndex(queueName, request.user, data.index);

  return json(data);
});

router.all('*', () => {
  const response = {
    error: 'Not found',
  };

  return new Response(JSON.stringify(response), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

export default router;
