import test from 'ava';
import sinon from 'sinon';

import { handleEndpointNotFound } from './handle-endpoint-not-found.js';

test('sends 404', t => {
  const request = {
    session: {},
    log: { debug: sinon.spy() },
  };
  const response = { sendStatus: sinon.spy() };

  handleEndpointNotFound(request, response);

  const sendCalls = response.sendStatus.getCalls();
  t.plan(2);
  t.is(sendCalls.length, 1);
  t.is(sendCalls[0].args[0], 404);
});
