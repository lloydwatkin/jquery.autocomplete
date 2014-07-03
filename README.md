jquery.autocomplete
===================

Autocomplete on any element*. Data source can be an ajax query response or from provided data. 

## Status

[![Build Status](https://travis-ci.org/lloydwatkin/jquery.autocomplete.svg)](https://travis-ci.org/lloydwatkin/jquery.autocomplete)

## Test

```bash
npm i -g phantomjs
npm test
```

This kicks off selenium server and tests the library using phantomjs. To use firefox for testing simply set an environment variable of __BROWSER__ with value **firefox**:

```bash
BROWSER=firefox npm test
```

## How to use

Here is an autocomplete sample for the text field with id 'autocomplete':

```html
    <input type="text" name="q" id="autocomplete" />
```

You can have multiple instances on a single page.

```javascript
     var options = { serviceUrl: 'service/autocomplete.ashx' }
     var a = $('#autocomplete').autocomplete(options)
```

You can add extra options:

```javascript
    var a = $('#query').autocomplete({
      serviceUrl: 'service/autocomplete.ashx',
      minChars: 2,
      delimiter: /(,|;)\s*/, // regex or character - pass null for single word autocomplete
      appendChars: ' ',
      maxHeight: 400,
      width: 300, 
      zIndex: 9999,
      deferRequestBy: 0, // miliseconds
      params: { country: 'Yes' }, // additional parameters
      noCache: false, // default is false
      onSelect: function(value, data) { alert('You selected: ' + value + ', ' + data) },
      lookup: ['January', 'February', 'March', 'April', 'May'], // local lookup values
      maxSuggestions: null, // Maximum suggestions to display (applies to local results only)
      searchEverywhere: false, // Search any part of data not just from beginning
                            // only applicable to local data lookups
      prefix: '',  // Only start autocompleting after this character e.g. '@' or '+'
      dataKey: 'data' // Provide values as objects and use this key as the inserted data.
                    // Allows users to specify a template for autocomplete suggestions
      searchKey: 'search', // Search on this data field
      disableMouseOver: false, // If true don't update selected option on mouseover
      identifier: 'some-unique-identifier' // added to attribute data-identifier of the autocomplete div
    })
```
  
Use **lookup** option only if you prefer to inject an array of autocompletion options, rather than sending Ajax queries.

If your `lookup` values are objects then you <strong>must</strong> provide values for `dataKey` and `searchKey`. 
Note: Autocomplete uses both data in `dataKey` and `searchKey` to find suggestions.

### Ajax Responses

Responses from ajax requests much be in the following format:

```javascript
    {
      query: 'Ba',
      suggestions: ['Bahamas', 'Bahrain', 'Bangladesh', 'Barbados'],
      data: ['BHS', 'BHR', 'BGD', 'BRB']
    }
```

Notes:

* __query__ - original query value
* __suggestions__ - comma separated array of suggested values
* __data__ (optional) - data array, that contains values for callback function when data is selected.

### Setting options

Autocomplete functionality can be disabled or enabled programmatically.

```javascript
    var ac = $('#query').autocomplete(options)
    ac.disable()
    ac.enable()
```
  
Options can be changed programmatically at any time, only options that are passed get set:

```javascript
    ac.setOptions({ zIndex: 1001 });
```

If you need to pass additional parameters, you can set them via setOptions too:

```javascript
    ac.setOptions({ params: { first: 'John', last: 'Doe' } })
```

### Formatting results

**formatResult**: function that formats values that are displayed in the autosuggest list. It takes three parameters: data we are attempting to autocomplete on, matching data entry, the third being the context of the Autocomplete object in case you want to use the matching regex. Default function for this:

```javascript
    formatResult: function(value, data) {
      var search = (this.searchKey) ? data[this.searchKey] : ''
      if (this.dataKey) data = data[this.dataKey]
      var pattern = '(' + value.replace(this.regEx, '\\$1') + ')'
      return ((search + ' (' + data).replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>') + ')')
    },
```

e.g. ```January (1st month)```

## Cleaning up

In order to remove the element once you are done simply do:

```javascript
    ac.remove()
```

### Insert special data into the DOM

Rather that simply insert the autcompleted data it is also possible to pass in a function to handle data insertion. 
This is achieved by passing a function as the `insertDomContent` key. Default function for this:

```javascript
    function(data, suggestion, context) {
      var val = context.getValue(suggestion)
      if ('object' === typeof(data))
        val = context.getValue(data[context.options.dataKey])
      if (context.options.appendChars) val = val + context.options.appendChars
      return val
    },
```

Note: Remember to call `context.getValue()` to get current input element contents.

When doing local lookups the options object should use the following format:

```javascript
{
  lookup: [
      { search: 'January', data: '1st month' },
      { search: 'Feburary', data: '2nd month' },
      { search: 'March', data: '3rd month' },
      { search: 'April', data: '4th month' },
      { search: 'May', data: '5th month' }
  ], 
  dataKey: 'data',
  searchKey: 'search'
}
```

For 'January' for example on autocomplete selection '1st month' will be substituted into the autocomplete target.

### Styling

Script generates the following HTML (sample query 'Ba'). Active element is marked with class "selected". You can style it any way you wish.

```html
    <div class="autocomplete-w1">
      <div style="width:299px;" id="Autocomplete_1240430421731" class="autocomplete">
        <div><strong>Ba</strong>hamas</div>
        <div><strong>Ba</strong>hrain</div>
        <div><strong>Ba</strong>ngladesh</div>
        <div class="selected"><strong>Ba</strong>rbados</div>
      </div>
    </div>
  
```

CSS: 

```css
    .autocomplete-w1 { position: absolute; top: 0px; left: 0px; margin: 6px 0 0 6px; }
    .autocomplete { border: 1px solid #999; background: #FFF; cursor: default; text-align: left; max-height: 350px; overflow: auto; margin: -6px 6px 6px -6px; }
    .autocomplete .selected { background: #F0F0F0; }
    .autocomplete div { padding: 2px 5px; white-space: nowrap; overflow: hidden; }
    .autocomplete strong { font-weight: normal; color: #3399FF; }
```

## Licence 

MIT.

## Source
  
This autocomplete has been updated and adapted from http://www.devbridge.com/projects/autocomplete/jquery/.

* Keyboard not currently working for non-form input types
