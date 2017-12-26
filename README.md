# json-to-html-form
![Mocha tests](/tests-badge.svg)

Get a html form from json

## usage
```js
const jthf = require("json-to-html-form");

const json = {
    "foo": "bar",
    "foo1": {
        "foo2": "bar1",
        "array1": [{
            "arrayItem": "item"
        }]
    }
};

const html = jthf.getForm(json);    
```

### html:
*(but without indentation and new lines...)*
```html
<form>
    <fieldset class="object">
        <legend id="legend-root">root</legend>
        <label>
            <span>foo</span>
            <input type="text" value="bar" name="foo">
        </label>
        <fieldset class="object">
            <legend id="legend-foo1">foo1</legend>
            <label>
                <span>foo2</span>
                <input type="text" value="bar1" name="foo1.foo2">
            </label>
            <fieldset class="array">
                <legend id="legend-foo1.array1">array1</legend>
                <ol>
                    <li>
                        <label>
                            <span>arrayItem</span>
                            <input type="text" value="item" name="foo1.array1.0.arrayItem">
                        </label>
                    </li>
                </ol>
            </fieldset>
        </fieldset>
    </fieldset>
</form>
```