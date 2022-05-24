import { jest } from '@jest/globals';

import { handleError } from './handle-error';

describe('handleError', () => {
  const logDebugSpy = jest.fn();
  const logErrorSpy = jest.fn();
  const nextSpy = jest.fn();
  const sendSpy = jest.fn();

  const goodRequest = {
    log: { error: logErrorSpy, debug: logDebugSpy },
    session: { views: 0 },
    query: { code: 'abc456' },
  };

  const errorRenderSpy = jest.fn((template, locals, callback) => {
    callback(null, '<some-fake-html>');
  });
  const goodErrorResponse = { render: errorRenderSpy, send: sendSpy };

  beforeAll(() => {
    jest.clearAllMocks();
    handleError(new Error('some-error'), goodRequest, goodErrorResponse, nextSpy);
  });

  it('logs the original error', () => {
    expect(logErrorSpy.mock.calls.length).toBe(1);
    expect(logErrorSpy.mock.calls[0][0]).toStrictEqual(new Error('some-error'));
  });

  it('renders the error template', () => {
    expect(errorRenderSpy.mock.calls.length).toBe(1);
    expect(errorRenderSpy.mock.calls[0][0]).toBe('error');
    expect(sendSpy.mock.calls.length).toBe(1);
    expect(sendSpy.mock.calls[0][0]).toBe('<some-fake-html>');
  });

  it('logs any error encountered rendering error template', () => {
    jest.clearAllMocks();
    const badRenderSpy = jest.fn((template, locals, callback) => {
      callback(new Error('render-error'), '<some-fake-html />');
    });
    const badErrorResponseRender = {
      render: badRenderSpy,
      send: sendSpy,
    };
    handleError(new Error('some-error'), goodRequest, badErrorResponseRender, nextSpy);
    expect(logErrorSpy.mock.calls.length).toBe(2);
    expect(logErrorSpy.mock.calls[1][0]).toStrictEqual(new Error('render-error'));
  });
});
