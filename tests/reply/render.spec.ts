import { assert, describe, expect, it } from 'vitest'
import { renderImpl } from '../../src/stratus-ts/reply/render'

const TEMPLATE_DIR = 'tests/reply/templates'

describe('# renderImpl', () => {
  describe('# basic render', () => {
    it('# should render basic template without any data', () => {
      expect(renderImpl(TEMPLATE_DIR, 'data-less')).toBe(
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>Data Less Title</title></head><body><h1>Data Less content</h1></body></html>'
      )
    })
  })
  describe('# basic render with data', () => {
    it('# should render basic template with basic data', () => {
      expect(
        renderImpl(TEMPLATE_DIR, 'basic-data', {
          info: 'this is info',
          data: 'this is basic data',
        })
      ).toBe(
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>Basic Data Title</title></head><body><h1>Basic Data content</h1><p>this is info</p><p>this is basic data</p></body></html>'
      )
    })
  })

  describe('# layout/include', () => {
    it('# should include basic template', () => {
      assert.equal(
        renderImpl(TEMPLATE_DIR, 'include'),
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><metaname="viewport"content="width=device-width, initial-scale=1.0"/><title><!-title!></title></head><body><nav>super fancy nav</nav></body></html><h1>Includes content</h1><footer><a href="#">super fancy footer</a><p>super sencetive copy right message</p></footer></body></html>'
      )
    })

    it('# should extands a basic layout', () => {
      assert.equal(
        renderImpl(TEMPLATE_DIR, 'layout'),
        `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><metaname="viewport"content="width=device-width, initial-scale=1.0"/><title><!- title !></title></head><body><nav></nav><h2>this is body</h2><h3>this is include content</h3><h3>this is level-2 content</h3>;<footer></footer><script>console.log('this work');</script></body></html>`
      )
    })
  })

  describe('# error in render', () => {
    it('# should throw if the varable is not defined', () => {
      assert.throws(
        () =>
          renderImpl(TEMPLATE_DIR, 'basic-data') as unknown as Promise<unknown>
      )
    })
  })
})
