'use strict';

var helper    = require('./helper')
  , should    = require('should')

var browser

beforeEach(function(done) {
    helper.getBrowser(function(driver) {
        browser = driver
        browser.get(process.cwd() + '/test/test.html')
            .then(function() { done() })
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
    })
    browser.element('#test1').sendKeys('r')
    browser.elements('div.autocomplete div').count(function(length) {
      length.should.equal(1)
    })
    browser.element('div.autocomplete div').html(function(html) {
      html.should.equal('<strong>Mar</strong>ch')
      done()
    })
  })
  
  it('Adds \'selected\' CSS class when item selected with down arrow', function(done) {
    browser.element('#test1').sendKeys('March')
    browser.elements('div.autocomplete div').count(function(length) {
      length.should.equal(1)
    })

    browser.element('#test1').sendKeys(helper.Webdriver.Key.ARROW_DOWN)
    browser.element('div.autocomplete div.selected').html(function(html) {
        html.should.include('<strong>March</strong>')
        done()
    })
  })

})

describe('Autocomplete fill', function() {
  
    it('Updates text box when clicking a value', function(done) {
        browser.element('#test1').sendKeys('Ma')
        browser.element('div.autocomplete div[title="March"]').click()
        browser.input('input#test1').value(function(value) {
            value.should.equal('March')
            done()
        })
    })
    
})