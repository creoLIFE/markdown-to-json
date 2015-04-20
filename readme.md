# Hash Markdown file parser to JSON

## Usage

parser.parse({fileName: 'blueprint.md'}, function(data){
    console.log(JSON.stringify(data));
});

parser.parse({fileName: 'blueprint.md', depth:2}, function(data){
    console.log(JSON.stringify(data));
});
