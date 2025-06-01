import type { IncomingMessage } from 'node:http';
import { parse } from 'node:url';

const STR_REGEXP = /^([a-zA-z][a-zA-Z0-9]*)$/;
const INT_REGEXP = /^([0-9]+)$/gi;
const BOOL_REGEXP = /^(true|false)$/gi;

const getValue = (val?: string) => {
  if (!val) {
    return true;
  }

  if (BOOL_REGEXP.test(val)) {
    return val.toLowerCase() === 'true';
  }
  if (INT_REGEXP.test(val)) {
    return Number(val);
  }
  if (STR_REGEXP.test(val)) {
    return String(val);
  }

  return null;
};

const getQuery = (req: IncomingMessage) => {
  const _path = req.url;

  if (!_path) {
    return {};
  }

  const { query } = parse(_path);

  if (!query) {
    return {};
  }

  const _query = {} as Record<string, number | string | boolean>;

  const arr = query.split('&');

  for (const item of arr) {
    const [key, _val] = item.split('=');
    if (!key) {
      continue;
    }
    const val = getValue(_val);

    if (val === null) {
      //! invalid value "${_val}" for key "${key}"
      console.error(`invalid value "${_val}" for key "${key}"`);
      _query[key!] = true;

      continue;
    }

    _query[key!] = val;
  }

  return _query;
};

export { getQuery };
