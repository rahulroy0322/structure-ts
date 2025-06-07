/* eslint-disable no-magic-numbers */
import assert from 'node:assert';
import { describe, it, mock } from 'node:test';

import {
  getCleanBaseUrl,
  getCleanPath,
  getCleanResponseUrl,
  getParams,
  getRegexpFromUrl,
} from '../../src/structure-ts/router/utils';

describe('#getRegexpFromUrl', () => {
  it('should return correct regex for a simple route', () => {
    const url = '/user/<id:int>';
    const { regexp } = getRegexpFromUrl(url);

    const match = regexp.exec('/user/123');

    assert.ok(match);
    assert.strictEqual(match![0], '/user/123');
  });

  it('should return correct regex for a route with multiple params', () => {
    const url = '/order/<orderId:int>/product/<productId:int>';
    const { regexp, keys } = getRegexpFromUrl(url);

    const match = regexp.exec('/order/456/product/789');
    assert.ok(match);
    assert.strictEqual(match![0], '/order/456/product/789');
    assert.strictEqual(keys.length, 2);
    assert.strictEqual(keys[0].key, 'orderId');
    assert.strictEqual(keys[1].key, 'productId');
  });

  it('should handle invalid type and exit the process', () => {
    const exit = process.exit;
    const error = console.error;

    const mockExit = mock.fn();
    const mockError = mock.fn();

    console.error = mockError;
    process.exit = mockExit as unknown as never;

    const url = '/user/<id:invalid>';

    assert.throws(() => getRegexpFromUrl(url));

    assert.deepStrictEqual(mockExit.mock.calls.length, 1);
    assert.deepStrictEqual(mockExit.mock.calls.at(0)?.arguments.at(0), 1);

    assert.deepStrictEqual(mockError.mock.calls.length, 1);
    assert.match(
      mockError.mock.calls.at(0)?.arguments.at(0),
      /invalid type "invalid" for url "\/user\/<id:invalid>"/
    );

    process.exit = exit;
    console.error = error;
  });
});

describe('#getCleanResponseUrl', () => {
  it('should remove leading and trailing slashes', () => {
    assert.equal(getCleanResponseUrl('/some/path/'), '/some/path');
    assert.equal(getCleanResponseUrl('some/path/'), '/some/path');
    assert.equal(
      getCleanResponseUrl('/some/dynamic/12354'),
      '/some/dynamic/12354'
    );
  });
});

describe('#getCleanBaseUrl', () => {
  it('should remove leading and trailing slashes from base URL', () => {
    assert.equal(getCleanBaseUrl('example.com/'), 'example.com');
    assert.equal(getCleanBaseUrl('example.com'), 'example.com');
    assert.equal(getCleanBaseUrl('/example.com/'), 'example.com');
  });
});

describe('#getCleanPath', () => {
  it('should combine base URL and path properly', () => {
    assert.equal(getCleanPath('example.com', '/path'), '/example.com/path');
    assert.equal(getCleanPath('/example.com', 'path'), '/example.com/path');
  });

  it('should handle invalid paths', () => {
    assert.throws(
      () => getCleanPath('example.com', '//path'),
      /Invalid Path at "example.com\/\/path"/
    );
  });

  it('should ensure no double slashes in paths', () => {
    assert.equal(getCleanPath('example.com', '/path/'), '/example.com/path');
    assert.throws(
      () => getCleanPath('example.com/', '/path'),
      /Invalid Path at "example.com\/\/path"/
    );
  });
});

describe('#getParams', () => {
  it('should return correct parameters from URL', () => {
    const url = '/user/<id:int>';
    const { regexp, keys } = getRegexpFromUrl(url);

    const result = getParams({ regexp, keys }, '/user/123');
    assert.deepStrictEqual(result, { path: '/user/123', params: { id: 123 } });
  });

  it('should return false for non-matching URL', () => {
    const url = '/user/<id:int>';
    const { regexp, keys } = getRegexpFromUrl(url);

    const result = getParams({ regexp, keys }, '/product/123');

    assert.equal(result, false);
  });
});

/* eslint-enable no-magic-numbers */
