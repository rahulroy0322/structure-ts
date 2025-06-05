import assert from 'node:assert';
import type { IncomingMessage } from 'node:http';
import { Readable } from 'node:stream';
import { describe, it } from 'node:test';

import { getUrlEncodedBody } from '../../../src/structure-ts/question/body/urlEncode';

const createMockRequest = (chunks: (string | Buffer)[]): IncomingMessage => {
  const stream = new Readable({
    read() {
      for (const chunk of chunks) {
        this.push(chunk);
      }
      this.push(null);
    },
  }) as IncomingMessage;

  return stream;
};

describe('#getUrlEncodedBody', () => {
  it('parses single key-value pair', async () => {
    const req = createMockRequest(['name=John']);
    const result = await getUrlEncodedBody(req);
    assert.deepStrictEqual(result, { name: 'John' });
  });

  it('parses multiple key-value pairs', async () => {
    const req = createMockRequest(['name=John&age=30']);
    const result = await getUrlEncodedBody(req);
    assert.deepStrictEqual(result, { name: 'John', age: '30' });
  });

  it('trims keys', async () => {
    const req = createMockRequest(['  name = John  ']);
    const result = await getUrlEncodedBody(req);
    assert.deepStrictEqual(result, { name: 'John' });
  });

  it('handles empty body', async () => {
    const req = createMockRequest(['']);
    const result = await getUrlEncodedBody(req);
    assert.deepStrictEqual(result, {});
  });

  it('handles URL-encoded characters', async () => {
    const req = createMockRequest(['city=New%20York']);
    const result = await getUrlEncodedBody(req);
    assert.deepStrictEqual(result, { city: 'New York' });
  });

  it('handles repeated keys as array', async () => {
    const req = createMockRequest(['name=John&name=Jane']);
    const result = await getUrlEncodedBody(req);
    assert.deepStrictEqual(result, { name: ['John', 'Jane'] });
  });
});
