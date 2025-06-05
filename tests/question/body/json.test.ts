// import type { IncomingMessage } from 'node:http';
import assert from 'assert';
import type { IncomingMessage } from 'http';
import { describe, it } from 'node:test';
import { Readable } from 'stream';

import { getJsonBody } from '../../../src/structure-ts/question/body/json';

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

describe('#getJsonBody', () => {
  it('should parse valid JSON body', async () => {
    const req = createMockRequest([JSON.stringify({ hello: 'world' })]);
    const result = await getJsonBody(req);
    assert.deepStrictEqual(result, { hello: 'world' });
  });

  it('should return empty object for invalid JSON', async () => {
    const req = createMockRequest(['{ invalid json']);
    const result = await getJsonBody(req);
    assert.deepStrictEqual(result, {});
  });

  it('should return empty object for empty body', async () => {
    const req = createMockRequest([]);
    const result = await getJsonBody(req);
    assert.deepStrictEqual(result, {});
  });

  it('should parse JSON array but return it as-is', async () => {
    /* eslint-disable no-magic-numbers */
    const req = createMockRequest([JSON.stringify([1, 2, 3])]);
    const result = await getJsonBody(req);
    assert.deepStrictEqual(result, [1, 2, 3]);
    /* eslint-enable no-magic-numbers */
  });

  it('should return null if JSON is null', async () => {
    const req = createMockRequest(['null']);
    const result = await getJsonBody(req);
    assert.strictEqual(result, null);
  });
});
