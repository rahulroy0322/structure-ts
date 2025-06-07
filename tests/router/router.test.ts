/* eslint-disable no-magic-numbers */
import assert from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';

import type { ControllerOptionType } from '../../src/@types';
import { Router } from '../../src/structure-ts/router/main';

describe('#Router', () => {
  let router = Router();

  beforeEach(() => {
    router = Router();
  });

  it('should allow GET request with a valid path', () => {
    const handler = mock.fn();
    router.get('/test', handler);

    const route = router.routes.main['/test'];
    assert.ok(route, 'Route should be registered');
    assert.deepStrictEqual(
      route.get!.controller,
      handler,
      'Controller should be the handler'
    );
  });

  it('should correctly register dynamic routes with parameters', () => {
    const handler = mock.fn();
    router.get('/test/<param:int>', handler);

    const route = router.routes.dynamic[0];

    assert.ok(route, 'Dynamic route should be registered');
    assert.deepStrictEqual(route[2], 'get', 'HTTP method should be GET');
    assert.deepStrictEqual(
      route[3],
      handler,
      'Controller should be the handler'
    );
  });

  it('should register the body schema if provided in options', () => {
    const handler = mock.fn();
    const options = {
      body: {
        key1: { type: 'string', required: true },
        key2: { type: 'email', required: false },
      },
    } as ControllerOptionType;

    router.post('/test', handler, options);

    const route = router.routes.main['/test']?.post;
    assert.ok(route, 'Route should be registered');
    assert.ok(route.body, 'Body schema should be registered');

    const { error } = route.body.validate({ key1: 'value' });
    assert.strictEqual(error, undefined, 'Validation should pass');
  });

  it('should throw an error for unknown body type in the schema', () => {
    const handler = mock.fn();
    const options = {
      body: {
        key1: { type: 'unknown', required: true },
      },
    } as unknown as ControllerOptionType;

    assert.throws(
      () => {
        router.post('/test', handler, options);
      },
      {
        message: 'unknown type "unknown"',
      }
    );
  });

  // TODO ? have to suport for params
  //   it('should match a dynamic route with parameters', () => {
  //   const handler = (req) => req.params.param;
  //   router.get('/test/<param:str>', handler);

  //   // Simulate a request
  //   const dynamicRoute = router.routes.dynamic.at(0)!
  //   const params = { param: 'value' };

  //   // Validate if dynamic route controller handles parameters correctly
  //   // @ts-expect-error as not passed reply
  //   assert.deepStrictEqual(dynamicRoute![3]({params}), 'value');
  // });

  it('should validate the body schema with correct types', () => {
    const handler = mock.fn();

    const options = {
      body: {
        name: { type: 'string', required: true },
        email: { type: 'email', required: true },
        age: { type: 'number', required: false },
      },
    } as ControllerOptionType;

    router.post('/user', handler, options);

    const route = router.routes.main['/user'].post!;
    const { error } = route.body!.validate({
      name: 'John',
      email: 'john@example.com',
      age: 30,
    });
    assert.strictEqual(
      error,
      undefined,
      'Validation should pass with correct data'
    );
  });

  it('should return validation error if body data is invalid', () => {
    const handler = () => {};
    const options = {
      body: {
        name: { type: 'string', required: true },
        email: { type: 'email', required: true },
      },
    } as ControllerOptionType;

    router.post('/user', handler, options);

    const route = router.routes.main['/user']!.post!;
    const { error } = route.body!.validate({
      name: 'John',
      email: 'invalid-email',
    });

    assert.ok(error, 'Validation should fail with invalid email');
  });
});

/* eslint-enable no-magic-numbers */
