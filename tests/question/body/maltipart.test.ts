import assert from 'node:assert';
import type { IncomingMessage } from 'node:http';
import { Readable } from 'node:stream';
import { describe, it } from 'node:test';

import { getMaltiPartBody } from '../../../src/structure-ts/question/body/maltipart';

const BOUNDARY = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

const buildMultipartBody = (parts: string[]): Buffer => {
  const boundary = `--${BOUNDARY}`;
  const closingBoundary = `--${BOUNDARY}--`;

  const joined =
    parts.map((p) => `${boundary}\r\n${p}`).join('') + `${closingBoundary}\r\n`;
  return Buffer.from(joined, 'utf-8');
};

const createMockRequest = (
  headers: Record<string, string>,
  body: Buffer
): IncomingMessage => {
  const stream = new Readable({
    read() {
      this.push(body);
      this.push(null);
    },
  }) as IncomingMessage;

  stream.headers = headers;
  return stream;
};

describe('#getMaltiPartBody', () => {
  it('parses simple multipart form with text fields', async () => {
    const body = buildMultipartBody([
      `Content-Disposition: form-data; name="username"\r\n\r\njohn_doe  \r\n`,
      `Content-Disposition: form-data; name="email"\r\n\r\njohn@example.com\r\n`,
    ]);

    const req = createMockRequest(
      { 'content-type': `multipart/form-data; boundary=${BOUNDARY}` },
      body
    );

    const result = await getMaltiPartBody(req);

    assert.deepStrictEqual(result.fields, {
      username: 'john_doe',
      email: 'john@example.com',
    });
    assert.deepStrictEqual(result.files, {});
  });

  it('parses multipart form with a file upload', async () => {
    const fileContent = 'Hello file';
    const body = buildMultipartBody([
      `Content-Disposition: form-data; name="avatar"; filename="photo.png"\r\nContent-Type: image/png\r\n\r\n${fileContent}`,
    ]);

    const req = createMockRequest(
      { 'content-type': `multipart/form-data; boundary=${BOUNDARY}` },
      body
    );

    const result = await getMaltiPartBody(req);

    assert.deepStrictEqual(result.fields, {});
    assert.strictEqual(result.files.avatar.filename, 'photo.png');
    assert.strictEqual(result.files.avatar.data.toString(), fileContent);
  });

  it('parses multipart with both field and file', async () => {
    const body = buildMultipartBody([
      `Content-Disposition: form-data; name="bio"\r\n\r\nJust a person`,
      `Content-Disposition: form-data; name="resume"; filename="resume.txt"\r\nContent-Type: text/plain\r\n\r\nThis is my resume`,
    ]);

    const req = createMockRequest(
      { 'content-type': `multipart/form-data; boundary=${BOUNDARY}` },
      body
    );

    const result = await getMaltiPartBody(req);

    assert.strictEqual(result.fields.bio, 'Just a person');
    assert.strictEqual(result.files.resume.filename, 'resume.txt');
    assert.strictEqual(
      result.files.resume.data.toString(),
      'This is my resume'
    );
  });

  it('throws on missing boundary', async () => {
    const req = createMockRequest({}, Buffer.from(''));
    await assert.rejects(() => getMaltiPartBody(req), /No boundary found/);
  });
});
