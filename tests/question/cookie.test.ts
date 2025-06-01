import assert from 'node:assert';
import { describe, it } from 'node:test';

import { parseCookie } from '../../src/structure-ts/question/cookie';

describe('#cookie', () => {
  it('should get nothing from empty string', () => {
    const cookies = parseCookie('');

    assert.deepEqual(cookies, {});
  });

  it('should get a basic cookie', () => {
    const cookies = parseCookie('name=val');

    assert.deepEqual(cookies, {
      name: 'val',
    });
  });
});
