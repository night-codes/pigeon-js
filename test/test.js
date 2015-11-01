var expect = require('chai').expect;

var pigeon = require('../index');
var parse = require('../lib/pigeon-parser').parseAttrString;

describe('build', function() {

    it('should give an error if param is not object', function(done) {

        var data = 'ABCD';

        pigeon(data, function(err, html) {
            expect(err).to.exist;
            expect(html).to.be.null;
            done();
        });

    });

    it('should support nested objects', function(done) {

        var data = {

            body: {
                '.class': {
                    '.child': {
                        '.finalchild': 'Content',
                    },
                },
            },

        };

        pigeon(data, function(err, html) {
            expect(err).to.be.null;
            expect(html).to.exist;
            expect(html).to.equal('<body><div  class="class"><div  class="child"><div  class="finalchild">Content</div></div></div></body>');
            done();
        }, {
            minify: true
        });

    });

    it('should support same keys', function(done) {

        var data = {
            '.class': [{
                '.child': 'Content'
            }, {
                '.child': 'Content'
            }, {
                '.child': 'Content'
            }],
        };

        pigeon(data, function(err, html) {
            expect(err).to.be.null;
            expect(html).to.exist;
            expect(html).to.equal('<div  class="class"><div  class="child">Content</div><div  class="child">Content</div><div  class="child">Content</div></div>');
            done();
        }, {
            minify: true
        });

    });

    it('should support functions', function(done) {

        var data = {

            p: function() {
                return 'Something';
            },

        };

        pigeon(data, function(err, html) {
            expect(err).to.be.null;
            expect(html).to.exist;
            expect(html).to.equal('<p>Something</p>');
            done();
        }, {
            minify: true
        });
    });

});

describe('parse', function() {

    it('should parse tag type', function() {
        var string = 'body.class.anotherclass#id[href=""]',
            parsed = parse(string);

        expect(parsed.tag).to.exist;
        expect(parsed.tag).to.equal('body');
    });

    it('should parse classes', function() {

        var string = '.classes.anotherclass.lastclass.anotherclass.classes._545^&3fg4',
            parsed = parse(string);

        expect(parsed.attributes).to.exist;
        expect(parsed.attributes).to.equal(' class="classes anotherclass lastclass fg4"');

    });

    it('should parse ids', function() {
        var string = '#theonlyID#shouldnotwork#4543$%$%',
            parsed = parse(string);

        expect(parsed.attributes).to.exist;
        expect(parsed.attributes).to.equal('id="theonlyID"');
    });

    it('should parse other attributes', function() {
        var string = '[onclick="doSomething();" href="#"]',
            parsed = parse(string);

        expect(parsed.attributes).to.exist;
        expect(parsed.attributes).to.equal(' onclick="doSomething();" href="#"');
    });

    it('should parse everything combined', function() {
        var string = 'section.class.anotherclass.BADNA@ME!*&6#ID#anotherID[data-attribute="attribute" onclick="doSomething();"]',
            parsed = parse(string);

        expect(parsed.attributes).to.exist;
        expect(parsed.tag).to.exist;
        expect(parsed.tag).to.equal('section');
        expect(parsed.attributes).to.equal('id="ID" class="class anotherclass BADNAME6" data-attribute="attribute" onclick="doSomething();"');
    });

});