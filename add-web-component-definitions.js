const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = function (options, content, outputPath) {
  options.path = options.path || function (tag) { return `/js/components/${tag}/${tag}.js` }
  options.position = options.position || 'beforeend'
  options.verbose = options.verbose || false
  options.quiet = options.quiet || false

  if (outputPath.endsWith('.html')) {
    if (options.verbose) {
      console.log('[add-web-component-definitions] Examining ', outputPath)
    }
    const dom = new JSDOM(content)
    const body = dom.window.document.body.innerHTML
    const regex = /<\/(\w+(-\w+)+)>/g
    const matches = body.matchAll(regex)
    const tagsSet = new Set()
    for (const match of matches) {
      tagsSet.add(match[1])
    }
    if (options.verbose) {
      console.log(`[add-web-component-definitions] Tags found in ${outputPath}:`, tagsSet)
    }
    for (const tag of tagsSet) {
      if (!options.quiet) {
        console.log('[add-web-component-definitions] Adding definition for tag: ', tag)
      }
      dom.window.document.body.insertAdjacentHTML(options.position, `<script type="module" src="${options.path(tag)}"></script>`)
    }
    return dom.serialize()
  }
  return content
}
