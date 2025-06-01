import ejs from 'ejs';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const FIRST_TAG = 0;
const TAG_NAME = -2;
const FIRST_CONTENT = 0;
const CONTENT_START = 3;
const CONTENT_END = 2;

const layoutRegex = /(<%(\s?)-\s+block\s(\w+)\s+%>)/;

const blockRegex =
  /(<%\s*block\s(\w+)\s*%>)([\s\S]*?)(<%\s*block\s(\w+)\s+end\s*%>)/;
const contentRegexp = /%>([\s\S]*?)(<%\s*block)/gi;
const contentBlockEndRegexp = /<%\s*block/gi;

const blockStartRegex = /(<%\s*block\s(\w+)\s)/gi;

// const checkEjsFile = (template: string, templateType: string) => {
//   const templatePath = path.relative(
//     process.cwd(),
//     path.join(template)
//   );

//   if (!existsSync(templatePath)) {
//     throw new Error(`"${template}" ${templateType} file does not exists!`);
//   }

//   return readFileSync(templatePath).toString()
// }

// const layout = (template: string, data?: Record<string, unknown>) => {
//   let fileString = checkEjsFile(template, 'layout')

//   const blocks = fileString.match(
//     new RegExp(layoutRegex, 'ig')
//   )?.map((block) => block.split(' ').at(TAG_NAME)!);

//   blocks?.forEach((block) => {
//     fileString = fileString.replace(layoutRegex, `<!--${block}-->`)
//   })

//   return renderEjs(fileString, data)
// }

const renderImpl = (
  dir: string,
  template: string,
  data?: Record<string, unknown>
) => {
  const checkEjsFile = (template: string, templateType: string) => {
    const templatePath = path.relative(
      process.cwd(),
      path.join(dir, template.concat('.ejs'))
    );

    if (!existsSync(templatePath)) {
      throw new Error(`"${template}" ${templateType} file does not exists!`);
    }

    return readFileSync(templatePath).toString();
  };

  const layout = (template: string, data?: Record<string, unknown>) => {
    let fileString = checkEjsFile(template, 'layout');

    const blocks = fileString
      .match(new RegExp(layoutRegex, 'ig'))
      ?.map((block) => block.split(' ').at(TAG_NAME)!);

    blocks?.forEach((block) => {
      fileString = fileString.replace(layoutRegex, `<!--${block}-->`);
    });

    return renderEjs(fileString, data);
  };

  const renderEjs = (
    fileContent: string,
    data: Record<string, unknown> = {}
  ) => {
    Object.assign(data, {
      layout,
      include,
    });

    return ejs.render(fileContent, data);
  };

  const include = (template: string, data?: Record<string, unknown>) => {
    const includeContent = checkEjsFile(template, 'include');

    return renderEjs(includeContent, data);
  };

  let fileString = checkEjsFile(template, 'template');

  const blocks = fileString
    .match(new RegExp(blockRegex, 'ig'))
    ?.map((match) => {
      const tag = match
        .match(blockStartRegex)
        ?.at(FIRST_TAG)
        ?.split(' ')
        .at(TAG_NAME);
      let content = match.match(contentRegexp)?.at(FIRST_CONTENT);

      if (content) {
        const firstMatch = 0;
        const endLength =
          content.match(contentBlockEndRegexp)?.at(firstMatch)?.length ||
          CONTENT_END;
        content = content.substring(CONTENT_START, content.length - endLength);
      }

      return {
        tag,
        content,
      };
    }) as
    | {
        tag: string;
        content: string;
      }[]
    | undefined;

  if (blocks) {
    fileString = fileString.replace(new RegExp(blockRegex, 'g'), '');
  }

  let html = renderEjs(fileString, data);

  blocks?.map(
    ({ tag, content }) => (html = html.replace(`<!--${tag}-->`, content || ''))
  );

  return minifyHtml(renderEjs(html));
};

const minifyHtml = (html: string) => {
  html = html.replace(/(\s\s+)/gi, '');
  html = html.replace(/(\n+)/gi, '');
  html = html.replace(/<!--.*?-->/gi, '');

  return html;
};

export { renderImpl };

// import ejs from 'ejs';
// import { existsSync, readFileSync } from 'node:fs';
// import { IncomingMessage, ServerResponse } from 'node:http';
// import path from 'node:path';

// import { ReplyType } from '../../@types';
// import { ok } from '../status';

// const renderEjs = (path: string, data?: Record<string, unknown>) => {
//   let html = ejs.render(readFileSync(path).toString(), data);
//   html = html.replace(/(\s\s+)/gi, '');
//   html = html.replace(/(\n+)/gi, '');

//   return html;
// };
// const include = (template: string, data?: Record<string, unknown>) => {
//   const includePath = path.relative(
//     process.cwd(),
//     path.join(TEMPLATE_DIR, template.concat('.ejs'))
//   );
//   if (!existsSync(includePath)) {
//     throw new Error(`"${template}" include file does not exists!`);
//   }

//   return renderEjs(includePath, data);
// };

// const render = <T>(
//   {
//     reply,
//     write,
//     res,
//   }: {
//     res: ReplyType<T>;
//     reply: ServerResponse<IncomingMessage>;
//     // eslint-disable-next-line no-unused-vars
//     write: (body: unknown) => void;
//   },
//   template: string,
//   data?: Record<string, unknown>
// ) => {
//   const templatePath = path.relative(
//     process.cwd(),
//     path.join(TEMPLATE_DIR, template.concat('.ejs'))
//   );

//   try {
//     if (!existsSync(templatePath)) {
//       throw new Error(`"${template}" template does not exists!`);
//     }

//     Object.assign(data as object, { include });

//     const html = renderEjs(templatePath, data);

//     res.status(ok())
//     .type('text/html');
//     write(html);
//   } catch (e) {
//     if (BASE_DIR === 'src') {
//       console.error(e);
//     }
//     const qns = Question(reply.req);
//     ERROR_CONTROLLER(e, qns, res as ReplyType<unknown>);
//   }
// };

// export { renderEjs, render };
