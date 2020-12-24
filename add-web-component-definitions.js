const { parse } = require('parse5')
const toHast = require('hast-util-from-parse5')
const visit = require('unist-util-visit')
const h = require('hastscript')
const toHtml = require('hast-util-to-html')

const isWebComponent = (tag) => tag && (/(\w+(-\w+)+)/g).test(tag)
const logName = '[add-web-component-definitions]';

module.exports = function (options, content, outputPath) {
  if (outputPath.endsWith('.html')) {
    options = Object.assign(
      {
        path: function (tag) { return `/js/components/${tag}/${tag}.js` },
        position: 'beforeend',
        verbose: false,
        quiet: false
      },
      options)

    if (options.verbose) {
      console.log(logName, 'Examining', outputPath)
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
      const value = [...tags]
        .map(tag => `import "${options.path(tag)}";`)
        .map(v => {
          if (!options.quiet) {
            console.log(logName, v)
          }
          return v
        })
        .join('\n')

      if (options.position === 'afterbegin') {
        body.children.unshift(h('script', { type: 'module' }, [{ type: 'text', value }]))
      } else {
        body.children.push(h('script', { type: 'module' }, [{ type: 'text', value }]))
      }
    }

    return toHtml(tree)
  }
  return content
}
