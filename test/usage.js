/**
 * Created by miroslawratman on 17/04/15.
 */

var parser = require('../src/parser');

parser.parse({fileName: 'blueprint.md'}, function(data){
    console.log(JSON.stringify(data));
    console.log('-------');
});

parser.parse({fileName: 'blueprint.md', depth:2}, function(data){
    console.log(JSON.stringify(data));
    console.log('-------');
});

parser.parse({fileName: 'blueprint2.md'}, function(data){
    console.log(JSON.stringify(data));
    console.log('-------');
});

