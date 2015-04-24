/**
 * Created by miroslawratman on 17/04/15.
 */
'use strict'

var fs = require('fs');
var marked = require('marked')

var parser = {

    /**
     * Method will parse markdown file and save it as a object
     * @param [object] params
     *        [string] fileName - path to markdown file
     *        [integer] depth - depth of parsing
     * @param [function] callback
     * @return [void]
     */
    parseFile: function (params, callback) {

        fs.exists(params.fileName, function () {
            fs.readFile(params.fileName, 'utf8', function (err, data) {
                if (typeof callback === 'function') {
                    parser.parse({content: data, depth: params.depth}, callback);
                }
                else {
                    throw new Error('No callback function defined');
                }
            })
        });
    },

    /**
     * Method will parse markdown content and save it as a object
     * @param [object] params
     *        [string] content - content to parse
     *        [integer] depth - depth of parsing
     * @param [function] callback
     * @return [void]
     */
    parse: function (params, callback) {
        if (typeof callback === 'function') {
            callback(parser.getJson(params.content, params.depth));
        }
        else {
            throw new Error('No callback function defined');
        }
    },

    /**
     * Method will parse givem markdown file data and give back object
     * @param [object] data - markdown file
     * @param [integer] parseDepth - define depth of parsed data
     * @return [object]
     */
    getJson: function (data, parseDepth) {
        var parseDepth = parseDepth ? parseDepth : 3;
        var tokens = marked.lexer(
            data, {}
        )

        var root = {
            sections: [],
            parent: null
        }

        var curr = {
            depth: 0,
            heading: root
        }

        for (var i = 0, l = tokens.length; i < l; i += 1) {
            var token = tokens[i]

            if (token.type === 'heading' && token.depth <= parseDepth) {
                var depth = token.depth;
                var name = token.text;
                var d = parser.findDetails(i, tokens);

                if (depth > curr.depth) {
                    curr.heading = curr.heading || root;
                    curr.depth = depth;

                    (curr.heading.subsections || root.sections).push(
                        curr.heading = parser.hide({
                            name: name,
                            subsections: [],
                            parent: curr.heading,
                            text: d.text,
                            content: d.content
                        })
                    )
                }
                else {
                    while (curr.depth !== depth) {
                        curr.depth -= 1;
                        curr.heading = curr.heading.parent || root;
                    }

                    (curr.heading.parent.subsections || root.sections).push(
                        curr.heading = parser.hide({
                            name: name,
                            subsections: [],
                            parent: curr.heading.parent,
                            text: d.text,
                            content: d.content
                        })
                    )
                }
            }
        }
        parser.hide(root);
        return root;
    },

    /**
     * Method will parse marked array and get details for current token
     * @param [integer] currEl - position of start element in marked array
     * @param [array] array - array of marked elements
     * @return [object]
     */
    findDetails: function (currEl, array) {
        var details = {
            text: "",
            content: []
        }
        var grabContent = false;

        //Look for data in array
        for (var i = currEl + 1; i < array.length; i++) {
            var el = array[i];
            if (el.type === 'heading') {
                break;
            }
            switch (el.type) {
                case 'paragraph':
                    details.text = el.text;
                    break;
                case 'loose_item_start':
                    grabContent = true;
                    break
                case 'loose_item_end':
                    grabContent = false;
                    break
                case 'text':
                    if (grabContent) {
                        details.content.push(el.text);
                    }
                    break;
            }
        }
        return details;
    },

    /**
     * Method will hide parrent section in output token
     * @param [object] object
     * @return [object]
     */
    hide: function (object) {
        Object.defineProperty(object, 'parent', {
            value: object.parent, enumerable: false
        });

        if( typeof object.content !== 'undefined' && object.content.length === 0 ){
            delete object.content;
        }
        if( typeof object.text !== 'undefined' && object.text === '' ){
            delete object.text;
        }
        if( typeof object.subsections !== 'undefined' && object.subsections.length === 0 ){
            delete object.subsections;
        }

        return object
    },

}


module.exports.parseFile = parser.parseFile;
module.exports.parse = parser.parse;



