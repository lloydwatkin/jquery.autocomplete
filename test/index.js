var Webdriver = require('selenium-webdriver')
require('webdriverjs-helper')
require('should')

var getBrowser = function(done) {
    var browserToUse = process.env.BROWSER || 'phantomjs'
    var browser, capabilities
    switch (browserToUse) {
        case 'phantomjs':
        default:
            capabilities = Webdriver.Capabilities.phantomjs()
            break
        case 'firefox':
            capabilities = Webdriver.Capabilities.firefox()
            break
        case 'chrome-remote':
            capabilities = Webdriver.Capabilities.chrome()
            break
        case 'chrome':
            var browser = new Webdriver.Builder()
                .withCapabilities(Webdriver.Capabilities.chrome())
                .build()
            done(browser)
            return
    }

    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer
    var server = new SeleniumServer(
        'test/resources/selenium-server-standalone-2.39.0.jar',
        { port: 4444 }
    )
    server.start().then(function() {

        var browser = new Webdriver.Builder()
            .usingServer(server.address())
            .withCapabilities(capabilities)
            .build()
        done(browser)
    })
}

getBrowser(function(driver) {
  driver.get(process.cwd() + '/test/test.html')
  driver.element('#test1').sendKeys('M')
  driver.elements('div.autocomplete div').count(function(length) {
    length.should.equal(0)
  })
  driver.element('#test1').sendKeys('a')
  driver.elements('div.autocomplete div').count(function(length) {
    length.should.equal(2)
  })
  driver.element('div.autocomplete div').html(function(html) {
    html.should.equal('<strong>Ma</strong>rch')
  })


  driver.quit()
})
