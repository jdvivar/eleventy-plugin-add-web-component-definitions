const { parse } = require('parse5')
const toHast = require('hast-util-from-parse5')
const visit = require('unist-util-visit')
const h = require('hastscript')
const toHtml = require('hast-util-to-html')

const isWebComponent = tag => tag && (/(\w+(-\w+)+)/g).test(tag)
const logPrefix = '[add-web-component-definitions]'

const addChild = (body, child, position) => {
  if (position === 'afterbegin') {
    body.children.unshift(child)
  } else {
    body.children.push(child)
  }
}

module.exports = function (options, content, outputPath) {
  if (typeof outputPath !== 'string' || !outputPath) { return content }

  if (!!options.path && !!options.specifiers) {
    throw new Error('You may configure a path function or import specifiers, but not both')
  }

  if (outputPath.endsWith('.html') || content.startsWith('<')) {
    options = Object.assign(
      {
        path: tag => `/js/components/${tag}/${tag}.js`,
        specifiers: {},
        position: 'beforeend',
        verbose: false,
        quiet: false,
        singleScript: false
      },
      options)

    if (typeof options.path !== 'function') {
      throw new TypeError(`Path must be a function: ${options.path}?`)
    }

    if (Object.keys(options.specifiers).length !== 0) {
      options.path = tag => {
        if (!options.specifiers[tag]) {
          return null
        }
        const typeOfSpecifier = typeof options.specifiers[tag]
        if (!['string', 'function'].includes(typeOfSpecifier)) {
          throw new TypeError(`Specifier must be either a function or a string: "${options.specifiers[tag]}" for tag "${tag}"?`)
        }
        return typeof options.specifiers[tag] === 'function'
          ? options.specifiers[tag](tag)
          : options.specifiers[tag]
      }
    }

    if (options.verbose) {
      console.log(logPrefix, 'Examining', outputPath)
      console.log(logPrefix, 'options', options)
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
      console.log(logPrefix, `Tags found in ${outputPath}:`, tags)
    }

    if (tags.size) {
      const arrayOfValues = [...new Set([...tags].map(options.path))].filter(Boolean)

      if (!options.quiet) {
        arrayOfValues.forEach(value => console.log(logPrefix, value))
      }

      if (options.singleScript) {
        const value = arrayOfValues.map(value => `import "${value}";`).join('\n')
        const child = h('script', { type: 'module' }, [{ type: 'text', value }])
        addChild(body, child, options.position)
      } else {
        arrayOfValues.forEach(src => {
          const child = h('script', { type: 'module', src })
          addChild(body, child, options.position)
        })
      }
    } else {
      return content
    }

    return toHtml(tree)
  }
  return content
}
