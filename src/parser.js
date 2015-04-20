/**
 * Created by miroslawratman on 17/04/15.
 */

var fs = require('fs');
var marked = require('marked')

var parser = {
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

                if (depth > curr.depth) {
                    curr.heading = curr.heading || root;
                    curr.depth = depth;

                    (curr.heading.subsections || root.sections).push(
                        curr.heading = parser.hideParent({
                            name: name,
                            subsections: [],
                            parent: curr.heading
                        })
                    )
                }
                else {
                    while (curr.depth !== depth) {
                        curr.depth -= 1;
                        curr.heading = curr.heading.parent || root;
                    }

                    (curr.heading.parent.subsections || root.sections).push(
                        curr.heading = parser.hideParent({
                            name: name,
                            subsections: [],
                            parent: curr.heading.parent
                        })
                    )
                }

                var d = parser.findDetails(i, tokens);
                curr.heading['text'] = d.text;
                curr.heading['content'] = d.content;
            }
        }
        parser.hideParent(root);
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
    hideParent: function (object) {
        Object.defineProperty(object, 'parent', {
            value: object.parent, enumerable: false
        });

        return object
    }
}


/**
 * Method will parse markdown file and save it as a object
 * @param [object] params
 * * [string] fileName
 * @param [function] callback
 * @return [void]
 */
module.exports.parse = function (params, callback) {

    fs.exists(params.fileName, function () {
        fs.readFile(params.fileName, 'utf8', function (err, data) {
            if (typeof callback === 'function') {
                callback(parser.getJson(data, params.depth));
            }
            else {
                throw new Error('No callback function defined');
            }
        })
    });
}

