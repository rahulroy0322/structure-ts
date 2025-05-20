import ejs from 'ejs';
import { readFileSync } from 'node:fs';

const renderEjs = (path: string, data?: Record<string, unknown>) => {
  let html = ejs.render(readFileSync(path).toString(), data);
  html = html.replace(/(\s\s+)/gi, '');
  html = html.replace(/(\n+)/gi, '');

  return html;
};

export { renderEjs };
