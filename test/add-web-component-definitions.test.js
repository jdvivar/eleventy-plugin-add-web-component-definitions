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

test('Undefined with non-html files', t => {
  t.is(
    addWebComponentDefinitions.bind(null, {})(
      undefined,
      'main.css'
    ),
    undefined
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

test('Is not output', t => {
  t.is(
    addWebComponentDefinitions.bind(null, {})(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      false
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>'
  )
})

test('Undefined output path extension, is not html', t => {
  t.is(
    addWebComponentDefinitions.bind(null, {})(
      'console.log("whatever")',
      'whatever'
    ),
    'console.log("whatever")'
  )
})

test('Undefined output path extension, it looks like html but it\'s not html', t => {
  t.is(
    addWebComponentDefinitions.bind(null, {})(
      '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0">whatever</rss>',
      'whatever'
    ),
    '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0">whatever</rss>'
  )
})

test('Undefined output path extension, is html', t => {
  t.is(
    addWebComponentDefinitions.bind(null, {})(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'whatever'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module" src="/js/components/custom-tag/custom-tag.js"></script></body></html>'
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
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module" src="/js/components/custom-tag/custom-tag.js"></script></body></html>'
  )
})

test('modulepreload link', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { modulePreload: true })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head><link rel="modulepreload" href="/js/components/custom-tag/custom-tag.js"></head><body><custom-tag>asdf</custom-tag><script type="module" src="/js/components/custom-tag/custom-tag.js"></script></body></html>'
  )
})

test('Configure path', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { path: tag => `/test/${tag}.js` })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module" src="/test/custom-tag.js"></script></body></html>'
  )
})

test('Configure position', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { position: 'afterbegin' })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><script type="module" src="/js/components/custom-tag/custom-tag.js"></script><custom-tag>asdf</custom-tag></body></html>'
  )
})

test('Configure verbose', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { verbose: true })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module" src="/js/components/custom-tag/custom-tag.js"></script></body></html>'
  )
})

test('Configure silent', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { silent: true })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module" src="/js/components/custom-tag/custom-tag.js"></script></body></html>'
  )
})

test('Two custom tags', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { silent: true })(
      '<html><head></head><body><custom-one>asdf</custom-one><custom-two>qwer</custom-two></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-one>asdf</custom-one><custom-two>qwer</custom-two><script type="module" src="/js/components/custom-one/custom-one.js"></script><script type="module" src="/js/components/custom-two/custom-two.js"></script></body></html>'
  )
})

test('Import specifier string', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { specifiers: { 'custom-tag': 'specifier' } })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module" src="specifier"></script></body></html>'
  )
})

test('Import specifier function', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { specifiers: { 'custom-tag': (tag) => `my-${tag}` } })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module" src="my-custom-tag"></script></body></html>'
  )
})

test('Path cannot be a number', t => {
  t.throws(() => {
    addWebComponentDefinitions.bind(null, { path: 42 })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    )
  }, {
    message: 'Path must be a function: 42?'
  })
})

test('Specifier cannot be a number', t => {
  t.throws(() => {
    addWebComponentDefinitions.bind(null, { specifiers: { 'custom-tag': 42 } })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    )
  }, {
    message: 'Specifier must be either a function or a string: "42" for tag "custom-tag"?'
  })
})

test('Specifiers or path but not both', t => {
  t.throws(() => {
    addWebComponentDefinitions.bind(null, { path: x => x, specifiers: { 'custom-tag': 42 } })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    )
  }, {
    message: 'You may configure a path function or import specifiers, but not both'
  })
})

test('Specifiers only add configured tags', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { specifiers: { 'custom-tag': '/custom-tag.js' } })(
      '<html><head></head><body><custom-tag>asdf</custom-tag><unknown-tag>hi</unknown-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><unknown-tag>hi</unknown-tag><script type="module" src="/custom-tag.js"></script></body></html>'
  )
})

test('Custom tag with single script', t => {
  t.is(
    addWebComponentDefinitions.bind(null, { singleScript: true })(
      '<html><head></head><body><custom-tag>asdf</custom-tag></body></html>',
      'index.html'
    ),
    '<html><head></head><body><custom-tag>asdf</custom-tag><script type="module">import "/js/components/custom-tag/custom-tag.js";</script></body></html>'
  )
})
