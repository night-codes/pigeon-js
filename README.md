# Pigeon
[![Build Status](https://travis-ci.org/avxto/pigeon-js.svg)](https://travis-ci.org/avxto/pigeon-js)
[![Dependency Status](https://david-dm.org/avxto/pigeon-js.svg)](https://david-dm.org/avxto/pigeon-js)

Pigeon is an HTML preprocessor / template engine written in Javascript.

# Installation
```npm install pigeon-js```

# About 
Pigeon is an HTML preprocessor. However, you do not need to learn a new language — you can stick to Javascript. Pigeon is an alternative to Absurd's HTML preprocessor.

# Usage 

``` javascript
var pigeon = require('pigeon-js');

var data = {
    content: 'Content'
};

var convert = {
    
    _: 'html',
    
    html: {
        head: {
            style: '.example {display: block;}',
            title: 'My title',
            script: 'function helloWorld () { console.log("Hello World"); }',
        },

        body: {
            '.main#ID': {
                '.child.child': 'Content',
                '.anotherchild': 'Content',
                '.lastchild': function() {
                    return data.content;
                },

            },
        },
    }

};

pigeon(convert, function(err, html) {
    console.log(html);
});
```

### Displays 

``` html
<!DOCTYPE html>
<html>

<head>
    <style>
        .example {
            display: block;
        }
    </style>
    <title>My title</title>
    <script>
        function helloWorld() {
            console.log("Hello World");
        }
    </script>
</head>

<body>
    <div id="ID" class="main">
        <div class="child">Content</div>
        <div class="anotherchild">Content</div>
        <div class="lastchild">Content</div>
    </div>
</body>

</html>

```

# License
The MIT License is a free software license originating at the Massachusetts Institute of Technology (MIT). It is a permissive free software license, meaning that it permits reuse within proprietary software provided all copies of the licensed software include a copy of the MIT License terms and the copyright notice.

