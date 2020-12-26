# eleventy-plugin-add-web-component-definitions

This plugin will automatically add Web Component definitions to your HTML pages

Given a page with this structure:
```html
<html>
  <body>
    <custom-tag></custom-tag>
  </body>
</html>
```

The plugin will transform it, with default options, into:
```html
<html>
  <body>
    <custom-tag></custom-tag>
    <script type="module" src="/js/components/custom-tag/custom-tag.js"></script>
  </body>
</html>
```

## How to use

First, install it:
```bash
npm install --save-dev eleventy-plugin-add-web-component-definitions
```

Then, in your `.eleventy.js` configuration file, add:
```js
// Together with your other imports
const addWebComponentDefinitions = require('eleventy-plugin-add-web-component-definitions')

module.exports = function(eleventyConfig) {

  // Inside your eleventy configuration function
  eleventyConfig.addPlugin(addWebComponentDefinitions)
}
```

### Options

| name           |  type      | default          | description         |
|----------------|------------|------------------|---------------------|
| `path`         | `Function or String` | ``function (tag) { return `/js/components/${tag}/${tag}.js\` `` | Path where your components are published |
| `specifiers` | `Object` | {}  | Input with this format `{<custom-tag>: <Function or String>}` to override a specific tag path, see below an example |
| `position`     | `String`   | `beforeend`      | Position where the script tag will be put in regards to the `body` element, the other options being `afterbegin` |
| `verbose`      | `Boolean`  | `false`          | It will console log each step, for debug purposes |
| `quiet`        | `Boolean`  | `false`          | It won't console log anything. By default, a log of each Web Component definition is log out with this format: `[add-web-component-definitions] Adding definition for tag: custom-tag`|
| `singleScript` | `Boolean` | `false`           | If true, only one script with import statements will be output: `<script type="module">import "js/components/custom-tag.js;</script>` |

### Example

Say your components live in `/components/` with no subfolders for tags and that your published website lives in a sub-folder of the domain (such as what happens in Github Pages or Gitlab Pages), you can do this:

```js
eleventyConfig.addPlugin(addWebComponentDefinitions, {
  path: tag => project.environment === 'production'
      ? `/my-project/components/${tag}.js`
      : `/components/${tag}.js`
  }
)
```
You can also specify a unique path for any custom-tag, which overrides the path configuration:

```js
eleventyConfig.addPlugin(addWebComponentDefinitions, {
  specifiers: {
    'custom-tag-one': tag => project.environment === 'production'
      ? `/alpha-project/components/${tag}.js`
      : `/components/${tag}.js`,
    'custom-tag-two': 'my-module'
  }
)
```

For a verbose output, do this:
```js
eleventyConfig.addPlugin(addWebComponentDefinitions, { verbose: true })
```

### Demo

Please find a demo at `/demo`, to see it working live just:
```sh
npm run demo
```

### Questions? Feature requests?

Please [open an issue](https://github.com/jdvivar/eleventy-plugin-add-web-component-definitions/issues/new) and I'll get back to you ASAP!