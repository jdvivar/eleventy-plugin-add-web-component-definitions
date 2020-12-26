const { parse } = require('parse5')
const toHast = require('hast-util-from-parse5')
const visit = require('unist-util-visit')
const h = require('hastscript')
const toHtml = require('hast-util-to-html')

const isWebComponent = (tag) => tag && (/(\w+(-\w+)+)/g).test(tag)
const logName = '[add-web-component-definitions]'

module.exports = function (options, content, outputPath) {
  if (outputPath.endsWith('.html')) {
    options = Object.assign(
      {
        specifiers: {},
        path: function (tag) { return `/js/components/${tag}/${tag}.js` },
        position: 'beforeend',
        verbose: false,
        quiet: false
      },
      options)

    if (options.verbose) {
      console.log(logName, 'Examining', outputPath)
      console.log(logName, 'options', options)
    }

    const tags = new Set()
    const tree = toHast(parse(content))
    let body

    visit(tree, 'element', (node) => {
      if (!body && node.tagName === 'body') {
        body = node
      }
      if (isWebComponent(node.tagName)) {
        tags.add(node.tagName)
      }
      return node
    })

    if (options.verbose) {
      console.log(logName, `Tags found in ${outputPath}:`, tags)
    }

    if (tags.size) {
      const value = [...new Set(
        [...tags]
          .map(tag => {
            const path = options.specifiers[tag] || options.path
            const typeOfPath = typeof path
            console.assert(
              'string function'.split(' ').includes(typeOfPath),
              { tag: tag, path: path, errorMsg: 'specifier/path must be a string or a function' }
            )
            const v = typeOfPath === 'string' ? path : path(tag)
            return v ? `import "${v}";` : null
          })
      )]
        .filter(Boolean)
        .join('\n')

      if (!options.quiet) {
        value.split('\n').forEach(v => console.log(logName, v))
      }

      const child = h('script', { type: 'module' }, [{ type: 'text', value }])

      if (options.position === 'afterbegin') {
        body.children.unshift(child)
      } else {
        body.children.push(child)
      }
    }

    return toHtml(tree)
  }
  return content
}
