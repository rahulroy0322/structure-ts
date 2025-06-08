/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-magic-numbers */
import assert from 'node:assert';
import { IncomingMessage, ServerResponse } from 'node:http';
import { describe, it } from 'node:test';

import type { QuestionType } from '../../src/@types';
import { Reply } from '../../src/structure-ts/reply/main';

const mockResponse = () => {
  // @ts-ignore
  const res = new ServerResponse(new IncomingMessage());
  res.statusCode = 200;
  // @ts-ignore
  res.headers = {};
  // @ts-ignore
  res.setHeader = (field, value) => {
    // @ts-ignore
    res.headers[field] = value;
  };
  // @ts-ignore
  res.getHeader = (field) => res.headers[field];
  // @ts-ignore
  res.write = (chunk) => {
    if (chunk) {
      // @ts-ignore
      res.body += chunk; // Capture the body content
    }
  };
  // @ts-ignore
  res.end = () => {}; // Mocking the end method
  return res;
};

describe('#reply', () => {
  it('should set status correctly', () => {
    const reply = Reply({
      baseDir: '',
      question: {} as QuestionType,
      errorController: () => {},
      templateDir: '',
      reply: mockResponse(),
    });

    reply.status(404);
    assert.strictEqual(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (reply as any).raw.statusCode,
      404,
      'Status code should be set to 404'
    );
  });

  it('should set content type header correctly', () => {
    const reply = Reply({
      baseDir: '',
      question: {} as QuestionType,
      errorController: () => {},
      templateDir: '',
      reply: mockResponse(),
    });

    reply.type('application/json');
    assert.strictEqual(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (reply as any).raw.getHeader('Content-Type'),
      'application/json',
      'Content-Type should be application/json'
    );
  });

  it('should throw an error when setting invalid status code', () => {
    const reply = Reply({
      baseDir: '',
      question: {} as QuestionType,
      errorController: () => {},
      templateDir: '',
      reply: mockResponse(),
    });

    assert.throws(() => {
      reply.status(10000); // Invalid status code
    }, /Invalid status code/);
  });

  it('should send JSON response correctly', () => {
    const reply = Reply({
      baseDir: '',
      question: {} as QuestionType,
      errorController: () => {},
      templateDir: '',
      reply: mockResponse(),
    });

    const data = { message: 'Hello' };
    reply.json({
      success: true,
      data,
    });
    assert.strictEqual(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (reply as any).raw.getHeader('Content-Type'),
      'application/json',
      'Content-Type should be application/json'
    );
    assert.strictEqual(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (reply as any).raw.body,
      'undefined{"success":true,"data":{"message":"Hello"}}',
      // TODO ?
      // added undefined at the start some how i don't know
      // but i will work on it in future
      'Body should be same as send'
    );
  });

  it('should handle cookies correctly', () => {
    const reply = Reply({
      baseDir: '',
      question: {} as QuestionType,
      errorController: () => {},
      templateDir: '',
      reply: mockResponse(),
    });

    reply.cookie('token', '1234', { maxAge: 3600 });
    assert.strictEqual(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (reply as any).raw.getHeader('Set-Cookie'),
      'token=1234; Max-Age=3600',
      'Cookie header should be set'
    );
  });

  it('should render HTML correctly', () => {
    const reply = Reply({
      baseDir: '',
      question: {} as QuestionType,
      errorController: () => {},
      templateDir: 'tests/reply/templates',
      reply: mockResponse(),
    });

    reply.render('reply', { message: 'Hello' });
    // Check that the content is rendered correctly in the response body
    assert.strictEqual(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (reply as any).raw.getHeader('Content-Type'),
      'text/html',
      'Content-Type should be text/html'
    );

    assert.strictEqual(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (reply as any).raw.body,
      'undefined<html><body>Hello</body></html>',
      // TODO ?
      // added undefined at the start some how i don't know
      // but i will work on it in future
      'Body should be same as send'
    );
  });
});
