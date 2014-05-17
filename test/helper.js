var Webdriver = require('selenium-webdriver')
require('webdriverjs-helper')
require('should')
require('colors')

var server

var startServer = function(done) {
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
    done()
}

var _getBrowser = function(done) {
    var browser = new Webdriver.Builder()
        .usingServer(server.address())
        .withCapabilities( Webdriver.Capabilities.phantomjs())
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