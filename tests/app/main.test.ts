import assert from 'node:assert';
import { describe, it } from 'node:test';

import { checkApps } from '../../src/structure-ts/app/main';

const base = 'tests/app/files';

describe('#checkApps', () => {
  it('should aggregate routes correctly when files are valid', async () => {
    const apps = ['base', 'other'];

    const { main, dynamic } = await checkApps(base, apps);

    assert.ok(main);
    assert.ok(dynamic);

    assert.ok('/base' in main);
    assert.strictEqual(typeof main['/base'].get?.controller, 'function');

    assert.ok('/other' in main);
    assert.strictEqual(typeof main['/other'].get?.controller, 'function');

    assert.deepStrictEqual(dynamic, []);
  });
});
