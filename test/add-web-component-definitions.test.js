const test = require('ava')
const addWebComponentDefinitions = require('../add-web-component-definitions')

test('Not html', t => {
  t.is(
    addWebComponentDefinitions.bind(null, {})(
      'asdf',
      ''
    ),
    'asdf'
  )
})

test('Is html', t => {
  t.is(
    addWebComponentDefinitions.bind(null, {})(
      '<html><head></head><body>asdf</body></html>',
      'index.html'
    ),
    '<html><head></head><body>asdf</body></html>'
  )
})

test('h1 tag', t => {
  t.is(
    addWebComponentDefinitions.bind(null, {})(
      '<html><head></head><body><h1>asdf</h1></body></html>',
      'index.html'
    ),
    '<html><head></head><body><h1>asdf</h1></body></html>'
  )
})

test('Custom tag', t => {
  t.is(
    addWebComponentDefinitions.bind(null, {})(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module">import "/js/components/custom-tag/custom-tag.js";</script></body></html>'
  )
})

test('Configure path', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { path: tag => `/test/${tag}.js` })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module">import "/test/custom-tag.js";</script></body></html>'
  )
})

test('Configure position', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { position: 'afterbegin' })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><script type="module">import "/js/components/custom-tag/custom-tag.js";</script><custom-tag>asdf</custom-tag></body></html>'
  )
})

test('Configure verbose', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { verbose: true })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module">import "/js/components/custom-tag/custom-tag.js";</script></body></html>'
  )
})

test('Configure silent', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { silent: true })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module">import "/js/components/custom-tag/custom-tag.js";</script></body></html>'
  )
})

test('Two custom tags', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { silent: true })(
      '<html><head></head><body><custom-one>asdf</custom-one><custom-two>qwer</custom-two></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-one>asdf</custom-one><custom-two>qwer</custom-two><script type="module">import "/js/components/custom-one/custom-one.js";\nimport "/js/components/custom-two/custom-two.js";</script></body></html>'
  )
})

test('Import specifier string', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { specifier: { 'custom-tag': 'specifier' } })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module">import "specifier";</script></body></html>'
  )
})

test('Import specifier function', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { specifier: { 'custom-tag': (tag) => `my-${tag}` } })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module">import "my-custom-tag";</script></body></html>'
  )
})
