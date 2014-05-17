var Webdriver = require('selenium-webdriver')
  , connect = require('connect')
require('webdriverjs-helper')
require('should')

var server = null
  , httpServer = null

var startServer = function(done) {
    
    httpServer = connect().use(connect.static('.')).listen(8080)
    
    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer
    server = new SeleniumServer(
        'test/resources/selenium-server-standalone-2.39.0.jar',
        { port: 4444 }
    )
    server.start().then(function() {
        done()
    })
}

var stopServer = function(done) {
    server.stop()
    httpServer.close()
    done()
}

var _getBrowser = function(done) {
    
    var capabilities = (process.env.BROWSER && process.env.BROWSER === 'firefox') ?
        Webdriver.Capabilities.firefox() : Webdriver.Capabilities.phantomjs()
    var browser = new Webdriver.Builder()
        .usingServer(server.address())
        .withCapabilities(capabilities)
        .build()
    done(browser)
}

var getBrowser = function(done) {
    if (!server) {
        return startServer(function() {
            _getBrowser(done)
        })
    }
    return _getBrowser(done)
}

module.exports = {
    getBrowser: getBrowser,
    stopServer: stopServer,
    Webdriver: Webdriver
}