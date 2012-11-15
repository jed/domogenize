domogenize
==========

Turn static HTML and CSS into declarative JavaScript, using [dōmo](http://domo-js.com). This is a rough first cut built as a proof-of-concept.

Example
-------

Run this file with node.js:

```javascript
var fs = require("fs")
var request = require("request")
var domogenize = require("domo")

request({
  url: "http://maker.github.com/ratchet/dist/ratchet.css",
  encoding: "utf8"
}, function(err, res, css) {
  if (err) throw err

  fs.writeFile("./ratchet.js", domogenize.css(css))
})
```

to generate this file at `./ratchet.js`, which looks something like the following, and renders the identical styles as the original, from JavaScript:

```javascript
// snip
var STYLE = require('domo').STYLE;

module.exports =

STYLE({ type: 'text/css' },
  // ...

  STYLE.on('.bar-title .title a', { color: 'inherit' }),

  STYLE.on('.bar-tab', {
    bottom: 0,
    height: 50,
    padding: 0,
    backgroundColor: '#393939',
    backgroundImage: 'linear-gradient(to bottom, #393939 0, #2b2b2b 100%)',
    borderTop: '1px solid #000',
    borderBottomWidth: 0,
    boxShadow: 'inset 0 1px 1px -1px rgba(255, 255, 255, .6)'
  }),

  STYLE.on('.tab-inner', {
    display: 'box',
    height: '100%',
    listStyle: 'none',
    WebkitBoxOrient: 'horizontal',
    boxOrient: 'horizontal'
  }),

  // ...
)
```

API
---

### domogenize.css(css)

Takes a CSS string, and returns a `require`-able JavaScript string that renders a single DOM stylesheet.

Once your CSS is converted to JavaScript, it can be made more dynamic by replacing literals with variables or functions, or by taking advantage of dōmo's mixins and nesting.

### domogenize.html(html)

Coming soon.
