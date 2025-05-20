import ejs from 'ejs';
import { existsSync, readFileSync } from 'node:fs';
import { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';

import { ReplyType } from '../../@types';
import { Question } from '../question';
import SETTINGS, { BASE_DIR } from '../settings';
import { ok } from '../status';

const TEMPLATE_DIR = SETTINGS.TEMPLATE_DIR!;
const ERROR_CONTROLLER = SETTINGS.ERROR_CONTROLLER!;

const renderEjs = (path: string, data?: Record<string, unknown>) => {
  let html = ejs.render(readFileSync(path).toString(), data);
  html = html.replace(/(\s\s+)/gi, '');
  html = html.replace(/(\n+)/gi, '');

  return html;
};
const include = (template: string, data?: Record<string, unknown>) => {
  const includePath = path.relative(
    process.cwd(),
    path.join(TEMPLATE_DIR, template.concat('.ejs'))
  );
  if (!existsSync(includePath)) {
    throw new Error(`"${template}" include file does not exists!`);
  }

  return renderEjs(includePath, data);
};

const render = <T>(
  {
    reply,
    write,
    res,
  }: {
    res: ReplyType<T>;
    reply: ServerResponse<IncomingMessage>;
    // eslint-disable-next-line no-unused-vars
    write: (body: unknown) => void;
  },
  template: string,
  data?: Record<string, unknown>
) => {
  const templatePath = path.relative(
    process.cwd(),
    path.join(TEMPLATE_DIR, template.concat('.ejs'))
  );

  try {
    if (!existsSync(templatePath)) {
      throw new Error(`"${template}" template does not exists!`);
    }

    Object.assign(data as object, { include });

    const html = renderEjs(templatePath, data);

    res.status(ok()).type('text/html');
    write(html);
  } catch (e) {
    if (BASE_DIR === 'src') {
      console.error(e);
    }
    const qns = Question(reply.req);
    ERROR_CONTROLLER(e, qns, res as ReplyType<unknown>);
  }
};

export { renderEjs, render };
