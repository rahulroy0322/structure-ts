import assert from 'node:assert';
import { IncomingMessage } from 'node:http';
import { describe, it } from 'node:test';

import { getQuery } from '../../src/structure-ts/question/query';

const createMockRequest = (url: string = '') => {
  return {
    url,
  } as unknown as IncomingMessage;
};

describe('#getQuery', () => {
  it('should return empty object when url is empty', () => {
    const req = createMockRequest();
    const query = getQuery(req);

    assert.deepEqual(query, {});
  });
  it('should return empty object when there was nothing in query url', () => {
    const req = createMockRequest('/?');
    const query = getQuery(req);

    assert.deepEqual(query, {});
  });
  it('should return perse besic values', () => {
    const req = createMockRequest('/?name=john&age=120&adult=true&&gender=m');
    const query = getQuery(req);

    assert.deepEqual(query, {
      name: 'john',
      age: 120,
      adult: true,
      gender: 'm',
    });
  });
  it('should return true when value is not present', () => {
    const req = createMockRequest('/?terminal');
    const query = getQuery(req);

    assert.deepEqual(query, {
      terminal: true,
    });
  });
});
