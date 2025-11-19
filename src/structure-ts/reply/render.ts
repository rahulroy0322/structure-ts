import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import ejs from 'ejs'

const FIRST_TAG = 0
const TAG_NAME = -2
const FIRST_CONTENT = 0
const CONTENT_START = 3
const CONTENT_END = 2

const layoutRegex = /(<%(\s?)-\s+block\s(\w+)\s+%>)/

const blockRegex =
  /(<%\s*block\s(\w+)\s*%>)([\s\S]*?)(<%\s*block\s(\w+)\s+end\s*%>)/
const contentRegexp = /%>([\s\S]*?)(<%\s*block)/gi
const contentBlockEndRegexp = /<%\s*block/gi

const blockStartRegex = /(<%\s*block\s(\w+)\s)/gi

const renderImpl = (
  dir: string,
  template: string,
  data?: Record<string, unknown>
) => {
  const checkEjsFile = (template: string, templateType: string) => {
    const templatePath = path.relative(
      process.cwd(),
      path.join(dir, template.concat('.ejs'))
    )

    if (!existsSync(templatePath)) {
      throw new Error(`"${template}" ${templateType} file does not exists!`)
    }

    return readFileSync(templatePath).toString()
  }

  const layout = (template: string, data?: Record<string, unknown>) => {
    let fileString = checkEjsFile(template, 'layout')

    const blocks = fileString
      .match(new RegExp(layoutRegex, 'ig'))
      // biome-ignore lint/style/noNonNullAssertion: it will be
      ?.map((block) => block.split(' ').at(TAG_NAME)!)

    blocks?.forEach((block) => {
      fileString = fileString.replace(layoutRegex, `<!--${block}-->`)
    })

    return renderEjs(fileString, data)
  }

  const renderEjs = (
    fileContent: string,
    data: Record<string, unknown> = {}
  ) => {
    Object.assign(data, {
      layout,
      include,
    })

    return ejs.render(fileContent, data)
  }

  const include = (template: string, data?: Record<string, unknown>) => {
    const includeContent = checkEjsFile(template, 'include')

    return renderEjs(includeContent, data)
  }

  let fileString = checkEjsFile(template, 'template')

  const blocks = fileString
    .match(new RegExp(blockRegex, 'ig'))
    ?.map((match) => {
      const tag = match
        .match(blockStartRegex)
        ?.at(FIRST_TAG)
        ?.split(' ')
        .at(TAG_NAME)
      let content = match.match(contentRegexp)?.at(FIRST_CONTENT)

      if (content) {
        const firstMatch = 0
        const endLength =
          content.match(contentBlockEndRegexp)?.at(firstMatch)?.length ||
          CONTENT_END
        content = content.substring(CONTENT_START, content.length - endLength)
      }

      return {
        tag,
        content,
      }
    }) as
    | {
        tag: string
        content: string
      }[]
    | undefined

  if (blocks) {
    fileString = fileString.replace(new RegExp(blockRegex, 'g'), '')
  }

  let html = renderEjs(fileString, data)

  blocks?.map(
    ({ tag, content }) => (html = html.replace(`<!--${tag}-->`, content || ''))
  )

  return minifyHtml(renderEjs(html))
}

const minifyHtml = (html: string) => {
  html = html.replace(/(\s\s+)/gi, '')
  html = html.replace(/(\n+)/gi, '')
  html = html.replace(/<!--.*?-->/gi, '')

  return html
}

export { renderImpl }
