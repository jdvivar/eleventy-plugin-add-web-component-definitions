const { parse } = require('parse5')
const toHast = require('hast-util-from-parse5')
const visit = require('unist-util-visit')
const h = require('hastscript')
const toHtml = require('hast-util-to-html')

const isWebComponent = (tag) => tag && (/(\w+(-\w+)+)/g).test(tag)
const logName = '[add-web-component-definitions]'

const addChild = (body, child, position) => {
  if (position === 'afterbegin') {
    body.children.unshift(child)
  } else {
    body.children.push(child)
  }
}

module.exports = function (options, content, outputPath) {
  if (outputPath.endsWith('.html')) {
    options = Object.assign(
      {
        specifiers: {},
        path: function (tag) { return `/js/components/${tag}/${tag}.js` },
        position: 'beforeend',
        verbose: false,
        quiet: false,
        singleScript: false
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
      const arrayOfValues = [...new Set(
        [...tags]
          .map(tag => {
            const thisPath = options.specifiers[tag] || options.path
            const typeOfPath = typeof thisPath
            if (!['string', 'function'].includes(typeOfPath)) {
              throw new TypeError(`specifier/path should be either string or a function: ${thisPath}?`)
            }
            const output = typeOfPath === 'string' ? thisPath : thisPath(tag)
            const path = options.singleScript ? `import "${output}";` : output
            return path
          })
      )]
        .filter(Boolean)

      if (!options.quiet) {
        arrayOfValues.forEach(value => console.log(logName, value))
      }

      if (options.singleScript) {
        const value = arrayOfValues.join('\n')
        const child = h('script', { type: 'module' }, [{ type: 'text', value }])
        addChild(body, child, options.position)
      } else {
        arrayOfValues.forEach(src => {
          const child = h('script', { type: 'module', src })
          addChild(body, child, options.position)
        })
      }
    }

    return toHtml(tree)
  }
  return content
}
