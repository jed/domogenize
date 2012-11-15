var fs = require("fs")
var request = require("request")
var domogenize = require("./")
var remoteCSS = "http://maker.github.com/ratchet/dist/ratchet.css"
var localJS = "./ratchet.js"

request(
  {url: remoteCSS, encoding: "utf8"},
  function(err, res, css) {
    if (err) throw err

    var js = domogenize.css(css)

    fs.writeFile(localJS, js, function(err) {
      if (err) throw err

      console.log(remoteCSS, "has been converted to JavaScript.")
    })
  }
)
