const os = require('os')
const fs = require('fs')
const { resolve } = require('path')
const assert = require('assert')
const request = require('supertest')
const { filename2uri, homedir } = require('../lib/utils')

const { app, start, appConfig } = require('..')

describe('md-fileserver', function () {
  let agent

  beforeEach(function () {
    const token = appConfig.token()
    assert.ok(token, `got token ${token}`)
    agent = request.agent(app)
    return agent.get(`/?session=${token}`)
      .expect('set-cookie', new RegExp(`session=${token};`))
  })

  context('general', function () {
    before(function () {
      appConfig.set('confluencer', false)
    })

    it('should load md file', function () {
      return agent
        .get(filename2uri(resolve(__dirname, 'cheatsheet.md')))
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(200, /Cheatsheet - Markdown Syntax with GFM<\/h1>/)
    })

    it('should redirect on missing extension', function () {
      return agent
        .get(filename2uri(resolve(__dirname, 'cheatsheet')))
        .expect('location', /cheatsheet\.md$/)
        .expect(302)
    })

    it('should load files with non-ascii chars', function () {
    // this may fail if confluence is configured
      return agent
        .get(filename2uri(resolve(__dirname, 'test.md', 'råndÖm.md')))
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(200, /råndÖm<\/h1>/)
    })

    it('should serve plain text files without extension', function () {
      return agent
        .get(filename2uri(resolve(__dirname, '..', 'LICENSE')))
        .expect('content-type', 'text/plain')
        .expect(200, /License/)
    })

    it('should serve index', function () {
      return agent
        .get(filename2uri(resolve(__dirname)))
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(200, />cheatsheet\.md</)
    })

    it('should serve index for folder with .md extension', function () {
      return agent
        .get(filename2uri(resolve(__dirname, 'test.md')))
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(200, />test\.md</)
    })

    it('should redirect to homedir', function () {
      return agent
        .get('/')
        .expect('location', homedir())
        .expect(302)
    })

    it('should load image', function () {
      return agent
        .get(filename2uri(resolve(__dirname, 'path_to', 'img.png')))
        .expect('content-type', 'image/png')
        .expect(200)
    })

    it('should return 404 on file not found', function () {
      return agent
        .get(filename2uri(resolve(__dirname, 'not-there.md')))
        .expect(404, /No document found../)
    })

    it('should reject with 403 if there is no session', function () {
      return request(app)
        .get(filename2uri(resolve(__dirname, 'cheatsheet.md')))
        .expect(403, /Access forbidden/)
    })
  })

  context('confluencer', function () {
    before(function () {
      appConfig.set('confluencer', true)
      appConfig.set('confluenceHtml', false)
    })
    after(function () {
      appConfig.set('confluencer', false)
      appConfig.set('confluenceHtml', false)
    })

    context('confluenceHtml=false', function () {
      it('should convert to html preview', function () {
        const filename = resolve(__dirname, 'test.md', 'confluencer.md')

        return agent
          .get(filename2uri(filename))
          .expect('content-type', 'text/html; charset=utf-8')
          .then((res) => {
            const html = filename + '.html'
            if (process.env.WRITE_FIXTURES) {
              fs.writeFileSync(html, res.text, 'utf8')
            }
            const expected = fs.readFileSync(html, 'utf8')
            assert.strictEqual(res.text, expected)
          })
      })

      it('should convert to confluence html with !confluence keyword', function () {
        const filename = resolve(__dirname, 'test.md', 'confluencer.key.md')

        return agent
          .get(filename2uri(filename))
          .expect('content-type', 'text/html; charset=utf-8')
          .then((res) => {
            const html = filename + '.chtml'
            if (process.env.WRITE_FIXTURES) {
              fs.writeFileSync(html, res.text, 'utf8')
            }
            const expected = fs.readFileSync(html, 'utf8')
            assert.strictEqual(res.text, expected)
          })
      })
    })

    context('confluenceHtml=true', function () {
      before(() => {
        appConfig.set('confluenceHtml', true)
      })

      it('should convert to confluence html', function () {
        const filename = resolve(__dirname, 'test.md', 'confluencer.md')

        return agent
          .get(filename2uri(filename))
          .expect('content-type', 'text/html; charset=utf-8')
          .then((res) => {
            const html = filename + '.chtml'
            if (process.env.WRITE_FIXTURES) {
              fs.writeFileSync(html, res.text, 'utf8')
            }
            const expected = fs.readFileSync(html, 'utf8')
            assert.strictEqual(res.text, expected)
          })
      })
    })
  })

  context('remote connection', function () {
    let server
    const port = 4004

    before(function () {
      server = start({ port, host: 'localhost' })
    })
    after(function () {
      server.close()
    })

    it('should reject remote connection', function () {
      const ips = Object.values(os.networkInterfaces()).reduce((a, c) => {
        c.forEach(i => {
          if (!i.internal && i.family === 'IPv4') a.push(i.address)
        })
        return a
      }, [])

      const url = `http://${ips[0]}:${port}`
      return request(url)
        .get(filename2uri(resolve(__dirname, 'cheatsheet.md')))
        .catch(err => {
          assert.strictEqual(err.code, 'ECONNRESET')
        })
    })
  })
})
