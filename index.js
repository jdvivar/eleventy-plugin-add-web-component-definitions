const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = function (eleventyConfig, options) {
  options.path = options.path || function (tag) { return `/js/components/${tag}/${tag}.js` }
  options.placement = options.placement || 'beforeend'
  options.verbose = options.verbose || false
  options.quiet = options.quiet || false

  eleventyConfig.addTransform('add-web-component-definitions', function (content, outputPath) {
    if (outputPath.endsWith('.html')) {
      if (options.verbose) {
        console.log('[add-web-component-definitions] Examining ', outputPath)
      }
      const dom = new JSDOM(content)
      const body = dom.window.document.body.innerHTML
      const regex = /<\/(\w+(-\w+)+)>/g
      const matches = body.matchAll(regex)
      const tagsSet = new Set()
      for (match of matches) {
        tagsSet.add(match[1])
      }
      if (options.verbose) {
        console.log(`[add-web-component-definitions] Tags found in ${outputPath}:`, tagsSet)
      }
      for (tag of tagsSet) {
        if (!options.quiet) {
          console.log('[add-web-component-definitions] Adding definition for tag: ', tag)
        }
        dom.window.document.body.insertAdjacentHTML(options.placement, `<script type="module" src="${options.path(tag)}"></script>`)
      }
      return dom.serialize()
    }
    return content
  })
}