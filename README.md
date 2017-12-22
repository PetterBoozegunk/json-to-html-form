# json-to-html-form
Get a html form from json

## usage
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

### html:
*(but without indentation and new lines...)*

    <form>
        <fieldset class="object">
            <legend>Root</legend>
            <label>
                <span>foo</span>
                <input type="text" value="bar" name="foo">
            </label>
            <fieldset class="object">
                <legend>foo1</legend>
                <label>
                    <span>foo2</span>
                    <input type="text" value="bar1" name="foo1.foo2">
                </label>
                <fieldset class="array">
                    <legend>array1</legend>
                    <ul>
                        <li>
                            <label>
                                <span>arrayItem</span>
                                <input type="text" value="item" name="foo1.array1.0.arrayItem">
                            </label>
                        </li>
                    </ul>
                </fieldset>
            </fieldset>
        </fieldset>
    </form>