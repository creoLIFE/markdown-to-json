/**
 * Created by miroslawratman on 17/04/15.
 */
'use strict'

var parser = require('../src/parser');

parser.parseFile({fileName: 'blueprint.md'}, function (data) {
    console.log(JSON.stringify(data));
    console.log('-------');
});

parser.parseFile({fileName: 'blueprint.md', depth: 2}, function (data) {
    console.log(JSON.stringify(data));
    console.log('-------');
});

parser.parseFile({fileName: 'blueprint2.md'}, function (data) {
    console.log(JSON.stringify(data));
    console.log('-------');
});

