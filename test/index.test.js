const os = require('os')
const { resolve } = require('path')
const assert = require('assert')
const request = require('supertest')
const { filename2uri, homedir } = require('../lib/utils')
const appConfig = require('../lib/appConfig')

const { app, start } = require('..')

describe('md-fileserver', function () {
  let agent

  before(function () {
    const token = appConfig().token()
    assert.ok(token, `got token ${token}`)
    agent = request.agent(app)
    return agent.get(`/?session=${token}`)
      .expect('set-cookie', new RegExp(`session=${token};`))
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
