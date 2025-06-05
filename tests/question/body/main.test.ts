import assert from 'node:assert';
import type { IncomingMessage } from 'node:http';
import { Readable } from 'node:stream';
import { describe, it } from 'node:test';

import {
  getRequestBody,
  getTransformedBody,
} from '../../../src/structure-ts/question/body/main';

const BOUNDARY = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

const buildMultipartBody = (parts: string[]): Buffer => {
  const boundary = `--${BOUNDARY}`;
  const closingBoundary = `--${BOUNDARY}--`;

  const joined =
    parts.map((p) => `${boundary}\r\n${p}`).join('') + `${closingBoundary}\r\n`;
  return Buffer.from(joined, 'utf-8');
};

const createMockRequest = (
  body: (string | Buffer)[] | Buffer,
  headers: Record<string, string> = {},
  method = 'GET'
): IncomingMessage => {
  const stream = new Readable({
    read() {
      if (Array.isArray(body)) {
        for (const chunk of body) {
          this.push(chunk);
        }
      } else {
        this.push(body);
      }
      this.push(null);
    },
  }) as IncomingMessage;

  stream.method = method;
  stream.headers = headers;
  return stream;
};

describe('#getRequestBody', () => {
  it('should read single chunk from request body', async () => {
    const req = createMockRequest(['hello']);
    const result = await getRequestBody(req);

    assert.deepStrictEqual(result, Buffer.from('hello'));
  });

  it('should concatenate multiple body', async () => {
    const req = createMockRequest(['hello', ' ', 'world']);
    const result = await getRequestBody(req);
    assert.deepStrictEqual(result, Buffer.from('hello world'));
  });

  it('should correctly handle Buffer chunks', async () => {
    const req = createMockRequest([Buffer.from('foo'), Buffer.from('bar')]);
    const result = await getRequestBody(req);
    assert.deepStrictEqual(result, Buffer.from('foobar'));
  });

  it('should return empty buffer for empty stream', async () => {
    const req = createMockRequest([]);
    const result = await getRequestBody(req);
    // eslint-disable-next-line no-magic-numbers
    assert.deepStrictEqual(result, Buffer.alloc(0));
  });

  it('should handle mixed chunk types', async () => {
    const req = createMockRequest(['foo', Buffer.from('bar')]);
    const result = await getRequestBody(req);
    assert.deepStrictEqual(result, Buffer.from('foobar'));
  });
});

describe('#getTransformedBody', () => {
  it('should return query body if content-type is missing', async () => {
    const req = {
      method: 'GET',
      headers: {},
      url: '/?name=john&age=120&adult=true&&gender=m',
    } as IncomingMessage;

    const result = await getTransformedBody(req);

    assert.deepStrictEqual(result, {
      body: { name: 'john', age: 120, adult: true, gender: 'm' },
      files: {},
    });
  });

  it('should handle multipart/form-data for POST requests', async () => {
    const body = buildMultipartBody([
      `Content-Disposition: form-data; name="username"\r\n\r\njohn_doe  \r\n`,
      `Content-Disposition: form-data; name="email"\r\n\r\njohn@example.com\r\n`,
    ]);

    const req = createMockRequest(
      body,
      { 'content-type': `multipart/form-data; boundary=${BOUNDARY}` },
      'POST'
    );

    const result = await getTransformedBody(req);
    assert.deepStrictEqual(result, {
      body: {
        username: 'john_doe',
        email: 'john@example.com',
      },
      files: {},
    });
  });

  it('should throw on multipart/form-data with non-POST method', async () => {
    const req = {
      method: 'GET',
      headers: { 'content-type': 'multipart/form-data' },
    } as IncomingMessage;

    await assert.rejects(() => getTransformedBody(req), {
      message: 'only "post" methode can handel maptipart data!',
    });
  });

  it('should handle JSON body', async () => {
    const req = createMockRequest(
      [JSON.stringify({ hello: 'world' })],
      {
        'content-type': 'application/json',
      },
      'POST'
    );

    const result = await getTransformedBody(req);
    assert.deepStrictEqual(result, {
      body: { hello: 'world' },
      files: {},
    });
  });

  it('should handle x-www-form-urlencoded body', async () => {
    const req = createMockRequest(['user=admin'], {
      'content-type': 'application/x-www-form-urlencoded',
    });

    const result = await getTransformedBody(req);
    assert.deepStrictEqual(result, {
      body: { user: 'admin' },
      files: {},
    });
  });

  it('should return empty body/files for unknown content-type', async () => {
    const req = {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
    } as IncomingMessage;

    const result = await getTransformedBody(req);
    assert.deepStrictEqual(result, {
      body: {},
      files: {},
    });
  });
});
