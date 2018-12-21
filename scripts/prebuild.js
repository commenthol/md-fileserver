const { resolve, dirname } = require('path')
const { cp, mkdir } = require('shelljs')

function copyKatexCss () {
  const source = resolve(dirname(require.resolve('katex')), 'dist')
  const target = resolve(__dirname, '..', 'assets', 'css', 'katex')
  mkdir('-p', resolve(target, 'fonts'))
  cp(resolve(source, 'katex.min.css'), target)
  cp('-r', resolve(source, 'fonts'), target)
}

copyKatexCss()
