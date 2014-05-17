'use strict';

var helper = require('./helper')
  , should = require('should')

var browser

beforeEach(function(done) {
    helper.getBrowser(function(driver) {
        browser = driver
        done()
    })
})

afterEach(function(done) {
    browser.quit()
    done()
})

after(function(done) {
    helper.stopServer(done)
})

describe('Lookups', function() {
    
  it('Performs a simple lookup', function(done) {

    browser.get(process.cwd() + '/test/test.html')
    browser.element('#test1').sendKeys('M')
    browser.elements('div.autocomplete div').count(function(length) {
      length.should.equal(0)
    })
    browser.element('#test1').sendKeys('a')
    browser.elements('div.autocomplete div').count(function(length) {
      length.should.equal(2)
    })
    browser.element('div.autocomplete div').html(function(html) {
      html.should.equal('<strong>Ma</strong>rch')
      done()
    })
    
  })

})