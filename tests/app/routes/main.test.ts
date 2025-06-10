/* eslint-disable no-magic-numbers */
import assert from 'node:assert';
import path from 'node:path';
import { describe, it, mock } from 'node:test';

import { checkRoute } from '../../../src/structure-ts/app/routes/main';

const base = 'tests/app/files';

describe('#checkRoute', () => {
  it('should return routes for valid route configuration', async () => {
    const app = 'app';

    const routes = await checkRoute(base, app);

    assert.deepStrictEqual(
      Object.keys(routes.main['/']).length,
      2,
      'should be add all the routes!'
    );
  });

  it('should exit for invalid route schema', async () => {
    const app = 'invalid';

    const exit = process.exit;
    const error = console.error;

    const mockExit = mock.fn();
    const mockError = mock.fn();

    console.error = mockError;
    process.exit = mockExit as unknown as never;

    await checkRoute(base, app);

    assert.deepStrictEqual(mockExit.mock.calls.length, 1);
    assert.deepStrictEqual(mockExit.mock.calls.at(0)?.arguments.at(0), 1);

    assert.deepStrictEqual(mockError.mock.calls.length, 2);
    assert.match(
      mockError.mock.calls.at(0)?.arguments.at(0),
      /invalid app "invalid"!/
    );

    console.error = error;
    process.exit = exit;
  });

  it('should fail if the route file does not exist', async () => {
    const app = 'non';

    const _path = path.join(__dirname, '../files/', app, 'routes');

    await assert.rejects(
      async () => {
        await checkRoute(base, app);
      },
      { url: 'file://'.concat(_path), code: 'ERR_MODULE_NOT_FOUND' }
    );
  });
});
