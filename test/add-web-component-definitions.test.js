const test = require('ava')
const addWebComponentDefinitions = require('../add-web-component-definitions')

test('Not html', t => {
  t.is(
    addWebComponentDefinitions(
      'asdf',
      ''
    ),
    'asdf'
  )
})

test('Is html', t => {
  t.is(
    addWebComponentDefinitions(
      '<html><head></head><body>asdf</body></html>',
      'index.html'
    ),
    '<html><head></head><body>asdf</body></html>'
  )
})

test('h1 tag', t => {
  t.is(
    addWebComponentDefinitions(
      '<html><head></head><body><h1>asdf</h1></body></html>',
      'index.html'
    ),
    '<html><head></head><body><h1>asdf</h1></body></html>'
  )
})

test('Custom tag', t => {
  t.is(
    addWebComponentDefinitions(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module" src="/js/components/custom-tag/custom-tag.js"></script></body></html>'
  )
})
